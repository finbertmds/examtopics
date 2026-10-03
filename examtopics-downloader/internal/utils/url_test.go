package utils

import "testing"

func TestAddToBaseUrl(t *testing.T) {
	tests := []struct {
		name  string
		input string
		want  string
	}{
		{
			name:  "absolute URL",
			input: "https://www.examtopics.com/discussions/python-institute/view/123/",
			want:  "https://www.examtopics.com/discussions/python-institute/view/123/",
		},
		{
			name:  "root-relative URL",
			input: "/discussions/python-institute/view/123/",
			want:  "https://www.examtopics.com/discussions/python-institute/view/123/",
		},
		{
			name:  "protocol-relative URL",
			input: "//cdn.examtopics.com/image.png",
			want:  "https://cdn.examtopics.com/image.png",
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			if got := AddToBaseUrl(test.input); got != test.want {
				t.Errorf("AddToBaseUrl(%q) = %q, want %q", test.input, got, test.want)
			}
		})
	}
}
