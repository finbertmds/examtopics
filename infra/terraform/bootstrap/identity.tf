resource "aws_iam_openid_connect_provider" "github" {
  count          = var.existing_github_oidc_provider_arn == null ? 1 : 0
  url            = "https://token.actions.githubusercontent.com"
  client_id_list = ["sts.amazonaws.com"]
}

resource "aws_iam_role" "pipeline" {
  for_each             = toset(["monitor", "plan", "apply", "deploy"])
  name                 = "${local.name}-${each.key}"
  max_session_duration = 3600
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Action    = "sts:AssumeRoleWithWebIdentity"
      Principal = { Federated = "arn:aws:iam::${local.account}:oidc-provider/token.actions.githubusercontent.com" }
      Condition = {
        StringEquals = {
          "token.actions.githubusercontent.com:aud"                 = "sts.amazonaws.com"
          "token.actions.githubusercontent.com:sub"                 = var.github_subject
          "token.actions.githubusercontent.com:repository_id"       = var.github_repository_id
          "token.actions.githubusercontent.com:repository_owner_id" = var.github_repository_owner_id
          "token.actions.githubusercontent.com:actor_id"            = var.github_repository_owner_id
          "token.actions.githubusercontent.com:ref"                 = "refs/heads/staging"
          "token.actions.githubusercontent.com:environment"         = "aws-staging"
        }
      }
    }]
  })
  depends_on = [aws_iam_openid_connect_provider.github]
}

resource "aws_iam_role_policy" "monitor" {
  name = "account-plan-and-spend"
  role = aws_iam_role.pipeline["monitor"].id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ["sts:GetCallerIdentity", "freetier:GetAccountPlanState", "ce:GetCostAndUsage"]
      Resource = ["*"]
    }]
  })
}

resource "aws_iam_policy" "runtime_boundary" {
  name        = "${local.name}-runtime-boundary"
  description = "Maximum permissions for the existing staging EC2 instance role."
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ssm:UpdateInstanceInformation", "ssmmessages:CreateControlChannel", "ssmmessages:OpenControlChannel",
          "ssmmessages:CreateDataChannel", "ssmmessages:OpenDataChannel", "ecr:GetAuthorizationToken"
        ]
        Resource  = ["*"]
        Condition = { StringEquals = { "aws:RequestedRegion" = local.region } }
      },
      {
        Effect   = "Allow"
        Action   = ["ecr:BatchCheckLayerAvailability", "ecr:BatchGetImage", "ecr:GetDownloadUrlForLayer"]
        Resource = [local.repository_arn]
      },
      {
        Effect   = "Allow"
        Action   = ["secretsmanager:GetSecretValue"]
        Resource = [var.secret_arn]
      }
    ]
  })
  lifecycle {
    prevent_destroy = true
  }
}
