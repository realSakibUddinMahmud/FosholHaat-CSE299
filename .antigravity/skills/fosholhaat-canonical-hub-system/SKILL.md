---
name: fosholhaat-canonical-hub-system
description: Use when generating, reviewing, or rewriting Stitch prompts for FosholHaat Hub screens that must stay locked to the approved canonical Hub design system derived from the approved Hub mobile base screen, including Hub shell structure, operational pulse composition, typography, and anti-drift rules.
---

# FosholHaat Canonical Hub System

Use this skill when a Hub-side screen must match the approved canonical Hub base system exactly.

Read these files first:

1. `/home/god_himself_wsl/FosholHaat-CSE299/docs/design-system.md`
2. `/home/god_himself_wsl/FosholHaat-CSE299/docs/stitch/10-canonical-token-sheet.md`
3. `/home/god_himself_wsl/FosholHaat-CSE299/docs/stitch/12-screen-generation-roadmap.md`
4. `/home/god_himself_wsl/FosholHaat-CSE299/docs/stitch/16-hub-base-exploration.md`

Approved canonical Hub base:

- screen title: `FosholHaat Hub Command Center`
- screen id: `1cad66d916214dfb8f05019cefaed33d`

Use this skill when:

- generating a new Hub screen from the approved Hub base
- rewriting Hub prompts because Stitch drifted into seller-like dashboard layouts, generic admin styling, or fleet-app behavior
- reviewing whether a Hub screen still matches the canonical Hub system
- locking exact visual constraints for inbound receipt, sorting, exception handling, dispatch staging, or Hub coordination flows

Required rules:

1. use the approved Hub base screen as the exact canonical base
2. preserve brand primary `#1A5632`
3. preserve bright white and soft-neutral surfaces such as `#F8FAF9`, `#FFFFFF`, and `#F4F6F5`
4. preserve Inter typography and calm operational hierarchy
5. preserve the branded Hub shell, command-surface opening composition, refined operational pulse treatment, compact action row, and operations-first bottom navigation
6. keep exception handling visible and important, but still premium and restrained rather than loud or chaotic
7. request one canonical screen only, not exploration

Prompt must explicitly include:

- base screen id
- exact token rules
- required component reuse
- anti-drift constraints
- exact screen purpose and operational content
- whether the screen is intake-first, sorting-first, dispatch-first, exception-first, or coordination-first

Do not allow:

- seller-dashboard reinterpretation
- buyer marketplace composition
- generic admin dashboard KPI-grid styling
- fleet-tracking or driver-console behavior
- warehouse ERP or bureaucratic enterprise styling
- finance-app or wallet-app visual language
- off-scope products such as rice, grains, or lentils
- geography drift beyond the tightly scoped Bogura -> Dhaka corridor tone
- charts or analytics-wall control-room drift

## Locked Hub Mobile Learnings

Apply these rules for downstream Hub mobile prompts:

- Hub screens must feel like a premium coordination surface, not a monitoring dashboard
- detail views must stay procedural and operational, not image-led or marketplace-like
- dispatch should read as staging and load preparation, not truck promotion or fleet tracking
- coordination screens must stay hub-centric, not drift toward buyer-style browsing or seller-style stock management

Known weak-output patterns from the approved Hub review loop:

- marketplace-style image drift in inbound detail
- loss of procedural composition in sorting detail
- promotional truck-detail drift in dispatch detail
- buyer-style coordination drift in order coordination

Prefer prompt phrases like:

- `command surface`
- `operational pulse`
- `live intake queue`
- `dispatch staging`
- `exception-aware coordination`

Avoid vague phrases like:

- `hub dashboard`
- `warehouse system`
- `tracking screen`

## Candidate Review Heuristics

Treat a Hub candidate as suspect if it shows:

- large product imagery or marketplace browsing cues
- over-red or alarmist exception styling
- fleet-console behavior
- bureaucratic ERP composition
- seller-like stock-management layout
- charts or metrics replacing live operational modules

Hub-specific guidance:

- Hub screens should feel like a premium mobile operations control surface for coordination, not a static monitoring dashboard
- the strongest recurring modules are operational pulse, compact actions, live intake queue, active sorting, dispatch staging, and exception handling
- inbound modules must feel like intake workflow, not marketplace product browsing or seller inventory
- dispatch modules must feel like staging and coordination, not fleet management or driver tracking
- status language should be realistic, concise, and product-grade
