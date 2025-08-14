package utils

import (
	"bufio"
	"encoding/base64"
	"encoding/json"
	"examtopics-downloader/internal/models"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"sort"
	"strings"
	"time"
)

func writeFile(filename string, content any) {
	file := CreateFile(filename)
	defer file.Close()

	switch v := content.(type) {
	case string:
		fmt.Fprintln(file, v)
	case []string:
		for _, line := range v {
			fmt.Fprintln(file, line)
		}
	default:
		log.Printf("writeFile: unsupported content type %T", v)
	}
}

func WriteData(dataList []models.QuestionData, outputPath string, commentBool bool) {
	file := CreateFile(outputPath)
	defer file.Close()

	fmt.Fprintf(file, "# Exam Topics Questions\n\n")
	fmt.Fprintf(file, "@thatonecodes\n\n")

	for _, data := range dataList {
		if data.Title == "" {
			continue
		}

		fmt.Fprintf(file, "## %s\n\n", data.Title)
		fmt.Fprintf(file, "%s\n\n", data.Header)

		if data.Content != "" {
			fmt.Fprintf(file, "%s\n\n", data.Content)
		}

		for _, question := range data.Questions {
			fmt.Fprintf(file, "%s\n\n", question)
		}

		fmt.Fprintf(file, "**Answer: %s**\n\n", data.Answer)
		fmt.Fprintf(file, "**Timestamp: %s**\n\n", data.Timestamp)
		fmt.Fprintf(file, "[View on ExamTopics](%s)\n\n", data.QuestionLink)

		if commentBool {
			fmt.Fprintf(file, "Comments: %s\n", data.Comments)
		}

		fmt.Fprintf(file, "----------------------------------------\n\n")
	}
}

func SaveLinks(filename string, links []models.QuestionData) {
	var fullLinks []string
	for _, link := range links {
		fullLinks = append(fullLinks, link.QuestionLink)
	}
	writeFile(filename, fullLinks)
}

// ConvertQuestionDataToJSON converts QuestionData to QuestionDataJson format
func ConvertQuestionDataToJSON(data models.QuestionData, fromCache bool) models.QuestionDataJson {
	questionNumber := ExtractQuestionNumber(data.Title)
	topicNumber := ExtractTopicNumber(data.Title)

	if fromCache {
		multipleChoice := false
		if len(data.RawData.AnswerET) > 1 {
			multipleChoice = true
		}

		questionText := strings.TrimSpace(data.RawData.QuestionText)

		choices := data.RawData.Choices
		if data.RawData.Choices == nil {
			choices = ParseChoicesFromQuestionText(data.RawData.QuestionText)
			questionText = RemoveIMGPlaceholder(questionText)
		}

		return models.QuestionDataJson{
			TopicNumber:     topicNumber,
			QuestionNumber:  questionNumber,
			Title:           data.Title,
			Answers:         choices,
			SuggestedAnswer: data.RawData.AnswerET,
			Answer:          data.RawData.Answer,
			Link:            data.QuestionLink,
			MultipleChoice:  multipleChoice,
			QuestionText:    questionText,
			AnswerImages:    data.RawData.AnswerImages,
			QuestionImages:  data.RawData.QuestionImages,
		}
	}

	var choices map[string]string
	if data.RawData.Choices != nil && len(data.RawData.Choices) > 0 {
		choices = data.RawData.Choices
	} else {
		choices = ConvertQuestionsToMap(data.Questions)
	}
	data.RawData.Choices = choices

	return models.QuestionDataJson{
		TopicNumber:     topicNumber,
		QuestionNumber:  questionNumber,
		Title:           data.Title,
		Answers:         choices,
		SuggestedAnswer: data.Answer,
		Answer:          data.Answer,
		Link:            data.QuestionLink,
		MultipleChoice:  len(data.Answer) > 1,
		QuestionText:    strings.TrimSpace(data.Content),
		AnswerImages:    data.AnswerImages,
		QuestionImages:  data.QuestionImages,
	}
}

