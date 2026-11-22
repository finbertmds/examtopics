provider "aws" {
  region              = "ap-southeast-2"
  allowed_account_ids = [var.staging_account_id]

  default_tags {
    tags = {
      Environment = "staging"
      ManagedBy   = "Terraform"
      Project     = "ExamTopics"
    }
  }
}
