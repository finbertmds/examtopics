package models

type QuestionLinkWithNumber struct {
	URL            string
	QuestionNumber int
}

type QuestionData struct {
	Title          string
	Header         string
	Content        string
	Questions      []string
	Answer         string
	Timestamp      string
	QuestionLink   string
	Comments       string
	QuestionImages []string
	AnswerImages   []string
	RawData        QuestionJSON
}

type QuestionDataJson struct {
	TopicNumber     int               `json:"topic_number"`
	QuestionNumber  int               `json:"question_number"`
	Title           string            `json:"title"`
	Answers         map[string]string `json:"answers"`
	SuggestedAnswer string            `json:"suggested_answer"`
	Answer          string            `json:"answer"`
	Link            string            `json:"link"`
	MultipleChoice  bool              `json:"multiple_choice"`
	QuestionText    string            `json:"question_text"`
	AnswerImages    []string          `json:"answer_images"`
	QuestionImages  []string          `json:"question_images"`
}

type FileInfo struct {
	URL    string
	Name   string
	Number int
}

type TreeResp struct {
	Tree []struct {
		Path string `json:"path"`
		Type string `json:"type"`
		Sha  string `json:"sha"`
		URL  string `json:"url"`
	} `json:"tree"`
}

type QuestionJSON struct {
	Choices           map[string]string `json:"choices"`
	ID                string            `json:"id"`
	ExamID            int               `json:"exam_id"`
	QuestionText      string            `json:"question_text"`
	Answer            string            `json:"answer"`
	AnswerET          string            `json:"answer_ET"`
	Topic             string            `json:"topic"`
	IsMC              bool              `json:"isMC"`
	AnswerDescription string            `json:"answer_description"`
	Discussion        []struct {
		Content     string `json:"content"`
		UpvoteCount string `json:"upvote_count"`
		Poster      string `json:"poster"`
		Timestamp   string `json:"timestamp"`
	} `json:"discussion"`
	AnswerImages   []string `json:"answer_images"`
	QuestionImages []string `json:"question_images"`
	URL            string   `json:"url"`
	Timestamp      string   `json:"timestamp"`
}

type JSONResponse struct {
	PageProps struct {
		Questions []QuestionJSON `json:"questions"`
	} `json:"pageProps"`
}
