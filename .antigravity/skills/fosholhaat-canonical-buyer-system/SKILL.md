---
name: fosholhaat-canonical-buyer-system
description: Use when generating, reviewing, or rewriting Stitch prompts for FosholHaat Buyer screens that must stay locked to the approved canonical Buyer design system derived from docs/stitch/assets/code.html, including exact brand color, shell structure, card treatment, typography, and status-color rules.
---

# FosholHaat Canonical Buyer System

Use this skill when a Buyer-side screen must match the approved canonical home-screen system exactly.

Read these files first:

1. `/home/god_himself_wsl/FosholHaat-CSE299/docs/design-system.md`
2. `/home/god_himself_wsl/FosholHaat-CSE299/docs/stitch/07-canonical-direction.md`
3. `/home/god_himself_wsl/FosholHaat-CSE299/docs/stitch/08-component-inventory.md`
4. `/home/god_himself_wsl/FosholHaat-CSE299/docs/stitch/10-canonical-token-sheet.md`

Use this skill when:

- generating a new Buyer screen from the approved home screen
- rewriting prompts because Stitch drifted into inconsistent colors or layouts
- reviewing whether a Buyer screen still matches the canonical system
- locking exact visual constraints for Buyer product detail, cart, orders, tracking, or browse flows

Required rules:

1. use the approved Buyer home screen as the exact canonical base
2. preserve brand primary `#1A5632`
3. preserve soft neutral fills `#F4F6F5`
4. reserve alert red for `LIVE` and cart badge states only
5. preserve Inter typography and calm hierarchy
6. preserve the same header, search, pill, card, and bottom-nav tone
7. request one canonical screen only, not exploration

Prompt must explicitly include:

- base screen id
- exact token rules
- required component reuse
- anti-drift constraints
- exact screen purpose and content

Do not allow:

- brighter random greens
- red-led branding
- navy active pills
- seller/admin visual drift in Buyer screens
- generic marketplace reinterpretation
- delivery-app or grocery-app styling