// WriteJSONData exports data to JSON format
func WriteJSONData(dataList []models.QuestionData, outputPath string, fromCache bool) {
	// Convert to JSON format
	var jsonData []models.QuestionDataJson

	sort.Slice(dataList, func(i, j int) bool {
		topicI := ExtractTopicNumber(dataList[i].Title)
		topicJ := ExtractTopicNumber(dataList[j].Title)

		if topicI != topicJ {
			return topicI < topicJ
		}

		questionNumberI := ExtractQuestionNumber(dataList[i].Title)
		questionNumberJ := ExtractQuestionNumber(dataList[j].Title)
		return questionNumberI < questionNumberJ
	})

	for _, data := range dataList {
		if data.Title == "" {
			continue
		}
		jsonData = append(jsonData, ConvertQuestionDataToJSON(data, fromCache))
	}

	// Create JSON file
	jsonBytes, err := json.MarshalIndent(jsonData, "", "  ")
	if err != nil {
		log.Printf("Error marshaling JSON: %v", err)
		return
	}

	file := CreateFile(outputPath)
	defer file.Close()

	_, err = file.Write(jsonBytes)
	if err != nil {
		log.Printf("Error writing JSON file: %v", err)
		return
	}
}

// CacheMetadata represents metadata about cached pages
type CacheMetadata struct {
	NumPages    int    `json:"num_pages"`
	LastUpdated string `json:"last_updated"`
	Provider    string `json:"provider"`
}

// SaveAllPagesWithMetadata saves all links from a provider to a cache file with metadata
func SaveAllPagesWithMetadata(filename string, links []string, numPages int, provider string) {
	file := CreateFile(filename)
	defer file.Close()

	// Write metadata as JSON comment at the top
	metadata := CacheMetadata{
		NumPages:    numPages,
		LastUpdated: time.Now().Format(time.RFC3339),
		Provider:    provider,
	}

	metadataJSON, err := json.Marshal(metadata)
	if err != nil {
		log.Printf("Failed to marshal metadata: %v", err)
	} else {
		fmt.Fprintf(file, "# METADATA: %s\n", string(metadataJSON))
	}

	// Write links
	for _, link := range links {
		fmt.Fprintln(file, link)
	}
}

// ReadCachedPagesWithMetadata reads cached pages from a file and returns metadata
func ReadCachedPagesWithMetadata(filename string) ([]string, *CacheMetadata) {
	file, err := os.Open(filename)
	if err != nil {
		return nil, nil
	}
	defer file.Close()

	var links []string
	var metadata *CacheMetadata

	scanner := bufio.NewScanner(file)
	firstLine := true

	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())

		// Parse metadata from first line if it exists
		if firstLine && strings.HasPrefix(line, "# METADATA: ") {
			metadataJSON := strings.TrimPrefix(line, "# METADATA: ")
			var meta CacheMetadata
			if err := json.Unmarshal([]byte(metadataJSON), &meta); err == nil {
				metadata = &meta
			}
			firstLine = false
			continue
		}

		firstLine = false

		if line != "" && !strings.HasPrefix(line, "#") {
			links = append(links, line)
		}
	}

	return links, metadata
}

// SaveAllPages saves all links from a provider to a cache file
func SaveAllPages(filename string, links []string) {
	file := CreateFile(filename)
	defer file.Close()

	for _, link := range links {
		fmt.Fprintln(file, link)
	}
}

// ReadCachedPages reads cached pages from a file
func ReadCachedPages(filename string) []string {
	file, err := os.Open(filename)
	if err != nil {
		return nil
	}
	defer file.Close()

	var links []string
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		link := strings.TrimSpace(scanner.Text())
		if link != "" {
			links = append(links, link)
		}
	}

	return links
}

// GitHubFileContent represents the content of a file from GitHub API
type GitHubFileContent struct {
	Content  string `json:"content"`
	Encoding string `json:"encoding"`
	SHA      string `json:"sha"`
}

