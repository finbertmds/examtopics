package main

import (
	"flag"
	"fmt"
	"log"
	"os"
	"strings"

	"examtopics-downloader/internal/fetch"
	"examtopics-downloader/internal/utils"
)

type cacheOptions struct {
	useCache bool
	noCache  bool
}

func registerCacheFlags(flags *flag.FlagSet) *cacheOptions {
	options := &cacheOptions{}
	flags.BoolVar(&options.useCache, "use-cache", false, "Use cached data from local files and GitHub (disabled by default)")
	flags.BoolVar(&options.noCache, "no-cache", false, "Disable all cache use; overrides -use-cache (legacy flag)")
	return options
}

func (options *cacheOptions) enabled() bool {
	return options.useCache && !options.noCache
}

func main() {
	provider := flag.String("p", "google", "Name of the exam provider (default -> google)")
	grepStr := flag.String("s", "", "String to grep for in discussion links (required)")
	outputPath := flag.String("o", "examtopics_output.md", "Optional path of the file where the data will be outputted")
	commentBool := flag.Bool("c", false, "Optionally include all the comment/discussion text")
	examsFlag := flag.Bool("exams", false, "Optionally show all the possible exams for your selected provider and exit")
	saveUrls := flag.Bool("save-links", false, "Optional argument to save unique links to questions")
	cache := registerCacheFlags(flag.CommandLine)
	saveAllPages := flag.Bool("save-all-pages", false, "Save all pages from provider to a cache file (requires -use-cache)")
	pushToGitHub := flag.Bool("push-github", false, "Push cached pages to GitHub repository")
	token := flag.String("t", "", "Optional argument to make cached requests faster to gh api")
	exportJSON := flag.Bool("json", false, "Export data to JSON format in addition to MD format")
	flag.Parse()
	noCache := !cache.enabled()
	defer reportExhaustedRetries()

	if *examsFlag {
		exams := fetch.GetProviderExams(*provider)
		fmt.Printf("Exams for provider '%s'\n\n", *provider)
		for _, exam := range exams {
			fmt.Println(utils.AddToBaseUrl(exam))
		}
		return
	}

	if *grepStr == "" {
		log.Println("running without a valid string to search for with -s, (no_grep_str)!")
	}

	if !noCache {
		links := fetch.GetCachedPages(*provider, *grepStr, *token)
		if len(links) > 0 {
			utils.WriteData(links, *outputPath, *commentBool)
			fmt.Printf("Successfully saved cached output to %s.\n", *outputPath)

			// Export JSON if requested
			if *exportJSON {
				jsonPath := strings.TrimSuffix(*outputPath, ".md") + ".json"
				utils.WriteJSONData(links, jsonPath, true)
				fmt.Printf("Successfully saved JSON output to %s.\n", jsonPath)
			}
			return
		}
	}

	if noCache {
		fmt.Println("Cache disabled (default), scraping fresh data from ExamTopics.")
	} else {
		fmt.Println("No cached data available, scraping fresh data from ExamTopics.")
	}
	links := fetch.GetAllPages(*provider, *grepStr, noCache, *saveAllPages, *pushToGitHub, *token)

	if *saveUrls {
		utils.SaveLinks("saved-links.txt", links)
	}
	utils.WriteData(links, *outputPath, *commentBool)
	fmt.Printf("Successfully saved output to %s.\n", *outputPath)

	// Export JSON if requested
	if *exportJSON {
		jsonPath := strings.TrimSuffix(*outputPath, ".md") + ".json"
		utils.WriteJSONData(links, jsonPath, false)
		fmt.Printf("Successfully saved JSON output to %s.\n", jsonPath)
	}
}

func reportExhaustedRetries() {
	const failedURLsPath = "failed_urls.txt"
	urls := fetch.GetExhaustedRetryURLs()
	content := strings.Join(urls, "\n")
	if len(urls) > 0 {
		content += "\n"
	}
	if err := os.WriteFile(failedURLsPath, []byte(content), 0644); err != nil {
		log.Printf("Failed to save exhausted retry URLs to %s: %v", failedURLsPath, err)
	}

	if len(urls) == 0 {
		log.Printf("No URLs exhausted retries; saved an empty %s", failedURLsPath)
		return
	}
	log.Printf("URLs that exhausted retries (%d), saved to %s:\n%s", len(urls), failedURLsPath, strings.Join(urls, "\n"))
}
