---
name: fosholhaat-stitch-build-loop
description: Use when iteratively generating FosholHaat Stitch screens through a controlled loop that starts from approved exploration, updates the project Stitch docs, and prevents duplicate or uncontrolled full-app generation.
---

# FosholHaat Stitch Build Loop

This is a FosholHaat-specific fork of a generic Stitch loop pattern.

Read these files first:

1. `/home/god_himself_wsl/FosholHaat-CSE299/CLAUDE.md`
2. `/home/god_himself_wsl/FosholHaat-CSE299/docs/stitch/README.md`
3. `/home/god_himself_wsl/FosholHaat-CSE299/docs/stitch/01-style-exploration.md`
4. `/home/god_himself_wsl/FosholHaat-CSE299/docs/design-system.md`

Use this skill when:

- generating the next approved Stitch screen for FosholHaat
- moving from style exploration into canonical generation
- maintaining a structured design-generation loop

Rules:

- do not generate the whole app in one pass
- do not treat exploration screens as final
- generate one canonical screen per flow
- delete duplicates after approval
- keep Stitch work aligned with project docs
- do not stop the loop at first-pass output if visible redundancy or hierarchy problems remain

Loop:

1. confirm the phase: exploration or canonical generation
2. if exploration is not complete, use exploration prompts only
3. if a direction is approved, generate only the next requested screen
4. run visual inspection for duplicate actions, dead space, filler, drift, weak hierarchy, boxy geometry, and clipping
5. regenerate if the candidate fails lock-quality review
6. update local docs or metadata if workflow state changes
7. define the next allowed screen or stop
