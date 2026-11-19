package utils

import (
	"bytes"
	"log"
	"strings"
	"sync"
	"testing"
)

func captureProgressLog(t *testing.T) *bytes.Buffer {
	t.Helper()
	var output bytes.Buffer
	previous := log.Writer()
	log.SetOutput(&output)
	t.Cleanup(func() { log.SetOutput(previous) })
	return &output
}

// Regression: terminal redraws must not concatenate progress and retry logs in Docker.
func TestProgressUsesSeparateLines(t *testing.T) {
	output := captureProgressLog(t)
	progress := NewProgress(609, "Pages")
	for i := 0; i < 609; i++ {
		if i == 10 {
			log.Print("Retry attempt 1")
		}
		progress.Increment()
	}
	text := output.String()
	if strings.ContainsAny(text, "\r\x1b") || !strings.HasSuffix(text, "\n") {
		t.Fatalf("progress must use newline-terminated records without terminal controls: %q", text)
	}
	lines := strings.Split(strings.TrimSuffix(text, "\n"), "\n")
	if len(lines) > 22 {
		t.Fatalf("progress flooded logs: got %d lines for 609 pages", len(lines))
	}
	for _, line := range lines {
		if strings.Count(line, "Pages:")+strings.Count(line, "Retry attempt") != 1 {
			t.Fatalf("records were joined or split: %q", line)
		}
	}
	if !strings.Contains(lines[0], "Pages: 0/609 (0.0%)") ||
		!strings.Contains(lines[len(lines)-1], "Pages: 609/609 (100.0%)") {
		t.Fatalf("missing initial or final progress: %q", text)
	}
}

func TestProgressCountsConcurrentCompletions(t *testing.T) {
	output := captureProgressLog(t)
	progress := NewProgress(100, "Questions")
	var wg sync.WaitGroup
	for i := 0; i < 100; i++ {
		wg.Go(func() { progress.Increment() })
	}
	wg.Wait()
	if strings.Count(output.String(), "Questions: 100/100 (100.0%)") != 1 {
		t.Fatalf("expected exactly one completion record: %q", output.String())
	}
}

func TestProgressHandlesEmptyWork(t *testing.T) {
	output := captureProgressLog(t)
	NewProgress(0, "Questions")
	if !strings.Contains(output.String(), "Questions: 0/0 (100.0%)\n") {
		t.Fatalf("empty work should be complete: %q", output.String())
	}
}
