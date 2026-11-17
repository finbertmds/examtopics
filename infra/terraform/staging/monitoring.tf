resource "aws_cloudwatch_metric_alarm" "api_status" {
  alarm_name          = "${local.name}-api-instance-status"
  alarm_description   = "EC2 reports an instance or platform status check failure."
  namespace           = "AWS/EC2"
  metric_name         = "StatusCheckFailed"
  statistic           = "Maximum"
  period              = 300
  evaluation_periods  = 2
  threshold           = 1
  comparison_operator = "GreaterThanOrEqualToThreshold"
  treat_missing_data  = "missing"

  dimensions = {
    InstanceId = aws_instance.api.id
  }
}

resource "aws_budgets_budget" "staging" {
  count = var.budget_alert_email == null ? 0 : 1

  account_id   = var.staging_account_id
  name         = "${local.name}-monthly"
  budget_type  = "COST"
  limit_amount = "20"
  limit_unit   = "USD"
  time_unit    = "MONTHLY"

  cost_types {
    include_credit = false
    include_refund = false
    use_blended    = false
  }

  dynamic "notification" {
    for_each = toset([25, 50, 75, 100])

    content {
      comparison_operator        = "GREATER_THAN"
      threshold                  = notification.value
      threshold_type             = "PERCENTAGE"
      notification_type          = "ACTUAL"
      subscriber_email_addresses = [var.budget_alert_email]
    }
  }

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 100
    threshold_type             = "PERCENTAGE"
    notification_type          = "FORECASTED"
    subscriber_email_addresses = [var.budget_alert_email]
  }
}
