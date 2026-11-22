locals {
  image_pattern = "^${local.account}[.]dkr[.]ecr[.]ap-southeast-2[.]amazonaws[.]com/${local.name}@sha256:[0-9a-f]{64}$"
}

resource "aws_ssm_document" "deploy" {
  name            = local.document_name
  document_type   = "Command"
  document_format = "JSON"
  content = jsonencode({
    schemaVersion = "2.2"
    description   = "Run the approved staging deployment helper using immutable release identities."
    parameters = {
      ReleaseId       = { type = "String", allowedPattern = "^[0-9a-f]{40}$" }
      ApiImage        = { type = "String", allowedPattern = local.image_pattern }
      ProxyImage      = { type = "String", allowedPattern = local.image_pattern }
      SecretVersionId = { type = "String", allowedPattern = "^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$" }
    }
    mainSteps = [{
      name   = "deploy"
      action = "aws:runShellScript"
      inputs = {
        timeoutSeconds = "600"
        runCommand = [
          "set -eu",
          "helper=/usr/local/sbin/examtopics-deploy",
          "test -f \"$helper\" && test ! -L \"$helper\" || exit 1",
          "test \"$(find \"$helper\" -user root ! -perm /022 -print)\" = \"$helper\"",
          "printf '%s  %s\\n' '${var.deploy_helper_sha256}' \"$helper\" | sha256sum --check --status",
          "exec \"$helper\" --release '{{ ReleaseId }}' --api-image '{{ ApiImage }}' --proxy-image '{{ ProxyImage }}' --secret-version '{{ SecretVersionId }}' >/dev/null 2>&1"
        ]
      }
    }]
  })
  lifecycle {
    prevent_destroy = true
  }
}
