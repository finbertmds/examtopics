# AWS staging cost estimate

Reference region is US East (N. Virginia), `us-east-1`. Keep the AWS account on the Free plan and review the $20 monthly budget before each operation. This estimate uses public AWS pricing and the high end of a calendar month's hours. It models modest staging use before credits and tax. Actual Free-plan credit usage and service availability require separately approved account reads.

| Component | Monthly assumption | USD |
| --- | --- | ---: |
| EC2 Linux | One t3.micro for 744 hours at $0.0104/hour, standard CPU credit mode. [EC2 T3 pricing](https://aws.amazon.com/ec2/instance-types/t3/) | 7.74 |
| Public IPv4 | One Elastic IP for 744 hours at $0.005/hour, including idle time. [VPC pricing](https://aws.amazon.com/vpc/pricing/) | 3.72 |
| EBS | 12 GB gp3 at $0.08/GB-month with baseline IOPS and throughput. No snapshots or incremental snapshot storage in this staging design. [EBS pricing](https://aws.amazon.com/ebs/pricing/) | 0.96 |
| Private ECR | 2 GB compressed retained images at $0.10/GB-month with same-region pulls. [ECR pricing](https://aws.amazon.com/ecr/pricing/) | 0.20 |
| Secrets Manager | One secret at $0.40/month plus up to 100 API calls at $0.05 per 10,000. [Secrets Manager pricing](https://aws.amazon.com/secrets-manager/pricing/) | 0.41 |
| Private S3 | 2 GB including retained versions, up to 10,000 reads and 1,000 writes. Estimate rounded upward. [S3 pricing](https://aws.amazon.com/s3/pricing/) | 0.10 |
| CloudFront pay-as-you-go | 10 GB delivered, 100,000 HTTPS requests and up to 100,000 viewer function invocations within the published monthly allowances. [CloudFront FAQ](https://aws.amazon.com/cloudfront/faqs/) | 0.00 |
| EC2 internet transfer | Up to 1 GB outbound, within the shared AWS internet egress allowance. [EC2 on-demand pricing](https://aws.amazon.com/ec2/pricing/on-demand/) | 0.00 |
| CloudWatch | One standard resolution alarm. Estimate includes a $0.10 allowance if the shared free quota has been used. Local rotating logs use the EC2 root volume. [CloudWatch pricing](https://aws.amazon.com/cloudwatch/pricing/) | 0.10 |
| Budget, ACM and Session Manager | Alert-only budget with no actions, non-exportable public ACM certificate used by CloudFront and normal Session Manager access to EC2. [Budgets pricing](https://aws.amazon.com/aws-cost-management/aws-budgets/pricing/) [ACM pricing](https://aws.amazon.com/certificate-manager/pricing/) [Systems Manager pricing](https://aws.amazon.com/systems-manager/pricing/) | 0.00 |
| **Estimated monthly total before credits and tax** | **Budget planning allowance is $15 for the modeled workload.** | **13.23** |

The $15 allowance includes headroom for modest traffic or request pricing variance. It is a forecast. The Terraform configuration uses a single VPC with an internet gateway, and avoids recurring NAT gateway, load balancer, remote access endpoint and AWS hosted zone fees. The estimate assumes an existing domain and DNS provider, an isolated staging Atlas deployment covered by its existing tier, and no paid Google Workspace changes. Include any new domain, DNS, Atlas, Google or package/registry costs in the approval proposal. CloudFront is configured for the standard pay-as-you-go distribution rather than a subscription plan.

AWS lists `t3.micro` and gp3 as Free Tier eligible instance and volume types. The public service list includes CloudFront, EBS, EC2, ECR, S3, VPC, CloudWatch, ACM, Secrets Manager, IAM, Systems Manager and AWS Budgets. Verify each exact feature and credit treatment in the intended account under separate read authorization. [EC2 Free Tier eligibility](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-free-tier-usage.html) [Supported AWS services](https://docs.aws.amazon.com/accounts/latest/reference/supported-services-sign-up-new.html)

A Budget with its notification address configured tracks account-wide cost before credits and reports actual usage at 25%, 50%, 75% and 100% and forecast usage at 100%. It does not enforce a spending cap. Metered traffic, logs, retained objects or snapshots introduced later, taxes, shared allowance exhaustion and retained idle resources can increase spend. Record both incurred gross costs and the remaining verified credit balance. Measure spending and storage after every staging release. Propose teardown before the Free plan expires if the environment is no longer needed.

Stop if the AWS plan is inactive, expired or unverifiable, if verified remaining USD credits are below $20, if a required operation could upgrade the account or if current spend plus projected additions exceeds $20 for that month. The AWS estimate, alert state and Terraform validation cannot substitute for the verified plan state and exact approval. [Repository AWS cost guardrails](../policies/aws-cost-guardrails.md) [Approval process](../policies/aws-deployment-approval.md)
