#!/usr/bin/env python3
"""Sửa discussion URL bằng bằng chứng về đúng câu hỏi, chạy được trên Python >=3.9.

Xem fix_examtopics_links.md. Cài requests, beautifulsoup4 bằng file requirements.
Không coi HTTP 200 là bằng chứng; 403/429/captcha là chưa xác minh, không phải 404.
"""
from __future__ import annotations

import argparse
import base64
from collections import Counter
import copy
from email.utils import parsedate_to_datetime
import hashlib
import json
import os
from pathlib import Path
import re
import sys
import time
from urllib.parse import parse_qs, quote_plus, unquote, urljoin, urlsplit, urlunsplit

try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    raise SystemExit('Cài thư viện: python3 -m pip install -r batch/requirements-links.txt')

HOSTS = {'examtopics.com', 'www.examtopics.com'}
VIEW = re.compile(r'^/discussions/([a-z0-9-]+)/view/(\d+)-(.+)/$', re.I)
BLOCK_MARKERS = ('just a moment', 'verify you are human', 'attention required',
                 'unusual traffic', 'access denied', 'cf-chl-')


def is_blocked(status, html):
    # Các từ như 'access denied' có thể nằm ngay trong đề thi/bình luận.
    soup = BeautifulSoup(html, 'html.parser')
    title = soup.title.get_text(' ', strip=True).casefold() if soup.title else ''
    return status in (403, 429) or any(marker in title for marker in BLOCK_MARKERS)


def normalize_text(value):
    return ' '.join(re.findall(r'\w+', str(value).casefold()))


def clean_text(text, max_words=20):
    text = re.sub(r'//IMG//|!\[[^\]]*\]\([^)]+\)', ' ', str(text or ''), flags=re.I)
    return ' '.join(text.split()[:max_words])


def extract_exam_info(title):
    match = re.fullmatch(r'\s*Exam\s+(.+?)\s+topic\s+\d+\s+question\s+\d+\s+discussion\s*',
                         title or '', re.I)
    name = match.group(1) if match else ''
    slug = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')
    return name, slug


def normalize_link(url):
    """Chỉ chấp nhận URL HTTPS của ExamTopics, không chấp nhận hostname giả."""
    try:
        parts = urlsplit(url or '')
        if parts.hostname not in HOSTS or parts.scheme not in ('http', 'https'):
            return ''
        if parts.username or parts.password or parts.port not in (None, 80, 443):
            return ''
        path = unquote(parts.path).rstrip('/') + '/'
        return urlunsplit(('https', 'www.examtopics.com', path, '', ''))
    except (ValueError, TypeError):
        return ''


def view_parts(url):
    url = normalize_link(url)
    return VIEW.fullmatch(urlsplit(url).path) if url else None


def extract_view_id(url):
    parts = view_parts(url)
    return parts.group(2) if parts else None


def is_valid_discussion_link(url, topic, question, exam_slug=None, vendor=None):
    parts = view_parts(url)
    if not parts:
        return False
    try:
        suffix = f'-topic-{int(topic)}-question-{int(question)}-discussion'
    except (TypeError, ValueError):
        return False
    slug = parts.group(3).lower()
    return (slug.endswith(suffix) and slug.startswith('exam-')
            and (not exam_slug or slug == f'exam-{exam_slug}{suffix}')
            and (not vendor or parts.group(1).lower() == vendor.lower()))


def identity(item):
    name, slug = extract_exam_info(item.get('title'))
    try:
        topic, number = int(item['topic_number']), int(item['question_number'])
    except (KeyError, ValueError, TypeError):
        return None
    title = normalize_text(item.get('title'))
    if not slug or topic < 0 or number < 1 or not title.endswith(
            f'topic {topic} question {number} discussion'):
        return None
    old = view_parts(item.get('link'))
    return name, slug, topic, number, old.group(1).lower() if old else None


def matches_url(url, item):
    info = identity(item)
    return bool(info and is_valid_discussion_link(url, info[2], info[3], info[1], info[4]))


def try_build_link_from_existing(item):
    info, parts = identity(item), view_parts(item.get('link'))
    if not info or not parts:
        return None
    _, slug, topic, number, vendor = info
    return (f'https://www.examtopics.com/discussions/{vendor}/view/'
            f'{parts.group(2)}-exam-{slug}-topic-{topic}-question-{number}-discussion/')


