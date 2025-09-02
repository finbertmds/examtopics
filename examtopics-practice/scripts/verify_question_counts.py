#!/usr/bin/env python3
import json
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUBLIC_EXAMS_DIR = ROOT / 'public' / 'exams'
EXAMS_INDEX = PUBLIC_EXAMS_DIR / 'exams.json'


def count_questions(file_path: Path) -> int:
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        if isinstance(data, list):
            return len(data)
        return 0
    except Exception as e:
        print(f"Failed to read {file_path}: {e}")
        return 0


def main():
    with open(EXAMS_INDEX, 'r', encoding='utf-8') as f:
        exams = json.load(f)

    mismatches = []

    for exam in exams:
        rel = exam.get('file')
        declared = exam.get('questionCount')
        if not rel:
            continue
        path = PUBLIC_EXAMS_DIR / Path(rel).name
        actual = count_questions(path)
        status = 'OK' if actual == declared else 'MISMATCH'
        print(f"{exam.get('id')}: declared={declared}, actual={actual} -> {status}")
        if actual != declared:
            mismatches.append((exam.get('id'), rel, declared, actual))

    print("\nTotal mismatches:", len(mismatches))
    for id_, rel, declared, actual in mismatches:
        print(f" - {id_} ({rel}): declared={declared}, actual={actual}")


if __name__ == '__main__':
    main()
