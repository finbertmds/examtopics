resource "aws_s3_bucket" "control" {
  for_each = local.bucket_names
  bucket   = each.value
  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_s3_bucket_versioning" "control" {
  for_each = aws_s3_bucket.control
  bucket   = each.value.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "control" {
  for_each = aws_s3_bucket.control
  bucket   = each.value.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_ownership_controls" "control" {
  for_each = aws_s3_bucket.control
  bucket   = each.value.id
  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

resource "aws_s3_bucket_public_access_block" "control" {
  for_each                = aws_s3_bucket.control
  bucket                  = each.value.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_policy" "control" {
  for_each = aws_s3_bucket.control
  bucket   = each.value.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid       = "RequireTLS"
      Effect    = "Deny"
      Principal = "*"
      Action    = "s3:*"
      Resource  = [each.value.arn, "${each.value.arn}/*"]
      Condition = { Bool = { "aws:SecureTransport" = "false" } }
    }]
  })
  depends_on = [aws_s3_bucket_public_access_block.control]
}

resource "aws_s3_bucket_lifecycle_configuration" "control" {
  for_each = aws_s3_bucket.control
  bucket   = each.value.id
  rule {
    id     = "bound-noncurrent-versions"
    status = "Enabled"
    filter {}

    noncurrent_version_expiration {
      noncurrent_days = 30
    }
    abort_incomplete_multipart_upload {
      days_after_initiation = 7
    }
    # Current state, current pointers and immutable per-release objects persist.
  }
  depends_on = [aws_s3_bucket_versioning.control]
}
