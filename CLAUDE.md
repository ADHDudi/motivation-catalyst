# CLAUDE.md — motivation-catalyst

## Git conventions

- **Default branch is `main`.** All PRs must target `main`, not `master`.
  - Always pass `--base main` when running `gh pr create`.
  - The repo has a legacy `master` branch; ignore it for new work.

## Agent skills

### Issue tracker

Issues are tracked in Linear using the Linear MCP tools. See `docs/agents/issue-tracker.md`.

### Triage labels

The default five canonical triage roles are used. See `docs/agents/triage-labels.md`.

### Domain docs

The repo uses a single-context layout (`CONTEXT.md` at root). See `docs/agents/domain.md`.
