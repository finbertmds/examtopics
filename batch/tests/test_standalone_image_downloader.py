import importlib.util
import logging
from pathlib import Path
import tempfile
import unittest
from unittest.mock import Mock, patch

MODULE_PATH = Path(__file__).resolve().parents[2] / 'examtopics-img-downloader' / 'download_images.py'
spec = importlib.util.spec_from_file_location('standalone_image_downloader', MODULE_PATH)
downloader_module = importlib.util.module_from_spec(spec)
with patch('logging.FileHandler', return_value=logging.NullHandler()):
    spec.loader.exec_module(downloader_module)


class StandaloneImageDownloaderTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        self.output = self.root / 'images'
        self.downloader = downloader_module.MultiImageDownloader(self.root, self.output)
        self.downloader.session.close()
        self.downloader.session = Mock()
        self.downloader.session.get.return_value = self.image_response()

    def image_response(self, status=200, location=None):
        response = Mock()
        response.status_code = status
        response.headers = {'content-type': 'image/png'}
        if location is not None:
            response.headers['location'] = location
        response.content = b'fixture-image'
        return response

    def test_supported_images_keep_their_folder_layout_and_regular_files_are_skipped(self):
        url = 'https://img.examtopics.com/example-exam/image%201.png?size=large'
        self.assertEqual(self.downloader.folder_key_for_url(url), 'example-exam')
        self.assertEqual(self.downloader.folder_key_for_url('https://www.examtopics.com/assets/exams/example/image.png'), 'assets/exams/example')
        self.downloader.session.get.return_value = self.image_response()
        folder = self.output / 'example-exam'
        self.assertEqual(self.downloader.download_image(url, folder), 1)
        self.assertEqual((folder / 'image%201.png').read_bytes(), b'fixture-image')
        self.assertEqual(self.downloader.download_image(url, folder), 2)
        self.downloader.session.get.assert_called_once_with(url, timeout=30, allow_redirects=False)

    def test_path_components_and_url_authority_are_validated_before_grouping(self):
        invalid = [
            'https://www.examtopics.com/assets/../image.png',
            'https://img.examtopics.com/%2e%2e/image.png',
            'https://www.examtopics.com/assets/a%2fb/image.png',
            'file://img.examtopics.com/example/image.png',
            'https://name@img.examtopics.com/example/image.png',
            'https://img.examtopics.com:444/example/image.png',
        ]
        for url in invalid:
            with self.subTest(url=url):
                self.assertIsNone(self.downloader.folder_key_for_url(url))
        self.downloader.session.get.assert_not_called()

    def test_symlinked_directory_and_file_are_rejected_without_network_or_writes(self):
        external = self.root / 'external'
        external.mkdir()
        linked = self.output / 'linked'
        linked.symlink_to(external, target_is_directory=True)
        self.assertEqual(self.downloader.download_image('https://img.examtopics.com/example/image.png', linked), 0)
        folder = self.output / 'example'
        folder.mkdir()
        outside_file = external / 'image.png'
        outside_file.write_bytes(b'original')
        (folder / 'image.png').symlink_to(outside_file)
        self.assertEqual(self.downloader.download_image('https://img.examtopics.com/example/image.png', folder), 0)
        self.assertEqual(outside_file.read_bytes(), b'original')
        self.downloader.session.get.assert_not_called()

    def test_unconfined_folder_key_is_rejected_without_creating_a_directory(self):
        with self.assertRaises(ValueError):
            self.downloader.download_images_for_folder('../outside', ['https://img.examtopics.com/example/image.png'])
        self.assertFalse((self.root / 'outside').exists())
        self.downloader.session.get.assert_not_called()

    def test_allowed_redirect_is_followed_only_after_validation(self):
        url = 'https://img.examtopics.com/example/image.png'
        target = 'https://www.examtopics.com/assets/image.png'
        redirect = self.image_response(302, target)
        response = self.image_response()
        self.downloader.session.get.side_effect = [redirect, response]
        self.assertEqual(self.downloader.download_image(url, self.output / 'example'), 1)
        self.assertEqual([call.args[0] for call in self.downloader.session.get.call_args_list], [url, target])
        self.assertTrue(all(call.kwargs['allow_redirects'] is False for call in self.downloader.session.get.call_args_list))
        redirect.close.assert_called_once()
        response.close.assert_called_once()

    def test_unsupported_and_downgrade_redirects_stop_before_requesting_the_target(self):
        url = 'https://img.examtopics.com/example/image.png'
        for location in ['https://images.example.test/image.png', 'http://img.examtopics.com/example/image.png']:
            with self.subTest(location=location):
                self.downloader.session.reset_mock()
                self.downloader.session.get.side_effect = None
                self.downloader.session.get.return_value = self.image_response(302, location)
                self.assertEqual(self.downloader.download_image(url, self.output / 'example'), 0)
                self.downloader.session.get.assert_called_once()
                self.assertFalse((self.output / 'example' / 'image.png').exists())

    def test_redirect_loops_stop_after_five_hops_and_close_every_response(self):
        response = self.image_response(302, '/example/image.png')
        self.downloader.session.get.return_value = response
        self.assertEqual(self.downloader.download_image(
            'https://img.examtopics.com/example/image.png', self.output / 'example'
        ), 0)
        self.assertEqual(self.downloader.session.get.call_count, 6)
        self.assertEqual(response.close.call_count, 6)
        self.assertEqual(list((self.output / 'example').iterdir()), [])

    def test_a_destination_symlink_created_while_fetching_is_not_overwritten(self):
        external = self.root / 'outside.png'
        external.write_bytes(b'unchanged')
        folder = self.output / 'example'

        def fetch(*_args, **_kwargs):
            (folder / 'image.png').symlink_to(external)
            return self.image_response()

        self.downloader.session.get.side_effect = fetch
        self.assertEqual(self.downloader.download_image(
            'https://img.examtopics.com/example/image.png', folder
        ), 0)
        self.assertEqual(external.read_bytes(), b'unchanged')
        self.assertEqual([entry.name for entry in folder.iterdir()], ['image.png'])

    def test_nonimage_responses_are_closed_and_leave_no_image_or_temporary_file(self):
        response = self.image_response()
        response.headers['content-type'] = 'text/html'
        self.downloader.session.get.return_value = response
        folder = self.output / 'example'
        self.assertEqual(self.downloader.download_image(
            'https://img.examtopics.com/example/image.png', folder
        ), 0)
        response.close.assert_called_once()
        self.assertEqual(list(folder.iterdir()), [])

    def test_a_replaced_output_root_is_rejected_before_requesting_an_image(self):
        renamed = self.root / 'original-images'
        self.output.rename(renamed)
        self.output.mkdir()
        self.assertEqual(self.downloader.download_image(
            'https://img.examtopics.com/example/image.png', self.output / 'example'
        ), 0)
        self.downloader.session.get.assert_not_called()


if __name__ == '__main__':
    unittest.main()
