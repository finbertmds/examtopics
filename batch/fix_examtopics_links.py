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
    """Đúng heading exam/topic/question VÀ 20 từ đầu của nội dung câu hỏi."""
    headings = [normalize_text(tag.get_text(' ', strip=True)) for tag in soup.select('h1, title')]
    if normalize_text(item.get('title')) not in headings:
        return False
    # Chỉ kiểm tra phần trước comments, tránh nhận nhầm câu hỏi trong bình luận.
    text = soup.get_text(' ', strip=True)
    text = re.split(r'\b(?:Comments|Show Suggested Answer)\b', text, maxsplit=1, flags=re.I)[0]
    prefix = normalize_text(clean_text(item.get('question_text')))
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


class Client:
    def __init__(self, cache_path, delay=3.0, timeout=20, offline=False, refresh=False):
        self.cache_path = Path(cache_path)
        self.delay, self.timeout, self.offline, self.refresh = delay, timeout, offline, refresh
        self.cache = json.loads(self.cache_path.read_text()) if self.cache_path.exists() else {}
        self.session = requests.Session()
        self.session.headers['User-Agent'] = 'Mozilla/5.0 (compatible; ExamTopicsLinkVerifier/2.0)'
        self.last_request = 0.0
        self.cooldowns = {}

    def get(self, url):
        cached = self.cache.get(url)
        cache_ttl = 60 if cached and (cached.get('error') or cached.get('status') != 200) else 86400
        if cached and not self.refresh and (self.offline or time.time() - cached.get('time', 0) < cache_ttl):
            if cached.get('status') == 200 and cached.get('error') == 'blocked_or_challenge' and not is_blocked(200, cached.get('html', '')):
                cached = dict(cached, error='')
            return cached
        if self.offline:
            return {'status': None, 'url': url, 'html': '', 'error': 'offline_cache_miss'}
        host = urlsplit(url).netloc
        if time.monotonic() < self.cooldowns.get(host, 0):
            return {'status': 429, 'url': url, 'html': '', 'error': 'rate_limit_cooldown'}
        time.sleep(max(0, self.delay - (time.monotonic() - self.last_request)))
        self.last_request = time.monotonic()
        try:
            # GET thay cho HEAD: cần đọc heading + câu hỏi, không chấp nhận status đơn thuần.
            with self.session.get(url, timeout=self.timeout) as response:
                html = response.text
                entry = {'status': response.status_code, 'url': response.url, 'html': html,
                         'error': '', 'time': time.time()}
                if response.status_code == 429:
                    retry = response.headers.get('Retry-After', '60')
                    self.cooldowns[host] = time.monotonic() + (int(retry) if retry.isdigit() else 60)
                if is_blocked(response.status_code, html):
                    entry['error'] = 'blocked_or_challenge'
        except requests.RequestException as exc:
            entry = {'status': None, 'url': url, 'html': '', 'error': type(exc).__name__, 'time': time.time()}
        self.cache[url] = entry
        atomic_json(self.cache_path, self.cache)
        return entry

    def search(self, query, engine):
        templates = {'bing': 'https://www.bing.com/search?q={}&count=20',
                     'google': 'https://www.google.com/search?q={}&num=10',
                     'duckduckgo': 'https://html.duckduckgo.com/html/?q={}'}
        url = templates[engine].format(quote_plus(query))
        response = self.get(url)
        if response['status'] != 200 or response['error']:
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
            report['attempts'].append({'url': url, 'http_status': response['status'], 'error': response['error']})
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


