package utils

import (
	"log"
	"sync"
)

// Progress writes complete log records, including when stdout has no terminal
// (for example, docker run without -t). Updates share the retry logger's writer
// and lock so concurrent messages cannot interrupt a progress record.
type Progress struct {
	mu        sync.Mutex
	label     string
	total     int
	completed int
	bucket    int
}

func NewProgress(total int, label string) *Progress {
	p := &Progress{label: label, total: total}
	p.report()
	return p
}

func (p *Progress) Increment() {
	p.mu.Lock()
	defer p.mu.Unlock()
	if p.completed >= p.total {
		return
	}
	p.completed++
	// At most 20 updates after the initial record, roughly every 5%.
	bucket := p.completed * 20 / p.total
	if bucket > p.bucket {
		p.bucket = bucket
		p.report()
	}
}

func (p *Progress) report() {
	percent := 100.0
	if p.total > 0 {
		percent = float64(p.completed) * 100 / float64(p.total)
	}
	log.Printf("%s: %d/%d (%.1f%%)", p.label, p.completed, p.total, percent)
}
