import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import MagicMock, patch


spec = importlib.util.spec_from_file_location(
    "download_exam_images", Path(__file__).resolve().parents[1] / "download_exam_images.py"
)
downloader = importlib.util.module_from_spec(spec)
spec.loader.exec_module(downloader)


class DownloadImagesTests(unittest.TestCase):
    def test_preserves_url_folders_and_leaves_existing_image_urls_unchanged(self):
        with tempfile.TemporaryDirectory() as temporary_dir:
            root = Path(temporary_dir)
            json_path = root / "aws-scs-c03.json"
            base_url = "https://img.examtopics.com/aws-certified-security-specialty/"
            new_url = base_url + "image25.png"
            existing_url = base_url + "nested/image26.png"
            json_path.write_text(json.dumps([{
                "question_images": [new_url, existing_url],
                "answer_images": [new_url],
            }]), encoding="utf-8")
            image_root = root / "img"
            existing_path = image_root / json_path.stem / "aws-certified-security-specialty/nested/image26.png"
            existing_path.parent.mkdir(parents=True)
            existing_path.write_bytes(b"existing")
            session = MagicMock()
            session.get.return_value.content = b"downloaded"

            with patch.object(downloader, "IMAGE_ROOT", image_root), patch.object(
                downloader.requests, "Session"
            ) as session_class:
                session_class.return_value.__enter__.return_value = session
                self.assertEqual(downloader.download_images(json_path), (1, 1, 0))

            session.get.assert_called_once_with(new_url, timeout=30)
            self.assertEqual(existing_path.read_bytes(), b"existing")
            self.assertEqual(
                (existing_path.parents[1] / "image25.png").read_bytes(), b"downloaded"
            )
            records = json.loads(json_path.read_text(encoding="utf-8"))
            local_path = "/img/aws-scs-c03/aws-certified-security-specialty/image25.png"
            self.assertEqual(records[0]["question_images"], [local_path, existing_url])
            self.assertEqual(records[0]["answer_images"], [local_path])
