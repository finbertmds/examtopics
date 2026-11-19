package main

import (
	"flag"
	"testing"
)

func TestCacheRequiresExplicitOptIn(t *testing.T) {
	for _, tc := range []struct {
		name string
		args []string
		want bool
	}{
		{"default skips cache", nil, false},
		{"explicit cache", []string{"-use-cache"}, true},
		{"explicit false skips cache", []string{"-use-cache=false"}, false},
		{"legacy no-cache", []string{"-no-cache"}, false},
		{"no-cache overrides opt-in", []string{"-use-cache", "-no-cache"}, false},
		{"override is independent of order", []string{"-no-cache", "-use-cache"}, false},
		{"legacy false does not opt in", []string{"-no-cache=false"}, false},
	} {
		t.Run(tc.name, func(t *testing.T) {
			flags := flag.NewFlagSet(tc.name, flag.ContinueOnError)
			options := registerCacheFlags(flags)
			if err := flags.Parse(tc.args); err != nil {
				t.Fatal(err)
			}
			if got := options.enabled(); got != tc.want {
				t.Fatalf("cache enabled = %v, want %v", got, tc.want)
			}
		})
	}
}
