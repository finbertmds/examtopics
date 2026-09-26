#!/usr/bin/env python3
"""Convert PCAP downloader JSON to the exam practice JSON schema."""

import argparse
import json
import re
from pathlib import Path
from typing import Any


OPTION_MARKER = re.compile(r"\*\*([A-Z]):\*\*\s*")
TOPIC_NUMBER = re.compile(r"-topic-(\d+)(?:-|/)")
QUESTION_NUMBER = re.compile(r"question-(\d+)-discussion")
IMAGE_PLACEHOLDER = "//IMG//"


def parse_answers(question_parts: list[str]) -> dict[str, str]:
    question_text = "\n".join(question_parts)
    markers = list(OPTION_MARKER.finditer(question_text))
    answers: dict[str, str] = {}

    for index, marker in enumerate(markers):
        start = marker.end()
        end = markers[index + 1].start() if index + 1 < len(markers) else len(question_text)
        answer_text = question_text[start:end].strip()
        answers[marker.group(1)] = answer_text

    return answers


def convert_record(record: dict[str, Any]) -> dict[str, Any]:
    link = record.get("question_link", "")
    topic_match = TOPIC_NUMBER.search(link)
    question_match = QUESTION_NUMBER.search(link)
    if not topic_match or not question_match:
        raise ValueError(f"Cannot extract topic/question number from question_link: {link}")

    header = record.get("header", "")
    question_parts = record.get("questions", [])
    if not isinstance(question_parts, list):
        raise ValueError("Expected 'questions' to be a list")

    content = record.get("content", "")
    image_urls = (
        [url.strip() for url in content.splitlines() if url.strip()]
        if isinstance(content, str)
        else []
    )
    header_image_count = header.count(IMAGE_PLACEHOLDER)
    question_images = image_urls[:header_image_count]
    answer_images = image_urls[header_image_count:]

    return {
        "topic_number": int(topic_match.group(1)),
        "question_number": int(question_match.group(1)),
        "title": record.get("title", ""),
        "answers": parse_answers(question_parts),
        "suggested_answer": record.get("answer", ""),
        "answer": record.get("answer", ""),
        "link": link,
        "multiple_choice": len(record.get("answer", "").strip()) > 1,
        "question_text": header.strip(),
        "answer_images": answer_images,
        "question_images": question_images,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path, help="source JSON file to convert")
    parser.add_argument("output", nargs="?", type=Path, help="output JSON file (optional)")
    args = parser.parse_args()
    output_path = args.output or args.input.with_name(f"{args.input.stem}_converted.json")

    with args.input.open("r", encoding="utf-8") as source_file:
        source_data = json.load(source_file)
    if not isinstance(source_data, list):
        raise ValueError("The input JSON root must be an array")

    converted_data = [convert_record(record) for record in source_data]
    with output_path.open("w", encoding="utf-8") as output_file:
        json.dump(converted_data, output_file, ensure_ascii=False, indent=2)
        output_file.write("\n")

    print(f"Converted {len(converted_data)} questions: {args.input} -> {output_path}")


if __name__ == "__main__":
    main()