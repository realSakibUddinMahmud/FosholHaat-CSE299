---
name: fosholhaat-design-orchestration
description: Use when a FosholHaat feature or screen family must move through exploration, review, approval, and implementation readiness in the correct order so coding does not start from unvalidated design output.
---

# FosholHaat Design Orchestration

This is a FosholHaat-specific fork of a generic design-orchestration pattern.

Read these files first:

1. `/home/god_himself_wsl/FosholHaat-CSE299/CLAUDE.md`
2. `/home/god_himself_wsl/FosholHaat-CSE299/docs/design-system.md`
3. `/home/god_himself_wsl/FosholHaat-CSE299/docs/agent-rules.md`
4. `/home/god_himself_wsl/FosholHaat-CSE299/docs/stitch/README.md`

Use this skill when:

- a new screen family is being planned
- a design decision affects multiple roles or platforms
- implementation is being requested before design approval exists

Required order:

1. define the design objective
2. run exploration if no approved direction exists
3. review against the FosholHaat checklist
4. run visual validation for redundancy, dead space, filler, and shell-boundary mistakes
5. approve one canonical direction
6. create implementation-ready design guidance
7. only then allow downstream coding or screen-family prompting

Block progress if:

- multiple conflicting design variants remain active
- the direction is not approved
- the requested output conflicts with the design-system docs