def unwrap_link(href, base='https://www.examtopics.com/'):
    """Giải mã Bing /ck/a?u=a1..., Google /url?q=..., DDG ?uddg=... ."""
    url = urljoin(base, href or '')
    for _ in range(4):
        p = urlsplit(url)
        if p.hostname in HOSTS:
            return normalize_link(url)
        qs = parse_qs(p.query)
        target = None
        host = (p.hostname or '').lower()
        if host == 'bing.com' or host.endswith('.bing.com'):
            encoded = qs.get('u', [''])[0]
            if encoded.startswith('a1'):
                try:
                    target = base64.urlsafe_b64decode(encoded[2:] + '=' * (-len(encoded[2:]) % 4)).decode()
                except (ValueError, UnicodeError):
                    pass
        elif re.fullmatch(r'(?:www\.)?google\.[a-z.]+', host) and p.path == '/url':
            target = (qs.get('q') or qs.get('url') or [None])[0]
        elif host == 'duckduckgo.com' or host.endswith('.duckduckgo.com'):
            target = qs.get('uddg', [None])[0]
        if not target:
            return ''
        url = target
    return ''


def page_matches(soup, item):
    """Đúng heading và phần nội dung câu hỏi, không đọc nhầm phần bình luận."""
    headings = [normalize_text(tag.get_text(' ', strip=True)) for tag in soup.select('h1, title')]
    if normalize_text(item.get('title')) not in headings:
        return False
    prefix = normalize_text(clean_text(item.get('question_text')))
    if not prefix:
        return False
    bodies = soup.select('.question-body .card-text') or soup.select('.question-body')
    for body in bodies:
        text = normalize_text(body.get_text(' ', strip=True))
        if text != prefix and not text.startswith(prefix + ' '):
            continue
        # Với câu ngắn, đối chiếu toàn bộ câu ngay đầu khối question-body.
        if len(prefix.split()) >= 4:
            return True
        answers = item.get('answers') or {}
        if isinstance(answers, dict) and sum(bool(normalize_text(a)) and normalize_text(a) in text
                                             for a in answers.values() if isinstance(a, str)) >= 2:
            return True
    if bodies:
        return False
    # HTML cũ/đã lưu: chỉ tách ở dòng tiêu đề, không tách từ 'comments' giữa câu.
    text = soup.get_text('\n', strip=True)
    text = re.split(r'(?im)^\s*(?:Comments\b|Show Suggested Answer\b)', text, maxsplit=1)[0]
    return len(prefix.split()) >= 10 and prefix in normalize_text(text)


def page_candidates(html, base):
    soup = BeautifulSoup(html, 'html.parser')
    urls = []
    for tag in soup.select('link[rel~="canonical"], meta[property="og:url"], a[href]'):
        url = unwrap_link(tag.get('href') or tag.get('content'), base)
        if url and view_parts(url) and url not in urls:
            urls.append(url)
    return soup, urls


def search_results(html, base):
    soup = BeautifulSoup(html, 'html.parser')
    results = []
    seen = set()
    for a in soup.select('a[href]'):
        url = unwrap_link(a['href'], base)
        if not view_parts(url) or url in seen:
            continue
        seen.add(url)
        container = a.find_parent(['li', 'article'])
        if container is None:
            container = a.find_parent(class_=re.compile(r'(^|\s)(?:result|MjjYud|g)(\s|$)'))
        # Không lấy toàn bộ trang SERP làm snippet: dễ trộn bằng chứng của các kết quả.
        text = container.get_text(' ', strip=True) if container else a.get_text(' ', strip=True)
        results.append({'url': url, 'title': a.get_text(' ', strip=True), 'snippet': text,
                        'source': base})
    return results


def indexed_match(result, item):
    prefix = normalize_text(clean_text(item.get('question_text')))
    text = normalize_text(result.get('snippet', ''))
    return (matches_url(result.get('url'), item) and len(prefix.split()) >= 10
            and prefix in text)


def build_search_queries(item):
    name, _, topic, number, _ = identity(item)
    prefix = clean_text(item.get('question_text')).replace('"', '')
    queries = [f'"{prefix}" "{name}" site:examtopics.com',
               f'"{name}" "topic {topic} question {number} discussion" site:examtopics.com/discussions/']
    view_id = extract_view_id(item.get('link'))
    if view_id:
        queries.append(f'"{view_id}" "{name}" discussion site:examtopics.com')
    queries.append(f'"{clean_text(item.get("question_text"), 15).replace(chr(34), "")}" discussion site:examtopics.com')
    return list(dict.fromkeys(queries))


