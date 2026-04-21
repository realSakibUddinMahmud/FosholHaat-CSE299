---
name: fosholhaat-foundation-baseline-builder
description: Use when FosholHaat needs to build or refresh the foundation lane from approved Stitch screens, including the screen worklist, Stitch artifact manifest, per-screen design profiles, root DESIGN.md, packages/tokens, shared-component baseline, and feature/route taxonomy.
---

# FosholHaat Foundation Baseline Builder

Claude Code mirror of the canonical repo skill at:

- `/home/god_himself_wsl/FosholHaat-CSE299/.agents/skills/fosholhaat-foundation-baseline-builder/SKILL.md`

Use this skill for foundation-lane work only.

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
10. `/home/god_himself_wsl/FosholHaat-CSE299/docs/implementation-control-system-sources.md`
11. `/home/god_himself_wsl/FosholHaat-CSE299/docs/stitch/41-artifact-handoff-doctrine.md`
12. `/home/god_himself_wsl/FosholHaat-CSE299/docs/stitch/10-canonical-token-sheet.md`
13. `/home/god_himself_wsl/FosholHaat-CSE299/docs/stitch/08-component-inventory.md`

Workflow:

1. run the foundation helper from `.agents/skills/fosholhaat-foundation-baseline-builder/scripts/build_foundation_baseline.py`
2. refresh `docs/foundation/stitch-capture.json` from approved Stitch metadata when the approved set changes
3. ingest the capture file into the artifact manifest
4. hydrate artifacts when HTML URLs exist
5. synthesize `DESIGN.md`, `packages/tokens/`, `docs/foundation/shared-component-baseline.md`, `docs/foundation/feature-route-taxonomy.md`, and `docs/foundation/screens/`
6. review generated outputs and record any canonical drift

Hard rules:

- foundation work uses approved screens only
- exploratory or rejected screens must never enter the baseline
- route and feature taxonomy must stay inside MVP scope
- do not hand-edit generated foundation artifacts quietly
- do not rewrite slice packs while doing foundation-lane work

