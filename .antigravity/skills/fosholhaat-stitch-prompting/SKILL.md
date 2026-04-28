---
name: fosholhaat-stitch-prompting
description: Use when writing or refining Stitch prompts for FosholHaat, especially for style exploration, canonical screen generation, design-token consistency, platform-adapted UX, or avoiding duplicate and low-quality screen output.
---

# FosholHaat Stitch Prompting

Use this skill for FosholHaat Stitch prompt creation and regeneration strategy.

Read these files first:

1. `/home/god_himself_wsl/FosholHaat-CSE299/docs/design-system.md`
2. `/home/god_himself_wsl/FosholHaat-CSE299/docs/mvp-scope.md`
3. `/home/god_himself_wsl/FosholHaat-CSE299/docs/skills-plan.md`

Use this skill when:

- creating a new Stitch generation prompt
- regenerating screens after rejecting prior output
- requesting style exploration
- asking Stitch for canonical screens
- extracting prompt learnings from an approved FosholHaat screen batch and folding them back into future prompt writing

Prompt policy:

1. start with 2-3 style exploration screens only
2. pick one direction
3. lock the direction
4. generate one canonical screen per flow
5. reject and delete duplicates
6. for web prompts, explicitly constrain against duplicate CTAs, dead space, filler footers, generic auth or dashboard templates, low-radius boxy geometry, clipped content, and missing header/footer/home-block logic
7. after a screen family is locked, promote the winning prompt traits into future generation rules instead of reusing weaker generic prompt language

Prompt must include:

- exact role and flow
- approved brand feel
- what to avoid
- performance and clarity expectations
- whether the output is exploration or canonical
- redundancy and anti-filler constraints for shell-level work
- geometry and anti-clipping constraints for desktop work

Do not ask Stitch to generate the entire product from a loose prompt.

## Canonical Prompt Construction

For canonical downstream prompts, write them in this order:

1. state `one canonical screen only` and whether this is exploration or not
2. state the exact approved base references:
   - shell id for web
   - approved mobile flow id when web is downstream from mobile
3. state the exact tokens and typography that must be preserved
4. state the intended desktop or mobile anatomy
5. state the required task tone and role identity
6. state the explicit rejection list

If a prompt is missing either the approved base ids or the rejection list, it is not strict enough.

## Locked Buyer Web Learnings

Use these concrete learnings when writing future FosholHaat web prompts, especially for Buyer-family work:

### What produced stronger output

- search-first procurement framing beats generic hero-led ecommerce framing
- left filter rail plus central comparison grid plus one meaningful support rail works better than symmetric marketing layouts
- desktop home screens are stronger when they read as a live workspace, not a centered storefront
- right-side context only works when it supports cart, group-buy, trust, or next-step continuity
- order and payment screens are stronger when they feel like procurement continuation, not fintech flows
- success screens are stronger when they read as premium receipt-and-next-step surfaces, not celebration pages and not blank confirmation shells

### What repeatedly caused weak output

- generic ecommerce homepage drift
- operations-list styling that loses Buyer flavor
- fintech or wallet styling in payment steps
- plain or underdesigned success states
- blue or off-system theme drift after refinement
- duplicate search or duplicate CTA treatment
- filler footer composition
- narrow centered composition that wastes desktop width

### Buyer web phrasing patterns to prefer

Prefer phrases like:

- `procurement workspace`
- `search-first control zone`
- `comparison-friendly product grid`
- `verified seller and stock trust cues`
- `active group-buy visibility`
- `premium receipt and next-step guidance`
- `calm B2B procurement tone`

Avoid relying on vague phrases like:

- `modern ecommerce page`
- `professional dashboard`
- `clean payment UI`
- `simple success screen`

## Web Prompt Quality Gate

Before using a web prompt, check that it explicitly prevents:

- generic ecommerce storefront drift
- grocery-delivery styling
- admin-dashboard boxiness
- fintech chips or wallet cues
- dead space
- filler footer clutter
- clipped labels
- non-MVP category drift
- theme-color drift away from the approved role system

If those checks are not explicit, rewrite the prompt before generating.
