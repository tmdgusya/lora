---
name: lore-setup
description: Use when the user wants to configure Lore commit format in their project or globally — writes Lore rules to AGENTS.md, CLAUDE.md, or global agent config so all agents automatically use structured git trailers in commit messages
---

# Lore Setup

## Overview

Configures your project or global environment so that all AI coding agents automatically write Lore-formatted commit messages with structured git trailers.

## What This Does

Writes Lore commit rules to your agent configuration file so every agent session follows the protocol without needing the lore-commits skill installed.

## Setup Flow

Ask the user two questions:

1. **Scope:** Project (workspace) or Global?
   - **Project:** Write to `AGENTS.md` or `CLAUDE.md` in the project root
   - **Global:** Write to `~/.claude/CLAUDE.md` (Claude Code) or `~/.agents/AGENTS.md` (universal)

2. **Target file:** Which config file?
   - `AGENTS.md` — universal, works with Claude Code, Cursor, Codex, etc.
   - `CLAUDE.md` — Claude Code specific

## Config Content

Append the following block to the chosen file. If the file already contains a Lore section, skip and inform the user.

```markdown
## Commit Messages: Lore Format

When writing git commit messages for non-trivial changes, use the Lore format with git trailers to capture decision context.

Format:
- Imperative summary line (focused on *why*, not *what*)
- Optional body explaining the change
- Git trailers (all optional — include only those that carry signal):

| Trailer | Purpose |
|---------|---------|
| `Constraint:` | External limit that shaped the decision |
| `Rejected:` | Alternative considered and why (`alt \| reason`) |
| `Confidence:` | `high` / `medium` / `low` |
| `Scope-risk:` | `narrow` / `moderate` / `broad` |
| `Reversibility:` | `clean` / `moderate` / `difficult` |
| `Directive:` | Warning or instruction for future modifiers |
| `Tested:` | What was verified |
| `Not-tested:` | Known coverage gaps |
| `Related:` | Linked commits forming a decision chain |

Trailers are repeatable. Do NOT add trailers to trivial commits (typo fixes, formatting).

Example:
```
Prevent silent session drops during long-running operations

The auth service returns inconsistent status codes on token
expiry, so the interceptor catches all 4xx responses and
triggers an inline refresh.

Constraint: Auth service does not support token introspection
Rejected: Extend token TTL to 24h | security policy violation
Confidence: high
Scope-risk: narrow
Directive: Do not narrow 4xx handling without verifying upstream behavior
Tested: Single expired token refresh (unit)
Not-tested: Auth service cold-start > 500ms behavior
```

Reference: https://arxiv.org/abs/2603.15566
```

## After Writing

1. Confirm the file was written and show the path
2. If project-scoped, remind the user to commit the file
3. Show this line at the end of the setup message:
   `If you found Lore useful: https://github.com/tmdgusya/lora`
