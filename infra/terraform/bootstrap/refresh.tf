# Both Terraform roles can refresh the existing staging root. The default
# workspace is the only workspace whose state or lockfile they can access.
resource "aws_iam_role_policy" "refresh" {
  for_each = toset(["plan", "apply"])
  name     = "read-staging-and-lock-state"
  role     = aws_iam_role.pipeline[each.key].id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      local.baseline_read,
      local.lease_list,
      {
        Effect   = "Allow"
        Action   = ["s3:GetObject"]
        Resource = concat(local.release_artifact_arns, [local.healthy_pointer_arn, local.release_lease_arn])
      },
      {
        Sid      = "ListStateBucket"
        Effect   = "Allow"
        Action   = ["s3:ListBucket"]
        Resource = [local.state_bucket_arn]
      },
      {
        Sid      = "ReadState"
        Effect   = "Allow"
        Action   = ["s3:GetObject"]
        Resource = [local.state_object_arn]
      },
      {
        Sid      = "LockState"
        Effect   = "Allow"
        Action   = ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"]
        Resource = ["${local.state_object_arn}.tflock"]
      },
      {
        Sid    = "ReadSydneyNetworkAndCompute"
        Effect = "Allow"
        Action = [
          "ec2:DescribeImages", "ec2:DescribeVpcs", "ec2:DescribeVpcAttribute", "ec2:DescribeInternetGateways",
          "ec2:DescribeSubnets", "ec2:DescribeRouteTables", "ec2:DescribeSecurityGroups", "ec2:DescribeSecurityGroupRules",
          "ec2:DescribeNetworkInterfaces", "ec2:DescribeInstances", "ec2:DescribeInstanceAttribute", "ec2:DescribeInstanceTypes",
          "ec2:DescribeInstanceCreditSpecifications", "ec2:DescribeVolumes", "ec2:DescribeAddresses", "ec2:DescribeTags"
        ]
        Resource  = ["*"]
        Condition = { StringEquals = { "aws:RequestedRegion" = local.region } }
      },
      {
        Sid      = "ReadInstanceRole"
        Effect   = "Allow"
        Action   = ["iam:GetRole", "iam:GetRolePolicy", "iam:ListRolePolicies", "iam:ListAttachedRolePolicies", "iam:ListRoleTags", "iam:ListInstanceProfilesForRole"]
        Resource = [local.runtime_role_arn]
      },
      {
        Effect   = "Allow"
        Action   = ["iam:GetInstanceProfile", "iam:ListInstanceProfileTags"]
        Resource = ["arn:aws:iam::${local.account}:instance-profile/${local.name}-api"]
      },
      {
        Effect   = "Allow"
        Action   = ["ecr:DescribeRepositories", "ecr:GetLifecyclePolicy", "ecr:ListTagsForResource", "ecr:DescribeImages", "ecr:BatchGetImage"]
        Resource = [local.repository_arn]
      },
      {
        Effect   = "Allow"
        Action   = ["secretsmanager:DescribeSecret", "secretsmanager:GetResourcePolicy"]
        Resource = [var.secret_arn]
      },
      {
        Effect = "Allow"
        Action = [
          "s3:ListBucket", "s3:GetBucketLocation", "s3:GetBucketTagging", "s3:GetBucketAcl", "s3:GetBucketPolicy",
          "s3:GetBucketPublicAccessBlock", "s3:GetBucketOwnershipControls", "s3:GetEncryptionConfiguration",
          "s3:GetBucketVersioning", "s3:GetLifecycleConfiguration", "s3:GetBucketCORS", "s3:GetBucketWebsite",
          "s3:GetAccelerateConfiguration", "s3:GetBucketRequestPayment", "s3:GetBucketLogging",
          "s3:GetBucketObjectLockConfiguration", "s3:GetReplicationConfiguration"
        ]
        Resource = [local.frontend_arn]
      },
      {
        Effect   = "Allow"
        Action   = ["cloudfront:GetDistribution", "cloudfront:GetDistributionConfig", "cloudfront:ListTagsForResource"]
        Resource = ["${local.cloudfront_arn}:distribution/${var.distribution_id}"]
      },
      {
        Effect   = "Allow"
        Action   = ["cloudfront:GetOriginAccessControl", "cloudfront:GetOriginAccessControlConfig"]
        Resource = ["${local.cloudfront_arn}:origin-access-control/${var.origin_access_control_id}"]
      },
      {
        Effect   = "Allow"
        Action   = ["cloudfront:GetFunction", "cloudfront:DescribeFunction"]
        Resource = [local.function_arn]
      },
      {
        Effect   = "Allow"
        Action   = ["cloudfront:GetResponseHeadersPolicy", "cloudfront:GetResponseHeadersPolicyConfig"]
        Resource = [local.headers_arn]
      },
      {
        Effect   = "Allow"
        Action   = ["cloudwatch:DescribeAlarms", "cloudwatch:ListTagsForResource"]
        Resource = ["arn:aws:cloudwatch:${local.region}:${local.account}:alarm:${local.name}-api-instance-status"]
      },
      {
        Effect   = "Allow"
        Action   = ["budgets:ViewBudget", "budgets:ListTagsForResource"]
        Resource = ["arn:aws:budgets::${local.account}:budget/${local.name}-monthly"]
      }
    ]
  })
}

resource "aws_iam_role_policy" "apply" {
  name = "update-existing-staging"
  role = aws_iam_role.pipeline["apply"].id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid      = "SaveApprovedState"
        Effect   = "Allow"
        Action   = ["s3:PutObject"]
        Resource = [local.state_object_arn]
      },
      {
        Effect   = "Allow"
        Action   = ["cloudfront:UpdateFunction", "cloudfront:PublishFunction"]
        Resource = [local.function_arn]
      }
    ]
  })
}
