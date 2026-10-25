"""Regression tests: tránh sửa nhầm exam/câu hỏi hoặc chấp nhận trang anti-bot."""
import argparse
import base64
import copy
from email.utils import formatdate
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import Mock, patch

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


class Clock:
    def __init__(self):
        self.now = 1700000000.0
        self.sleeps = []

    def time(self):
        return self.now

    def sleep(self, seconds):
        assert 0 <= seconds <= 10
        self.sleeps.append(seconds)
        self.now += seconds


class HttpResponse:
    def __init__(self, status, retry_after=None):
        self.status_code, self.url, self.text = status, FULL, html()
        self.headers = {} if retry_after is None else {'Retry-After': retry_after}

    def __enter__(self):
        return self

    def __exit__(self, *args):
        return False


class RateLimitTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.cache = Path(self.tmp.name, 'cache.json')
        self.clock = Clock()
        for name, method in [('time', self.clock.time), ('monotonic', self.clock.time), ('sleep', self.clock.sleep)]:
            patcher = patch.object(m.time, name, method)
            patcher.start()
            self.addCleanup(patcher.stop)
        self.quiet = patch('builtins.print')
        self.quiet.start()
        self.addCleanup(self.quiet.stop)

    def client(self, responses, **kwargs):
        kwargs.setdefault('wait_on_rate_limit', True)
        client = m.Client(self.cache, delay=0, backoff=2, **kwargs)
        client.session.get = Mock(side_effect=responses)
        return client

    def test_default_fast_mode_does_not_wait_or_retry_blocked_host(self):
        client = self.client([HttpResponse(429, '3600')], wait_on_rate_limit=False)
        start = self.clock.now
        self.assertEqual(client.get(FULL)['status'], 429)
        self.assertEqual(client.get(OLD)['error'], 'host_cooldown_skipped')
        self.assertEqual(client.session.get.call_count, 1)
        self.assertEqual(self.clock.now, start)

    def test_search_does_not_wait_even_if_examtopics_wait_enabled(self):
        m.atomic_json(self.cache, {'__hosts__': {'www.google.com': {'retry_at': self.clock.now + 3600, 'interval': 60}}})
        client = self.client([HttpResponse(200)], wait_on_rate_limit=True)
        start = self.clock.now
        _, error = client.search('query one', 'google')
        self.assertEqual(error['http_status'], 429)
        client.search('query two', 'google')
        self.assertEqual(client.session.get.call_count, 0)
        client.search('query three', 'bing')
        self.assertEqual(client.session.get.call_count, 1)
        self.assertEqual(self.clock.now, start)

    def test_search_403_disables_engine_but_keeps_good_cached_results(self):
        client = self.client([HttpResponse(403)])
        client.search('bad', 'google')
        _, error = client.search('another query', 'google')
        self.assertEqual(error['error'], 'engine_disabled_this_run')
        self.assertEqual(client.session.get.call_count, 1)
        query = 'cached query'
        url = 'https://www.google.com/search?q=' + m.quote_plus(query) + '&num=10'
        client.cache[url] = {'status': 200, 'url': url, 'html': f'<li><a href="{FULL}">Title</a>{ITEM["question_text"]}</li>',
                             'error': '', 'time': self.clock.now}
        results, error = client.search(query, 'google')
        self.assertIsNone(error)
        self.assertEqual(results[0]['url'], FULL)
        self.assertEqual(client.session.get.call_count, 1)

    def test_429_then_success_retries_actual_request(self):
        client = self.client([HttpResponse(429, '7'), HttpResponse(200)])
        start = self.clock.now
        result = client.get(FULL)
        self.assertEqual(result['status'], 200)
        self.assertEqual(result['retry_count'], 1)
        self.assertEqual(client.session.get.call_count, 2)
        self.assertGreaterEqual(self.clock.now - start, 7)
        self.assertEqual(result['retry_history'][0]['http_status'], 429)

    def test_http_date_and_invalid_retry_after(self):
        self.assertEqual(m.retry_after_seconds('invalid', self.clock.now), 0)
        self.assertEqual(m.retry_after_seconds('-3', self.clock.now), 0)
        date = formatdate(self.clock.now + 30, usegmt=True)
        client = self.client([HttpResponse(429, date), HttpResponse(200)])
        start = self.clock.now
        client.get(FULL)
        self.assertGreaterEqual(self.clock.now - start, 30)

    def test_exponential_backoff(self):
        responses = iter([HttpResponse(429), HttpResponse(429), HttpResponse(429), HttpResponse(200)])
        client = self.client([])
        request_times = []
        def fetch(*args, **kwargs):
            request_times.append(self.clock.now)
            return next(responses)
        client.session.get.side_effect = fetch
        result = client.get(FULL)
        self.assertEqual(result['status'], 200)
        self.assertEqual(client.session.get.call_count, 4)
        # Mỗi lần thử sau phải nghỉ ít nhất 2, 4, 8 giây; pacing thích nghi có thể dài hơn.
        gaps = [later - earlier for earlier, later in zip(request_times, request_times[1:])]
        self.assertTrue(all(gap >= minimum for gap, minimum in zip(gaps, [2, 4, 8])))

    def test_cached_429_is_waited_then_retried_even_with_refresh(self):
        for refresh in (False, True):
            with self.subTest(refresh=refresh):
                m.atomic_json(self.cache, {FULL: {'status': 429, 'url': FULL, 'html': '',
                    'error': 'blocked_or_challenge', 'time': self.clock.now, 'retry_at': self.clock.now + 20}})
                client = self.client([HttpResponse(200)], refresh=refresh)
                start = self.clock.now
                self.assertEqual(client.get(FULL)['status'], 200)
                self.assertGreaterEqual(self.clock.now - start, 20)
                self.assertEqual(client.session.get.call_count, 1)

    def test_host_cooldown_survives_restart_and_applies_to_different_url(self):
        client = self.client([HttpResponse(429, '30')], retries=0)
        with self.assertRaises(m.RateLimitExceeded):
            client.get(FULL)
        restarted = self.client([HttpResponse(200)])
        start = self.clock.now
        restarted.get(OLD)
        self.assertGreaterEqual(self.clock.now - start, 30)

    def test_exhaustion_stops_batch_preserves_pending_and_original_data(self):
        src = Path(self.tmp.name, 'input.json')
        report = src.parent / 'reports' / (src.stem + '.link-report.json')
        items = [ITEM, dict(ITEM, question_number=2)]
        m.atomic_json(src, items)
        args = argparse.Namespace(input=str(src), output=None, report=None, cache=str(self.cache),
            resume=False, evidence=None, delay=0, timeout=1, offline=False, refresh=False,
            engines='', html_dir=None, only_unresolved=None, limit=0)
        client = self.client([HttpResponse(429), HttpResponse(429)], retries=1)
        with patch.object(m, 'Client', return_value=client):
            with self.assertRaises(m.RateLimitExceeded):
                m.process_json(args)
        rows = json.loads(report.read_text())
        self.assertEqual(rows[0]['reason'], 'rate_limited_retry_later')
        self.assertEqual(rows[1]['reason'], 'not_processed')
        self.assertEqual(client.session.get.call_count, 2)
        self.assertEqual(json.loads(src.read_text()), items)
        # Chạy lại riêng các câu đang chờ: cả câu bị 429 lẫn câu chưa xử lý vẫn được chọn.
        args.only_unresolved = True
        with patch.object(m, 'Client', return_value=FakeClient()):
            m.process_json(args)
        rows = json.loads(report.read_text())
        self.assertEqual([row['question_number'] for row in rows], [1, 2])
        self.assertTrue(all(row['reason'] != 'not_processed' for row in rows))

    def test_offline_cached_429_does_not_wait_or_access_network(self):
        m.atomic_json(self.cache, {FULL: {'status': 429, 'url': FULL, 'html': '',
            'error': 'blocked_or_challenge', 'time': self.clock.now, 'retry_at': self.clock.now + 20}})
        client = self.client([], offline=True)
        self.assertEqual(client.get(FULL)['status'], 429)
        client.session.get.assert_not_called()
        self.assertEqual(self.clock.sleeps, [])