def atomic_json(path, data):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    temp = path.with_name(path.name + '.tmp')
    try:
        with temp.open('w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            f.write('\n')
        os.replace(temp, path)
    finally:
        if temp.exists():
            temp.unlink()


class RateLimitExceeded(RuntimeError):
    def __init__(self, url, retry_at, attempts):
        self.url, self.retry_at, self.attempts = url, retry_at, attempts
        super().__init__(f'HTTP 429 từ {urlsplit(url).netloc} sau {attempts} lượt yêu cầu')


def retry_after_seconds(value, now):
    """Retry-After có thể là số giây hoặc ngày HTTP, không chỉ là số nguyên."""
    try:
        return max(0.0, float(value))
    except (TypeError, ValueError):
        try:
            return max(0.0, parsedate_to_datetime(value).timestamp() - now)
        except (TypeError, ValueError, OverflowError):
            return 0.0


class Client:
    def __init__(self, cache_path, delay=3.0, timeout=20, offline=False, refresh=False,
                 retries=3, backoff=60.0, wait_on_rate_limit=False):
        self.cache_path = Path(cache_path)
        self.delay, self.timeout, self.offline, self.refresh = delay, timeout, offline, refresh
        self.retries, self.backoff = retries, backoff
        self.wait_on_rate_limit = wait_on_rate_limit
        self.skipped_hosts = set()
        self.disabled_engines = set()
        self.cache = json.loads(self.cache_path.read_text()) if self.cache_path.exists() else {}
        self.host_states = self.cache.setdefault('__hosts__', {})
        self.session = requests.Session()
        self.session.headers['User-Agent'] = 'Mozilla/5.0 (compatible; ExamTopicsLinkVerifier/2.0)'
        self.last_requests = {}

    def wait_for_host(self, host, wait_on_rate_limit=True):
        state = self.host_states.get(host, {})
        remaining = max(0.0, state.get('retry_at', 0) - time.time())
        if remaining:
            print(f'    HTTP 429: nghỉ {remaining:.0f}s cho {host} rồi thử lại; Ctrl-C để lưu và dừng.', flush=True)
        while state.get('retry_at', 0) > time.time():
            time.sleep(min(10, state['retry_at'] - time.time()))
        interval = max(self.delay, state.get('interval', 0)) if wait_on_rate_limit else self.delay
        if host in self.last_requests:
            remaining = interval - (time.monotonic() - self.last_requests[host])
            while remaining > 0:
                step = min(10, remaining)
                time.sleep(step)
                remaining = interval - (time.monotonic() - self.last_requests[host])

    def get(self, url, wait_on_rate_limit=None):
        wait_on_rate_limit = self.wait_on_rate_limit if wait_on_rate_limit is None else wait_on_rate_limit
        cached = self.cache.get(url)
        cache_ttl = 60 if cached and (cached.get('error') or cached.get('status') != 200) else 86400
        if cached and not self.refresh and (self.offline or time.time() - cached.get('time', 0) < cache_ttl):
            if cached.get('status') == 200 and cached.get('error') == 'blocked_or_challenge' and not is_blocked(200, cached.get('html', '')):
                cached = dict(cached, error='')
            # Cache 429 là lệnh chờ, không phải kết quả kiểm tra của câu hỏi.
            if self.offline or cached.get('status') != 429:
                return cached
        if self.offline:
            return {'status': None, 'url': url, 'html': '', 'error': 'offline_cache_miss'}
        host = urlsplit(url).netloc
        state = self.host_states.setdefault(host, {})
        if cached and cached.get('status') == 429:
            retry_at = cached.get('retry_at', cached.get('time', 0) + self.backoff)
            state['retry_at'] = max(state.get('retry_at', 0), retry_at)
        if not wait_on_rate_limit and state.get('retry_at', 0) > time.time():
            if host not in self.skipped_hosts:
                print(f'    Bỏ qua {host} đang giới hạn tần suất; dùng cache/nguồn khác, không chờ.', flush=True)
                self.skipped_hosts.add(host)
            return {'status': 429, 'url': url, 'html': '', 'error': 'host_cooldown_skipped'}
        history = []
        for attempt in range(self.retries + 1 if wait_on_rate_limit else 1):
            self.wait_for_host(host, wait_on_rate_limit)
            self.last_requests[host] = time.monotonic()
            retry_header = None
            try:
                # Đọc heading + nội dung; HTTP 200 đơn thuần không đủ để xác minh.
                with self.session.get(url, timeout=self.timeout) as response:
                    entry = {'status': response.status_code, 'url': response.url, 'html': response.text,
                             'error': '', 'time': time.time(), 'retry_count': attempt}
                    retry_header = response.headers.get('Retry-After')
                    if is_blocked(response.status_code, entry['html']):
                        entry['error'] = 'blocked_or_challenge'
            except requests.RequestException as exc:
                entry = {'status': None, 'url': url, 'html': '', 'error': type(exc).__name__,
                         'time': time.time(), 'retry_count': attempt}
            if entry['status'] == 429:
                # Không thử sớm hơn Retry-After; backoff tăng 60, 120, 240... giây.
                pause = max(self.backoff * (2 ** attempt), retry_after_seconds(retry_header, time.time()))
                state['retry_at'] = max(state.get('retry_at', 0), time.time() + pause)
                state['interval'] = min(60.0, max(5.0, self.delay, state.get('interval', self.delay) * 1.5))
                entry.update(retry_at=state['retry_at'], retry_after=retry_header)
                history.append({'http_status': 429, 'retry_at': state['retry_at']})
            entry['retry_history'] = list(history)
            self.cache[url] = entry
            atomic_json(self.cache_path, self.cache)
            if entry['status'] != 429:
                return entry
            if not wait_on_rate_limit:
                if host not in self.skipped_hosts:
                    print(f'    Bỏ qua {host} do HTTP 429; dùng cache/nguồn khác, không chờ.', flush=True)
                    self.skipped_hosts.add(host)
                return entry
            if attempt == self.retries:
                # Dừng batch có checkpoint; không gán 429 giả cho hàng loạt câu sau.
                raise RateLimitExceeded(url, state['retry_at'], attempt + 1)
            print(f'    Giới hạn tần suất: sẽ thử lại {attempt + 1}/{self.retries} cho {host}.', flush=True)

    def search(self, query, engine):
        templates = {'bing': 'https://www.bing.com/search?q={}&count=20',
                     'google': 'https://www.google.com/search?q={}&num=10',
                     'duckduckgo': 'https://html.duckduckgo.com/html/?q={}'}
        url = templates[engine].format(quote_plus(query))
        cached = self.cache.get(url)
        # Chỉ tắt nguồn đang lỗi trong phiên chạy; cache 200 của nguồn đó vẫn dùng được.
        if engine in self.disabled_engines and not (cached and cached.get('status') == 200 and not cached.get('error')):
            return [], {'engine': engine, 'query': query, 'http_status': None, 'error': 'engine_disabled_this_run'}
        # Search là nguồn bổ sung: không chặn cả batch để đợi Google/Bing/DDG.
        response = self.get(url, wait_on_rate_limit=False)
        if response['status'] != 200 or response['error']:
            if response['status'] in (202, 403, 429) or response['error'] == 'blocked_or_challenge':
                if engine not in self.disabled_engines:
                    print(f'    Tắt search {engine} trong phiên này do bị chặn; chuyển nguồn khác.', flush=True)
                self.disabled_engines.add(engine)
            return [], {'engine': engine, 'query': query, 'http_status': response['status'],
                        'error': response['error'] or 'http_error'}
        return search_results(response['html'], response['url']), None



class Resolver:
    def __init__(self, client, engines=(), html_dir=None, evidence=None, max_candidates=30):
        self.client, self.engines = client, engines
        self.local_pages = []
        self.local_links = []
        self.max_candidates = max_candidates
        if html_dir:
            for path in sorted(Path(html_dir).rglob('*.html')):
                html = path.read_text(encoding='utf-8', errors='replace')
                soup, urls = page_candidates(html, 'https://www.examtopics.com/')
                self.local_pages.append((soup, urls, str(path)))
                self.local_links.extend(urls)
        self.evidence = evidence or []

    def resolve(self, item):
        old = item.get('link', '')
        report = {'topic_number': item.get('topic_number'), 'question_number': item.get('question_number'),
                  'old_link': old, 'new_link': old, 'status': 'Không tìm thấy',
                  'verification': 'unverified', 'source': None, 'attempts': []}
        if not identity(item):
            report['reason'] = 'invalid_question_metadata'
            return report

        def accept(url, method, source):
            url = normalize_link(url)
            report.update(new_link=url, status='Đúng rồi' if url == old else 'Đã sửa',
                          verification=method, source=source, reason='matched_exam_topic_question_and_text')
            return report

        for soup, urls, source in self.local_pages:
            if page_matches(soup, item):
                for url in urls:
                    if matches_url(url, item):
                        return accept(url, 'saved_html_content', source)
        for result in self.evidence:
            if indexed_match(result, item):
                return accept(result['url'], 'search_index', result.get('source', 'evidence_file'))

        tried = set()
        def verify(url):
            url = normalize_link(url)
            if not view_parts(url) or url in tried or len(tried) >= self.max_candidates:
                return None
            tried.add(url)
            response = self.client.get(url)
            report['attempts'].append({'url': url, 'http_status': response['status'], 'error': response['error'],
                                       'retry_count': response.get('retry_count', 0),
                                       'retry_history': response.get('retry_history', [])})
            if response['status'] != 200 or response['error']:
                return None
            # Một redirect sang exam khác hoặc trang đăng nhập không xác minh được câu hỏi.
            if not view_parts(response['url']):
                return None
            soup, urls = page_candidates(response['html'], response['url'])
            if not page_matches(soup, item):
                report['attempts'][-1]['validation'] = 'content_mismatch'
                return None
            for candidate in [*urls, normalize_link(response['url']), url]:
                if matches_url(candidate, item):
                    return accept(candidate, 'page_content', response['url'])
            return None

        # Link rút gọn có thể trả canonical/og:url; link ghép chỉ là ứng viên.
        candidate = try_build_link_from_existing(item)
        for url in dict.fromkeys([candidate, old, *[u for u in self.local_links if matches_url(u, item)]]):
            if url:
                result = verify(url)
                if result:
                    return result
        for query in build_search_queries(item):
            for engine in self.engines:
                results, error = self.client.search(query, engine)
                if error:
                    report['attempts'].append(error)
                for result in results:
                    if indexed_match(result, item):
                        return accept(result['url'], 'search_index', result['source'])
                    url = result['url']
                    if matches_url(url, item) or extract_view_id(url) == extract_view_id(old) is not None:
                        answer = verify(url)
                        if answer:
                            return answer
        errors = [a.get('error') for a in report['attempts']]
        if any(a.get('http_status') == 429 for a in report['attempts']):
            report['reason'] = 'rate_limited_retry_later'
        else:
            report['reason'] = 'blocked_or_network_error' if any(errors) else 'no_matching_verified_url'
        return report


def question_items(data):
    if isinstance(data, list):
        items = data
    elif isinstance(data, dict):
        items = next((data[k] for k in ('questions', 'data', 'items') if isinstance(data.get(k), list)), [data])
    else:
        raise ValueError('JSON phải là danh sách, một câu hỏi, hoặc object chứa questions/data/items.')
    if not all(isinstance(item, dict) for item in items):
        raise ValueError('Mỗi câu hỏi phải là object.')
    return items


def fingerprint(item):
    # Bao gồm link: khi link đã được người dùng sửa, resume phải kiểm tra lại.
    return hashlib.sha256(json.dumps(item, sort_keys=True, ensure_ascii=False).encode()).hexdigest()


def default_artifact_paths(input_path):
    # json/exam.json -> reports/exam.link-report.json và cache/exam.link-cache.json.
    base = input_path.parent.parent if input_path.parent.name.lower() == 'json' else input_path.parent
    return (base / 'reports' / (input_path.stem + '.link-report.json'),
            base / 'cache' / (input_path.stem + '.link-cache.json'))


def process_json(args):
    input_path = Path(args.input)
    output = Path(args.output) if args.output else input_path
    default_report, default_cache = default_artifact_paths(input_path)
    report_path = Path(args.report) if args.report else default_report
    cache_path = Path(args.cache) if args.cache else default_cache
    if len({output.resolve(), report_path.resolve(), cache_path.resolve()}) != 3:
        raise ValueError('Output, report và cache phải là ba file khác nhau.')
    if input_path.resolve() in (report_path.resolve(), cache_path.resolve()):
        raise ValueError('Report/cache không được ghi đè input.')
    if args.evidence and Path(args.evidence).resolve() in (output.resolve(), report_path.resolve(), cache_path.resolve()):
        raise ValueError('Không được ghi đè file evidence.')
    unresolved_path = None
    unresolved_rows = None
    if args.only_unresolved:
        unresolved_path = (report_path if args.only_unresolved is True
                           else Path(args.only_unresolved))
        if unresolved_path.resolve() in (output.resolve(), cache_path.resolve()):
            raise ValueError('JSON/cache không được ghi đè báo cáo nguồn của --only-unresolved.')
        if unresolved_path.exists() or args.only_unresolved is not True:
            unresolved_rows = json.loads(unresolved_path.read_text(encoding='utf-8'))
            if not isinstance(unresolved_rows, list) or not all(isinstance(r, dict) for r in unresolved_rows):
                raise ValueError('Báo cáo --only-unresolved phải là list các object.')
        else:
            print(f'Chưa có {unresolved_path}; chỉ kiểm tra các link thiếu/sai định dạng.', flush=True)
    data = json.loads(input_path.read_text(encoding='utf-8'))
    original = copy.deepcopy(data)
    items = question_items(data)
    old_items = question_items(original)
    previous = json.loads(report_path.read_text()) if args.resume and report_path.exists() else []
    saved = {}
    for result in previous:
        if result.get('verification') != 'unverified':
            for key in (result.get('fingerprint'), result.get('updated_fingerprint')):
                if key:
                    saved[key] = result
    evidence = json.loads(Path(args.evidence).read_text()) if args.evidence else []
    if not isinstance(evidence, list) or not all(isinstance(r, dict) for r in evidence):
        raise ValueError('Evidence phải là list các object url/title/snippet/source.')
    client = Client(cache_path, args.delay, args.timeout, args.offline, args.refresh,
                    retries=getattr(args, 'retries', 3), backoff=getattr(args, 'backoff', 60.0),
                    wait_on_rate_limit=getattr(args, 'wait_on_rate_limit', False))
    resolver = Resolver(client, args.engines.split(',') if args.engines else (), args.html_dir, evidence)
    # Khi đọc và ghi cùng report, giữ cả các câu không được chọn và tiến độ chưa xử lý.
    same_report = unresolved_rows is not None and unresolved_path.resolve() == report_path.resolve()
    reports = copy.deepcopy(unresolved_rows) if same_report else []
    previous_questions = set()
    if args.only_unresolved:
        if unresolved_rows is not None:
            previous_questions = {(r.get('topic_number'), r.get('question_number')) for r in unresolved_rows
                                  if r.get('status') == 'Không tìm thấy'}
        else:
            previous_questions = {(q.get('topic_number'), q.get('question_number')) for q in items
                                  if not matches_url(q.get('link'), q)}
    # Lưu sẵn những câu đang chờ, để dừng do 429/Ctrl-C vẫn chạy tiếp được bằng --only-unresolved.
    for index, item in enumerate(items, 1):
        key = (item.get('topic_number'), item.get('question_number'))
        if args.only_unresolved and key not in previous_questions:
            continue
        if not any((row.get('topic_number'), row.get('question_number')) == key for row in reports):
            reports.append({'topic_number': key[0], 'question_number': key[1], 'index': index,
                            'old_link': item.get('link', ''), 'new_link': item.get('link', ''),
                            'status': 'Không tìm thấy', 'verification': 'unverified',
                            'source': None, 'reason': 'not_processed', 'attempts': []})
    selected = 0
    try:
        for index, item in enumerate(items, 1):
            should_run = (not args.only_unresolved or (item.get('topic_number'), item.get('question_number')) in previous_questions)
            should_run = should_run and (not args.limit or selected < args.limit)
            if not should_run:
                continue
            selected += 1
            key = fingerprint(item)
            try:
                result = saved.get(key) or resolver.resolve(item)
            except RateLimitExceeded as exc:
                row = next(row for row in reports if
                           (row.get('topic_number'), row.get('question_number')) ==
                           (item.get('topic_number'), item.get('question_number')))
                row.update(reason='rate_limited_retry_later', retry_at=exc.retry_at,
                           attempts=[{'url': exc.url, 'http_status': 429, 'error': 'retry_budget_exhausted',
                                      'request_count': exc.attempts}])
                raise
            result = dict(result, fingerprint=key, index=index)
            if result['verification'] != 'unverified':
                item['link'] = result['new_link']
            result['updated_fingerprint'] = fingerprint(item)
            existing = next((i for i, row in enumerate(reports) if
                             (row.get('topic_number'), row.get('question_number')) ==
                             (result['topic_number'], result['question_number'])), None)
            if existing is None:
                reports.append(result)
            else:
                reports[existing] = result
            print(f"[{index}/{len(items)}] Topic {item.get('topic_number')} câu {item.get('question_number')}: "
                  f"{result['status']} ({result['verification']}; {result['reason']})", flush=True)
            # Checkpoint từng câu; resume chỉ tái dùng kết quả đã xác minh.
            atomic_json(output, data)
            atomic_json(report_path, reports)
    finally:
        # Kể cả Ctrl-C: giữ tiến độ và xác nhận các trường ngoài link không đổi.
        for old, new in zip(old_items, items):
            assert {k:v for k,v in old.items() if k != 'link'} == {k:v for k,v in new.items() if k != 'link'}
        atomic_json(output, data)
        atomic_json(report_path, reports)
    print(json.dumps(dict(Counter(r['status'] for r in reports)), ensure_ascii=False))
    print(f'JSON: {output}\nBáo cáo: {report_path}\nCache: {cache_path}')
    return reports


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('input', help='JSON câu hỏi')
    parser.add_argument('-o', '--output', help='Mặc định sửa trực tiếp file input; chỉ tạo file khác khi chỉ định -o')
    parser.add_argument('--report', help='File báo cáo (mặc định reports/<exam>.link-report.json ngoài thư mục json)')
    parser.add_argument('--cache', help='File cache (mặc định cache/<exam>.link-cache.json ngoài thư mục json)')
    parser.add_argument('--delay', type=float, default=3.0, help='Khoảng cách tối thiểu giữa request (giây)')
    parser.add_argument('--timeout', type=float, default=20)
    parser.add_argument('--wait-on-rate-limit', action='store_true', help='Cho phép chờ/thử lại 429 khi mở ExamTopics; mặc định bỏ qua nguồn đang giới hạn')
    parser.add_argument('--retries', type=int, default=3, help='Số lần thử lại khi dùng --wait-on-rate-limit (mặc định 3)')
    parser.add_argument('--backoff', type=float, default=60.0, help='Thời gian nghỉ ban đầu khi 429, tăng gấp đôi sau mỗi lần thử (giây, mặc định 60)')
    parser.add_argument('--engines', default='bing,duckduckgo', help='Danh sách engine phân cách bởi dấu phẩy; chuỗi rỗng để tắt search')
    parser.add_argument('--html-dir', help='Thư mục HTML đã lưu từ discussion/trang danh sách')
    parser.add_argument('--evidence', help='JSON list kết quả search: url,title,snippet,source')
    parser.add_argument('--only-unresolved', nargs='?', const=True, metavar='REPORT',
                        help='Chỉ xử lý câu chưa tìm thấy; tự đọc *.link-report.json nếu không truyền REPORT, hoặc chọn link thiếu/sai định dạng khi chưa có báo cáo')
    parser.add_argument('--resume', action='store_true', help='Tái dùng kết quả đã xác minh trong report nếu input của câu chưa đổi')
    parser.add_argument('--refresh', action='store_true', help='Bỏ qua cache HTTP')
    parser.add_argument('--offline', action='store_true', help='Chỉ dùng cache, HTML và evidence đã có')
    parser.add_argument('--limit', type=int, default=0, help='Giới hạn số câu được xử lý; 0 = tất cả')
    args = parser.parse_args()
    if args.delay < 0 or args.timeout <= 0 or args.limit < 0 or args.retries < 0 or args.backoff <= 0:
        parser.error('delay/limit/retries phải >=0; timeout/backoff phải >0')
    if set(filter(None, args.engines.split(','))) - {'bing', 'google', 'duckduckgo'}:
        parser.error('Engine hỗ trợ: bing,google,duckduckgo')
    if args.offline and args.refresh:
        parser.error('--offline và --refresh không dùng cùng nhau')
    try:
        process_json(args)
    except RateLimitExceeded as exc:
        seconds = max(0, exc.retry_at - time.time())
        print(f'\n{exc}. Đã lưu checkpoint; tạm dừng batch. Chờ ít nhất {seconds:.0f}s rồi chạy lại cùng lệnh với --only-unresolved. Không kết luận các link còn lại bị sai.', file=sys.stderr)
        return 75
    except KeyboardInterrupt:
        print('\nĐã lưu checkpoint. Chạy lại cùng lệnh với --resume.', file=sys.stderr)
        return 130
    except (OSError, ValueError) as exc:
        print(f'Lỗi: {exc}', file=sys.stderr)
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())
