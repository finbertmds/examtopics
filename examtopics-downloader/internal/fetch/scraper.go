package fetch

import (
	"encoding/json"
	"fmt"
	"log"
	"sort"
	"strings"
	"sync"
	"time"

	"examtopics-downloader/internal/constants"
	"examtopics-downloader/internal/models"
	"examtopics-downloader/internal/utils"

	"github.com/PuerkitoBio/goquery"
	"github.com/cheggaaa/pb/v3"
)

func getDataFromLink(link string) *models.QuestionData {
	doc, err := ParseHTML(link, *client)
	if err != nil {
		log.Printf("Failed parsing HTML data from link: %v", err)
		return nil
	}

	title := utils.CleanText(doc.Find("h1").Text())

	answerText := strings.TrimSpace(doc.Find(".correct-answer").Text())
	answerImages := utils.ExtractImageLinks(answerText)

	content, err2 := doc.Find("p.card-text").Html()
	if err2 != nil {
		log.Printf("Failed parsing HTML data from link content: %v", err2)
		return nil
	}
	questionImages := utils.ExtractImageLinks(content)
	content = utils.CleanHTML(content)

	var allQuestions []string
	doc.Find("li.multi-choice-item").Each(func(i int, s *goquery.Selection) {
		allQuestions = append(allQuestions, utils.CleanText(s.Text()))
	})

	var rawData models.QuestionJSON
	if len(allQuestions) == 0 {
		contentText := utils.ReplaceBrWithNewline(content)
		choices := utils.ParseChoicesFromQuestionText(contentText)
		rawData.Choices = choices

		content = utils.RemoveIMGPlaceholder(content)
	}

	return &models.QuestionData{
		Title:          title,
		Header:         strings.ReplaceAll(strings.TrimSpace(doc.Find(".question-discussion-header").Text()), "\t", ""),
		Content:        content,
		Questions:      allQuestions,
		Answer:         answerText,
		Timestamp:      utils.CleanText(doc.Find(".discussion-meta-data > i").Text()),
		QuestionLink:   link,
		Comments:       utils.CleanText(doc.Find(".discussion-container").Text()),
		QuestionImages: questionImages,
		AnswerImages:   answerImages,
		RawData:        rawData,
	}
}

func getTitleFromLink(link string) string {
	doc, err := ParseHTML(link, *client)
	if err != nil {
		log.Printf("Failed parsing HTML data from link: %v", err)
		return ""
	}

	return utils.CleanText(doc.Find("h1").Text())
}

func getJSONFromLink(link string) []*models.QuestionData {
	initialResp := FetchURL(link, *client)

	var githubResp map[string]any
	err := json.Unmarshal(initialResp, &githubResp)
	if err != nil {
		log.Printf("error unmarshalling GitHub API response: %v", err)
		return nil
	}

	downloadURL, ok := githubResp["download_url"].(string)
	if !ok {
		log.Printf("couldn't find download_url in GitHub API response")
		return nil
	}

	jsonResp := FetchURL(downloadURL, *client)

	var content models.JSONResponse
	err = json.Unmarshal(jsonResp, &content)
	if err != nil {
		log.Printf("error unmarshalling the questions data: %v, %v", err, downloadURL)
		return nil
	}

	fmt.Println("Processing content from:", downloadURL)

	var questions []*models.QuestionData

	if content.PageProps.Questions == nil {
		log.Printf("no questions found in JSON content")
		return nil
	}

	for _, q := range content.PageProps.Questions {
		var comments string
		for _, discussion := range q.Discussion {
			comments += fmt.Sprintf("[%s] %s\n", discussion.Poster, discussion.Content)
		}

		var choicesHeader string
		var keys []string
		for key := range q.Choices {
			keys = append(keys, key)
		}
		sort.Strings(keys)
		for _, key := range keys {
			choicesHeader += fmt.Sprintf("**%s:** %s\n\n", key, q.Choices[key])
		}

		title := getTitleFromLink(q.URL)

		questions = append(questions, &models.QuestionData{
			Title:          title,
			Header:         q.QuestionText,
			Content:        strings.Join(q.QuestionImages, "\n"),
			Questions:      []string{choicesHeader},
			Answer:         q.Answer,
			Timestamp:      q.Timestamp,
			QuestionLink:   q.URL,
			Comments:       utils.CleanText(comments),
			QuestionImages: q.QuestionImages,
			AnswerImages:   q.AnswerImages,
			RawData:        q,
		})
	}

	return questions
}

