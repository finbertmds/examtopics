mock_provider "aws" {}

variables {
  staging_account_id       = "123456789012"
  staging_domain           = "staging.example.com"
  api_ami_id               = "ami-0123456789abcdef0"
  frontend_certificate_arn = "arn:aws:acm:us-east-1:123456789012:certificate/11111111-2222-3333-4444-555555555555"
}

run "staging_defaults" {
  command = plan

  assert {
    condition = alltrue([
      aws_s3_bucket_public_access_block.frontend.block_public_acls,
      aws_s3_bucket_public_access_block.frontend.block_public_policy,
      aws_s3_bucket_public_access_block.frontend.ignore_public_acls,
      aws_s3_bucket_public_access_block.frontend.restrict_public_buckets,
      aws_cloudfront_origin_access_control.frontend.signing_behavior == "always"
    ])
    error_message = "The frontend must use a private S3 origin with signed CloudFront requests."
  }

  assert {
    condition = (
      aws_instance.api.metadata_options[0].http_tokens == "required" &&
      aws_instance.api.metadata_options[0].http_put_response_hop_limit == 1 &&
      aws_instance.api.root_block_device[0].encrypted &&
      aws_instance.api.credit_specification[0].cpu_credits == "standard"
    )
    error_message = "The API must enforce IMDSv2, encrypted EBS and standard burst CPU credits."
  }

  assert {
    condition = (
      output.frontend_url == "https://app.staging.example.com" &&
      output.api_url == "https://api.staging.example.com" &&
      toset(keys(aws_vpc_security_group_ingress_rule.api_web)) == toset(["80", "443"]) &&
      length(aws_budgets_budget.staging) == 0
    )
    error_message = "Staging must use the configured staging hosts, expose web ports only and leave budget creation opt-in."
  }
}

run "budget_with_alerts" {
  command = plan

  variables {
    budget_alert_email = "staging-alerts@example.com"
  }

  assert {
    condition = (
      aws_budgets_budget.staging[0].limit_amount == "20" &&
      !aws_budgets_budget.staging[0].cost_types[0].include_credit &&
      length(aws_budgets_budget.staging[0].notification) == 5
    )
    error_message = "The $20 monthly budget must exclude credits and configure five alerts."
  }
}

run "reject_cross_account_certificate" {
  command = plan

  variables {
    frontend_certificate_arn = "arn:aws:acm:us-east-1:999999999999:certificate/11111111-2222-3333-4444-555555555555"
  }

  expect_failures = [var.frontend_certificate_arn]
}
