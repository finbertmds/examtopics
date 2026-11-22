"""Pure eligibility, billing and Terraform gates for the Sydney staging workflow."""

import calendar
import hashlib
import ipaddress
import json
import re
from collections import Counter
from datetime import datetime, timedelta
from decimal import Decimal, InvalidOperation, localcontext, ROUND_CEILING


ACCOUNT = "450114866570"
REGION = "ap-southeast-2"
DOMAIN = "staging.finbert.ngo"
REPO = "finbertmds/examtopics"
REPO_ID = 1035462381
STATE_KEY = "staging/terraform.tfstate"
REGISTRY = f"{ACCOUNT}.dkr.ecr.{REGION}.amazonaws.com"
ECR_REPO = f"{REGISTRY}/examtopics-staging"
AWS_PROVIDER = "registry.terraform.io/hashicorp/aws"
SHA_PATTERN = r"[0-9a-f]{40}"
DIGEST_PATTERN = r"sha256:[0-9a-f]{64}"
TARGET_FIELDS = (
    "account_id", "region", "api_instance_id", "api_public_ipv4", "frontend_bucket",
    "frontend_distribution_id", "frontend_distribution_domain", "api_environment_secret_arn",
    "release_repository_url", "frontend_url", "api_url",
)
COST_FIELDS = ("monthly_usd", "metering_lag_reserve_usd", "deployment_reserve_usd")
COST_COUNTS = {
    "aws_instance": 1, "aws_eip": 1, "aws_cloudwatch_metric_alarm": 1, "aws_s3_bucket": 1,
    "aws_ecr_repository": 1, "aws_secretsmanager_secret": 1, "aws_cloudfront_distribution": 1,
    "aws_cloudfront_function": 1,
}
MANAGED_TYPES = set(COST_COUNTS) | {
    "aws_budgets_budget", "aws_cloudfront_origin_access_control", "aws_cloudfront_response_headers_policy",
    "aws_ecr_lifecycle_policy", "aws_eip_association", "aws_iam_instance_profile", "aws_iam_role",
    "aws_iam_role_policy", "aws_internet_gateway", "aws_route_table", "aws_route_table_association",
    "aws_s3_bucket_lifecycle_configuration", "aws_s3_bucket_ownership_controls", "aws_s3_bucket_policy",
    "aws_s3_bucket_public_access_block", "aws_s3_bucket_server_side_encryption_configuration",
    "aws_s3_bucket_versioning", "aws_security_group", "aws_subnet", "aws_vpc",
    "aws_vpc_security_group_egress_rule", "aws_vpc_security_group_ingress_rule",
}
WRITABLE_ATTRIBUTES = {
    "aws_cloudfront_function.frontend_route": {"code"},
}
VOLATILE_ATTRIBUTES = {
    "aws_cloudfront_function.frontend_route": {"etag", "live_stage_etag", "last_modified_time"},
    "aws_cloudfront_response_headers_policy.frontend": {"etag"},
}


class GateError(ValueError):
    """A safe reason the workflow must stop."""


def require(condition, reason):
    if not condition:
        raise GateError(reason)


def matches(value, pattern):
    return isinstance(value, str) and re.fullmatch(pattern, value) is not None


def eligible_merge(event, sha, ref):
    try:
        pr = event["pull_request"]
        repos = (event["repository"], pr["head"]["repo"], pr["base"]["repo"])
        owner_id = repos[0]["owner"]["id"]
        return (
            event["action"] == "closed" and pr["merged"] is True
            and ref == "refs/heads/staging" and pr["base"]["ref"] == "staging"
            and pr["head"]["ref"] == "develop" and matches(sha, SHA_PATTERN)
            and sha == pr["merge_commit_sha"]
            and type(owner_id) is int and owner_id > 0 and pr["merged_by"]["id"] == owner_id
            and all(repo["id"] == REPO_ID and repo["full_name"] == REPO for repo in repos)
        )
    except (KeyError, TypeError):
        return False


def pull_request_paths(pages):
    return [name for page in pages for entry in page
            for name in (entry["filename"], entry.get("previous_filename")) if name]


def classify_paths(paths):
    return (
        any(path.startswith("infra/terraform/staging/") for path in paths),
        any(path == ".nvmrc" or path.startswith(("examtopics-backend/", "examtopics-practice/")) for path in paths),
    )


def deployment_paths_changed(paths):
    return any(classify_paths(paths)) or any(
        path.startswith(("infra/cicd/", ".github/workflows/")) for path in paths
    )


