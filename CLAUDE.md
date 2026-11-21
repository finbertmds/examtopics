# Claude Code adapter

@AGENTS.md

`AGENTS.md` is the canonical source for shared project policy, safety, architecture, scoped rules, review roles and working practices. Follow it for every task. If instructions disagree, follow the stricter safety rule and report the conflict.

## Claude-specific configuration

- `.claude/settings.json` supplies Claude permission deny/ask rules. They supplement the shared policy; the deny list is not complete and does not authorize commands it misses.
- `.claude/rules/` contains the shared scoped rules and loads automatically for matching paths in Claude. Codex reads these same files through the scope table in `AGENTS.md`.
- `.claude/agents/` contains Claude role metadata and shared reviewer instructions. Codex adapters read the same instruction bodies; names are mapped in `AGENTS.md`.
- `.claude/skills/release-readiness/` contains the shared release checklist, also discoverable by Codex through `.agents/skills/`.
- Keep Claude tool/model metadata here or in `.claude/`; put project-wide behavior in the shared sources. Do not assume Claude permissions configure Codex permissions.
