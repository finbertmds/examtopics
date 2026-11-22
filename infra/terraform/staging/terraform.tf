terraform {
  required_version = ">= 1.14.0, < 2.0.0"

  # The operator migrates the approved local state before enabling CI.
  backend "s3" {
    key          = "staging/terraform.tfstate"
    region       = "ap-southeast-2"
    encrypt      = true
    use_lockfile = true
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}
