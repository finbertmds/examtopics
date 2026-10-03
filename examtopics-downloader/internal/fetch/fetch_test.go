package fetch

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

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
