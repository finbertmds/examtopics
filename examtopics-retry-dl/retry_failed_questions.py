#!/usr/bin/env python3
"""Re-scrape failed ExamTopics discussion URLs into the downloader JSON format."""

from __future__ import annotations

import argparse
import json
import re
import sys
import time
from pathlib import Path
from typing import Any
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup


BASE_URL = "https://www.examtopics.com"
URL_PATTERN = re.compile(r"https?://[^\s\"'<>]+")
TOPIC_PATTERN = re.compile(r"topic-(\d+)", re.IGNORECASE)
QUESTION_PATTERN = re.compile(r"question-(\d+)-discussion", re.IGNORECASE)
CHOICE_PATTERN = re.compile(r"^\s*([A-Z])\.\s*(.*)$", re.DOTALL)
MULTIPLE_CHOICE_PATTERN = re.compile(
    r"\b(?:choose|select)\s+(?:all|two|three|four|five|six|[2-9])\b", re.IGNORECASE
)
IMAGE_PLACEHOLDER = "//IMG//"


def clean_text(value: str) -> str:
    value = value.replace("\xa0", " ")
    return re.sub(r"\s+", " ", value).strip()


def html_to_text(element: Any, image_placeholder: bool = True) -> str:
    for line_break in element.find_all("br"):
        line_break.replace_with("\n")
    if image_placeholder:
        for image in element.find_all("img"):
            image.replace_with(IMAGE_PLACEHOLDER)
    return element.get_text("", strip=False).replace("\r\n", "\n").strip()


def image_urls(element: Any) -> list[str]:
    return [urljoin(BASE_URL, image["src"]) for image in element.find_all("img", src=True)]


def parse_choices(option_elements: list[Any], question_text: str) -> tuple[str, dict[str, str]]:
    choices: dict[str, str] = {}
    for option in option_elements:
        match = CHOICE_PATTERN.match(clean_text(html_to_text(option)))
        if match:
            choices[match.group(1)] = match.group(2).strip()

    if choices:
        return question_text, choices

    lines = question_text.replace("<br>", "\n").splitlines()
    first_choice = next(
        (index for index, line in enumerate(lines) if CHOICE_PATTERN.match(line)),
        None,
    )
    if first_choice is None:
        return question_text.strip(), choices

    question = "\n".join(lines[:first_choice]).strip()
    for index in range(first_choice, len(lines)):
        match = CHOICE_PATTERN.match(lines[index])
        if not match:
            continue
        next_choice = next(
            (
                next_index
                for next_index in range(index + 1, len(lines))
                if CHOICE_PATTERN.match(lines[next_index])
            ),
            len(lines),
        )
        option_text = "\n".join(lines[index + 1 : next_choice]).strip()
        choices[match.group(1)] = " ".join(
            part for part in (match.group(2).strip(), option_text) if part
        )
    return question, choices


def scrape_question(url: str, session: requests.Session, timeout: float) -> dict[str, Any]:
    response = session.get(url, timeout=timeout)
    response.raise_for_status()
    if not response.text.strip():
        raise ValueError("empty response body")

    soup = BeautifulSoup(response.text, "html.parser")
    title = clean_text(soup.find("h1").get_text(" ", strip=True)) if soup.find("h1") else ""
    topic_match = TOPIC_PATTERN.search(url)
    question_match = QUESTION_PATTERN.search(url)
    if not topic_match or not question_match:
        raise ValueError("URL does not contain topic and question numbers")

    content_element = soup.select_one("p.card-text")
    if content_element is None:
        raise ValueError("could not find question content (p.card-text)")
    question_images = image_urls(content_element)
    question_text, answers = parse_choices(
        soup.select("li.multi-choice-item"), html_to_text(content_element)
    )

    answer_element = soup.select_one(".correct-answer")
    answer = clean_text(html_to_text(answer_element, image_placeholder=False)) if answer_element else ""
    answer_images = image_urls(answer_element) if answer_element else []

    return {
        "topic_number": int(topic_match.group(1)),
        "question_number": int(question_match.group(1)),
        "title": title,
        "answers": answers,
        "suggested_answer": answer,
        "answer": answer,
        "link": url,
        "multiple_choice": len(answer) > 1 or bool(MULTIPLE_CHOICE_PATTERN.search(question_text)),
        "question_text": question_text.strip(),
        "answer_images": answer_images,
        "question_images": question_images,
    }


def load_urls(urls: list[str], input_file: Path | None) -> list[str]:
    raw_lines = list(urls)
    if input_file:
        raw_lines.extend(input_file.read_text(encoding="utf-8").splitlines())

    found_urls: list[str] = []
    seen: set[str] = set()
    for line in raw_lines:
        matches = URL_PATTERN.findall(line)
        candidates = matches if matches else [line.strip()]
        for candidate in candidates:
            candidate = candidate.rstrip(".,;:)")
            if candidate.startswith("http://") or candidate.startswith("https://"):
                if candidate not in seen:
                    seen.add(candidate)
                    found_urls.append(candidate)
    return found_urls


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("urls", nargs="*", help="one or more ExamTopics discussion URLs")
    parser.add_argument("-i", "--input", type=Path, help="text file with URLs or retry log lines")
    parser.add_argument("-o", "--output", type=Path, default=Path("retried_questions.json"))
    parser.add_argument("--retries", type=int, default=20, help="attempts per URL (default: 20)")
    parser.add_argument("--timeout", type=float, default=30, help="request timeout in seconds")
    parser.add_argument("--delay", type=float, default=0.5, help="delay between URLs in seconds")
    args = parser.parse_args()

    if args.retries < 1:
        parser.error("--retries must be at least 1")

    try:
        urls = load_urls(args.urls, args.input)
    except OSError as error:
        parser.error(str(error))
    if not urls:
        parser.error("provide at least one URL or a non-empty --input file")

    session = requests.Session()
    session.headers.update({"User-Agent": "Mozilla/5.0 (compatible; ExamTopicsRetryScraper/1.0)"})
    results: list[dict[str, Any]] = []
    failed_urls: list[str] = []

    for index, url in enumerate(urls, start=1):
        for attempt in range(1, args.retries + 1):
            try:
                results.append(scrape_question(url, session, args.timeout))
                print(f"[{index}/{len(urls)}] Scraped {url}")
                break
            except (requests.RequestException, ValueError) as error:
                if attempt == args.retries:
                    failed_urls.append(url)
                    print(f"[{index}/{len(urls)}] Failed after {attempt} attempts: {url}: {error}", file=sys.stderr)
                else:
                    wait_seconds = min(2 ** (attempt - 1), 30)
                    print(
                        f"[{index}/{len(urls)}] Attempt {attempt} failed; retrying in {wait_seconds}s: {url}",
                        file=sys.stderr,
                    )
                    time.sleep(wait_seconds)
        if index < len(urls) and args.delay > 0:
            time.sleep(args.delay)

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(
        json.dumps(results, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(f"Saved {len(results)} questions to {args.output}")
    if failed_urls:
        print(f"{len(failed_urls)} URLs could not be scraped:", file=sys.stderr)
        for url in failed_urls:
            print(url, file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())