def dollars(value):
    require(
        not isinstance(value, bool)
        and isinstance(value, (int, float, str, Decimal))
        and matches(str(value), r"(?:[0-9]{1,9}(?:\.[0-9]{1,18})?|\.[0-9]{1,18})(?:[eE][+-]?[0-9]{1,2})?"),
        "USD amount is unknown",
    )
    try:
        amount = Decimal(str(value))
    except InvalidOperation:
        raise GateError("USD amount is unknown") from None
    require(amount.is_finite() and 0 <= amount <= 1_000_000_000, "USD amount is unknown")
    return amount


def cost_window(now):
    today = now.date()
    return today.replace(day=1).isoformat(), (today + timedelta(days=1)).isoformat()


def budget_model(cost_model):
    require(isinstance(cost_model, dict) and set(cost_model) == set(COST_FIELDS),
            "Cost model requires monthly usage and both reserves")
    assume = tuple(dollars(cost_model[field]) for field in COST_FIELDS)
    require(all(cost > 0 for cost in assume) and sum(assume) <= 20, "Cost model exceeds the approved budget")
    return assume


def check_budget(plan, costs, cost_model, now):
    try:
        require(plan["accountId"] == ACCOUNT and plan["accountPlanType"] == "FREE"
                and plan["accountPlanStatus"] == "ACTIVE", "The staging Free plan is not active")
        expiry = datetime.fromisoformat(plan["accountPlanExpirationDate"])
        require(expiry.tzinfo is not None and expiry > now, "The staging Free plan is expired or unverified")
        credits = plan["accountPlanRemainingCredits"]
        require(credits["unit"] == "USD", "Free plan credits are not denominated in USD")
        balance = dollars(credits["amount"])
        require(balance >= 20, "Free plan credits are below $20")
        require(not costs.get("NextPageToken"), "Cost Explorer returned an incomplete window")
        [window] = costs["ResultsByTime"]
        start, end = cost_window(now)
        require(window["TimePeriod"] == {"Start": start, "End": end}
                and type(window["Estimated"]) is bool and not window.get("Groups"),
                "Cost Explorer did not report the requested month-to-date window")
        spend = window["Total"]["UnblendedCost"]
        require(spend["Unit"] == "USD", "Reported spend is not denominated in USD")
        month_to_date = dollars(spend["Amount"])
    except (KeyError, TypeError, ValueError) as error:
        if isinstance(error, GateError):
            raise
        raise GateError("Billing response is missing or incomplete") from None
    monthly, lag, deploy = budget_model(cost_model)
    days = calendar.monthrange(now.year, now.month)[1]
    with localcontext() as ctx:
        ctx.prec = 50
        projected = (month_to_date + monthly * (days - now.day + 1) / days + lag + deploy)
        projected = projected.quantize(Decimal("0.000000000000000001"), rounding=ROUND_CEILING)
    require(projected <= 20, "Projected staging monthly cost exceeds $20")
    return balance, month_to_date, projected


