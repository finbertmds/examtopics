package fetch

import (
	"encoding/json"
	"fmt"
	"log"
	"sort"
	"strings"
	"sync"

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

func fetchAllPageLinksConcurrently(providerName, grepStr string, numPages, concurrency int) []string {
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
			results <- getLinksFromPage(url, grepStr)
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

// Main concurrent page scraping logic
func GetAllPages(providerName string, grepStr string) []models.QuestionData {
	baseURL := fmt.Sprintf("https://www.examtopics.com/discussions/%s/", providerName)
	numPages := getMaxNumPages(baseURL)
	fmt.Printf("Fetching %d pages for provider '%s'\n", numPages, providerName)

	allLinks := fetchAllPageLinksConcurrently(providerName, grepStr, numPages, constants.MaxConcurrentRequests)

	uniqueLinks := utils.DeduplicateLinks(allLinks)

	fmt.Printf("Found %d unique matching links:\n", len(uniqueLinks))

	var wg sync.WaitGroup
	sem := make(chan struct{}, constants.MaxConcurrentRequests)
	results := make([]*models.QuestionData, len(uniqueLinks))
	startTime := utils.StartTime()
	bar := pb.StartNew(len(uniqueLinks))

	rateLimiter := utils.CreateRateLimiter(constants.RequestsPerSecond)
	defer rateLimiter.Stop()

	for i, link := range uniqueLinks {
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
