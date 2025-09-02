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
from urllib.parse import urlparse
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
        self.base_output_folder = Path(base_output_folder)
        self.downloaded_images = set()
        self.failed_downloads = []
        self.folder_stats = defaultdict(lambda: {'total': 0, 'successful': 0, 'failed': 0})
        
        # Create base output folder if it doesn't exist
        self.base_output_folder.mkdir(parents=True, exist_ok=True)
        
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
    
    def folder_key_for_url(self, url: str):
        """Determine relative folder key under base_output_folder for a given URL.
        - img.examtopics.com: use first path segment as folder
        - www.examtopics.com: place under assets/<path_without_leading_assets_and_filename>
        Returns None if URL is unsupported.
        """
        try:
            parsed = urlparse(url)
        except Exception:
            return None
        host = parsed.netloc
        path = parsed.path or ""
        parts = [p for p in path.split('/') if p]
        if host == 'img.examtopics.com':
            if len(parts) >= 2:
                return parts[0]
            return None
        if host == 'www.examtopics.com':
            # Build under assets/, remove leading 'assets' if present, and drop filename
            if len(parts) == 0:
                return None
            # Remove filename
            dir_parts = parts[:-1]
            # Strip leading 'assets'
            if dir_parts and dir_parts[0] == 'assets':
                dir_parts = dir_parts[1:]
            if not dir_parts:
                return 'assets'
            return 'assets/' + '/'.join(dir_parts)
        return None
    
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
        """Extract filename from URL"""
        parsed_url = urlparse(url)
        return os.path.basename(parsed_url.path)
    
    def download_image(self, url, output_folder, max_retries=3):
        """Download a single image with retry logic"""
        filename = self.get_filename_from_url(url)
        file_path = output_folder / filename
        
        # Skip if already downloaded
        if file_path.exists():
            logging.info(f"Image already exists: {filename}")
            return True
        
        for attempt in range(max_retries):
            try:
                logging.info(f"Downloading {filename} (attempt {attempt + 1}/{max_retries})")
                
                response = self.session.get(url, timeout=30)
                response.raise_for_status()
                
                # Check if response is actually an image
                content_type = response.headers.get('content-type', '')
                if not content_type.startswith('image/'):
                    logging.warning(f"URL {url} does not return an image (content-type: {content_type})")
                    return False
                
                # Save the image
                output_folder.mkdir(parents=True, exist_ok=True)
                with open(file_path, 'wb') as f:
                    f.write(response.content)
                
                logging.info(f"Successfully downloaded: {filename}")
                self.downloaded_images.add(url)
                return True
                
            except requests.exceptions.RequestException as e:
                logging.warning(f"Attempt {attempt + 1} failed for {filename}: {e}")
                if attempt < max_retries - 1:
                    time.sleep(2 ** attempt)  # Exponential backoff
                else:
                    logging.error(f"Failed to download {filename} after {max_retries} attempts")
                    self.failed_downloads.append(url)
                    return False
    
    def download_images_for_folder(self, folder_key, image_urls):
        """Download all images for a specific folder key (relative under base_output_folder)"""
        output_folder = self.base_output_folder / folder_key
        output_folder.mkdir(parents=True, exist_ok=True)
        
        logging.info(f"Processing folder: {folder_key} with {len(image_urls)} images")
        
        successful = 0
        failed = 0
        
        for i, url in enumerate(image_urls, 1):
            logging.info(f"Progress for {folder_key}: {i}/{len(image_urls)}")
            
            if self.download_image(url, output_folder):
                successful += 1
            else:
                failed += 1
            
            # Add a small delay to be respectful to the server
            time.sleep(0.5)
        
        # Update folder statistics
        self.folder_stats[folder_key]['total'] = len(image_urls)
        self.folder_stats[folder_key]['successful'] = successful
        self.folder_stats[folder_key]['failed'] = failed
        
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
            logging.info(f"  {folder}: {stats['successful']}/{stats['total']} successful")
        
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
