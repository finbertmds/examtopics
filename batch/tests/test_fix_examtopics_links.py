"""Regression tests: tránh sửa nhầm exam/câu hỏi hoặc chấp nhận trang anti-bot."""
import argparse
import base64
import copy
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

SPEC = importlib.util.spec_from_file_location('fix_links', Path(__file__).parents[1] / 'fix_examtopics_links.py')
m = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(m)

OLD = 'https://www.examtopics.com/discussions/amazon/view/122305-exam-aws-certified-security-specialty-scs-c02-topic-1/'
FULL = OLD.rstrip('/') + '-question-1-discussion/'
ITEM = {'topic_number': 1, 'question_number': 1,
        'title': 'Exam AWS Certified Security - Specialty SCS-C02 topic 1 question 1 discussion',
        'question_text': 'A company has an AWS Lambda function that creates image thumbnails from larger images. The Lambda function needs read and write access.',
        'answers': {'A': 'unchanged'}, 'link': OLD}


def html(item=ITEM, canonical=FULL):
    return f'<html><head><title>{item["title"]}</title><link rel="canonical" href="{canonical}"></head><body><h1>{item["title"]}</h1><p>{item["question_text"]}</p>Show Suggested Answer Comments</body></html>'


class FakeClient:
    def __init__(self, responses=None, results=None):
        self.responses, self.results, self.calls = responses or {}, results or [], []

    def get(self, url):
        self.calls.append(url)
        return self.responses.get(url, {'status': 403, 'url': url, 'html': '', 'error': 'blocked_or_challenge'})

    def search(self, query, engine):
        return self.results, None


def response(url, content, status=200):
    return {'status': status, 'url': url, 'html': content, 'error': ''}


