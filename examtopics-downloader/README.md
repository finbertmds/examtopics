# Exam Topics Downloader

This repo aims to make it possible for you to obtain all the exam questions from the examtopics website (which is paywalled).

## Setting it Up

### Using docker

1. Make sure [docker](https://docs.docker.com/engine/install/) is installed on your system.
2. Pull the docker image:

```bash
docker pull ghcr.io/finbertmds/examtopics-downloader:latest
```

3\. Run the container:

```bash
docker run -it \
  --name examtopics-downloader \
  ghcr.io/finbertmds/examtopics-downloader:latest \
  -p google -s devops \
  -save-links -o output.md -json
docker cp examtopics-downloader:/app/output.md .
docker cp examtopics-downloader:/app/output.json .
docker cp examtopics-downloader:/app/saved-links.txt .
docker rm examtopics-downloader
```

> [!NOTE]  
> If seeing `exec: format exec error` or warnings about unsuportted platforms, if you are on `linux/arm64`, modify the docker cmd to:

```bash
docker run -it \
  --name examtopics-downloader \
  --platform linux/arm64 \
  ghcr.io/finbertmds/examtopics-downloader:latest \
  -p google -s devops \
  -save-links -o output.md -json
docker cp examtopics-downloader:/app/output.md .
docker cp examtopics-downloader:/app/output.json .
docker cp examtopics-downloader:/app/saved-links.txt .
docker rm examtopics-downloader
```

### Using Dockerfile

1. `git clone https://github.com/finbertmds/examtopics` and make sure docker is installed on your system.
2. Run `cd examtopics-downloader && docker build -t examtopics-dl . && docker run --rm examtopics-dl -p google -s devops -save-links -o output.md`
3. After setup, it will give you a list of exams with the `cisco` provider.

### Building from Source

1. First, you must install [Golang >= 1.24](https://go.dev/doc/install) from the offical website.
2. Then, run `git clone https://github.com/finbertmds/examtopics` in your terminal to clone the repo.
3. `cd` into the directory: `cd examtopics/examtopics-downloader`
4. You can now run: `go run ./cmd/main.go -p cisco -exams`

(there will be compiled binaries in the future)

## Command Line Arguments

```
Each command line argument you can provide when running the program:

  -c	Optionally include all the comment/discussion text
  -exams
    	Optionally show all the possible exams for your selected provider and exit
  -json
    	Export data to JSON format in addition to MD format
  -no-cache
    	Optional argument, set to disable looking through cached data on github
  -o string
    	Optional path of the file where the data will be outputted (default "examtopics_output.md")
  -p string
    	Name of the exam provider (default -> google) (default "google")
  -s string
    	String to grep for in discussion links (required)
  -save-all-pages
    	Save all pages from provider to file when using no-cache mode
  -push-github
    	Push cached pages to GitHub repository (requires token)
  -save-links
    	Optional argument to save unique links to questions
  -t string
    	Optional argument to make cached requests faster to gh api
```

## Possible Arguments List

### Exam Providers, `-p`

| Provider (-p)    | View Exams                                                                     | Notes     |
| ---------------- | ------------------------------------------------------------------------------ | --------- |
| amazon           | [Amazon Exams](https://www.examtopics.com/exams/amazon/)                       | AWS Certs |
| cisco            | [Cisco Exams](https://www.examtopics.com/exams/cisco/)                         |           |
| comptia          | [CompTIA Exams](https://www.examtopics.com/exams/comptia/)                     |           |
| salesforce       | [Salesforce Exams](https://www.examtopics.com/exams/salesforce/)               |           |
| fortinet         | [Fortinet Exams](https://www.examtopics.com/exams/fortinet/)                   |           |
| juniper          | [Juniper Exams](https://www.examtopics.com/exams/juniper/)                     |           |
| isaca            | [ISACA Exams](https://www.examtopics.com/exams/isaca/)                         |           |
| vmware           | [VMware Exams](https://www.examtopics.com/exams/vmware/)                       |           |
| isc2             | [ISC2 Exams](https://www.examtopics.com/exams/isc2/)                           | CISSP etc |
| servicenow       | [ServiceNow Exams](https://www.examtopics.com/exams/servicenow/)               |           |
| google           | [Google Exams](https://www.examtopics.com/exams/google/)                       |           |
| microsoft        | [Microsoft Exams](https://www.examtopics.com/exams/microsoft/)                 |           |
| ec-council       | [EC-Council Exams](https://www.examtopics.com/exams/ec-council/)               | CEH etc   |
| oracle           | [Oracle Exams](https://www.examtopics.com/exams/oracle/)                       |           |
| paloaltonetworks | [Palo Alto Networks Exams](https://www.examtopics.com/exams/paloaltonetworks/) |           |

> [!NOTE]  
> The more the amount of exams/discussion the provider has, the longer it will take to scrape through the exams.

### `-save-links` && `-output-save-links`

This is a bool flag, so the default is that it's set to `false`, deactivated. If `-save-links` is false `-output-save-links` will do nothing.
`-output-save-links` is a `string` which includes the output path for the saved links, default is `saved-links.txt`.

### Grep String, `-s`

The `-s` argument can take an exam ID (ex. 200-301) or a word, such as "devops". for example:

```bash
go run . -p google -s devops
```

would get all exams from the `google` provider containing the string `devops`.

### Comments and output, `-c` && `-o`

The `-c` argument is another bool flag, so it is defaultly set to false(as it creates a lot of noise in the `.md` file), but you can include it by adding the flag.
`-o` is the output path, based on `os.create(path)`, in the current working directory.

### JSON Export, `-json`

The `-json` argument is a bool flag that enables JSON export in addition to the default MD format. When enabled, it will create a JSON file with the same name as the MD file but with `.json` extension.

The JSON format follows the `QuestionDataJson` structure:
```json
{
  "question_number": 1,
  "answers": {
    "A": "Answer text for option A",
    "B": "Answer text for option B",
    "C": "Answer text for option C",
    "D": "Answer text for option D"
  },
  "suggested_answer": "A",
  "answer": "A",
  "link": "https://www.examtopics.com/discussions/...",
  "multiple_choice": false,
  "question_text": "The question text here"
}
```

Example usage:
```bash
go run . -p amazon -s sap-c02 -o aws_sap_c02.md -json
```
This will create both `aws_sap_c02.md` and `aws_sap_c02.json` files.

### Exams output, `-exams`

This argument will display output defaulted to such as and exit immediately.

```
Exams for provider 'google'

https://www.examtopics.com/exams/google/adwords-fundamentals/
https://www.examtopics.com/exams/google/associate-android-developer/
https://www.examtopics.com/exams/google/associate-cloud-engineer/
https://www.examtopics.com/exams/google/associate-data-practitioner/
https://www.examtopics.com/exams/google/associate-google-workspace-administrator/
https://www.examtopics.com/exams/google/cloud-digital-leader/
https://www.examtopics.com/exams/google/display-advertising/
https://www.examtopics.com/exams/google/google-analytics/
https://www.examtopics.com/exams/google/gsuite/
https://www.examtopics.com/exams/google/individual-qualification/
https://www.examtopics.com/exams/google/mobile-advertising/
https://www.examtopics.com/exams/google/professional-chromeos-administrator/
https://www.examtopics.com/exams/google/professional-cloud-architect/
https://www.examtopics.com/exams/google/professional-cloud-database-engineer/
https://www.examtopics.com/exams/google/professional-cloud-developer/
https://www.examtopics.com/exams/google/professional-cloud-devops-engineer/
https://www.examtopics.com/exams/google/professional-cloud-network-engineer/
https://www.examtopics.com/exams/google/professional-cloud-security-engineer/
https://www.examtopics.com/exams/google/professional-collaboration-engineer/
https://www.examtopics.com/exams/google/professional-data-engineer/
https://www.examtopics.com/exams/google/professional-google-workspace-administrator/
https://www.examtopics.com/exams/google/professional-machine-learning-engineer/
https://www.examtopics.com/exams/google/search-advertising/
https://www.examtopics.com/exams/google/shopping-advertising/
https://www.examtopics.com/exams/google/video-advertising/
```

### Token Input, `-t`

When you add you `Github` PAT, it allows for more requests to the API, (up to 5000) which is needed when scraping bigger things.
The cached data helps you access big dumps faster.

### No Cache Arg, `-no-cache`

When you add this argument, it tells the program to ignore the cached `Github` repoitories of updated exam info, however the scraper will take longer than the cache.
Useful when wanting to scrape realtime data.

### Save All Pages Arg, `-save-all-pages`

This flag works in conjunction with `-no-cache` to save all pages from a provider to a local cache file. When enabled:

1. **First run with `-save-all-pages`**: The program will fetch all pages from the provider and save them to a file named `cached_pages_{provider}.txt`
2. **Subsequent runs without `-save-all-pages`**: The program will read from the cached file and filter by the grep string, avoiding the need to fetch all pages again

This is particularly useful for providers with many pages, as it allows you to:
- Save time on subsequent searches by avoiding re-fetching all pages
- Filter through cached pages locally without making network requests
- Maintain a local cache of all provider pages for offline use

Example usage:
```bash
# First run: save all pages for google provider
go run . -p google -s devops -no-cache -save-all-pages

# Subsequent runs: use cached pages (much faster)
go run . -p google -s cloud -no-cache
```

The cache file will be created in the current working directory as `cached_pages_google.txt` (for the google provider).

**Cache Validation**: The tool automatically validates cache freshness by:
1. Fetching the current number of pages from ExamTopics
2. Comparing with the cached page count stored in metadata
3. Using cache only if the page counts match
4. Falling back to cache if current page count cannot be determined (e.g., due to rate limiting)

**Cache Strategy**: When `-save-all-pages` is used:
1. **Cache Storage**: All discussion links are saved to cache (without filtering by grepStr)
2. **Data Processing**: Only links matching the grepStr are processed for output files (MD/JSON)
3. **Cache Reuse**: Subsequent runs with different grepStr can reuse the same cache file
4. **Fallback to Fresh Data**: If no matching links are found in cache, automatically fetch fresh data from ExamTopics
5. **Optimized Fetching**: Only calls `fetchAllPageLinksConcurrently` once per run, reusing results for both caching and filtering

**No Cache Mode**: When `-no-cache` is used:
1. **Skip Local Cache**: Does not read from local cached files
2. **Skip GitHub Cache**: Does not fetch from GitHub cache
3. **Skip Cache Storage**: Does not save new cache files (even with `-save-all-pages`)
4. **Skip GitHub Push**: Does not push cache files to GitHub (even with `-push-github`)
5. **Fresh Data**: Always fetches fresh data from ExamTopics website

Cache files include metadata in the first line:
```
# METADATA: {"num_pages":36,"last_updated":"2025-08-14T23:23:30+09:00","provider":"google"}
/discussions/google/view/12345
/discussions/google/view/67890
...
```

### Push to GitHub Arg, `-push-github`

This flag works in conjunction with `-save-all-pages` and `-t` (token) to push cached pages to the GitHub repository. When enabled:

1. **Requires GitHub Token**: You must provide a GitHub Personal Access Token using the `-t` flag
2. **Push to Repository**: The cached pages will be pushed to `https://github.com/finbertmds/examtopics-data` in the `CachedPages/` folder
3. **Automatic Fetching**: On subsequent runs, the tool will automatically try to fetch cached pages from GitHub if local cache doesn't exist

Example usage:
```bash
# Save pages locally and push to GitHub
go run . -p google -s devops -no-cache -save-all-pages -push-github -t YOUR_GITHUB_TOKEN

# Fetch from GitHub on subsequent runs (no need to save locally again)
go run . -p google -s cloud -no-cache -t YOUR_GITHUB_TOKEN
```

The files will be stored in the GitHub repository at:
- `CachedPages/cached_pages_google.txt`
- `CachedPages/cached_pages_amazon.txt`
- etc.

**Note**: You need a GitHub Personal Access Token with `repo` permissions to push files to the repository.

## [For outputted file examples, see the examples folder](examples/google_devops.md)

## Demo

So, you have installed `go` on your system, and you're inside of the working directory. Let's say you would like the questions for the cisco exam 200-301.

Open your terminal and run:

```bash
go run . -p cisco -s 200-301
```

Note that you can put the id as the string to look for, as the program is compatible this way also.

After waiting a few moments, you would see the output end with:

```bash
Successfully saved output to {OUTPUT_LOCATION}.
```

If so, hooray, you have successfully saved all/most of the questions in a `.md` file!
The format would be such as (older, only scraping format):

```
----------------------------------------

## Exam 200-301 topic 1 question 532 discussion

Actual exam question from

Cisco's
200-301

Question #: 532
Topic #: 1

[All 200-301 Questions]

Refer to the exhibit. An engineer configured NAT translations and has verified that the configuration is correct. Which IP address is the source IP after the NAT has taken place?
Suggested Answer: D 🗳️

A. 10.4.4.4

B. 10.4.4.5

C. 172.23.103.10

D. 172.23.104.4

**Answer: D**

**Timestamp: Jan. 5, 2021, 9:48 p.m.**

[View on ExamTopics](https://www.examtopics.com/discussions/cisco/view/41599-exam-200-301-topic-1-question-532-discussion/)

----------------------------------------
```

More options for formatting are coming soon.
