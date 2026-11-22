locals {
  healthy_pointer_arn = "${local.release_bucket_arn}/releases/last-known-healthy.json"
  # In an IAM Resource, each question mark matches exactly one character.
  release_artifact_arns = [
    for file in ["manifest.json", "frontend.tar.gz"] :
    "${local.release_bucket_arn}/releases/????????????????????????????????????????/${file}"
  ]
}

resource "aws_iam_role_policy" "deploy" {
  name = "publish-staging-release"
  role = aws_iam_role.pipeline["deploy"].id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      local.baseline_read,
      local.lease_list,
      {
        Sid       = "MeasureRetainedReleaseVersions"
        Effect    = "Allow"
        Action    = ["s3:ListBucketVersions"]
        Resource  = [local.release_bucket_arn]
        Condition = { StringEquals = { "s3:prefix" = "releases/" } }
      },
      {
        Sid      = "MeasureRetainedFrontendVersions"
        Effect   = "Allow"
        Action   = ["s3:ListBucketVersions"]
        Resource = [local.frontend_arn]
      },
      {
        Effect   = "Allow"
        Action   = ["s3:GetObject"]
        Resource = concat(local.release_artifact_arns, [local.healthy_pointer_arn, local.release_lease_arn])
      },
      {
        Sid       = "TakeReleaseLease"
        Effect    = "Allow"
        Action    = ["s3:PutObject"]
        Resource  = [local.release_lease_arn]
        Condition = { StringEquals = { "s3:if-none-match" = "*" } }
      },
      {
        Sid      = "ReleaseOwnedLease"
        Effect   = "Allow"
        Action   = ["s3:DeleteObject"]
        Resource = [local.release_lease_arn]
        Condition = {
          Null            = { "s3:if-match" = "false" }
          StringNotEquals = { "s3:if-match" = "*" }
        }
      },
      {
        Sid       = "CreateImmutableReleaseArtifacts"
        Effect    = "Allow"
        Action    = ["s3:PutObject"]
        Resource  = local.release_artifact_arns
        Condition = { StringEquals = { "s3:if-none-match" = "*" } }
      },
      {
        Sid       = "CompareAndSwapHealthyPointer"
        Effect    = "Allow"
        Action    = ["s3:PutObject"]
        Resource  = [local.healthy_pointer_arn]
        Condition = { Null = { "s3:if-match" = "false" } }
      },
      {
        Effect   = "Allow"
        Action   = ["s3:GetObject", "s3:PutObject"]
        Resource = ["${local.frontend_arn}/*"]
      },
      {
        Effect    = "Allow"
        Action    = ["ecr:GetAuthorizationToken"]
        Resource  = ["*"]
        Condition = { StringEquals = { "aws:RequestedRegion" = local.region } }
      },
      {
        Effect = "Allow"
        Action = [
          "ecr:DescribeRepositories", "ecr:DescribeImages", "ecr:BatchGetImage", "ecr:BatchCheckLayerAvailability",
          "ecr:InitiateLayerUpload", "ecr:UploadLayerPart", "ecr:CompleteLayerUpload", "ecr:PutImage"
        ]
        Resource = [local.repository_arn]
      },
      {
        Effect   = "Allow"
        Action   = ["secretsmanager:DescribeSecret"]
        Resource = [var.secret_arn]
      },
      {
        Sid      = "RunOnlyBootstrapDocument"
        Effect   = "Allow"
        Action   = ["ssm:SendCommand"]
        Resource = [local.document_arn]
      },
      {
        Sid       = "RunOnlyOnStagingApi"
        Effect    = "Allow"
        Action    = ["ssm:SendCommand"]
        Resource  = [local.instance_arn]
        Condition = { StringEquals = { "ssm:resourceTag/Environment" = "staging", "ssm:resourceTag/Project" = "ExamTopics" } }
      },
      {
        # SSM status reads require a wildcard resource. Cancellation is not authorized.
        Effect    = "Allow"
        Action    = ["ssm:GetCommandInvocation"]
        Resource  = ["*"]
        Condition = { StringEquals = { "aws:RequestedRegion" = local.region } }
      }
    ]
  })
}
