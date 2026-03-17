# Lore

Git commit messages as a structured knowledge protocol for AI coding agents.

Based on the paper ["Lore: Repurposing Git Commit Messages as a Structured Knowledge Protocol for AI Coding Agents"](https://arxiv.org/abs/2603.15566) by Ivan Stetsenko (2026).

## Problem: Decision Shadow

Every commit destroys decision context. Developers and AI agents consider alternatives, evaluate tradeoffs, and choose one approach — but only the final diff survives. The constraints, rejected alternatives, confidence levels, and warnings to future modifiers all evaporate.

This lost context is the **Decision Shadow**. Individually small, but accumulated it creates what the industry calls "legacy code" — code that works but whose structural rationale has been lost.

## Solution: Lore Atoms

Lore turns each commit into an **atomic unit of institutional knowledge** by encoding decision context as **git trailers** — a native git feature that requires no custom tooling.

```
Prevent silent session drops during long-running operations

The auth service returns inconsistent status codes on token
expiry, so the interceptor catches all 4xx responses and
triggers an inline refresh.

Constraint: Auth service does not support token introspection
Constraint: Must not add latency to non-expired-token paths
Rejected: Extend token TTL to 24h | security policy violation
Rejected: Background refresh on timer | race condition
Confidence: high
Scope-risk: narrow
Reversibility: clean
Directive: Error handling is intentionally broad (all 4xx)
  -- do not narrow without verifying upstream behavior
Tested: Single expired token refresh (unit)
Not-tested: Auth service cold-start > 500ms behavior
```

## Trailer Vocabulary

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

All trailers are optional and repeatable. Extend with custom trailers as needed.

## Querying

Git trailers are natively queryable:

```bash
git log --trailer="Constraint" -- path/to/file.ts
git log --trailer="Rejected" -- path/to/file.ts
git log --trailer="Directive" -- path/to/file.ts
```

Zero infrastructure. Your git history becomes a queryable decision database.

## Install

```bash
npx skills add tmdgusya/lora
```

This installs a [Claude Code](https://claude.ai/download) skill that teaches AI agents to write Lore-formatted commit messages. Works with any agent that supports the [skills](https://github.com/vercel-labs/skills) ecosystem.

Global install (available across all projects):
```bash
npx skills add tmdgusya/lora -g
```

## Key Properties

- **Atomic binding** — knowledge fused permanently with code changes
- **Temporal immutability** — append-only log, once committed it persists forever
- **Universal availability** — every git project already has this channel
- **Natural granularity** — commits are already scoped to logical work units
- **Graceful degradation** — worst case is identical to current practice

## License

MIT
