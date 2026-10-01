#!/usr/bin/env python3
"""Download images referenced by a converted exam JSON file."""

import argparse
import json
import os
from pathlib import Path
from urllib.parse import unquote, urlparse

import requests


IMAGE_ROOT = (
    Path(__file__).resolve().parent.parent
    / "examtopics-practice"
    / "public"
    / "img"
)


def exam_folder_name(json_path: Path) -> str:
    name = json_path.stem
    if name.endswith("_converted"):
        name = name[: -len("_converted")]
    return name.replace("_", "-")


def get_image_urls(records: list[dict]) -> list[str]:
    urls: list[str] = []
    seen: set[str] = set()

    for record in records:
        for field in ("answer_images", "question_images"):
            images = record.get(field, [])
            if not isinstance(images, list):
                continue
            for url in images:
                if isinstance(url, str) and url.startswith(("http://", "https://")) and url not in seen:
                    seen.add(url)
                    urls.append(url)

    return urls


def download_images(json_path: Path) -> tuple[int, int, int]:
    with json_path.open("r", encoding="utf-8") as source_file:
        records = json.load(source_file)
    if not isinstance(records, list):
        raise ValueError("The JSON root must be an array")

    output_dir = IMAGE_ROOT / exam_folder_name(json_path)
    output_dir.mkdir(parents=True, exist_ok=True)
    urls = get_image_urls(records)
    downloaded = skipped = failed = 0
    local_paths: dict[str, str] = {}

    with requests.Session() as session:
        session.headers.update({"User-Agent": "Mozilla/5.0"})
        for url in urls:
            filename = Path(unquote(urlparse(url).path)).name
            if not filename:
                print(f"Skipping URL without a filename: {url}")
                failed += 1
                continue

            output_path = output_dir / filename
            local_path = f"/img/{output_dir.name}/{filename}"
            if output_path.exists():
                skipped += 1
                local_paths[url] = local_path
                continue

            try:
                response = session.get(url, timeout=30)
                response.raise_for_status()
                output_path.write_bytes(response.content)
                downloaded += 1
                local_paths[url] = local_path
                print(f"Downloaded {filename}")
            except requests.RequestException as error:
                failed += 1
                print(f"Failed {url}: {error}")

    rewritten = 0
    for record in records:
        for field in ("answer_images", "question_images"):
            images = record.get(field, [])
            if not isinstance(images, list):
                continue
            for index, url in enumerate(images):
                if url in local_paths:
                    images[index] = local_paths[url]
                    rewritten += 1

    temporary_path = json_path.with_suffix(json_path.suffix + ".tmp")
    with temporary_path.open("w", encoding="utf-8") as output_file:
        json.dump(records, output_file, ensure_ascii=False, indent=2)
        output_file.write("\n")
    os.replace(temporary_path, json_path)

    print(
        f"Images in {output_dir}: {downloaded} downloaded, "
        f"{skipped} already present, {failed} failed; "
        f"rewrote {rewritten} image references in {json_path}"
    )
    return downloaded, skipped, failed


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("json_file", type=Path, help="converted exam JSON file")
    args = parser.parse_args()
    download_images(args.json_file)


if __name__ == "__main__":
    main()