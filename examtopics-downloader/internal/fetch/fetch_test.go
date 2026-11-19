package fetch

import (
	"bytes"
	"compress/gzip"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

type fixtureTransport func(*http.Request) (*http.Response, error)

func (f fixtureTransport) RoundTrip(req *http.Request) (*http.Response, error) { return f(req) }

func TestFetchURLRejectsOversizedResponse(t *testing.T) {
	attempts := 0
	client := http.Client{Transport: fixtureTransport(func(req *http.Request) (*http.Response, error) {
		attempts++
		return &http.Response{
			StatusCode: http.StatusOK,
			Body:       io.NopCloser(strings.NewReader(strings.Repeat("a", 16*1024*1024+1))),
			Header:     make(http.Header),
		}, nil
	})}
	if body := FetchURL("https://fixture.invalid/data.json", client); body != nil {
		t.Fatal("oversized response must be rejected")
	}
	if attempts != 1 {
		t.Fatalf("oversized response retried %d times", attempts)
	}
}

func TestParseHTMLBoundsDecodedBody(t *testing.T) {
	for _, size := range []int{4 * 1024 * 1024, 4*1024*1024 + 1} {
		var compressed bytes.Buffer
		writer := gzip.NewWriter(&compressed)
		_, _ = writer.Write([]byte(strings.Repeat("a", size)))
		_ = writer.Close()
		reader, err := gzip.NewReader(bytes.NewReader(compressed.Bytes()))
		if err != nil {
			t.Fatal(err)
		}
		// net/http transparently decompresses gzip before exposing Body.
		client := http.Client{Transport: fixtureTransport(func(req *http.Request) (*http.Response, error) {
			return &http.Response{StatusCode: http.StatusOK, Body: reader, Header: make(http.Header), Uncompressed: true}, nil
		})}
		doc, err := ParseHTML("https://fixture.invalid/page", client)
		if size == 4*1024*1024 && (err != nil || doc == nil) {
			t.Fatal("body at limit was rejected")
		}
		if size > 4*1024*1024 && (err == nil || doc != nil) {
			t.Fatal("oversized decoded HTML reached parser")
		}
	}
}

func TestFetchURLRetriesTooManyRequests(t *testing.T) {
	attempts := 0
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		attempts++
		if attempts == 1 {
			w.Header().Set("Retry-After", "0")
			w.WriteHeader(http.StatusTooManyRequests)
			return
		}
		_, _ = w.Write([]byte("ok"))
	}))
	defer server.Close()

	body := FetchURL(server.URL, *server.Client())
	if string(body) != "ok" {
		t.Fatalf("FetchURL() = %q, want %q", body, "ok")
	}
	if attempts != 2 {
		t.Fatalf("request attempts = %d, want 2", attempts)
	}
}

func TestFetchURLDoesNotRetryNotFound(t *testing.T) {
	attempts := 0
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		attempts++
		http.NotFound(w, r)
	}))
	defer server.Close()

	body := FetchURL(server.URL, *server.Client())
	if body != nil {
		t.Fatalf("FetchURL() = %q, want nil", body)
	}
	if attempts != 1 {
		t.Fatalf("request attempts = %d, want 1", attempts)
	}
}
