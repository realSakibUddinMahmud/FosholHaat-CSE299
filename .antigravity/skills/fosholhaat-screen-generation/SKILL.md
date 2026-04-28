---
name: fosholhaat-screen-generation
description: Use when generating a new FosholHaat screen in Stitch after the design direction is approved, especially when the screen must extend the canonical design system, reuse approved components, and stay aligned with the locked Buyer/Seller/Hub visual language instead of starting from a loose prompt.
---

# FosholHaat Screen Generation

Use this skill when creating new FosholHaat screens from the approved design system.

Read these files first:

1. `/home/god_himself_wsl/FosholHaat-CSE299/CLAUDE.md`
2. `/home/god_himself_wsl/FosholHaat-CSE299/docs/design-system.md`
3. `/home/god_himself_wsl/FosholHaat-CSE299/docs/stitch/07-canonical-direction.md`
4. `/home/god_himself_wsl/FosholHaat-CSE299/docs/stitch/08-component-inventory.md`
5. `/home/god_himself_wsl/FosholHaat-CSE299/docs/stitch/09-next-screen-prompts.md`
6. `/home/god_himself_wsl/FosholHaat-CSE299/docs/stitch/26-web-generation-doctrine.md` when working on web

Use this skill when:

- generating the next Buyer, Seller, or Hub screen from an approved base
- asking Stitch to create a product-detail, cart, orders, tracking, or browse screen
- extending the canonical FosholHaat visual system into a new flow
- creating a new screen family after the home-screen direction is locked
- converting approved component inventory into screen-level Stitch prompts

Generation policy:

1. start from the approved canonical base, never from a blank stylistic description
2. identify the exact role and exact screen purpose
3. reuse approved shell and component patterns where applicable
4. preserve the same brand accent, type discipline, and tone
5. request only one canonical screen for the flow unless exploration is explicitly required
6. reject prompts that reintroduce neon green, red-led branding, or grocery-app styling
7. for web screens, explicitly avoid duplicate CTAs, dead space, filler footer modules, and generic template sections
8. for web screens, explicitly require premium rounded geometry, sufficient edge padding, and unclipped content
9. for web shells, explicitly require a consistent reusable header, restrained reusable footer, and a clear role home block

Prompt must include:

- exact role
- exact screen name
- whether the screen is canonical or exploratory
- which approved components must be reused
- the approved brand and tone constraints
- what to avoid

Required output behavior:

- treat `docs/stitch/assets/screen.png` and `docs/stitch/assets/code.html` as the canonical Buyer visual base unless a newer approved canonical asset is explicitly documented
- prefer extension of the system over reinvention
- maintain B2B trust, readability, and outdoor usability
- for web candidates, run a post-generation visual sanity check before surfacing the result
- reject if cards, rails, or auth modules feel boxy, cramped, or visually cropped

Do not:

- ask Stitch to invent a new visual direction
- mix multiple active design directions
- generate duplicates for the same flow without explicit instruction
- drift into consumer grocery, food delivery, or coupon-app UI
- surface a screen if obvious visual inconsistencies remain unresolved