class LinkTests(unittest.TestCase):
    def test_short_question_can_be_verified_in_question_body(self):
        item = dict(ITEM, question_text='Which functionality does Amazon SageMaker Clarify provide?')
        source = f'<h1>{item["title"]}</h1><div class="question-body"><p class="card-text">{item["question_text"]}<br>A. Option</p></div>'
        self.assertTrue(m.page_matches(m.BeautifulSoup(source, 'html.parser'), item))
        wrong = source.replace(item['question_text'], 'Which service is used to run virtual machines?')
        self.assertFalse(m.page_matches(m.BeautifulSoup(wrong, 'html.parser'), item))

    def test_comments_word_inside_question_does_not_cut_content(self):
        item = dict(ITEM, question_text='A company wants to identify harmful language in the comments section of social media posts by using an ML model.')
        source = f'<h1>{item["title"]}</h1><div class="question-body"><p class="card-text">{item["question_text"]}</p></div><div class="comments">Other comments</div>'
        self.assertTrue(m.page_matches(m.BeautifulSoup(source, 'html.parser'), item))
        source = f'<h1>{item["title"]}</h1><div class="question-body"><p class="card-text">Different question</p></div><div class="comments">{item["question_text"]}</div>'
        self.assertFalse(m.page_matches(m.BeautifulSoup(source, 'html.parser'), item))

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

    def test_default_updates_original_without_fixed_output_and_resumes(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            src, cache = root / 'json' / 'input.json', root / 'cache' / 'input.link-cache.json'
            original = {'metadata': {'count': 1}, 'questions': [copy.deepcopy(ITEM)]}
            m.atomic_json(src, original)
            m.atomic_json(cache, {OLD: response(OLD, html())})
            args = argparse.Namespace(input=str(src), output=None, report=None, cache=None,
                resume=False, evidence=None, delay=0, timeout=1, offline=True, refresh=False,
                engines='', html_dir=None, only_unresolved=None, limit=0)
            first = m.process_json(args)
            data = json.loads(src.read_text())
            self.assertEqual(data['questions'][0]['link'], FULL)
            data['questions'][0]['link'] = OLD
            self.assertEqual(data, original)
            self.assertFalse((root / 'input_fixed.json').exists())
            self.assertTrue((root / 'reports' / 'input.link-report.json').exists())
            self.assertTrue(cache.exists())
            self.assertEqual(sorted(p.name for p in src.parent.iterdir()), ['input.json'])
            cache.unlink()
            args.resume = True
            second = m.process_json(args)
            self.assertEqual(second[0]['verification'], first[0]['verification'])
            self.assertEqual(second[0]['attempts'], first[0]['attempts'])
            self.assertEqual(json.loads(src.read_text())['questions'][0]['link'], FULL)
            self.assertFalse((root / 'input_fixed.json').exists())

    def test_only_unresolved_cli_accepts_flag_or_report(self):
        for suffix, expected in [([], None), (['--only-unresolved'], True),
                                 (['--only-unresolved', 'old-report.json'], 'old-report.json')]:
            with self.subTest(suffix=suffix), patch.object(m.sys, 'argv', ['fix_links', 'input.json', *suffix]), patch.object(m, 'process_json') as process:
                self.assertEqual(m.main(), 0)
                self.assertEqual(process.call_args.args[0].only_unresolved, expected)

    def test_only_unresolved_reuses_report_without_losing_other_rows(self):
        for automatic in (True, False):
            with self.subTest(automatic=automatic), tempfile.TemporaryDirectory() as tmp:
                root = Path(tmp)
                src, cache = root / 'input.json', root / 'cache.json'
                report = src.parent / 'reports' / (src.stem + '.link-report.json')
                second = dict(ITEM, question_number=2, title=ITEM['title'].replace('question 1 ', 'question 2 '),
                              link=FULL.replace('question-1-', 'question-2-'))
                third = dict(ITEM, question_number=3)
                m.atomic_json(src, [ITEM, second, third])
                previous = [{'topic_number': 1, 'question_number': 1, 'status': 'Không tìm thấy'},
                            {'topic_number': 1, 'question_number': 2, 'status': 'Đúng rồi', 'note': 'preserved'},
                            {'topic_number': 1, 'question_number': 3, 'status': 'Không tìm thấy'}]
                m.atomic_json(report, previous)
                m.atomic_json(cache, {OLD: response(OLD, html())})
                args = argparse.Namespace(input=str(src), output=None, report=None, cache=str(cache),
                    resume=False, evidence=None, delay=0, timeout=1, offline=True, refresh=False,
                    engines='', html_dir=None, only_unresolved=True if automatic else str(report), limit=1)
                rows = m.process_json(args)
                self.assertEqual(len(rows), 3)
                self.assertEqual(rows[0]['status'], 'Đã sửa')
                self.assertEqual(rows[1:], previous[1:])
                self.assertEqual(json.loads(src.read_text())[1:], [second, third])

    def test_only_unresolved_without_report_selects_incomplete_urls(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            src, cache = root / 'input.json', root / 'cache.json'
            second = dict(ITEM, question_number=2, title=ITEM['title'].replace('question 1 ', 'question 2 '),
                          link=FULL.replace('question-1-', 'question-2-'))
            m.atomic_json(src, [ITEM, second])
            m.atomic_json(cache, {OLD: response(OLD, html())})
            args = argparse.Namespace(input=str(src), output=None, report=None, cache=str(cache),
                resume=False, evidence=None, delay=0, timeout=1, offline=True, refresh=False,
                engines='', html_dir=None, only_unresolved=True, limit=0)
            rows = m.process_json(args)
            self.assertEqual([row['question_number'] for row in rows], [1])
            self.assertEqual(json.loads(src.read_text()), [dict(ITEM, link=FULL), second])

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
