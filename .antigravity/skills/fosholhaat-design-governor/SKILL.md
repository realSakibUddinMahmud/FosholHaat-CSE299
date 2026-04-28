---
name: fosholhaat-design-governor
description: Use when generating, reviewing, comparing, pruning, or approving FosholHaat UI screens, design systems, design tokens, or cross-platform UX so the product stays visually consistent and avoids duplicate or low-quality screen output.
---

# FosholHaat Design Governor

Use this skill for FosholHaat design control.

Read these files first:

1. `/home/god_himself_wsl/FosholHaat-CSE299/CLAUDE.md`
2. `/home/god_himself_wsl/FosholHaat-CSE299/docs/design-system.md`
3. `/home/god_himself_wsl/FosholHaat-CSE299/docs/mvp-scope.md`

Use this skill when:

- preparing Stitch prompts
- reviewing generated screens
- choosing between variants
- checking visual consistency across mobile, web, and operations screens
- deciding whether a screen is canonical, mergeable, or discardable
- running a visual inspection pass before approval

Rules:

- old rejected screens are not baseline references
- one canonical screen per flow
- delete duplicates after a direction is approved
- enforce one shared design system with platform-adapted UX
- optimize for modern, premium, polished, trustworthy startup quality
- apply a skeptical visual-validator mindset before declaring a screen approval-ready
- reject screens with redundant actions, redundant modules, or dead space that weakens authority
- reject shells with filler footer content, microtext clutter, or generic template behavior
- reject shells that drift into boxy low-radius desktop templates
- reject any screen with clipped text, cut-off labels, or cropped navigation content
- reject web shells that lack a clear reusable header/footer system
- reject web shells that lack a clear role home block or anchor block

Avoid:

- text-heavy layouts
- generic AI-looking dashboard clutter
- mismatched spacing, typography, or component rules
- inconsistent buyer/seller/hub visual hierarchy

If asked to judge a screen, evaluate:

1. clarity
2. trust
3. startup polish
4. cross-platform consistency
5. conversion to code readiness
6. redundancy and duplicate CTA risk
7. visual completion and dead-space control
8. readability and contrast of secondary text
9. geometry quality and rounded-corner fit with FosholHaat mobile language
10. clipping or cropped-content failures
11. reusable header/footer continuity
12. role-appropriate home-block presence

Visual rejection triggers:

- two CTAs for the same primary action in the same shell without a strong reason
- shell-level auth pages with duplicate login entry points
- dead lower-page zones that make the design feel unfinished
- right rails or support panels that do not justify their space
- footer clutter that adds no product value
- clipped left rails, cut-off text, or cropped cards
- geometry that feels too rectangular to be premium
