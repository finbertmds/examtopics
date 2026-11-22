locals {
  name               = "examtopics-staging"
  region             = "ap-southeast-2"
  account            = var.staging_account_id
  state_key          = "staging/terraform.tfstate"
  document_name      = "ExamTopicsStagingDeploy"
  bucket_names       = { state = "${local.name}-tfstate-${local.account}", release = "${local.name}-releases-${local.account}" }
  state_bucket_arn   = "arn:aws:s3:::${local.bucket_names.state}"
  release_bucket_arn = "arn:aws:s3:::${local.bucket_names.release}"
  frontend_arn       = "arn:aws:s3:::${local.name}-web-${local.account}"
  state_object_arn   = "${local.state_bucket_arn}/${local.state_key}"
  repository_arn     = "arn:aws:ecr:${local.region}:${local.account}:repository/${local.name}"
  instance_arn       = "arn:aws:ec2:${local.region}:${local.account}:instance/${var.instance_id}"
  document_arn       = "arn:aws:ssm:${local.region}:${local.account}:document/${local.document_name}"
  runtime_role_arn   = "arn:aws:iam::${local.account}:role/${local.name}-api"
  cloudfront_arn     = "arn:aws:cloudfront::${local.account}"
  function_arn       = "${local.cloudfront_arn}:function/${local.name}-frontend-route"
  headers_arn        = "${local.cloudfront_arn}:response-headers-policy/${var.headers_policy_id}"
  release_lease_key  = "releases/in-progress.json"
  release_lease_arn  = "${local.release_bucket_arn}/${local.release_lease_key}"
  baseline_read = {
    Sid      = "ReadApprovedBaseline"
    Effect   = "Allow"
    Action   = ["s3:GetObject"]
    Resource = [for key in ["baseline/config.json", "baseline/inventory.json"] : "${local.release_bucket_arn}/${key}"]
  }
  lease_list = {
    Sid       = "CheckReleaseLease"
    Effect    = "Allow"
    Action    = ["s3:ListBucket"]
    Resource  = [local.release_bucket_arn]
    Condition = { StringEquals = { "s3:prefix" = local.release_lease_key } }
  }
}