def validate_config(config):
    patterns = {
        "controller_sha": SHA_PATTERN,
        "api_instance_id": r"i-[0-9a-f]{17}",
        "frontend_distribution_id": r"E[A-Z0-9]{6,20}",
        "frontend_distribution_domain": r"d[0-9a-z]+\.cloudfront\.net",
        "api_environment_secret_arn": (
            rf"arn:aws:secretsmanager:{REGION}:{ACCOUNT}:secret:/examtopics/staging/api-environment-[A-Za-z0-9]{{6}}"
        ),
        "state_bucket": rf"examtopics-staging-tfstate-{ACCOUNT}",
        "release_bucket": rf"examtopics-staging-releases-{ACCOUNT}",
        "ssm_document": r"ExamTopicsStagingDeploy",
        "ssm_document_version": r"[1-9][0-9]*",
        "secret_version_id": r"[a-zA-Z0-9-]{32,64}",
        "proxy_image": re.escape(ECR_REPO) + "@" + DIGEST_PATTERN,
    }
    fixed = {
        "account_id": ACCOUNT, "region": REGION, "staging_domain": DOMAIN, "state_key": STATE_KEY,
        "frontend_bucket": f"examtopics-staging-web-{ACCOUNT}",
        "frontend_url": f"https://app.{DOMAIN}", "api_url": f"https://api.{DOMAIN}",
        "release_repository_url": ECR_REPO,
    }
    positive_int = ("max_release_bytes", "max_api_image_bytes", "max_ecr_repository_bytes", "max_release_storage_bytes")
    require(isinstance(config, dict)
            and set(config) == (set(patterns) | set(fixed) | set(positive_int)
                                | {"api_public_ipv4", "terraform_variables", "cost_model"}),
            "Staging configuration fields are incomplete or unknown")
    for name, value in fixed.items():
        require(config[name] == value, f"Unexpected staging configuration for {name}")
    for name, pattern in patterns.items():
        require(matches(config[name], pattern), f"Unexpected staging configuration for {name}")
    require(config["controller_sha"] != "0" * 40, "Controller commit has not been recorded")
    require(len({config[k] for k in ("frontend_bucket", "release_bucket", "state_bucket")}) == 3,
            "Frontend, state and release buckets must be distinct")
    try:
        address = ipaddress.IPv4Address(config["api_public_ipv4"])
        require(address.is_global and not address.is_multicast, "Staging API must have a public IPv4 address")
    except (ValueError, TypeError):
        raise GateError("Staging API must have a verified IPv4 address") from None
    require(isinstance(config["api_public_ipv4"], str), "Staging API must have a verified IPv4 address")
    for name in positive_int:
        require(type(config[name]) is int and config[name] > 0, f"Invalid byte cap for {name}")
    require(config["max_api_image_bytes"] <= config["max_ecr_repository_bytes"], "Invalid ECR storage caps")
    require(config["max_release_bytes"] <= 512 * 1024**2 and config["max_api_image_bytes"] <= 512 * 1024**2
            and config["max_ecr_repository_bytes"] <= 2_000_000_000
            and config["max_release_storage_bytes"] <= 2_000_000_000,
            "Storage caps exceed the reviewed cost envelope")
    variables = config["terraform_variables"]
    require(isinstance(variables, dict), "Terraform inputs are missing")
    required = {"api_ami_id", "staging_account_id", "staging_domain", "frontend_certificate_arn"}
    require(required <= set(variables) <= required | {"budget_alert_email", "runtime_permissions_boundary_arn"},
            "Terraform inputs are incomplete or unknown")
    require(variables["staging_account_id"] == ACCOUNT and variables["staging_domain"] == DOMAIN
            and matches(variables["api_ami_id"], r"ami-[0-9a-f]{17}")
            and matches(variables["frontend_certificate_arn"],
                        rf"arn:aws:acm:us-east-1:{ACCOUNT}:certificate/[0-9a-f-]{{36}}"),
            "Terraform inputs are outside the approved staging environment")
    if variables.get("budget_alert_email") is not None:
        require(matches(variables["budget_alert_email"], r"[^@\s]+@[^@\s]+\.[^@\s]+"), "Invalid budget alert email")
    require(variables.get("runtime_permissions_boundary_arn") ==
            f"arn:aws:iam::{ACCOUNT}:policy/examtopics-staging-runtime-boundary",
            "The bootstrap runtime permissions boundary is missing or unapproved")
    monthly, lag, deployment = budget_model(config["cost_model"])
    require(monthly >= 18 and lag >= 1 and deployment >= Decimal(".25"),
            "The cost model omits the reviewed workload or monitoring reserves")


def validated_targets(outputs, config):
    required = set(TARGET_FIELDS) - {"account_id", "region"}
    require(isinstance(outputs, dict) and required <= set(outputs) <= set(TARGET_FIELDS),
            "Terraform outputs are incomplete or unknown")
    for name, output in outputs.items():
        require(isinstance(output, dict) and output.get("sensitive") is False
                and output.get("value") == config[name],
                f"Terraform output {name} does not match the approved staging target")
    return {field: config[field] for field in TARGET_FIELDS}


def protected_values(address, values):
    allowed = WRITABLE_ATTRIBUTES.get(address, set()) | VOLATILE_ATTRIBUTES.get(address, set())
    return {key: value for key, value in values.items() if key not in allowed}


def fingerprint(address, kind, values):
    require(isinstance(values, dict) and isinstance(values.get("id"), str) and values["id"],
            "Terraform resource identity is missing")
    protected = json.dumps(protected_values(address, values), sort_keys=True, separators=(",", ":"), allow_nan=False)
    return {"id": values["id"], "type": kind, "protected_sha256": hashlib.sha256(protected.encode()).hexdigest()}


def inventory(values):
    root = values.get("root_module", {})
    require(isinstance(root, dict) and not root.get("child_modules")
            and isinstance(root.get("resources"), list), "Terraform root inventory is missing or not flat")
    resources = {}
    for item in root["resources"]:
        require(isinstance(item, dict) and item.get("provider_name") == AWS_PROVIDER,
                "Terraform resource provider is outside the approved AWS root")
        if item.get("mode") == "data":
            require(item.get("address") == "data.aws_ami.api" and item.get("type") == "aws_ami",
                    "Terraform data source is outside the approved AWS root")
            continue
        address, kind = item.get("address"), item.get("type")
        require(item.get("mode") == "managed" and kind in MANAGED_TYPES
                and matches(address, re.escape(kind) + r"\.[A-Za-z0-9_-]+(?:\[(?:[0-9]+|\"[A-Za-z0-9_-]+\")\])?")
                and address not in resources, "Terraform resource address or type is outside the approved AWS root")
        resources[address] = fingerprint(address, kind, item.get("values"))
    counts = Counter(item["type"] for item in resources.values())
    require(all(counts[kind] == count for kind, count in COST_COUNTS.items())
            and counts["aws_budgets_budget"] <= 1, "Terraform cost-bearing resource counts changed")
    costs = {kind: counts[kind] for kind in (*COST_COUNTS, "aws_budgets_budget")}
    return {"schema_version": 1, "resources": resources, "cost_counts": costs}


