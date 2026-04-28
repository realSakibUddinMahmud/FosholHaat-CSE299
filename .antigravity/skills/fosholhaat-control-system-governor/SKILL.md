---
name: fosholhaat-control-system-governor
description: Use when building, updating, auditing, or enforcing FosholHaat's implementation control system, including phase gates, implementation transition, agent-team orchestration, ambiguity policy, verification doctrine, and control-related skills or automation.
---

# FosholHaat Control System Governor

Claude Code mirror of the canonical repo skill at:

- `/home/god_himself_wsl/FosholHaat-CSE299/.agents/skills/fosholhaat-control-system-governor/SKILL.md`

Use this skill when the task affects how FosholHaat is governed during implementation.

Read these files first:

1. `/home/god_himself_wsl/FosholHaat-CSE299/CLAUDE.md`
2. `/home/god_himself_wsl/FosholHaat-CSE299/docs/master-spec.md`
3. `/home/god_himself_wsl/FosholHaat-CSE299/docs/mvp-scope.md`
4. `/home/god_himself_wsl/FosholHaat-CSE299/docs/architecture.md`
5. `/home/god_himself_wsl/FosholHaat-CSE299/docs/design-system.md`
6. `/home/god_himself_wsl/FosholHaat-CSE299/docs/agent-rules.md`
7. `/home/god_himself_wsl/FosholHaat-CSE299/docs/implementation-control-system.md`
8. `/home/god_himself_wsl/FosholHaat-CSE299/docs/implementation-transition.md`
9. `/home/god_himself_wsl/FosholHaat-CSE299/docs/agent-team-orchestration.md`
10. `/home/god_himself_wsl/FosholHaat-CSE299/docs/ambiguity-escalation-policy.md`
11. `/home/god_himself_wsl/FosholHaat-CSE299/docs/frontend-implementation-doctrine.md`
12. `/home/god_himself_wsl/FosholHaat-CSE299/docs/implementation-control-system-sources.md`

Workflow:

1. restate the control surface being changed
2. identify whether the change affects law, transition, orchestration, ambiguity, frontend doctrine, or skill governance
3. convert repeated implementation failures into explicit anti-repeat policy
4. update project docs first
5. update related skills, commands, settings, or automation second
6. update discoverability files if the workflow changed
7. verify that no lower-level tool or skill now conflicts with the docs
8. if a control-critical planned skill is missing, add the canonical `.agents` skill and refresh the `.claude` mirror in the same change

Hard rules:

- project docs are the system of record
- generic orchestration helpers are advisory, not law
- no broad implementation path may bypass slice packs or contract freeze
- no raw AI Studio output is trusted without normalization against project law
- no new control rule is valid until it is placed in the relevant doc
- use `.claude/agents/`, `.claude/skills/`, and `.claude/settings.json` only as enforcement or discovery layers, not as replacements for project law
