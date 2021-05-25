provider "aws" {
  version = "~> 2.0"
  region  = var.aws_region
}

locals {
  project_id = "ssr-test-a1"
  s3_origin_id = "ssr-test-origin-dev"
}

resource "aws_cloudfront_origin_access_identity" "oai" {
  comment = "CF origin identity"
}

resource "aws_s3_bucket" "bucket" {
  bucket = "${local.project_id}-dev-assets"
  acl    = "private"

  website {
      index_document = "index.html"
      error_document = "index.html"
  }

  tags = {
    Name = "${local.project_id}-dev-assets"
  }
}

data "aws_iam_policy_document" "read_bucket_policy" {
  statement {
    sid       = "AllowCloudFrontS3Read"
    actions   = ["s3:GetObject"]
    resources = [
      "${aws_s3_bucket.bucket.arn}/*"
    ]
    principals {
      type        = "AWS"
      identifiers = [
        aws_cloudfront_origin_access_identity.oai.iam_arn
      ]
    }
  }
}


resource "aws_s3_bucket_policy" "s3_allow_read_access" {
  bucket = aws_s3_bucket.bucket.id
  policy = data.aws_iam_policy_document.read_bucket_policy.json
}

resource "aws_cloudfront_distribution" "cf_distribution" {
    origin {
        domain_name = aws_s3_bucket.bucket.bucket_regional_domain_name
        origin_id = local.s3_origin_id 

        s3_origin_config {
            origin_access_identity = "origin-access-identity/cloudfront/${aws_cloudfront_origin_access_identity.oai.id}"
        }
    }

    enabled = true
    is_ipv6_enabled     = true
    comment             = "SSR test"

    default_cache_behavior {
        allowed_methods  = ["GET", "HEAD"]
        cached_methods   = ["GET", "HEAD"]
        target_origin_id = local.s3_origin_id

        lambda_function_association {
          event_type   = "origin-request"
          lambda_arn   = aws_lambda_function.edge_origin_request.qualified_arn
          include_body = false
        }

        forwarded_values {
          query_string = true
          cookies {
            forward = "whitelist"
            whitelisted_names = ["source"]
          }
        }

        viewer_protocol_policy = "redirect-to-https"
        min_ttl                = 0 
        default_ttl            = 3600 
        max_ttl                = 86400 
    }

    price_class = "PriceClass_100" 

    restrictions {
        geo_restriction {
            restriction_type = "none"
        }
    }

    tags = {
        Environment = "production"
    }

    viewer_certificate {
        cloudfront_default_certificate = true
    }
}

resource "aws_s3_bucket" "edge_functions" {
  bucket        = "edge-function-assets1"
  acl           = "private"
  region        = "${var.aws_region}"

  tags = {
    Name        = "Dev Bucket"
    Environment = "Dev"
  }
}

resource "aws_s3_bucket_object" "source" {
  bucket = aws_s3_bucket.edge_functions.id
  key = "edge-functions-assets"
  source = "../deploy-1.0.1.zip"
  etag = "${filemd5("../deploy-1.0.1.zip")}"
}


data "aws_iam_policy_document" "lambda_assume_role" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = [
        "lambda.amazonaws.com",
        "edgelambda.amazonaws.com"
      ]
    }
  }
}

resource "aws_iam_role" "lambda_role" {
  name                 = "AllowLambdaLogs"
  assume_role_policy   = data.aws_iam_policy_document.lambda_assume_role.json
  description          = "IAM Role with permissions to provide lambda permission to CW logs"
}


resource "aws_lambda_function" "edge_origin_request" {
  function_name = "edge-origin-request" 
  s3_bucket = aws_s3_bucket.edge_functions.id
  s3_key = aws_s3_bucket_object.source.id
  handler = "dist/index.handler"
  role = aws_iam_role.lambda_role.arn
  timeout = 30
  publish = true

  source_code_hash = "${filebase64sha256("../deploy-1.0.1.zip")}"

  runtime = "nodejs12.x"
  depends_on = [
    "aws_iam_role_policy_attachment.attach_lambda_role_logs",
    "aws_cloudwatch_log_group.origin_request_logs"
  ]
}

resource "aws_cloudwatch_log_group" "origin_request_logs" {
    name = "/aws/lambda/origin-requests"
    retention_in_days = 1
}

data "aws_iam_policy_document" "lambda_cw_log_policy" {
    version = "2012-10-17"
    statement {
        actions = [
            "logs:CreateLogGroup",
            "logs:CreateLogStream",
            "logs:PutLogEvents"
        ]
        effect = "Allow"
        resources = ["arn:aws:logs:*:*:*"]
    }
}

resource "aws_iam_policy" "lambda_logging" {
    name = "lambda_logging"
    path = "/"
    description = "IAM Policy for logging from a lambda"
    policy = data.aws_iam_policy_document.lambda_cw_log_policy.json
}

resource "aws_iam_role_policy_attachment" "attach_lambda_role_logs" {
    role = aws_iam_role.lambda_role.name
    policy_arn = aws_iam_policy.lambda_logging.arn
}
