# Finish Functional MVP

Use this in a new Codex thread:

```text
Use `.codex/agents/functional-mvp-finisher.md`.
Complete FosholHaat to a functional deployment-ready MVP from the current branch.
Use autonomous subagents where useful, but keep shared auth/schema/deployment single-owner.
Do not stop unless blocked by missing external credentials, destructive DB risk, or a scope decision.
```

Minimum final evidence required:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
git status --short --branch
```