def process_json(args):
    input_path = Path(args.input)
    output = Path(args.output) if args.output else input_path.with_name(input_path.stem + '_fixed.json')
    report_path = Path(args.report) if args.report else output.with_suffix('.link-report.json')
    cache_path = Path(args.cache) if args.cache else input_path.with_suffix('.link-cache.json')
    if len({output.resolve(), report_path.resolve(), cache_path.resolve()}) != 3:
        raise ValueError('Output, report và cache phải là ba file khác nhau.')
    if input_path.resolve() in (report_path.resolve(), cache_path.resolve()):
        raise ValueError('Report/cache không được ghi đè input.')
    for source in (getattr(args, 'evidence', None), getattr(args, 'only_unresolved', None)):
        if source and Path(source).resolve() in (output.resolve(), report_path.resolve(), cache_path.resolve()):
            raise ValueError('Không được ghi đè file evidence/báo cáo nguồn của --only-unresolved.')
    data = json.loads(input_path.read_text(encoding='utf-8'))
    original = copy.deepcopy(data)
    items = question_items(data)
    old_items = question_items(original)
    previous = json.loads(report_path.read_text()) if args.resume and report_path.exists() else []
    saved = {r.get('fingerprint'): r for r in previous if r.get('verification') != 'unverified'}
    evidence = json.loads(Path(args.evidence).read_text()) if args.evidence else []
    if not isinstance(evidence, list) or not all(isinstance(r, dict) for r in evidence):
        raise ValueError('Evidence phải là list các object url/title/snippet/source.')
    client = Client(cache_path, args.delay, args.timeout, args.offline, args.refresh)
    resolver = Resolver(client, args.engines.split(',') if args.engines else (), args.html_dir, evidence)
    reports = []
    previous_questions = set()
    if args.only_unresolved:
        previous_questions = {(r.get('topic_number'), r.get('question_number')) for r in
                              json.loads(Path(args.only_unresolved).read_text()) if r.get('status') == 'Không tìm thấy'}
    selected = 0
    try:
        for index, item in enumerate(items, 1):
            should_run = (not args.only_unresolved or (item.get('topic_number'), item.get('question_number')) in previous_questions)
            should_run = should_run and (not args.limit or selected < args.limit)
            if not should_run:
                continue
            selected += 1
            key = fingerprint(item)
            result = saved.get(key) or resolver.resolve(item)
            result = dict(result, fingerprint=key, index=index)
            if result['verification'] != 'unverified':
                item['link'] = result['new_link']
            reports.append(result)
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
    parser.add_argument('-o', '--output', help='Mặc định *_fixed.json; có thể đặt trùng input')
    parser.add_argument('--report', help='Báo cáo JSON riêng')
    parser.add_argument('--cache', help='Cache HTTP: thành công 24 giờ, lỗi 60 giây')
    parser.add_argument('--delay', type=float, default=3.0, help='Khoảng cách tối thiểu giữa request (giây)')
    parser.add_argument('--timeout', type=float, default=20)
    parser.add_argument('--engines', default='bing,google,duckduckgo', help='Danh sách engine phân cách bởi dấu phẩy; chuỗi rỗng để tắt search')
    parser.add_argument('--html-dir', help='Thư mục HTML đã lưu từ discussion/trang danh sách')
    parser.add_argument('--evidence', help='JSON list kết quả search: url,title,snippet,source')
    parser.add_argument('--only-unresolved', help='Chỉ xử lý các câu Không tìm thấy trong báo cáo cũ')
    parser.add_argument('--resume', action='store_true', help='Tái dùng kết quả đã xác minh trong report nếu input của câu chưa đổi')
    parser.add_argument('--refresh', action='store_true', help='Bỏ qua cache HTTP')
    parser.add_argument('--offline', action='store_true', help='Chỉ dùng cache, HTML và evidence đã có')
    parser.add_argument('--limit', type=int, default=0, help='Giới hạn số câu được xử lý; 0 = tất cả')
    args = parser.parse_args()
    if args.delay < 0 or args.timeout <= 0 or args.limit < 0:
        parser.error('delay/limit phải >=0; timeout phải >0')
    if set(filter(None, args.engines.split(','))) - {'bing', 'google', 'duckduckgo'}:
        parser.error('Engine hỗ trợ: bing,google,duckduckgo')
    if args.offline and args.refresh:
        parser.error('--offline và --refresh không dùng cùng nhau')
    try:
        process_json(args)
    except KeyboardInterrupt:
        print('\nĐã lưu checkpoint. Chạy lại cùng lệnh với --resume.', file=sys.stderr)
        return 130
    except (OSError, ValueError) as exc:
        print(f'Lỗi: {exc}', file=sys.stderr)
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())
