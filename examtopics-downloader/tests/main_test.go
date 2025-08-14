package tests

import (
	"encoding/json"
	"fmt"
	"os"
	"strings"
	"testing"

	"examtopics-downloader/internal/fetch"
	"examtopics-downloader/internal/utils"
)

func TestGetAllPages(t *testing.T) {
	links := fetch.GetAllPages("lpi", "010-160", false, false, false, "")
	if len(links) == 0 {
		t.Fatalf("Expected non-empty links, but got empty")
	}
	fmt.Printf("Data len of %d for provider 'lpi'\n", len(links))
}

func TestValidateExamsOutput(t *testing.T) {
	links := fetch.GetAllPages("lpi", "010-160", false, false, false, "")
	if len(links) == 0 {
		t.Fatalf("Expected non-empty links, but got empty")
	}
	outputPath := "test.txt"

	utils.SaveLinks(outputPath, links)

	data, err := os.ReadFile(outputPath)
	if err != nil {
		t.Fatalf("Expected file at %s but got error: %v", outputPath, err)
	}

	content := string(data)
	expectedContent := "https://www.examtopics.com/discussions/lpi/view"
	if !strings.Contains(content, expectedContent) {
		t.Errorf("Expected file content to contain %q but got:\n%s", expectedContent, content)
	}

	err = os.Remove(outputPath)
	if err != nil {
		t.Fatalf("Error when removing file! %v", err)
	}
}

func TestExamProvider(t *testing.T) {
	data := fetch.GetProviderExams("google")
	if len(data) == 0 {
		t.Fatalf("Expected non-empty data for provider 'google', but got: %v", data)
	}

	t.Logf("Got %d exams for provider 'google'", len(data))
}

func TestWriteData(t *testing.T) {
	links := fetch.GetAllPages("lpi", "010-160", false, false, false, "")
	if len(links) == 0 {
		t.Fatalf("Expected non-empty links, but got empty")
	}
	outputPath := "write_test.md"
	utils.WriteData(links, outputPath, true)

	data, err := os.ReadFile(outputPath)
	if err != nil {
		t.Fatalf("Expected file at %s but got error: %v", outputPath, err)
	}

	content := string(data)
	if !strings.Contains(content, "Comments:") {
		t.Errorf("Expected file content to contain 'Comments:' but got:\n%s", content)
	}

	err = os.Remove(outputPath)
	if err != nil {
		t.Fatalf("Error when removing file! %v", err)
	}
}

func TestCachingFunctionality(t *testing.T) {
	// Test saving all pages
	cacheFileName := "cached_pages_test.txt"
	testLinks := []string{
		"/discussions/test/view/12345",
		"/discussions/test/view/67890",
		"/discussions/test/view/11111",
	}

	// Save test links with metadata
	utils.SaveAllPagesWithMetadata(cacheFileName, testLinks, 10, "test")

	// Read back the cached links with metadata
	cachedLinks, metadata := utils.ReadCachedPagesWithMetadata(cacheFileName)
	if len(cachedLinks) != len(testLinks) {
		t.Fatalf("Expected %d cached links, but got %d", len(testLinks), len(cachedLinks))
	}

	// Verify metadata
	if metadata == nil {
		t.Fatalf("Expected metadata, but got nil")
	}
	if metadata.NumPages != 10 {
		t.Errorf("Expected 10 pages, but got %d", metadata.NumPages)
	}
	if metadata.Provider != "test" {
		t.Errorf("Expected provider 'test', but got %s", metadata.Provider)
	}

	// Verify content
	for i, link := range cachedLinks {
		if link != testLinks[i] {
			t.Errorf("Expected link %s, but got %s", testLinks[i], link)
		}
	}

	// Clean up
	err := os.Remove(cacheFileName)
	if err != nil {
		t.Fatalf("Error when removing cache file! %v", err)
	}
}

func TestGitHubFunctionality(t *testing.T) {
	// Test GitHub file content structure
	fileContent := utils.GitHubFileContent{
		Content:  "L2Rpc2N1c3Npb25zL3Rlc3Qvdmlldy8xMjM0NQo=", // base64 encoded "/discussions/test/view/12345"
		Encoding: "base64",
		SHA:      "test-sha",
	}

	if fileContent.Encoding != "base64" {
		t.Errorf("Expected encoding 'base64', but got %s", fileContent.Encoding)
	}

	// Test that the structure can be marshaled/unmarshaled
	jsonData, err := json.Marshal(fileContent)
	if err != nil {
		t.Fatalf("Failed to marshal GitHubFileContent: %v", err)
	}

	var unmarshaled utils.GitHubFileContent
	err = json.Unmarshal(jsonData, &unmarshaled)
	if err != nil {
		t.Fatalf("Failed to unmarshal GitHubFileContent: %v", err)
	}

	if unmarshaled.Content != fileContent.Content {
		t.Errorf("Expected content %s, but got %s", fileContent.Content, unmarshaled.Content)
	}
}
