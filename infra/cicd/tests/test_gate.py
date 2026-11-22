import copy
import unittest
from datetime import datetime, timezone
from decimal import Decimal

from infra.cicd import gate


ACCOUNT = "450114866570"
SHA = "a" * 40
REPO = {"id": 1035462381, "full_name": "finbertmds/examtopics", "owner": {"id": 78}}
NOW = datetime(2026, 6, 16, 12, tzinfo=timezone.utc)
COST = {"monthly_usd": "14", "metering_lag_reserve_usd": "1", "deployment_reserve_usd": ".25"}


def merged_event():
    return {
        "action": "closed",
        "repository": copy.deepcopy(REPO),
        "pull_request": {
            "merged": True, "merge_commit_sha": SHA, "merged_by": {"id": 78},
            "head": {"ref": "develop", "repo": copy.deepcopy(REPO)},
            "base": {"ref": "staging", "repo": copy.deepcopy(REPO), "sha": "b" * 40},
        },
    }


def billing():
    return (
        {"accountId": ACCOUNT, "accountPlanStatus": "ACTIVE", "accountPlanType": "FREE",
         "accountPlanExpirationDate": "2026-12-01T00:00:00Z",
         "accountPlanRemainingCredits": {"amount": 20, "unit": "USD"}},
        {"ResultsByTime": [{
            "TimePeriod": {"Start": "2026-06-01", "End": "2026-06-17"},
            "Estimated": True, "Groups": [],
            "Total": {"UnblendedCost": {"Amount": "11.75", "Unit": "USD"}},
        }], "GroupDefinitions": [], "DimensionValueAttributes": []},
    )


def resource(kind, name, values):
    return {"address": f"{kind}.{name}", "type": kind, "mode": "managed",
            "name": name, "provider_name": "registry.terraform.io/hashicorp/aws", "values": values}


def state_and_plan():
    resources = [
        resource("aws_instance", "api", {"id": "i-123", "instance_type": "t3.micro"}),
        resource("aws_eip", "api", {"id": "eipalloc-123", "domain": "vpc"}),
        resource("aws_s3_bucket", "frontend", {"id": "bucket-123", "force_destroy": False}),
        resource("aws_cloudfront_distribution", "frontend", {"id": "E123", "price_class": "PriceClass_100"}),
        resource("aws_cloudfront_function", "frontend_route", {"id": "fn-123", "code": "function handler() {}", "etag": "old"}),
        resource("aws_ecr_repository", "api", {"id": "repo-123", "image_tag_mutability": "IMMUTABLE"}),
        resource("aws_secretsmanager_secret", "api_environment", {"id": "secret-123", "recovery_window_in_days": 7}),
        resource("aws_cloudwatch_metric_alarm", "api_status", {"id": "alarm-123", "evaluation_periods": 2}),
        resource("aws_iam_role_policy", "api_runtime", {"id": "role:policy", "policy": "one scoped action"}),
    ]
    state = {"format_version": "1.0", "values": {"root_module": {"resources": resources}, "outputs": {}}}
    plan = {
        "format_version": "1.2", "applyable": True, "complete": True, "errored": False,
        "resource_changes": [
            {**{k: v for k, v in item.items() if k != "values"},
             "change": {"actions": ["no-op"], "before": copy.deepcopy(item["values"]),
                        "after": copy.deepcopy(item["values"]), "after_unknown": {}}}
            for item in resources
        ],
        "prior_state": copy.deepcopy(state),
        "planned_values": copy.deepcopy(state["values"]),
        "configuration": {"provider_config": {
            "aws": {"full_name": "registry.terraform.io/hashicorp/aws"},
        }, "root_module": {}},
    }
    return state, plan


class MergeTests(unittest.TestCase):
    def test_rename_out_of_application_still_requires_deployment_checks(self):
        paths = gate.pull_request_paths([[{"filename": "docs/Dockerfile", "previous_filename": "examtopics-backend/Dockerfile"}]])
        self.assertTrue(gate.deployment_paths_changed(paths))

    def test_owner_merge_must_bind_same_repo_and_exact_staging_commit(self):
        event = merged_event()
        self.assertTrue(gate.eligible_merge(event, SHA, "refs/heads/staging"))
        cases = [
            ("action", "opened"), ("head.ref", "feature"), ("head.repo.id", 334),
            ("base.repo.full_name", "someone/examtopics"), ("base.ref", "master"),
            ("merged", False), ("merged_by.id", 77), ("merge_commit_sha", "b" * 40),
        ]
        for path, bad in cases:
            with self.subTest(path=path):
                event = merged_event()
                target = event if path == "action" else event["pull_request"]
                *parents, key = path.split(".")
                for part in parents:
                    target = target[part]
                target[key] = bad
                self.assertFalse(gate.eligible_merge(event, SHA, "refs/heads/staging"))
        self.assertFalse(gate.eligible_merge(merged_event(), SHA, "refs/heads/master"))

    def test_classifies_only_changes_to_staging_root_and_release_sources(self):
        cases = [
            (["docs/migration/aws-staging.md"], (False, False)),
            (["infra/terraform/bootstrap/main.tf"], (False, False)),
            (["examtopics-backend/services/auth.js"], (False, True)),
            (["infra/terraform/staging/frontend.tf"], (True, False)),
            (["infra/terraform/staging/frontend-route.js", "examtopics-practice/src/App.tsx"], (True, True)),
        ]
        for paths, expected in cases:
            with self.subTest(paths=paths):
                self.assertEqual(gate.classify_paths(paths), expected)


