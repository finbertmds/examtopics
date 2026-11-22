mock_provider "aws" {}

variables {
  staging_account_id         = "450114866570"
  github_subject             = "repo:finbertmds/examtopics:environment:aws-staging:job_workflow_ref:finbertmds/examtopics/.github/workflows/staging-release.yml@refs/tags/aws-staging-controller-v1"
  github_repository_id       = "1035462381"
  github_repository_owner_id = "67890"
  instance_id                = "i-0123456789abcdef0"
  distribution_id            = "E123456EXAMPLE"
  headers_policy_id          = "01234567-89ab-cdef-0123-456789abcdef"
  origin_access_control_id   = "E234567EXAMPLE"
  secret_arn                 = "arn:aws:secretsmanager:ap-southeast-2:450114866570:secret:/examtopics/staging/api-environment-ABC123"
  deploy_helper_sha256       = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
}

run "isolate_pipeline_permissions" {
  command = plan

  assert {
    condition = (
      toset(keys(aws_iam_role.pipeline)) == toset(["monitor", "plan", "apply", "deploy"]) &&
      alltrue([for role in values(aws_iam_role.pipeline) :
        jsondecode(role.assume_role_policy).Statement[0].Condition.StringEquals["token.actions.githubusercontent.com:sub"] == var.github_subject &&
        jsondecode(role.assume_role_policy).Statement[0].Condition.StringEquals["token.actions.githubusercontent.com:ref"] == "refs/heads/staging" &&
        jsondecode(role.assume_role_policy).Statement[0].Condition.StringEquals["token.actions.githubusercontent.com:aud"] == "sts.amazonaws.com" &&
        jsondecode(role.assume_role_policy).Statement[0].Condition.StringEquals["token.actions.githubusercontent.com:repository_id"] == "1035462381" &&
        jsondecode(role.assume_role_policy).Statement[0].Condition.StringEquals["token.actions.githubusercontent.com:repository_owner_id"] == var.github_repository_owner_id &&
        jsondecode(role.assume_role_policy).Statement[0].Condition.StringEquals["token.actions.githubusercontent.com:actor_id"] == var.github_repository_owner_id &&
        jsondecode(role.assume_role_policy).Statement[0].Condition.StringEquals["token.actions.githubusercontent.com:environment"] == "aws-staging"
      ])
    )
    error_message = "Every CI role must require the verified environment subject, protected staging ref and STS audience."
  }

  assert {
    condition = (
      toset(jsondecode(aws_iam_role_policy.monitor.policy).Statement[0].Action) == toset(["sts:GetCallerIdentity", "ce:GetCostAndUsage", "freetier:GetAccountPlanState"]) &&
      toset(flatten([for s in jsondecode(aws_iam_role_policy.refresh["plan"].policy).Statement :
        s.Resource if contains(s.Action, "s3:PutObject")
      ])) == toset(["arn:aws:s3:::examtopics-staging-tfstate-450114866570/staging/terraform.tfstate.tflock"]) &&
      alltrue([for s in jsondecode(aws_iam_role_policy.deploy.policy).Statement :
        !contains(s.Action, "secretsmanager:GetSecretValue") && !contains(s.Action, "ssm:CancelCommand") &&
        (!contains(s.Action, "ssm:SendCommand") || contains([
          "arn:aws:ssm:ap-southeast-2:450114866570:document/ExamTopicsStagingDeploy",
          "arn:aws:ec2:ap-southeast-2:450114866570:instance/i-0123456789abcdef0"
        ], one(s.Resource)))
      ])
    )
    error_message = "Monitoring is read-only, plan can write only its lock, and deploy can run only the bootstrap document on its pinned instance."
  }

  assert {
    condition = (
      !can(regex(jsondecode(aws_ssm_document.deploy.content).parameters.ApiImage.allowedPattern, "docker.io/library/redis:latest")) &&
      can(regex(jsondecode(aws_ssm_document.deploy.content).parameters.ApiImage.allowedPattern, "450114866570.dkr.ecr.ap-southeast-2.amazonaws.com/examtopics-staging@sha256:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef")) &&
      !can(regex(jsondecode(aws_ssm_document.deploy.content).parameters.ReleaseId.allowedPattern, "abcd; echo unexpected")) &&
      !can(regex(jsondecode(aws_ssm_document.deploy.content).parameters.SecretVersionId.allowedPattern, "--------------------------------")) &&
      can(regex(jsondecode(aws_ssm_document.deploy.content).parameters.SecretVersionId.allowedPattern, "01234567-89ab-cdef-0123-456789abcdef")) &&
      strcontains(join(" ", jsondecode(aws_ssm_document.deploy.content).mainSteps[0].inputs.runCommand), var.deploy_helper_sha256)
    )
    error_message = "The fixed command must verify the helper and accept only staging image digests and release IDs."
  }

  assert {
    condition = alltrue([for key in ["state", "release"] :
      aws_s3_bucket_public_access_block.control[key].block_public_policy &&
      aws_s3_bucket_public_access_block.control[key].block_public_acls &&
      aws_s3_bucket_public_access_block.control[key].ignore_public_acls &&
      aws_s3_bucket_public_access_block.control[key].restrict_public_buckets &&
      one(aws_s3_bucket_ownership_controls.control[key].rule).object_ownership == "BucketOwnerEnforced" &&
      one(one(aws_s3_bucket_server_side_encryption_configuration.control[key].rule).apply_server_side_encryption_by_default).sse_algorithm == "AES256" &&
      aws_s3_bucket_versioning.control[key].versioning_configuration[0].status == "Enabled" &&
      alltrue([for rule in aws_s3_bucket_lifecycle_configuration.control[key].rule : length(rule.expiration) == 0])
    ])
    error_message = "State and release buckets must retain current data privately, including the previous healthy release artifacts."
  }
}

