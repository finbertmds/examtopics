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

func main() {
	provider := flag.String("p", "google", "Name of the exam provider (default -> google)")
	grepStr := flag.String("s", "", "String to grep for in discussion links (required)")
	outputPath := flag.String("o", "examtopics_output.md", "Optional path of the file where the data will be outputted")
	commentBool := flag.Bool("c", false, "Optionally include all the comment/discussion text")
	examsFlag := flag.Bool("exams", false, "Optionally show all the possible exams for your selected provider and exit")
	saveUrls := flag.Bool("save-links", false, "Optional argument to save unique links to questions")
	noCache := flag.Bool("no-cache", false, "Optional argument, set to disable looking through cached data on github")
	saveAllPages := flag.Bool("save-all-pages", false, "Save all pages from provider to file when using no-cache mode")
	pushToGitHub := flag.Bool("push-github", false, "Push cached pages to GitHub repository")
	token := flag.String("t", "", "Optional argument to make cached requests faster to gh api")
	exportJSON := flag.Bool("json", false, "Export data to JSON format in addition to MD format")
	flag.Parse()

	if *examsFlag {
		exams := fetch.GetProviderExams(*provider)
		fmt.Printf("Exams for provider '%s'\n\n", *provider)
		for _, exam := range exams {
			fmt.Println(utils.AddToBaseUrl(exam))
		}
		os.Exit(0)
	}

	if *grepStr == "" {
		log.Println("running without a valid string to search for with -s, (no_grep_str)!")
	}

	if !*noCache {
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
			os.Exit(0)
		}
	}

	fmt.Println("Going to manual scraping, cached data failed.")
	links := fetch.GetAllPages(*provider, *grepStr, *noCache, *saveAllPages, *pushToGitHub, *token)

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
