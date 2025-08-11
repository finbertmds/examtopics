package utils

import (
	"encoding/json"
	"examtopics-downloader/internal/models"
	"fmt"
	"log"
	"sort"
	"strings"
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
