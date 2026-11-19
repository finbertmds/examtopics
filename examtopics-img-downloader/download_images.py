#!/usr/bin/env python3
"""
Script to download images from all exam JSON files
Downloads all images from answer_images and question_images URLs to local folders
Automatically determines output folders based on image domains:
- img.examtopics.com -> batch/img/<first-path-segment>
- www.examtopics.com -> batch/img/assets/<path-without-leading-"assets"-and-filename>
"""

import json
import os
import requests
import time
import glob
import stat
import secrets
from contextlib import contextmanager
from urllib.parse import urlparse, unquote, urljoin
from pathlib import Path
import logging
from collections import defaultdict

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('image_download.log'),
        logging.StreamHandler()
    ]
)

class MultiImageDownloader:
    def __init__(self, json_folder, base_output_folder):
        self.json_folder = Path(json_folder)
        self.base_output_folder = Path(base_output_folder).absolute()
        self.downloaded_images = set()
        self.failed_downloads = []
        self.folder_stats = defaultdict(lambda: {'total': 0, 'successful': 0, 'failed': 0, 'skipped': 0})
        
        # Create base output folder if it doesn't exist
        self.base_output_folder.mkdir(parents=True, exist_ok=True)
        self.output_root_identity = self.base_output_folder.stat(follow_symlinks=False)
        
        # Session for requests with retry logic
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
    
    def get_json_files(self):
        """Get all JSON files in the specified folder"""
        pattern = self.json_folder / "*.json"
        json_files = list(glob.glob(str(pattern)))
        logging.info(f"Found {len(json_files)} JSON files in {self.json_folder}")
        return json_files
    
    def load_json_data(self, json_file_path):
        """Load and parse a JSON file"""
        try:
            with open(json_file_path, 'r', encoding='utf-8') as file:
                data = json.load(file)
            logging.info(f"Successfully loaded {json_file_path} with {len(data)} questions")
            return data
        except FileNotFoundError:
            logging.error(f"JSON file not found: {json_file_path}")
            return None
        except json.JSONDecodeError as e:
            logging.error(f"Error parsing JSON file {json_file_path}: {e}")
            return None
    
    def validated_image_url(self, url):
        """Accept supported image URLs before any network or filesystem use."""
        if not isinstance(url, str) or any(ord(char) < 32 or ord(char) == 127 for char in url):
            raise ValueError("Invalid image URL")
        parsed = urlparse(url)
        if (parsed.scheme not in ('https', 'http') or
                parsed.hostname not in ('img.examtopics.com', 'www.examtopics.com') or
                parsed.username is not None or parsed.password is not None or
                parsed.port not in (None, 443 if parsed.scheme == 'https' else 80)):
            raise ValueError("Unsupported image URL")
        parts = [part for part in parsed.path.split('/') if part]
        if not parts or parsed.path.endswith('/'):
            raise ValueError("Image URL requires a filename")
        for part in parts:
            decoded = unquote(part, errors='strict')
            if (decoded in ('.', '..') or '/' in decoded or '\\' in decoded or
                    any(ord(char) < 32 or ord(char) == 127 for char in decoded)):
                raise ValueError("Unsafe image URL path")
        if parsed.hostname == 'img.examtopics.com' and len(parts) < 2:
            raise ValueError("Image URL requires an exam folder")
        return parsed, parts

    def folder_key_for_url(self, url: str):
        """Keep supported host layouts, with every path component validated."""
        try:
            parsed, parts = self.validated_image_url(url)
        except (ValueError, UnicodeError):
            return None
        if parsed.hostname == 'img.examtopics.com':
            return parts[0]
        directories = parts[:-1]
        if directories and directories[0] == 'assets':
            directories = directories[1:]
        return '/'.join(['assets', *directories])

    def relative_output_folder(self, folder):
        candidate = Path(folder).absolute()
        try:
            relative = candidate.relative_to(self.base_output_folder)
        except ValueError:
            raise ValueError("Image destination is outside the output folder") from None
        if any(part in ('.', '..') for part in relative.parts):
            raise ValueError("Unsafe image destination")
        return relative

    @contextmanager
    def open_output_folder(self, folder):
        """Walk relative to open directories and refuse symlinks at each step."""
        relative = self.relative_output_folder(folder)
        if (not hasattr(os, 'O_NOFOLLOW') or not hasattr(os, 'O_DIRECTORY') or
                not all(operation in os.supports_dir_fd for operation in (os.open, os.mkdir, os.stat, os.link))):
            raise OSError("Secure image output requires directory-relative filesystem operations")
        flags = os.O_RDONLY | os.O_DIRECTORY | os.O_NOFOLLOW
        directory = os.open(self.base_output_folder, flags)
        try:
            opened_root = os.fstat(directory)
            if (opened_root.st_dev, opened_root.st_ino) != (
                    self.output_root_identity.st_dev, self.output_root_identity.st_ino):
                raise OSError("The image output root changed during the download")
            for part in relative.parts:
                try:
                    os.mkdir(part, dir_fd=directory)
                except FileExistsError:
                    pass
                child = os.open(part, flags, dir_fd=directory)
                os.close(directory)
                directory = child
            yield directory
        finally:
            os.close(directory)

    def regular_image_exists(self, directory, filename):
        try:
            entry = os.stat(filename, dir_fd=directory, follow_symlinks=False)
        except FileNotFoundError:
            return False
        if not stat.S_ISREG(entry.st_mode):
            raise OSError("Image destination must be a regular file")
        return True

    def fetch_image(self, url):
        """Follow only validated redirects, bounded to five hops."""
        current_url = url
        for hop in range(6):
            parsed, _ = self.validated_image_url(current_url)
            response = self.session.get(current_url, timeout=30, allow_redirects=False)
            if response.status_code not in (301, 302, 303, 307, 308):
                try:
                    response.raise_for_status()
                    if not response.headers.get('content-type', '').lower().startswith('image/'):
                        raise ValueError("URL did not return an image")
                    return response.content
                finally:
                    response.close()
            try:
                location = response.headers.get('location')
                if not location or hop == 5:
                    raise ValueError("Invalid or excessive image redirects")
                next_url = urljoin(current_url, location)
                target, _ = self.validated_image_url(next_url)
                if parsed.scheme == 'https' and target.scheme != 'https':
                    raise ValueError("HTTPS image redirects must preserve HTTPS")
                current_url = next_url
            finally:
                response.close()

    def save_image(self, directory, filename, content):
        temporary = '.image-' + secrets.token_hex(16) + '.part'
        descriptor = os.open(temporary, os.O_WRONLY | os.O_CREAT | os.O_EXCL | os.O_NOFOLLOW, 0o600, dir_fd=directory)
        try:
            with os.fdopen(descriptor, 'wb') as output:
                output.write(content)
            try:
                os.link(temporary, filename, src_dir_fd=directory, dst_dir_fd=directory, follow_symlinks=False)
            except FileExistsError:
                if self.regular_image_exists(directory, filename):
                    return 2
                raise OSError("Image destination changed during publication") from None
            return 1
        finally:
            os.unlink(temporary, dir_fd=directory)

    def extract_image_urls_by_folder(self, data):
        """Extract all image URLs from the JSON data, grouped by resolved folder key"""
        images_by_folder = defaultdict(set)
        
        def add_url(url: str):
            key = self.folder_key_for_url(url)
            if key:
                images_by_folder[key].add(url)
        
        for question in data:
            # Extract answer images
            if 'answer_images' in question and question['answer_images']:
                for url in question['answer_images']:
                    add_url(url)
            
            # Extract question images
            if 'question_images' in question and question['question_images']:
                for url in question['question_images']:
                    add_url(url)
        
        return images_by_folder
    
    def get_filename_from_url(self, url):
        """Extract the original filename after validating its decoded form."""
        _, parts = self.validated_image_url(url)
        return parts[-1]

    def download_image(self, url, output_folder, max_retries=3):
        """Download into a confined directory, preserving existing regular files."""
        try:
            filename = self.get_filename_from_url(url)
            with self.open_output_folder(output_folder) as directory:
                if self.regular_image_exists(directory, filename):
                    return 2
                for attempt in range(max_retries):
                    try:
                        content = self.fetch_image(url)
                        result = self.save_image(directory, filename, content)
                        if result == 1:
                            self.downloaded_images.add(url)
                        return result
                    except requests.exceptions.RequestException:
                        logging.warning("Image request failed (attempt %s/%s)", attempt + 1, max_retries)
                        if attempt < max_retries - 1:
                            time.sleep(2 ** attempt)
        except (ValueError, UnicodeError, OSError):
            logging.warning("Image rejected because its URL, response or destination is unsafe")
        self.failed_downloads.append(url)
        return 0

    def download_images_for_folder(self, folder_key, image_urls):
        """Download all images for a specific folder key (relative under base_output_folder)"""
        output_folder = self.base_output_folder / folder_key
        self.relative_output_folder(output_folder)
        
        logging.info(f"Processing folder: {folder_key} with {len(image_urls)} images")
        
        successful = 0
        failed = 0
        skipped = 0
        
        for i, url in enumerate(image_urls, 1):
            logging.info(f"Progress for {folder_key}: {i}/{len(image_urls)}")
            
            result = self.download_image(url, output_folder)
            if result == 1:
                successful += 1
            elif result == 2:
                skipped += 1
            else:
                failed += 1
            
            # Add a small delay to be respectful to the server
            time.sleep(0.5)
        
        # Update folder statistics
        self.folder_stats[folder_key]['total'] = len(image_urls)
        self.folder_stats[folder_key]['successful'] = successful
        self.folder_stats[folder_key]['failed'] = failed
        self.folder_stats[folder_key]['skipped'] = skipped
        
        return successful, failed
    
    def process_all_json_files(self):
        """Process all JSON files and download images"""
        json_files = self.get_json_files()
        if not json_files:
            logging.error(f"No JSON files found in {self.json_folder}")
            return False
        
        all_images_by_folder = defaultdict(set)
        
        # Process each JSON file
        for json_file in json_files:
            logging.info(f"Processing JSON file: {json_file}")
            
            data = self.load_json_data(json_file)
            if not data:
                continue
            
            # Extract images grouped by folder
            images_by_folder = self.extract_image_urls_by_folder(data)
            
            # Merge with overall collection
            for folder_key, urls in images_by_folder.items():
                all_images_by_folder[folder_key].update(urls)
        
        # Download images for each folder
        total_folders = len(all_images_by_folder)
        logging.info(f"Found {total_folders} folders with images to download")
        
        for i, (folder_key, image_urls) in enumerate(all_images_by_folder.items(), 1):
            logging.info(f"Processing folder {i}/{total_folders}: {folder_key}")
            self.download_images_for_folder(folder_key, image_urls)
        
        # Print summary
        self.print_summary()
        return True
    
    def print_summary(self):
        """Print download summary"""
        total_images = len(self.downloaded_images) + len(self.failed_downloads)
        successful = len(self.downloaded_images)
        failed = len(self.failed_downloads)
        
        logging.info("=" * 60)
        logging.info("DOWNLOAD SUMMARY")
        logging.info("=" * 60)
        logging.info(f"Total images found: {total_images}")
        logging.info(f"Successfully downloaded: {successful}")
        logging.info(f"Failed downloads: {failed}")
        logging.info(f"Base output folder: {self.base_output_folder.absolute()}")
        
        logging.info("\nFolder Statistics:")
        for folder, stats in self.folder_stats.items():
            logging.info(f"  {folder}: {stats['successful']} successful, {stats['failed']} failed, {stats['skipped']} skipped")
        
        if failed > 0:
            logging.info("\nFailed URLs:")
            for url in self.failed_downloads:
                logging.info(f"  - {url}")

def main():
    # Configuration
    json_folder = "../batch/json"
    base_output_folder = "../batch/img"
    
    # Validate input folder exists
    if not os.path.exists(json_folder):
        logging.error(f"JSON folder not found: {json_folder}")
        return
    
    # Create downloader and start download
    downloader = MultiImageDownloader(json_folder, base_output_folder)
    success = downloader.process_all_json_files()
    
    if success:
        logging.info("Download process completed!")
    else:
        logging.error("Download process failed!")

if __name__ == "__main__":
    main()
