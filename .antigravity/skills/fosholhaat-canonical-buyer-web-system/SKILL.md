---
name: fosholhaat-canonical-buyer-web-system
description: Use when generating, reviewing, or rewriting Stitch prompts for FosholHaat Buyer web screens that must stay locked to the approved canonical Buyer desktop shell, including desktop navigation model, search-and-filter zone, content-grid logic, typography, and anti-drift rules.
---

# FosholHaat Canonical Buyer Web System

Use this skill when a Buyer-side web screen must match the approved Buyer desktop shell exactly.

Read these files first:

1. `/home/god_himself_wsl/FosholHaat-CSE299/docs/design-system.md`
2. `/home/god_himself_wsl/FosholHaat-CSE299/docs/stitch/07-canonical-direction.md`
3. `/home/god_himself_wsl/FosholHaat-CSE299/docs/stitch/08-component-inventory.md`
4. `/home/god_himself_wsl/FosholHaat-CSE299/docs/stitch/10-canonical-token-sheet.md`
5. `/home/god_himself_wsl/FosholHaat-CSE299/docs/stitch/22-buyer-web-shell-exploration.md`
6. `/home/god_himself_wsl/FosholHaat-CSE299/docs/stitch/26-web-generation-doctrine.md`
7. `/home/god_himself_wsl/FosholHaat-CSE299/docs/stitch/27-buyer-web-ia-map.md`
8. `/home/god_himself_wsl/FosholHaat-CSE299/docs/stitch/32-buyer-web-screen-prompts.md`
9. `/home/god_himself_wsl/FosholHaat-CSE299/docs/stitch/33-buyer-web-screen-registry.md`

The doctrine file is the governing rule set.
The IA map defines Buyer desktop page anatomy and module priority.
The Buyer web prompt doc and Buyer web registry capture the locked downstream pattern that produced the approved screen set.

Use this skill when:

- generating the canonical Buyer web shell
- generating Buyer web screens after the web shell is approved
- rewriting Buyer web prompts because output drifted into generic ecommerce or admin-dashboard styling
- checking whether a Buyer web screen still matches the canonical Buyer desktop family

Required rules:

1. use the approved Buyer desktop shell as the exact canonical web base once approved
2. preserve primary brand green `#1A5632`
3. preserve `#F8FAF9`, `#F4F6F5`, white-card surfaces, and Buyer-family typography discipline
4. preserve Inter typography and calm B2B hierarchy
5. preserve desktop search-first browsing logic and comparison-friendly layout
6. preserve Buyer-family trust, pricing, stock, and verification signal treatment
7. request one canonical screen only, not exploration, unless shell exploration is explicitly intended
8. keep Buyer desktop density browse-first, not dashboard-first
9. use right-side context only for cart, group-buy, or trust support
10. reject unnecessary shell-level chips or summary blocks that feel finance-like or arbitrary
11. prefer visibly rounded premium card geometry over flat rectangular marketplace boxes
12. require a stable Buyer header, restrained Buyer footer, and a procurement-oriented home block
13. keep the approved green system stable across refinements; reject off-system theme drift even if the layout is otherwise stronger
14. treat payment, orders, and success states as Buyer procurement continuation, not isolated generic utilities

Prompt must explicitly include:

- base shell id when approved
- exact token rules
- desktop layout rules
- required component reuse
- anti-drift constraints
- exact screen purpose
- whether the screen is browse-first, detail-first, or task-first
- whether the screen should feel like a procurement workspace, order-management surface, or receipt/confirmation surface

Do not allow:

- generic ecommerce storefront drift
- grocery-delivery styling
- giant promo hero banners
- admin-dashboard tables as the dominant composition
- navy/blue desktop chrome
- visual mismatch with Buyer mobile family
- duplicate primary actions
- decorative or low-value footer clutter
- boxy low-radius desktop geometry
- clipped labels or cramped side filters

Buyer web-specific guidance:

- mobile defines flow logic
- web shell defines layout logic
- Buyer desktop should improve scanning, comparison, and trust visibility
- denser information is allowed only when it clearly improves decision-making
- product grids outrank analytics or summary blocks

## Locked Buyer Web Refinement Learnings

Apply these rules for downstream Buyer desktop prompts:

### Home and browse

- strongest output came from a procurement workspace composition, not a hero page
- prefer:
  - search-first control zone
  - left filter rail
  - central comparison-friendly product grid
  - one meaningful right-side support rail
- reject centered or overly narrow compositions that underuse desktop width

### Orders

- order surfaces must still feel Buyer-facing, not like a generic internal ops table
- if using lists, add procurement context, trust signals, and clearer next-step continuity
- reject compositions that look like a polished back-office list with weak Buyer identity

### Payment

- payment selection must stay visibly inside the FosholHaat procurement journey
- reject fintech styling, wallet chips, finance tiles, or abstract billing-first composition
- prefer procurement reassurance, delivery/payment clarity, and order continuity cues

### Success and confirmation

- success screens should read as premium receipt and next-step guidance
- reject both noisy celebration and overly plain utility shells
- require receipt identity, order confidence, and actionable follow-through

## Candidate Review Heuristics

Treat a candidate as suspect if any of these appear:

- blue or off-green theme drift
- duplicate search affordances
- duplicate primary CTAs
- right rail with no real task value
- footer becoming generic filler
- visual downgrade into boxy admin geometry
- clipped or cramped labels