func fetchAllPageLinksConcurrently(providerName, grepStr string, numPages, concurrency int, getAllLinks bool) []string {
	var wg sync.WaitGroup
	sem := make(chan struct{}, concurrency)
	results := make(chan []string, numPages)
	bar := pb.StartNew(numPages)
	startTime := utils.StartTime()

	rateLimiter := utils.CreateRateLimiter(constants.RequestsPerSecond)
	defer rateLimiter.Stop()

	for i := 1; i <= numPages; i++ {
		wg.Add(1)
		go func(i int) {
			defer wg.Done()
			sem <- struct{}{}
			defer func() { <-sem }()

			<-rateLimiter.C

			url := fmt.Sprintf("https://www.examtopics.com/discussions/%s/%d", providerName, i)

			var links []string
			if getAllLinks {
				links = getAllLinksFromPage(url)
			} else {
				links = getLinksFromPage(url, grepStr)
			}

			results <- links
			bar.Increment()
		}(i)
	}

	go func() {
		wg.Wait()
		close(results)
	}()

	var all []string
	for res := range results {
		all = append(all, res...)
	}

	bar.Finish()
	fmt.Printf("Scraping completed in %s.\n", utils.TimeSince(startTime))
	return all
}

// processCachedLinks processes cached links and filters them by grep string
func processCachedLinks(cachedLinks []string, grepStr string) []models.QuestionData {
	var filteredLinks []string

	// Filter links by grep string
	for _, link := range cachedLinks {
		if utils.GrepString(link, "/discussions") && utils.GrepString(link, grepStr) {
			filteredLinks = append(filteredLinks, link)
		}
	}

	fmt.Printf("Found %d matching links from cached pages:\n", len(filteredLinks))

	var wg sync.WaitGroup
	sem := make(chan struct{}, constants.MaxConcurrentRequests)
	results := make([]*models.QuestionData, len(filteredLinks))
	startTime := utils.StartTime()
	bar := pb.StartNew(len(filteredLinks))

	rateLimiter := utils.CreateRateLimiter(constants.RequestsPerSecond)
	defer rateLimiter.Stop()

	for i, link := range filteredLinks {
		wg.Add(1)
		url := utils.AddToBaseUrl(link)

		go func(i int, url string) {
			defer wg.Done()
			sem <- struct{}{}
			defer func() { <-sem }()

			<-rateLimiter.C

			data := getDataFromLink(url)
			if data != nil {
				results[i] = data
			}
			bar.Increment()
		}(i, url)
	}

	wg.Wait()
	bar.Finish()

	// Filter out nil entries
	var finalData []models.QuestionData
	for _, entry := range results {
		if entry != nil {
			finalData = append(finalData, *entry)
		}
	}

	fmt.Printf("Processing completed in %s.\n", utils.TimeSince(startTime))

	return finalData
}

