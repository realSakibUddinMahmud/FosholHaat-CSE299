---
name: fosholhaat-canonical-seller-system
description: Use when generating, reviewing, or rewriting Stitch prompts for FosholHaat Seller screens that must stay locked to the approved canonical Seller design system derived from the approved Seller mobile base screen, including exact brand color, seller shell structure, inventory-card treatment, typography, and anti-drift rules.
---

# FosholHaat Canonical Seller System

Use this skill when a Seller-side screen must match the approved canonical Seller base system exactly.

Read these files first:

1. `/home/god_himself_wsl/FosholHaat-CSE299/docs/design-system.md`
2. `/home/god_himself_wsl/FosholHaat-CSE299/docs/stitch/10-canonical-token-sheet.md`
3. `/home/god_himself_wsl/FosholHaat-CSE299/docs/stitch/12-screen-generation-roadmap.md`
4. `/home/god_himself_wsl/FosholHaat-CSE299/docs/stitch/13-seller-base-exploration.md`

Approved canonical Seller base:

- screen title: `FosholHaat Seller Dashboard`
- screen id: `dd6e8a76a4a44640b48e37a6c6154abd`

Use this skill when:

- generating a new Seller screen from the approved Seller base
- rewriting Seller prompts because Stitch drifted into inconsistent colors, layout, or generic dashboard styling
- reviewing whether a Seller screen still matches the canonical Seller system
- locking exact visual constraints for Seller inventory, supply, orders, fulfillment, payout, or DWR-related supply visibility flows

Required rules:

1. use the approved Seller base screen as the exact canonical base
2. preserve brand primary `#1A5632`
3. preserve soft neutral fills such as `#F4F6F5` and clean white cards
4. preserve Inter typography and strong operational hierarchy
5. preserve the same branded Seller shell, top identity area, summary-card rhythm, CTA tone, inventory-card treatment, and bottom-nav language
6. keep payout visibility secondary to supply, stock, and order operations
7. request one canonical screen only, not exploration

Prompt must explicitly include:

- base screen id
- exact token rules
- required component reuse
- anti-drift constraints
- exact screen purpose and content
- whether the screen is inventory-first, fulfillment-first, payout-supporting, or DWR-record-first

Do not allow:

- brighter random greens
- red-led branding
- buyer-home or consumer marketplace reinterpretation
- generic admin dashboard styling
- generic fintech or wallet-app payout emphasis
- grocery-delivery styling
- charts or analytics-heavy control-room drift

## Locked Seller Mobile Learnings

Apply these rules for downstream Seller mobile prompts:

- supply and inventory must stay visually primary
- orders and fulfillment should read as active operating work, not abstract reporting
- payout visibility is allowed but must remain secondary and visually restrained
- DWR-linked screens should feel like practical supply records, not compliance bureaucracy

Known weak-output patterns from the approved Seller review loop:

- off-brand green drift in supply and orders screens
- wallet-style or fintech visual drift in payout screens
- generic admin dashboard composition replacing Seller operating rhythm

Prefer prompt phrases like:

- `supply-first operating surface`
- `inventory-card treatment`
- `active fulfillment visibility`
- `restrained payout support`
- `small-aggregator operations`

Avoid vague prompt language like:

- `seller dashboard`
- `transaction app`
- `business finance page`

## Candidate Review Heuristics

Treat a Seller candidate as suspect if it shows:

- brighter or random green drift from the approved system
- payout emphasis stronger than supply or orders
- generic dashboard tiles with weak inventory identity
- chart walls with no task value
- buyer-home or marketplace composition
- logistics language that feels fleet-first instead of seller-relevant

Seller-specific guidance:

- Seller screens should feel like a premium mobile operating surface for beparis, traders, and small aggregators
- the strongest recurring modules are inventory/supply, active orders or fulfillment, stock alerts, and payout visibility
- logistics/dispatch language must remain seller-relevant, not fleet-control or buyer-tracking-first
- inventory states must be operationally meaningful and visually clear