class LinkTests(unittest.TestCase):
    def test_build_has_exam_prefix(self):
        self.assertEqual(m.try_build_link_from_existing(ITEM), FULL)

    def test_identity_rejects_wrong_exam_host_suffix_and_vendor(self):
        for wrong in [FULL.replace('scs-c02', 'scs-c03'), FULL.replace('question-1-', 'question-10-'),
                      FULL.replace('www.examtopics.com', 'www.examtopics.com.evil.org'), FULL + 'extra/',
                      FULL.replace('/amazon/', '/microsoft/')]:
            self.assertFalse(m.matches_url(wrong, ITEM), wrong)
        self.assertFalse(m.matches_url(FULL.replace('https://', 'https://user:pass@'), ITEM))

    def test_unwrap_search_redirects(self):
        encoded = base64.urlsafe_b64encode(FULL.encode()).decode().rstrip('=')
        self.assertEqual(m.unwrap_link('https://www.bing.com/ck/a?u=a1' + encoded), FULL)
        self.assertEqual(m.unwrap_link('/url?q=' + m.quote_plus(FULL), 'https://www.google.com/'), FULL)
        self.assertEqual(m.unwrap_link('//duckduckgo.com/l/?uddg=' + m.quote_plus(FULL)), FULL)

    def test_matching_page_canonical(self):
        client = FakeClient({OLD: response(OLD, html())})
        result = m.Resolver(client).resolve(ITEM)
        self.assertEqual(result['new_link'], FULL)
        self.assertEqual(result['verification'], 'page_content')

    def test_status_200_wrong_question_rejected(self):
        other = dict(ITEM, title=ITEM['title'].replace('question 1 ', 'question 2 '))
        client = FakeClient({OLD: response(OLD, html(other)), FULL: response(FULL, '<title>Just a moment</title>ExamTopics discussion')})
        self.assertEqual(m.Resolver(client).resolve(ITEM)['verification'], 'unverified')

    def test_right_heading_wrong_text_rejected(self):
        wrong = dict(ITEM, question_text='Completely different question body with no relation to Lambda or image thumbnails.')
        client = FakeClient({OLD: response(OLD, html(wrong))})
        self.assertEqual(m.Resolver(client).resolve(ITEM)['new_link'], OLD)

    def test_prefix_in_comments_does_not_validate(self):
        source = f'<h1>{ITEM["title"]}</h1><p>Different body.</p>Comments {ITEM["question_text"]}'
        self.assertFalse(m.page_matches(m.BeautifulSoup(source, 'html.parser'), ITEM))

    def test_search_evidence_works_when_site_is_blocked(self):
        results = [{'url': FULL, 'snippet': ITEM['question_text'], 'source': 'https://www.bing.com/search?q=test'}]
        result = m.Resolver(FakeClient(results=results), engines=['bing']).resolve(ITEM)
        self.assertEqual(result['new_link'], FULL)
        self.assertEqual(result['verification'], 'search_index')

    def test_search_url_alone_is_not_proof(self):
        results = [{'url': FULL, 'snippet': 'unrelated', 'source': 'test'}]
        self.assertEqual(m.Resolver(FakeClient(results=results), engines=['bing']).resolve(ITEM)['new_link'], OLD)

    def test_serp_snippets_not_combined_between_results(self):
        page = f'<li class="b_algo"><a href="{FULL}">Link</a>unrelated</li><li>Other result {ITEM["question_text"]}</li>'
        results = m.search_results(page, 'https://bing.com/search')
        self.assertFalse(m.indexed_match(results[0], ITEM))

    def test_blocked_does_not_mean_missing(self):
        result = m.Resolver(FakeClient()).resolve(ITEM)
        self.assertEqual(result['reason'], 'blocked_or_network_error')
        self.assertEqual(result['new_link'], OLD)

    def test_saved_html_verifies_without_network(self):
        with tempfile.TemporaryDirectory() as tmp:
            Path(tmp, 'question.html').write_text(html())
            client = FakeClient()
            result = m.Resolver(client, html_dir=tmp).resolve(ITEM)
            self.assertEqual(result['verification'], 'saved_html_content')
            self.assertEqual(client.calls, [])

    def test_bad_title_metadata_not_guessed(self):
        item = dict(ITEM, title='Unknown exam')
        self.assertEqual(m.Resolver(FakeClient()).resolve(item)['reason'], 'invalid_question_metadata')

    def test_access_denied_in_question_is_not_antibot(self):
        self.assertFalse(m.is_blocked(200, html(dict(ITEM, question_text='Access denied is the error in this question.'))))
        self.assertTrue(m.is_blocked(200, '<title>Just a moment...</title>'))
        self.assertTrue(m.is_blocked(429, html()))

    def test_image_placeholder_does_not_break_content_match(self):
        item = dict(ITEM, question_text=ITEM['question_text'].replace('Lambda', '//IMG// Lambda'))
        self.assertTrue(m.page_matches(m.BeautifulSoup(html(), 'html.parser'), item))

    def test_cached_offline_no_network(self):
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp, 'cache.json')
            m.atomic_json(p, {OLD: response(OLD, html())})
            result = m.Resolver(m.Client(p, offline=True)).resolve(ITEM)
            self.assertEqual(result['new_link'], FULL)

    def test_end_to_end_preserves_wrapper_and_nonlink_fields_and_resumes(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            src, out, cache, report = [root / n for n in ('input.json', 'out.json', 'cache.json', 'report.json')]
            original = {'metadata': {'count': 1}, 'questions': [copy.deepcopy(ITEM)]}
            m.atomic_json(src, original)
            m.atomic_json(cache, {OLD: response(OLD, html())})
            args = argparse.Namespace(input=str(src), output=str(out), report=str(report), cache=str(cache),
                resume=False, evidence=None, delay=0, timeout=1, offline=True, refresh=False,
                engines='', html_dir=None, only_unresolved=None, limit=0)
            first = m.process_json(args)
            data = json.loads(out.read_text())
            self.assertEqual(data['metadata'], original['metadata'])
            self.assertEqual({k:v for k,v in data['questions'][0].items() if k != 'link'},
                             {k:v for k,v in ITEM.items() if k != 'link'})
            self.assertEqual(json.loads(src.read_text()), original)
            cache.unlink()
            args.resume = True
            self.assertEqual(m.process_json(args), first)

    def test_output_collision_rejected_before_writing(self):
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp, 'in.json')
            m.atomic_json(p, [ITEM])
            args = argparse.Namespace(input=str(p), output=str(p), report=str(p), cache=str(Path(tmp, 'cache')))
            with self.assertRaises(ValueError):
                m.process_json(args)
            self.assertEqual(json.loads(p.read_text()), [ITEM])


if __name__ == '__main__':
    unittest.main()
