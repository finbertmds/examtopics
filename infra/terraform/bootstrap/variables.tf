variable "staging_account_id" {
  type        = string
  description = "Verified ID of the dedicated staging account."
  validation {
    condition     = var.staging_account_id == "450114866570"
    error_message = "Use the approved staging account."
  }
}

variable "github_subject" {
  type        = string
  description = "Verified customized sub including environment and protected controller job_workflow_ref (optionally its SHA)."
  validation {
    condition = can(regex(
      "^repo:finbertmds(@[0-9]+)?/examtopics(@[0-9]+)?:environment:aws-staging:job_workflow_ref:finbertmds/examtopics/[.]github/workflows/staging-release[.]yml@refs/tags/aws-staging-controller-v1(:job_workflow_sha:[0-9a-f]{40})?$",
      var.github_subject
    ))
    error_message = "Use the verified customized environment subject bound to the protected staging controller tag."
  }
}

variable "github_repository_id" {
  type        = string
  description = "Verified immutable GitHub ID of FinbertMDS/examtopics."
  validation {
    condition     = var.github_repository_id == "1035462381"
    error_message = "Use the approved FinbertMDS/examtopics repository ID."
  }
}

variable "github_repository_owner_id" {
  type        = string
  description = "Verified immutable GitHub ID of the repository owner."
  validation {
    condition     = can(regex("^[1-9][0-9]*$", var.github_repository_owner_id))
    error_message = "Supply the numeric GitHub owner ID."
  }
}

variable "existing_github_oidc_provider_arn" {
  type        = string
  default     = null
  description = "Existing account-wide GitHub issuer ARN, if present. Verify its client IDs before bootstrap."
  validation {
    condition     = var.existing_github_oidc_provider_arn == null || var.existing_github_oidc_provider_arn == "arn:aws:iam::${var.staging_account_id}:oidc-provider/token.actions.githubusercontent.com"
    error_message = "Supply the GitHub issuer ARN in the verified account."
  }
}

variable "secret_arn" {
  type        = string
  description = "Exact ARN (including generated suffix) of the existing staging environment secret. Identifier only."
  validation {
    condition     = can(regex("^arn:aws:secretsmanager:ap-southeast-2:${var.staging_account_id}:secret:/examtopics/staging/api-environment-[A-Za-z0-9]{6}$", var.secret_arn))
    error_message = "Supply the existing Sydney staging secret ARN."
  }
}

variable "instance_id" {
  type        = string
  description = "Approved staging API instance ID."
  validation {
    condition     = can(regex("^i-[0-9a-f]{17}$", var.instance_id))
    error_message = "Supply the existing staging EC2 instance ID."
  }
}

variable "distribution_id" {
  type        = string
  description = "ID of the existing staging frontend distribution."
  validation {
    condition     = can(regex("^[A-Z0-9]{8,32}$", var.distribution_id))
    error_message = "Supply a CloudFront distribution ID."
  }
}

variable "origin_access_control_id" {
  type        = string
  description = "ID of the existing staging CloudFront origin access control."
  validation {
    condition     = can(regex("^[A-Z0-9]{8,32}$", var.origin_access_control_id))
    error_message = "Supply a CloudFront origin access control ID."
  }
}

variable "headers_policy_id" {
  type        = string
  description = "ID of the existing staging CloudFront response headers policy."
  validation {
    condition     = can(regex("^[a-f0-9]{8}(-[a-f0-9]{4}){3}-[a-f0-9]{12}$", var.headers_policy_id))
    error_message = "Supply a CloudFront response headers policy UUID."
  }
}

variable "deploy_helper_sha256" {
  type        = string
  description = "Reviewed SHA-256 of the root-owned helper installed by the staging operator."
  validation {
    condition     = can(regex("^[0-9a-f]{64}$", var.deploy_helper_sha256))
    error_message = "Supply the reviewed SHA-256 as lowercase hexadecimal."
  }
}