run "reject_wildcard_subject" {
  command = plan

  variables {
    github_subject = "repo:FinbertMDS/*:environment:aws-staging"
  }

  expect_failures = [var.github_subject]
}

run "lease_and_apply_writes_stay_scoped" {
  command = plan

  assert {
    condition = (
      toset(flatten([for statement in jsondecode(aws_iam_role_policy.deploy.policy).Statement :
        statement.Resource if contains(statement.Action, "s3:DeleteObject")
      ])) == toset(["arn:aws:s3:::examtopics-staging-releases-450114866570/releases/in-progress.json"]) &&
      alltrue([for statement in jsondecode(aws_iam_role_policy.deploy.policy).Statement :
        try(statement.Condition.Null["s3:if-match"] == "false" &&
        statement.Condition.StringNotEquals["s3:if-match"] == "*", false)
        if contains(statement.Action, "s3:DeleteObject")
      ]) &&
      anytrue([for statement in jsondecode(aws_iam_role_policy.deploy.policy).Statement :
        contains(statement.Action, "s3:PutObject") &&
        contains(statement.Resource, "arn:aws:s3:::examtopics-staging-releases-450114866570/releases/in-progress.json") &&
        try(statement.Condition.StringEquals["s3:if-none-match"] == "*", false)
      ]) &&
      toset(flatten([for statement in jsondecode(aws_iam_role_policy.deploy.policy).Statement :
        statement.Resource if contains(statement.Action, "s3:PutObject")
        ])) == toset([
        "arn:aws:s3:::examtopics-staging-releases-450114866570/releases/in-progress.json",
        "arn:aws:s3:::examtopics-staging-releases-450114866570/releases/last-known-healthy.json",
        "arn:aws:s3:::examtopics-staging-releases-450114866570/releases/????????????????????????????????????????/frontend.tar.gz",
        "arn:aws:s3:::examtopics-staging-releases-450114866570/releases/????????????????????????????????????????/manifest.json",
        "arn:aws:s3:::examtopics-staging-web-450114866570/*",
      ]) &&
      alltrue([for policy in values(aws_iam_role_policy.refresh) : anytrue([
        for statement in jsondecode(policy.policy).Statement :
        contains(statement.Action, "s3:ListBucket") &&
        contains(statement.Resource, "arn:aws:s3:::examtopics-staging-releases-450114866570") &&
        try(statement.Condition.StringEquals["s3:prefix"] == "releases/in-progress.json", false)
      ])])
    )
    error_message = "Pipeline roles must isolate the deployment lease and use conditional publisher writes and deletes."
  }

  assert {
    condition = (
      toset(flatten([for statement in jsondecode(aws_iam_role_policy.apply.policy).Statement : statement.Action])) ==
      toset(["s3:PutObject", "cloudfront:UpdateFunction", "cloudfront:PublishFunction"]) &&
      toset(flatten([for statement in jsondecode(aws_iam_role_policy.apply.policy).Statement :
        statement.Resource if contains(statement.Action, "s3:PutObject")
      ])) == toset(["arn:aws:s3:::examtopics-staging-tfstate-450114866570/staging/terraform.tfstate"])
    )
    error_message = "Apply may write only the staging state object and supported CloudFront updates."
  }

  assert {
    condition = (
      toset(flatten([for statement in jsondecode(aws_iam_policy.runtime_boundary.policy).Statement :
        statement.Resource if contains(statement.Action, "secretsmanager:GetSecretValue")
      ])) == toset([var.secret_arn]) &&
      alltrue([for statement in jsondecode(aws_iam_policy.runtime_boundary.policy).Statement :
        alltrue([for action in statement.Action : !startswith(action, "iam:") && !startswith(action, "s3:")])
      ])
    )
    error_message = "The runtime boundary must keep staging secret access on the host without access to IAM or release storage."
  }
}

run "reject_foreign_account" {
  command = plan

  variables {
    staging_account_id = "123456789012"
    secret_arn         = "arn:aws:secretsmanager:ap-southeast-2:123456789012:secret:/examtopics/staging/api-environment-ABC123"
  }

  expect_failures = [var.staging_account_id]
}

run "reject_foreign_github_repository" {
  command = plan

  variables {
    github_repository_id = "1234567"
  }

  expect_failures = [var.github_repository_id]
}
