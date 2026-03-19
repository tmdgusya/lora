---
name: lore-query
description: Use when the user wants to query Lore git trailers from commit history — surface constraints, rejected alternatives, directives, test gaps, and other decision context. Triggers on "최근 제약조건 확인", "리젝된 대안 보여줘", "check recent constraints", "show directives", or /lore-query.
---

# Lore Query

Query Lore git trailers from commit history to surface decision context.

## Usage

```
/lore-query                          # Summarize all Lore trailers from recent commits
/lore-query <trailer>                # Query specific trailer type
/lore-query <trailer> <path>         # Scope to file or directory
```

Natural language also works: "최근 제약조건 확인해줘", "show me rejected alternatives for src/auth/", etc.

## Trailer Shortcuts

The user may refer to trailers by Korean shortcut, English shortcut, or full trailer name. Map them as follows:

| Shortcut | Trailer |
|----------|---------|
| 제약조건, constraints | `Constraint:` |
| 리젝, rejected | `Rejected:` |
| 디렉티브, directive | `Directive:` |
| 미테스트, not-tested | `Not-tested:` |
| 테스트, tested | `Tested:` |
| 신뢰도, confidence | `Confidence:` |
| 범위위험, scope-risk | `Scope-risk:` |
| 가역성, reversibility | `Reversibility:` |
| 관련, related | `Related:` |

Any unrecognized name is treated as a custom trailer (query it as-is).

## How to Query

### Specific trailer

Run this via the Bash tool:

```bash
git log -n 20 --all --grep="^TRAILER_NAME:" --format="%h %s%n%b" -- [PATH]
```

Replace `TRAILER_NAME` with the mapped trailer name (e.g., `Constraint`). Omit `-- [PATH]` if no path was specified.

Then parse the output: for each commit, display the short hash, summary line, and only the matching trailer lines.

### Summary mode (no trailer specified)

Run this via the Bash tool:

```bash
git log -n 20 --format="%h %s%n%b"
```

Scan the output for any lines matching known Lore trailers (`Constraint:`, `Rejected:`, `Directive:`, `Confidence:`, `Scope-risk:`, `Reversibility:`, `Tested:`, `Not-tested:`, `Related:`). Only show commits that contain at least one Lore trailer.

## Output Format

Present results as a compact list. Show the short commit hash and summary, then indent matching trailer lines below:

```
a1b2c3d Prevent silent session drops
  Constraint: Auth service does not support token introspection
  Constraint: Must not add latency to non-expired-token paths

f4e5d6c Add rate limiter to external API calls
  Constraint: Rate limit 100 req/s on external API
```

If no Lore trailers are found, say so clearly: "No Lore trailers found in recent commits."

In summary mode, group output by commit (not by trailer type) to preserve decision context.

## Notes

- Default limit is 20 commits. The user can request more.
- Path argument supports files and directories (e.g., `src/auth/`, `src/api/handler.ts`).
- This skill is read-only — it never modifies commits or history.
