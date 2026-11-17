data "aws_ami" "api" {
  owners = ["amazon"]

  filter {
    name   = "image-id"
    values = [var.api_ami_id]
  }

  filter {
    name   = "name"
    values = ["al2023-ami-2023.*-kernel-*-x86_64"]
  }

  filter {
    name   = "architecture"
    values = ["x86_64"]
  }

  filter {
    name   = "free-tier-eligible"
    values = ["true"]
  }
}

resource "aws_vpc" "staging" {
  cidr_block           = "10.86.0.0/24"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = { Name = local.name }
}

resource "aws_internet_gateway" "staging" {
  vpc_id = aws_vpc.staging.id
  tags   = { Name = local.name }
}

resource "aws_subnet" "api" {
  vpc_id                  = aws_vpc.staging.id
  cidr_block              = "10.86.0.0/26"
  map_public_ip_on_launch = false

  tags = { Name = "${local.name}-api" }
}

resource "aws_route_table" "api" {
  vpc_id = aws_vpc.staging.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.staging.id
  }

  tags = { Name = "${local.name}-api" }
}

resource "aws_route_table_association" "api" {
  subnet_id      = aws_subnet.api.id
  route_table_id = aws_route_table.api.id
}

resource "aws_security_group" "api" {
  name        = "${local.name}-api"
  description = "Public API TLS and ACME. Administration uses SSM."
  vpc_id      = aws_vpc.staging.id
}

resource "aws_vpc_security_group_ingress_rule" "api_web" {
  for_each = toset(["80", "443"])

  security_group_id = aws_security_group.api.id
  cidr_ipv4         = "0.0.0.0/0"
  description       = "HTTP redirects and certificate validation, HTTPS API"
  ip_protocol       = "tcp"
  from_port         = tonumber(each.value)
  to_port           = tonumber(each.value)
}

resource "aws_vpc_security_group_egress_rule" "api_https" {
  security_group_id = aws_security_group.api.id
  cidr_ipv4         = "0.0.0.0/0"
  description       = "HTTPS for SSM, ACME, Google and release artifacts"
  ip_protocol       = "tcp"
  from_port         = 443
  to_port           = 443
}

resource "aws_vpc_security_group_egress_rule" "api_atlas" {
  security_group_id = aws_security_group.api.id
  cidr_ipv4         = "0.0.0.0/0"
  description       = "TLS to dynamic Atlas public endpoints"
  ip_protocol       = "tcp"
  from_port         = 27015
  to_port           = 27017
}

resource "aws_iam_role" "api" {
  name = "${local.name}-api"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy" "api_runtime" {
  name = "staging-runtime"
  role = aws_iam_role.api.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ssm:UpdateInstanceInformation",
          "ssmmessages:CreateControlChannel",
          "ssmmessages:CreateDataChannel",
          "ssmmessages:OpenControlChannel",
          "ssmmessages:OpenDataChannel"
        ]
        Resource = "*"
      },
      {
        Effect   = "Allow"
        Action   = "ecr:GetAuthorizationToken"
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "ecr:BatchCheckLayerAvailability",
          "ecr:BatchGetImage",
          "ecr:GetDownloadUrlForLayer"
        ]
        Resource = aws_ecr_repository.api.arn
      },
      {
        Effect   = "Allow"
        Action   = "secretsmanager:GetSecretValue"
        Resource = aws_secretsmanager_secret.api_environment.arn
      }
    ]
  })
}

resource "aws_iam_instance_profile" "api" {
  name = "${local.name}-api"
  role = aws_iam_role.api.name
}

resource "aws_instance" "api" {
  ami                         = data.aws_ami.api.id
  instance_type               = "t3.micro"
  subnet_id                   = aws_subnet.api.id
  vpc_security_group_ids      = [aws_security_group.api.id]
  iam_instance_profile        = aws_iam_instance_profile.api.name
  associate_public_ip_address = false

  credit_specification {
    cpu_credits = "standard"
  }

  metadata_options {
    http_endpoint               = "enabled"
    http_tokens                 = "required"
    http_put_response_hop_limit = 1
    instance_metadata_tags      = "disabled"
  }

  root_block_device {
    encrypted             = true
    volume_type           = "gp3"
    volume_size           = 12
    delete_on_termination = true
  }

  tags = { Name = "${local.name}-api" }

  depends_on = [aws_iam_role_policy.api_runtime, aws_route_table_association.api]
}

resource "aws_eip" "api" {
  domain = "vpc"
  tags   = { Name = "${local.name}-api" }

  depends_on = [aws_internet_gateway.staging]
}

resource "aws_eip_association" "api" {
  allocation_id = aws_eip.api.id
  instance_id   = aws_instance.api.id
}

resource "aws_secretsmanager_secret" "api_environment" {
  name                    = "/examtopics/staging/api-environment"
  description             = "Docker env-file value supplied outside Terraform by an authorized staging operator."
  recovery_window_in_days = 7
}
