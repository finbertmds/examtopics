variable "api_ami_id" {
  description = "Reviewed x86_64 standard Amazon Linux 2023 AMI ID in ap-southeast-2 with SSM Agent installed."
  type        = string

  validation {
    condition     = can(regex("^ami-[0-9a-f]{17}$", var.api_ami_id))
    error_message = "Use a reviewed ap-southeast-2 AMI ID."
  }
}

variable "budget_alert_email" {
  description = "AWS Budgets notification address. Null leaves budget creation outside this plan."
  type        = string
  default     = null

  validation {
    condition     = var.budget_alert_email == null || can(regex("^[^@ ]+@[^@ ]+[.][^@ ]+$", var.budget_alert_email))
    error_message = "Supply a notification email address or leave it null."
  }
}

variable "frontend_certificate_arn" {
  description = "ARN of the issued us-east-1 ACM public certificate covering the staging_domain frontend hostname in the staging account."
  type        = string

  validation {
    condition     = can(regex("^arn:aws:acm:us-east-1:${var.staging_account_id}:certificate/[0-9a-f-]+$", var.frontend_certificate_arn))
    error_message = "Use an ACM certificate in us-east-1 owned by the approved staging account."
  }
}

variable "staging_account_id" {
  description = "The separately verified 12-digit AWS account ID dedicated to staging."
  type        = string

  validation {
    condition     = can(regex("^[0-9]{12}$", var.staging_account_id))
    error_message = "Supply the 12-digit staging AWS account ID."
  }
}

variable "staging_domain" {
  description = "Full staging frontend hostname, such as staging.examtopics.finbert.ngo, controlled outside this root. The API inserts the api label after the staging label."
  type        = string

  validation {
    condition     = can(regex("^staging([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?){2,}$", var.staging_domain))
    error_message = "Use a lowercase frontend hostname starting with staging., such as staging.examtopics.finbert.ngo."
  }
}