def inventory_from_state(state):
    require(isinstance(state, dict) and matches(state.get("format_version"), r"1\.[0-9]+")
            and isinstance(state.get("values"), dict), "Terraform state is missing or incompatible")
    return inventory(state["values"])


def known(value):
    if isinstance(value, dict):
        return all(known(item) for item in value.values())
    if isinstance(value, list):
        return all(known(item) for item in value)
    return value is False


def review_plan(plan, baseline):
    require(isinstance(plan, dict) and matches(plan.get("format_version"), r"1\.[0-9]+")
            and plan.get("complete") is True and plan.get("errored") is False
            and not any(plan.get(field) for field in ("deferred_changes", "resource_drift", "action_invocations")),
            "Terraform plan is incomplete, contains drift or invokes an unsupported action")
    require(inventory_from_state(plan.get("prior_state")) == baseline
            and isinstance(plan.get("planned_values"), dict) and inventory(plan["planned_values"]) == baseline,
            "Terraform plan changed the protected staging inventory")
    configuration = plan.get("configuration", {})
    providers = configuration.get("provider_config", {})
    require(set(providers) == {"aws"} and providers["aws"].get("full_name") == AWS_PROVIDER
            and not configuration.get("root_module", {}).get("module_calls"),
            "Terraform plan uses an unapproved provider or module")
    changes = plan.get("resource_changes")
    require(isinstance(changes, list), "Terraform resource changes are missing")
    seen = set()
    has_update = False
    for action in changes:
        address, kind, change = action.get("address"), action.get("type"), action.get("change", {})
        require(action.get("provider_name") == AWS_PROVIDER
                and not any(action.get(field) for field in ("deposed", "previous_address"))
                and not any(change.get(field) for field in ("importing", "generated_config", "replace_paths")),
                "Terraform plan contains a resource movement, import or replacement")
        if action.get("mode") == "data":
            require(address == "data.aws_ami.api" and kind == "aws_ami" and change.get("actions") == ["no-op"],
                    "Terraform plan has a deferred or unapproved data read")
            continue
        require(action.get("mode") == "managed" and address in baseline["resources"] and address not in seen
                and change.get("actions") in (["update"], ["no-op"]),
                "Terraform plan contains a new, removed or replaced resource")
        seen.add(address)
        update = change["actions"] == ["update"]
        volatile = VOLATILE_ATTRIBUTES.get(address, set()) if update else set()
        require(isinstance(change.get("after_unknown"), dict)
                and known({k: v for k, v in change["after_unknown"].items() if k not in volatile}),
                "Terraform plan has unknown protected attributes")
        before, after = change.get("before"), change.get("after")
        require(fingerprint(address, kind, before) == baseline["resources"][address]
                and fingerprint(address, kind, after) == baseline["resources"][address],
                "Terraform plan changed a protected resource identity or value")
        if update:
            writable = WRITABLE_ATTRIBUTES.get(address, set())
            require(writable and any(before.get(key) != after.get(key) for key in writable)
                    and all(isinstance(after.get(key), str) for key in writable),
                    "Terraform plan updates a resource outside the approved fields")
            has_update = True
        else:
            require(before == after, "Terraform plan marks a changed resource as a no-op")
    require(seen == set(baseline["resources"]), "Terraform plan omitted an approved resource")
    for change in plan.get("output_changes", {}).values():
        require(change.get("actions") == ["no-op"] and change.get("after_unknown") is False
                and change.get("before") == change.get("after"), "Terraform plan changed an output")
    require(not has_update or plan.get("applyable") is True, "Terraform plan is not applyable")
    return has_update


def review_refresh(plan, baseline):
    require(isinstance(plan, dict) and plan.get("complete") is True and plan.get("errored") is False
            and not any(plan.get(key) for key in ("deferred_changes", "resource_drift", "action_invocations")),
            "The live staging refresh is incomplete or contains drift")
    require(inventory_from_state(plan.get("prior_state")) == baseline
            and inventory(plan.get("planned_values", {})) == baseline,
            "Live staging configuration differs from the approved baseline")
    require(all(change.get("change", {}).get("actions") == ["no-op"] for change in plan.get("resource_changes", [])),
            "The read-only refresh contains an unexpected resource action")
