package utils

import (
	"encoding/json"
	"os"
	"path/filepath"
	"reflect"
	"testing"

	"examtopics-downloader/internal/models"
)

func TestWriteJSONDataExportsImageArrays(t *testing.T) {
	for _, fromCache := range []bool{false, true} {
		for _, tc := range []struct {
			name   string
			images []string
			want   string
		}{
			{"missing", nil, `[]`},
			{"empty", []string{}, `[]`},
			{"populated", []string{"https://example.com/image.png"}, `["https://example.com/image.png"]`},
		} {
			mode := "scraped/"
			if fromCache {
				mode = "cached/"
			}
			t.Run(mode+tc.name, func(t *testing.T) {
				data := models.QuestionData{Title: "Exam test topic 1 question 1 discussion"}
				if fromCache {
					data.RawData.AnswerImages = tc.images
					data.RawData.QuestionImages = tc.images
				} else {
					data.AnswerImages = tc.images
					data.QuestionImages = tc.images
				}
				path := filepath.Join(t.TempDir(), "output.json")
				WriteJSONData([]models.QuestionData{data}, path, fromCache)
				content, err := os.ReadFile(path)
				if err != nil {
					t.Fatal(err)
				}
				var rows []map[string]json.RawMessage
				if err := json.Unmarshal(content, &rows); err != nil {
					t.Fatal(err)
				}
				if len(rows) != 1 {
					t.Fatalf("got %d rows, want 1", len(rows))
				}
				for _, field := range []string{"answer_images", "question_images"} {
					var got, want any
					if err := json.Unmarshal(rows[0][field], &got); err != nil {
						t.Fatal(err)
					}
					if err := json.Unmarshal([]byte(tc.want), &want); err != nil {
						t.Fatal(err)
					}
					if !reflect.DeepEqual(got, want) {
						t.Errorf("%s = %s, want %s", field, rows[0][field], tc.want)
					}
				}
			})
		}
	}
}
