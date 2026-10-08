package constants

import "time"

const HttpTimeout = 20 * time.Second
const MaxConcurrentRequests = 15
const RequestsPerSecond = 2.0
const MaxRetries = 20
const InitalBackoff = 5 * time.Second
const BackoffFactor = 2.0
