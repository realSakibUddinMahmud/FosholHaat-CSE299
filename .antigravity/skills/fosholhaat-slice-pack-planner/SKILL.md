---
name: fosholhaat-slice-pack-planner
description: Use when FosholHaat needs to turn the frozen foundation into a prioritized slice backlog and implementation-ready slice packs, including spec, API contract, UI contract, test plan, screen map, dependency notes, and parallelization readiness.
---

# FosholHaat Slice Pack Planner

Claude Code mirror of the canonical repo skill at:

- `/home/god_himself_wsl/FosholHaat-CSE299/.agents/skills/fosholhaat-slice-pack-planner/SKILL.md`

Use this skill for slice-lane planning only.

Read these files first:

1. `/home/god_himself_wsl/FosholHaat-CSE299/CLAUDE.md`
2. `/home/god_himself_wsl/FosholHaat-CSE299/docs/master-spec.md`
3. `/home/god_himself_wsl/FosholHaat-CSE299/docs/mvp-scope.md`
4. `/home/god_himself_wsl/FosholHaat-CSE299/docs/architecture.md`
5. `/home/god_himself_wsl/FosholHaat-CSE299/docs/agent-rules.md`
6. `/home/god_himself_wsl/FosholHaat-CSE299/docs/implementation-control-system.md`
7. `/home/god_himself_wsl/FosholHaat-CSE299/docs/implementation-transition.md`
8. `/home/god_himself_wsl/FosholHaat-CSE299/docs/agent-team-orchestration.md`
9. `/home/god_himself_wsl/FosholHaat-CSE299/docs/ambiguity-escalation-policy.md`
10. `/home/god_himself_wsl/FosholHaat-CSE299/docs/foundation/agent-handoff-contract.md`
11. `/home/god_himself_wsl/FosholHaat-CSE299/DESIGN.md`
12. `/home/god_himself_wsl/FosholHaat-CSE299/docs/foundation/shared-component-baseline.md`
13. `/home/god_himself_wsl/FosholHaat-CSE299/docs/foundation/feature-route-taxonomy.md`
14. `/home/god_himself_wsl/FosholHaat-CSE299/docs/slices/README.md`

Workflow:

1. confirm the task belongs in the slice lane, not the foundation lane
2. generate or refresh the slice backlog under `docs/slices/`
3. define slice boundary, dependency notes, screen coverage matrix, downstream route classification, platform readiness, and parallelization readiness
4. create the standard five-file slice pack for approved or pre-approved slices
5. mark whether each slice is planning only, approved for contract freeze, or ready for implementation orchestration
6. route unresolved shared-component, route, token, or role-law gaps back to foundation

Hard rules:

- do not auto-approve product scope changes
- do not start implementation inside this skill
- do not silently assume cross-platform parity for mobile-only slices
- do not invent DTO fields or route states outside explicit contracts
- keep slices vertically bounded and small enough for controlled parallel execution
- record plain-language review expectations when the slice changes trust-critical copy
- record runtime hygiene checks when local shared packages or SSR/client surfaces are involved
