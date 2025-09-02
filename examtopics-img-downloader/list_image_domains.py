#!/usr/bin/env python3
"""
List unique image domains from all exam JSON files in ../batch/json/*.json
- Scans answer_images and question_images fields
- Extracts domains from URLs
- Prints a deduplicated, sorted list
"""

import json
import os
import glob
from urllib.parse import urlparse
from typing import Iterable, Set

JSON_DIR = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "batch", "json"))


def iter_json_files(folder: str) -> Iterable[str]:
    pattern = os.path.join(folder, "*.json")
    return glob.glob(pattern)


def load_json(path: str):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def extract_domains_from_question(q: dict) -> Set[str]:
    domains: Set[str] = set()

    def add_from_list(urls):
        if not urls:
            return
        for u in urls:
            try:
                parsed = urlparse(u)
                if parsed.scheme in ("http", "https") and parsed.netloc:
                    domains.add(parsed.netloc)
            except Exception:
                # ignore malformed URLs
                pass

    add_from_list(q.get("answer_images"))
    add_from_list(q.get("question_images"))
    return domains


def main():
    if not os.path.isdir(JSON_DIR):
        print(f"JSON directory not found: {JSON_DIR}")
        return

    all_domains: Set[str] = set()

    files = list(iter_json_files(JSON_DIR))
    print(f"Scanning {len(files)} JSON files in {JSON_DIR} ...")

    for path in files:
        try:
            data = load_json(path)
        except Exception as e:
            print(f"Failed to parse {path}: {e}")
            continue

        if not isinstance(data, list):
            continue

        for q in data:
            if isinstance(q, dict):
                all_domains.update(extract_domains_from_question(q))

    result = sorted(all_domains)
    print("\nUnique image domains (deduplicated):")
    for d in result:
        print(d)


if __name__ == "__main__":
    main()