class BudgetTests(unittest.TestCase):
    def test_projected_cost_reserves_today_and_returns_exact_decimals(self):
        plan, costs = billing()
        self.assertEqual(gate.check_budget(plan, costs, COST, NOW),
                         (Decimal("20"), Decimal("11.75"), Decimal("20.00")))

    def test_blocks_paid_expired_unknown_and_insufficient_credits(self):
        changes = [
            {"accountPlanType": "PAID"}, {"accountPlanStatus": "NOT_STARTED"},
            {"accountId": "000000000000"}, {"accountPlanExpirationDate": "2026-06-16T12:00:00Z"},
            {"accountPlanExpirationDate": "2026-06-16"}, {"accountPlanRemainingCredits": {}},
            {"accountPlanRemainingCredits": {"amount": "19.99", "unit": "USD"}},
            {"accountPlanRemainingCredits": {"amount": "NaN", "unit": "USD"}},
        ]
        for change in changes:
            with self.subTest(change=change):
                plan, costs = billing()
                plan.update(change)
                with self.assertRaises(gate.GateError):
                    gate.check_budget(plan, costs, COST, NOW)

    def test_blocks_unknown_or_overspent_cost(self):
        for amount in ("11.750001", "Infinity", "-.2", "unknown"):
            with self.subTest(amount=amount):
                plan, costs = billing()
                costs["ResultsByTime"][0]["Total"]["UnblendedCost"]["Amount"] = amount
                with self.assertRaises(gate.GateError):
                    gate.check_budget(plan, costs, COST, NOW)
        plan, costs = billing()
        costs["ResultsByTime"][0]["TimePeriod"]["End"] = "2026-06-15"
        with self.assertRaises(gate.GateError):
            gate.check_budget(plan, costs, COST, NOW)


class TerraformGateTests(unittest.TestCase):
    def test_app_only_live_refresh_blocks_drift_without_an_apply(self):
        state, plan = state_and_plan()
        baseline = gate.inventory_from_state(state)
        gate.review_refresh(plan, baseline)
        plan["resource_drift"] = [plan["resource_changes"][0]]
        with self.assertRaises(gate.GateError):
            gate.review_refresh(plan, baseline)
        plan["resource_drift"] = []
        plan["planned_values"]["root_module"]["resources"][0]["values"]["instance_type"] = "t3.large"
        with self.assertRaises(gate.GateError):
            gate.review_refresh(plan, baseline)
    def test_allows_only_proven_in_place_cloudfront_function_code_update(self):
        state, plan = state_and_plan()
        baseline = gate.inventory_from_state(state)
        self.assertEqual(baseline["resources"]["aws_instance.api"]["id"], "i-123")
        self.assertEqual(baseline["cost_counts"]["aws_instance"], 1)
        self.assertNotIn("one scoped action", repr(baseline))
        self.assertFalse(gate.review_plan(plan, baseline))
        change = plan["resource_changes"][4]["change"]
        change["actions"] = ["update"]
        change["after"] = {"id": "fn-123", "code": "function handler() { return 1 }"}
        change["after_unknown"] = {"etag": True}
        plan["planned_values"]["root_module"]["resources"][4]["values"] = copy.deepcopy(change["after"])
        self.assertTrue(gate.review_plan(plan, baseline))
        change["after_unknown"]["code"] = True
        with self.assertRaises(gate.GateError):
            gate.review_plan(plan, baseline)

    def test_rejects_resource_creation_deletion_replacement_movement_or_import(self):
        state, plan = state_and_plan()
        baseline = gate.inventory_from_state(state)
        for changes in (
            {"change": {"actions": ["create"]}}, {"change": {"actions": ["delete"]}},
            {"change": {"actions": ["delete", "create"]}}, {"previous_address": "aws_instance.other"},
            {"address": "aws_instance.extra"},
        ):
            with self.subTest(changes=changes):
                other = copy.deepcopy(plan)
                other["resource_changes"][0].update(changes)
                with self.assertRaises(gate.GateError):
                    gate.review_plan(other, baseline)
        plan["resource_changes"][0]["change"]["importing"] = {"id": "i-123"}
        with self.assertRaises(gate.GateError):
            gate.review_plan(plan, baseline)

    def test_rejects_security_cost_and_identity_changes_even_when_resource_count_matches(self):
        state, plan = state_and_plan()
        baseline = gate.inventory_from_state(state)
        for index, field, value in (
            (0, "instance_type", "m7i.48xlarge"), (0, "id", "i-other"),
            (2, "force_destroy", True), (3, "price_class", "PriceClass_All"),
            (4, "runtime", "another-runtime"), (8, "policy", "everything"),
        ):
            with self.subTest(field=field):
                altered = copy.deepcopy(plan)
                change = altered["resource_changes"][index]["change"]
                change["actions"] = ["update"]
                change["after"][field] = value
                altered["planned_values"]["root_module"]["resources"][index]["values"][field] = value
                with self.assertRaises(gate.GateError):
                    gate.review_plan(altered, baseline)

    def test_rejects_empty_state_drift_and_incomplete_plan(self):
        state, plan = state_and_plan()
        baseline = gate.inventory_from_state(state)
        with self.assertRaises(gate.GateError):
            gate.inventory_from_state({"format_version": "1.0", "values": {"root_module": {"resources": []}}})
        for changes in (
            {"resource_drift": [plan["resource_changes"][0]]}, {"complete": False},
            {"deferred_changes": [{}]}, {"action_invocations": [{}]},
            {"planned_values": {"root_module": {"resources": []}}},
        ):
            with self.subTest(changes=changes):
                other = {**plan, **changes}
                with self.assertRaises(gate.GateError):
                    gate.review_plan(other, baseline)
