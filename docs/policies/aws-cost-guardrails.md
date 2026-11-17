# AWS cost guardrails

These rules apply to the Main Orchestrator and every subagent. Cloud mutation and production modification are denied by default. Follow the [deployment approval policy](aws-deployment-approval.md) for authorization.

## Credit protection

- Eligible new AWS accounts may receive up to $200 USD in Free Tier credits. Use the verified balance for decisions.
- With authorized read-only access, agents MUST use the AWS Free Tier [GetAccountPlanState API](https://docs.aws.amazon.com/aws-cost-management/latest/APIReference/API_freetier_GetAccountPlanState.html) (AWS CLI `aws freetier get-account-plan-state`) to verify the target account ID, plan type, status, expiration, and actual remaining credit amount and currency. Record when the check was performed. Usage quotas and billing alerts cannot establish the credit balance.
- Agents MUST block deployment if the plan or balance cannot be verified, the plan is inactive or expired, remaining credits are below $20 USD, or the account is on a plan other than Free. A non-Free plan requires a separately and explicitly approved policy change before deployment can be considered.
- Agents MUST preserve the Free plan and MUST NOT initiate a Paid upgrade or any action that causes one automatically. Creating or joining AWS Organizations or enabling AWS Control Tower requires specific human authorization, and remains prohibited while it would trigger an upgrade under this policy. See [AWS account plan rules](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/free-tier-plans.html).
- Agents MUST NOT independently consume credits or trigger billable services. Verify plan eligibility, credit applicability, pricing, and expected usage for each resource. Free Tier eligibility alone does not establish zero cost.

## Cost monitoring

- The monthly AWS budget is $20 USD. Recommend actual-spend alerts at 25%, 50%, 75%, and 100%, and a forecast alert at 100%. Creating or changing alerts requires approval.
- AWS Budgets provides monitoring and alerts. It is not a hard spending cap, and charges can accrue before an alert arrives. Track credit usage and expiration independently from billing alerts.
- Before approval, show current reported month-to-date spending, its reporting timestamp and treatment of credits, and the expected cost after the change. Stop if the projected monthly cost exceeds the $20 USD budget.
- Estimates depend on pricing and usage assumptions. Actual charges come from metered usage and may be reported later. Account for public IPv4, NAT Gateway, data transfer, storage, logs, backups, requests, and managed services, including one-time costs where applicable.

## IAM least privilege

Use separate access for credit monitoring, Terraform planning, and deployment.

- Credit monitoring MUST use read-only permissions scoped to the required account and billing data, including `freetier:GetAccountPlanState`.
- Terraform planning MUST use least-privilege read-only access where feasible. Disclose any necessary backend lock operation and obtain explicit authorization for it. Planning access MUST NOT include deployment permissions.
- Deployment MUST use narrowly scoped, short-lived write access for the approved account, environment, and operation. Release access only after explicit human approval.
- Agents MUST NOT receive `AdministratorAccess` by default, modify their own IAM restrictions, or bypass them through another identity, service, or agent.
