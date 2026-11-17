output "api_instance_id" {
  description = "Staging EC2 instance to administer through Session Manager."
  value       = aws_instance.api.id
}

output "api_public_ipv4" {
  description = "Stable IPv4 for the staging API A record and Atlas staging allowlist."
  value       = aws_eip.api.public_ip
}

output "api_url" {
  description = "Staging API HTTPS origin after DNS and application setup."
  value       = "https://${local.api_host}"
}

output "frontend_bucket" {
  description = "Private S3 bucket for published staging frontend assets."
  value       = aws_s3_bucket.frontend.id
}

output "frontend_distribution_domain" {
  description = "CloudFront DNS target for the staging frontend CNAME."
  value       = aws_cloudfront_distribution.frontend.domain_name
}

output "frontend_distribution_id" {
  description = "CloudFront distribution that serves the staging frontend."
  value       = aws_cloudfront_distribution.frontend.id
}

output "frontend_url" {
  description = "Staging frontend HTTPS origin after DNS and asset publication."
  value       = "https://${local.frontend_host}"
}

output "release_repository_url" {
  description = "Private staging ECR repository for immutable API and proxy image releases."
  value       = aws_ecr_repository.api.repository_url
}

output "api_environment_secret_arn" {
  description = "Secrets Manager ARN for the API env-file; this output contains only the identifier."
  value       = aws_secretsmanager_secret.api_environment.arn
}
