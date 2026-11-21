# Shared Claude Code and Codex configuration

Both tools use the root `AGENTS.md` as shared project policy. `CLAUDE.md` imports it; Codex reads it as repository instructions. This covers local-only work, production approval, secrets, architecture, tests and working practices.

## Sources and adapters

| Content | Source | Consumers |
|---|---|---|
| Project policy and scope map | `AGENTS.md` | Claude import and Codex repository instructions |
| Scoped project rules | `.claude/rules/*.md` | Claude path loading; explicit Codex reads required by AGENTS.md |
| Four reviewer roles | `.claude/agents/*.md` | Claude agents; `.codex/agents/*.toml` instruct Codex to read the same body |
| Release checklist | `.claude/skills/release-readiness/SKILL.md` | Claude skills; `.agents/skills/release-readiness` symlink for Codex |
| Backend security implementer | `.codex/agents/security_engineer.toml` | Codex implementation role, separate from reviewers |
| Runtime permissions | `.claude/settings.json`; Codex host sandbox/approval settings | Each tool separately |

The role table in `AGENTS.md` maps hyphenated Claude names to underscored Codex names. Adapters deliberately do not copy Claude model, effort, color, maxTurns or tool metadata into Codex. Shared role limits apply regardless of the available runtime tools.

## Updating guidance

1. Edit shared policy in `AGENTS.md`, scoped rules in `.claude/rules/`, reviewer bodies in `.claude/agents/`, and the release checklist at its original path.
2. Keep Claude-specific settings in `.claude/`. Keep Codex-specific configuration in `.codex/`. If a role or path changes, update both adapters and the table in `AGENTS.md` together.
3. Verify that all four Codex reviewer adapters point to existing Claude role files, that TOML/JSON parse, and that the skill symlink resolves to the original checklist. Review `git diff --check` and the complete configuration diff.
4. Start a fresh chat/session in each tool after changing configuration. Verify role and skill availability there; parsing files alone does not prove a running session reloaded them.

There is no generated second copy to synchronize. Editing a shared rule, reviewer body or checklist changes the source read by both tools. Do not replace the skill symlink with a copied directory.

## Runtime limits

Markdown instructions are behavioral policy, not a command firewall. Claude deny/ask rules do not configure Codex permissions. Codex sandboxing and approval controls remain managed by its host; these project adapters do not weaken them or grant network/cloud access. Read-only reviewer instructions must still be honored when the host offers write-capable tools.

Equal guidance and quality gates improve consistency; they cannot guarantee identical model output. Verify applicable tests and independent review in either tool. Configuration availability depends on the installed runtime; when an agent cannot be delegated, report that limitation and perform its checklist as directed by `AGENTS.md`.

This configuration work does not deploy, access AWS, modify production, or authorize future external operations.