// Main concurrent page scraping logic
func GetAllPages(providerName string, grepStr string, noCache bool, saveAllPages bool, pushToGitHub bool, token string) []models.QuestionData {
	// Check if we have cached all pages for this provider
	cacheFileName := fmt.Sprintf("cached_pages_%s.txt", providerName)

	// Get current number of pages from ExamTopics
	baseURL := fmt.Sprintf("https://www.examtopics.com/discussions/%s/", providerName)
	currentNumPages := 0

	// Try to get current page count, but don't panic if it fails
	func() {
		defer func() {
			if r := recover(); r != nil {
				log.Printf("Failed to get current page count: %v", r)
				currentNumPages = 0
			}
		}()
		currentNumPages = getMaxNumPages(baseURL)
	}()

	if currentNumPages > 0 {
		fmt.Printf("Current number of pages for provider '%s': %d\n", providerName, currentNumPages)
	} else {
		fmt.Printf("Could not determine current page count for provider '%s', will use cache if available\n", providerName)
	}

	if !noCache {
		// Try to read from local cached file first
		if cachedLinks, metadata := utils.ReadCachedPagesWithMetadata(cacheFileName); len(cachedLinks) > 0 {
			// Check if cache is up to date by comparing number of pages
			if currentNumPages > 0 && metadata != nil && metadata.NumPages == currentNumPages {
				fmt.Printf("Local cache is up to date (%d pages), filtering by grep string '%s'\n", currentNumPages, grepStr)
				result := processCachedLinks(cachedLinks, grepStr)
				if len(result) > 0 {
					return result
				} else {
					fmt.Printf("No matching links found in cache, fetching fresh data from ExamTopics\n")
				}
			} else if currentNumPages > 0 && metadata != nil {
				fmt.Printf("Local cache is outdated (cached: %d pages, current: %d pages), need to fetch fresh data\n", metadata.NumPages, currentNumPages)
			} else if currentNumPages == 0 && metadata != nil {
				// If we can't get current page count, use cache if it exists
				fmt.Printf("Using local cache (%d pages) as fallback, filtering by grep string '%s'\n", metadata.NumPages, grepStr)
				result := processCachedLinks(cachedLinks, grepStr)
				if len(result) > 0 {
					return result
				} else {
					fmt.Printf("No matching links found in cache, fetching fresh data from ExamTopics\n")
				}
			} else {
				fmt.Printf("Local cache found but no metadata, need to fetch fresh data\n")
			}
		}

		// Try to fetch from GitHub if local cache doesn't exist or is outdated
		if token != "" {
			if cachedLinks, metadata := utils.FetchCachedPagesFromGitHub(providerName, token); len(cachedLinks) > 0 {
				// Check if GitHub cache is up to date
				if currentNumPages > 0 && metadata != nil && metadata.NumPages == currentNumPages {
					fmt.Printf("GitHub cache is up to date (%d pages), filtering by grep string '%s'\n", currentNumPages, grepStr)
					result := processCachedLinks(cachedLinks, grepStr)
					if len(result) > 0 {
						return result
					} else {
						fmt.Printf("No matching links found in GitHub cache, fetching fresh data from ExamTopics\n")
					}
				} else if currentNumPages > 0 && metadata != nil {
					fmt.Printf("GitHub cache is outdated (cached: %d pages, current: %d pages), need to fetch fresh data\n", metadata.NumPages, currentNumPages)
				} else if currentNumPages == 0 && metadata != nil {
					// If we can't get current page count, use GitHub cache if it exists
					fmt.Printf("Using GitHub cache (%d pages) as fallback, filtering by grep string '%s'\n", metadata.NumPages, grepStr)
					result := processCachedLinks(cachedLinks, grepStr)
					if len(result) > 0 {
						return result
					} else {
						fmt.Printf("No matching links found in GitHub cache, fetching fresh data from ExamTopics\n")
					}
				} else {
					fmt.Printf("GitHub cache found but no metadata, need to fetch fresh data\n")
				}
			}
		}
	} else {
		fmt.Printf("Cache disabled, fetching fresh data from ExamTopics\n")
	}

	// If we still don't have current page count, try to get it again or use a default
	if currentNumPages == 0 {
		// Try one more time with a delay
		time.Sleep(2 * time.Second)
		func() {
			defer func() {
				if r := recover(); r != nil {
					log.Printf("Failed to get current page count on retry: %v", r)
					currentNumPages = 50 // Use a reasonable default
				}
			}()
			currentNumPages = getMaxNumPages(baseURL)
		}()

		if currentNumPages == 0 {
			currentNumPages = 50 // Use a reasonable default
		}
	}

	fmt.Printf("Fetching %d pages for provider '%s'\n", currentNumPages, providerName)

	// Always fetch all links first (we'll filter them later)
	allLinksForCache := fetchAllPageLinksConcurrently(providerName, grepStr, currentNumPages, constants.MaxConcurrentRequests, true)
	uniqueAllLinks := utils.DeduplicateLinks(allLinksForCache)

	// If saveAllPages is true and cache is enabled, save to cache
	if saveAllPages && !noCache {
		// Check if there are actual changes before saving and pushing
		existingLinks, existingMetadata := utils.ReadCachedPagesWithMetadata(cacheFileName)
		hasChanges := true

		if len(existingLinks) > 0 && existingMetadata != nil {
			// Compare number of pages and number of links
			if existingMetadata.NumPages == currentNumPages && len(existingLinks) == len(uniqueAllLinks) {
				hasChanges = false
				fmt.Printf("No changes detected (pages: %d, links: %d), skipping GitHub push\n", currentNumPages, len(uniqueAllLinks))
			} else {
				fmt.Printf("Changes detected - Pages: %d -> %d, Links: %d -> %d\n",
					existingMetadata.NumPages, currentNumPages, len(existingLinks), len(uniqueAllLinks))
			}
		} else {
			fmt.Printf("No existing cache found, will push to GitHub\n")
		}

		utils.SaveAllPagesWithMetadata(cacheFileName, uniqueAllLinks, currentNumPages, providerName)
		fmt.Printf("Saved %d unique links to %s for future use (pages: %d)\n", len(uniqueAllLinks), cacheFileName, currentNumPages)

		// Push to GitHub if requested and there are changes
		if pushToGitHub && token != "" && hasChanges {
			fileName := fmt.Sprintf("cached_pages_%s.txt", providerName)
			if err := utils.PushFileToGitHub(cacheFileName, fileName, token); err != nil {
				log.Printf("Failed to push to GitHub: %v", err)
			} else {
				fmt.Printf("Successfully pushed %s to GitHub repository\n", fileName)
			}
		} else if pushToGitHub && token != "" && !hasChanges {
			fmt.Printf("Skipped GitHub push - no changes detected\n")
		}
	}

	// Filter all links to get only those matching grepStr
	var matchingLinks []string
	for _, link := range uniqueAllLinks {
		if utils.GrepString(link, "/discussions") && utils.GrepString(link, grepStr) {
			matchingLinks = append(matchingLinks, link)
		}
	}

	fmt.Printf("Found %d unique matching links:\n", len(matchingLinks))

	var wg sync.WaitGroup
	sem := make(chan struct{}, constants.MaxConcurrentRequests)
	results := make([]*models.QuestionData, len(matchingLinks))
	startTime := utils.StartTime()
	bar := pb.StartNew(len(matchingLinks))

	rateLimiter := utils.CreateRateLimiter(constants.RequestsPerSecond)
	defer rateLimiter.Stop()

	for i, link := range matchingLinks {
		wg.Add(1)
		url := utils.AddToBaseUrl(link)

		go func(i int, url string) {
			defer wg.Done()
			sem <- struct{}{}
			defer func() { <-sem }()

			<-rateLimiter.C

			data := getDataFromLink(url)
			if data != nil {
				results[i] = data
			}
			bar.Increment()
		}(i, url)
	}

	wg.Wait()
	bar.Finish()
	// Filter out nil entries
	var finalData []models.QuestionData
	for _, entry := range results {
		if entry != nil {
			finalData = append(finalData, *entry)
		}
	}

	fmt.Printf("Scraping completed in %s.\n", utils.TimeSince(startTime))

	return finalData
}
