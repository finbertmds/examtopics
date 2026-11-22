output "monitor_role_arn" {
  description = "OIDC role for the account and budget gate."
  value       = aws_iam_role.pipeline["monitor"].arn
}
output "plan_role_arn" {
  description = "OIDC role for staging refresh, plan and the native state lock."
  value       = aws_iam_role.pipeline["plan"].arn
}
output "apply_role_arn" {
  description = "OIDC role for applying the accepted staging plan."
  value       = aws_iam_role.pipeline["apply"].arn
}
output "deploy_role_arn" {
  description = "OIDC role for a staging release."
  value       = aws_iam_role.pipeline["deploy"].arn
}
output "runtime_permissions_boundary_arn" {
  description = "The boundary to attach to the runtime role during baseline preparation."
  value       = aws_iam_policy.runtime_boundary.arn
}
output "state_bucket" {
  description = "S3 backend bucket for the staging workload root only."
  value       = aws_s3_bucket.control["state"].bucket
}
output "state_key" {
  description = "Native S3 backend state key."
  value       = local.state_key
}
output "release_bucket" {
  description = "Private baseline, release archives and healthy pointer bucket."
  value       = aws_s3_bucket.control["release"].bucket
}
output "deploy_document_name" {
  description = "Name of the operator-managed command document."
  value       = aws_ssm_document.deploy.name
}
output "deploy_document_version" {
  description = "Numeric version to approve in baseline config and send explicitly."
  value       = aws_ssm_document.deploy.document_version
}