// PushFileToGitHub pushes a file to GitHub repository
func PushFileToGitHub(filePath, fileName, token string) error {
	repoOwner := "finbertmds"
	repoName := "examtopics-data"
	branch := "main"

	// Read file content
	content, err := os.ReadFile(filePath)
	if err != nil {
		return fmt.Errorf("failed to read file %s: %v", filePath, err)
	}

	// Encode content to base64
	encodedContent := base64.StdEncoding.EncodeToString(content)

	// Create GitHub API URL
	apiURL := fmt.Sprintf("https://api.github.com/repos/%s/%s/contents/CachedPages/%s", repoOwner, repoName, fileName)

	// Create request body
	requestBody := map[string]interface{}{
		"message": fmt.Sprintf("Update cached pages for %s", strings.TrimSuffix(fileName, ".txt")),
		"content": encodedContent,
		"branch":  branch,
	}

	jsonBody, err := json.Marshal(requestBody)
	if err != nil {
		return fmt.Errorf("failed to marshal request body: %v", err)
	}

	// Create HTTP request
	req, err := http.NewRequest("PUT", apiURL, strings.NewReader(string(jsonBody)))
	if err != nil {
		return fmt.Errorf("failed to create request: %v", err)
	}

	// Set headers
	req.Header.Set("Authorization", "token "+token)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/vnd.github.v3+json")

	// Make request
	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to make request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("GitHub API returned status %d: %s", resp.StatusCode, string(body))
	}

	log.Printf("Successfully pushed %s to GitHub", fileName)
	return nil
}

// FetchCachedPagesFromGitHub fetches cached pages from GitHub
func FetchCachedPagesFromGitHub(providerName, token string) ([]string, *CacheMetadata) {
	repoOwner := "finbertmds"
	repoName := "examtopics-data"
	branch := "main"
	fileName := fmt.Sprintf("cached_pages_%s.txt", providerName)

	// Create GitHub API URL
	apiURL := fmt.Sprintf("https://api.github.com/repos/%s/%s/contents/CachedPages/%s?ref=%s",
		repoOwner, repoName, fileName, branch)

	// Create HTTP request
	req, err := http.NewRequest("GET", apiURL, nil)
	if err != nil {
		log.Printf("Failed to create request: %v", err)
		return nil, nil
	}

	// Set headers
	if token != "" {
		req.Header.Set("Authorization", "token "+token)
	}
	req.Header.Set("Accept", "application/vnd.github.v3+json")

	// Make request
	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("Failed to make request: %v", err)
		return nil, nil
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		log.Printf("GitHub API returned status %d for %s", resp.StatusCode, fileName)
		return nil, nil
	}

	// Parse response
	var fileContent GitHubFileContent
	if err := json.NewDecoder(resp.Body).Decode(&fileContent); err != nil {
		log.Printf("Failed to decode response: %v", err)
		return nil, nil
	}

	// Decode content
	if fileContent.Encoding != "base64" {
		log.Printf("Unexpected encoding: %s", fileContent.Encoding)
		return nil, nil
	}

	decodedContent, err := base64.StdEncoding.DecodeString(fileContent.Content)
	if err != nil {
		log.Printf("Failed to decode content: %v", err)
		return nil, nil
	}

	// Parse content into lines and extract metadata
	var links []string
	var metadata *CacheMetadata

	scanner := bufio.NewScanner(strings.NewReader(string(decodedContent)))
	firstLine := true

	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())

		// Parse metadata from first line if it exists
		if firstLine && strings.HasPrefix(line, "# METADATA: ") {
			metadataJSON := strings.TrimPrefix(line, "# METADATA: ")
			var meta CacheMetadata
			if err := json.Unmarshal([]byte(metadataJSON), &meta); err == nil {
				metadata = &meta
			}
			firstLine = false
			continue
		}

		firstLine = false

		if line != "" && !strings.HasPrefix(line, "#") {
			links = append(links, line)
		}
	}

	log.Printf("Successfully fetched %d cached pages from GitHub for provider %s", len(links), providerName)
	return links, metadata
}
