mock_provider "aws" {}

variables {
  staging_account_id       = "123456789012"
  staging_domain           = "staging.example.com"
  api_ami_id               = "ami-0123456789abcdef0"
  frontend_certificate_arn = "arn:aws:acm:us-east-1:123456789012:certificate/11111111-2222-3333-4444-555555555555"
}

run "staging_defaults" {
  command = plan

  # The policy id is computed, so it is unknown in a mocked plan. A fixed mock
  # id lets the cache behaviours' linkage be asserted at plan time.
  override_resource {
    target          = aws_cloudfront_response_headers_policy.frontend
    override_during = plan
    values = {
      id = "mock-frontend-headers-policy"
    }
  }

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

  assert {
    condition = (
      length([
        for item in aws_cloudfront_response_headers_policy.frontend.custom_headers_config[0].items : item
        if item.header == "Content-Security-Policy-Report-Only" &&
        item.override &&
        strcontains(item.value, "default-src 'self'") &&
        strcontains(item.value, "connect-src 'self' https://api.staging.example.com")
      ]) == 1 &&
      aws_cloudfront_response_headers_policy.frontend.security_headers_config[0].frame_options[0].frame_option == "DENY" &&
      !aws_cloudfront_response_headers_policy.frontend.security_headers_config[0].strict_transport_security[0].include_subdomains
    )
    error_message = "The frontend headers policy must send a Report-Only CSP that allows the staging API, deny framing and keep HSTS off subdomains."
  }

  assert {
    condition = alltrue([
      for policy_id in [
        aws_cloudfront_distribution.frontend.default_cache_behavior[0].response_headers_policy_id,
        aws_cloudfront_distribution.frontend.ordered_cache_behavior[0].response_headers_policy_id,
      ] : policy_id == aws_cloudfront_response_headers_policy.frontend.id && policy_id != "67f7725c-6f97-4210-82d7-5512b31e9d03"
    ])
    error_message = "Both frontend cache behaviours must use the custom response headers policy, not the managed one."
  }

  assert {
    condition = (
      aws_ecr_repository.api.image_tag_mutability == "IMMUTABLE" &&
      aws_ecr_repository.api.image_scanning_configuration[0].scan_on_push
    )
    error_message = "The release repository must keep immutable tags and scan images on push."
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
