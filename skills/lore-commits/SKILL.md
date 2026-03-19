---
name: lore-commits
description: Use when writing git commit messages for non-trivial changes — captures decision context (constraints, rejected alternatives, confidence, directives) as structured git trailers so future agents and developers can query project knowledge via git log --trailer=
---

# Lore Commits

## Overview

Every commit destroys decision context. You considered alternatives, evaluated tradeoffs, and chose one approach — but only the final diff survives. **Lore** reclaims this lost knowledge by encoding it as **git trailers** in commit messages.

**Core principle:** A commit is not a label for a diff — it's an atomic unit of institutional knowledge. Use git's native trailer format so decisions are machine-queryable, not buried in prose.

## When to Use

- Any commit where you made non-obvious decisions
- When you rejected alternative approaches
- When external constraints shaped your implementation
- When future modifiers need warnings about fragile assumptions
- When test coverage has known gaps

**When NOT to use:** Trivial changes (typo fixes, formatting) where no real decisions were made.

## The Format

```
<imperative summary line>

<optional body explaining the change>

Constraint: <external constraint that shaped this decision>
Rejected: <alternative> | <reason it was rejected>
Confidence: <high | medium | low>
Scope-risk: <narrow | moderate | broad>
Reversibility: <clean | moderate | difficult>
Directive: <warning or instruction for future modifiers>
Tested: <what was verified>
Not-tested: <known coverage gaps>
Related: <commit hash or description of related commit>
```

**All trailers are optional.** Include only those that carry signal for this specific commit.

## Trailer Vocabulary

| Trailer | Purpose | Example |
|---------|---------|---------|
| `Constraint:` | External limit that shaped the decision | `Auth service does not support token introspection` |
| `Rejected:` | Alternative considered and why it was dropped. Use `|` to separate alternative from reason | `Extend token TTL to 24h | security policy violation` |
| `Confidence:` | How sure you are this is right: `high`, `medium`, `low` | `high` |
| `Scope-risk:` | Blast radius: `narrow`, `moderate`, `broad` | `narrow` |
| `Reversibility:` | How easy to undo: `clean`, `moderate`, `difficult` | `clean` |
| `Directive:` | Warning to future modifiers — what NOT to do or what to check first | `Do not narrow 4xx handling without verifying upstream behavior` |
| `Tested:` | What was verified and how | `Single expired token refresh (unit)` |
| `Not-tested:` | Known gaps in verification | `Auth service cold-start > 500ms behavior` |
| `Related:` | Linked commits forming a decision chain | `abc1234 (initial auth interceptor)` |

You can **repeat** trailers (multiple `Constraint:`, multiple `Rejected:`, etc.).

You can **extend** the vocabulary with custom trailers when needed (e.g., `Deadline:`, `Stakeholder:`, `Migration:`).

## Complete Example

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

## Why Git Trailers (Not Prose)

Agents naturally capture decision context as prose paragraphs. The problem: **prose is not queryable**.

Git trailers are a native git feature. Queryable with standard git tools:

```bash
# Query all constraints affecting a file
git log --all --grep="^Constraint:" -- path/to/file.ts

# Find all rejected approaches
git log --all --grep="^Rejected:" -- path/to/file.ts

# Find directives (warnings for future modifiers)
git log --all --grep="^Directive:" -- path/to/file.ts

# Check what's not tested
git log --all --grep="^Not-tested:" -- path/to/file.ts
```

This turns your git history into a **queryable decision database** at zero infrastructure cost.

## Agent Workflow

When modifying code, before committing:

1. **Harvest context** — What constraints did you face? What alternatives did you reject?
2. **Write the summary line** — Imperative, focused on *why* not *what*
3. **Add body** if the *how* needs explanation
4. **Append trailers** — One per decision fact. Only include trailers that carry signal.
5. **Self-check** — Would a future agent modifying this code benefit from knowing this?

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Writing trailers as prose paragraphs | Use `Key: value` format on separate lines |
| Putting trailers before the body | Trailers must come after the body, separated by a blank line |
| Omitting the reason in `Rejected:` | Always use `alternative | reason` format |
| Adding trailers to trivial commits | Only add when real decisions were made |
| Duplicating diff content in trailers | Trailers capture what's NOT in the diff — the why, not the what |
| Using `Confidence: yes` | Use the scale: `high`, `medium`, `low` |
