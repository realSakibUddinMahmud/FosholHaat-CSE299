---
name: fosholhaat-canonical-shared-mobile-system
description: Use when generating, reviewing, or rewriting Stitch prompts for FosholHaat shared mobile screens that must stay locked to the approved canonical shared-access design system derived from the approved shared mobile base screen, including shared entry shell structure, typography, access-module treatment, and anti-drift rules.
---

# FosholHaat Canonical Shared Mobile System

Use this skill when a shared-mobile screen must match the approved canonical shared access system exactly.

Read these files first:

1. `/home/god_himself_wsl/FosholHaat-CSE299/docs/design-system.md`
2. `/home/god_himself_wsl/FosholHaat-CSE299/docs/stitch/10-canonical-token-sheet.md`
3. `/home/god_himself_wsl/FosholHaat-CSE299/docs/stitch/12-screen-generation-roadmap.md`
4. `/home/god_himself_wsl/FosholHaat-CSE299/docs/stitch/19-shared-mobile-base-exploration.md`

Approved canonical shared-mobile base:

- screen title: `FosholHaat Canonical Access Shell`
- screen id: `3db3a577f19548b78260477c460fd407`

Use this skill when:

- generating a new shared-mobile screen from the approved shared-mobile base
- rewriting shared-mobile prompts because Stitch drifted into generic auth templates, landing-page behavior, or role-specific signup forms
- reviewing whether a shared-mobile screen still matches the canonical shared-mobile system
- locking exact visual constraints for access, login, language switching, or signup role-selection flows

Required rules:

1. use the approved shared-mobile base screen as the exact canonical base
2. preserve brand primary `#1A5632`
3. preserve bright white and soft-neutral surfaces such as `#F8FAF9`, `#FFFFFF`, and `#F4F6F5`
4. preserve Inter typography and strong but calm B2B hierarchy
5. preserve the branded shared-access shell, premium top identity area, compact language toggle, and layered access-module treatment
6. keep the experience role-neutral at the shared-mobile layer
7. request one canonical screen only, not exploration

Prompt must explicitly include:

- base screen id
- exact token rules
- required component reuse
- anti-drift constraints
- exact screen purpose and shared-mobile boundary
- whether the screen is welcome-first, login-first, language-first, or role-selection-first

Do not allow:

- generic SaaS login-page styling
- fintech, wallet, or social-onboarding visual language
- hero-photo auth screens
- role-specific signup forms in shared-mobile screens
- Hub self-registration
- dashboard previews, bottom navigation, or footer-link filler
- farmer-first or nationwide positioning copy
- fake operational or enterprise-status strips that imitate product depth

## Locked Shared-Mobile Learnings

Apply these rules for downstream shared-mobile prompts:

- shared-mobile must feel like product entry, not a marketing page and not an in-app shell
- header treatment matters; broken or generic auth headers materially weaken the family
- role selection must remain role-branching only, not role-form entry
- language selection must stay elegant and product-grade, not utility-screen plain

Known weak-output patterns from the approved shared-mobile review loop:

- generic auth-template behavior
- broken or weak header treatment
- marketplace or farmer-first copy drift
- bottom-nav app-shell drift in role selection
- separator-mark or utility-style language-screen drift

Prefer prompt phrases like:

- `premium product-entry surface`
- `shared access shell`
- `compact language toggle`
- `layered access module`
- `role-neutral trust`

Avoid vague phrases like:

- `login page`
- `onboarding screen`
- `auth UI`

## Candidate Review Heuristics

Treat a shared-mobile candidate as suspect if it shows:

- generic SaaS auth-card composition
- role-specific signup fields
- bottom navigation or app-shell framing
- landing-page hero behavior
- weak bilingual or language treatment
- fake product-status strips trying to add depth

Shared-mobile-specific guidance:

- shared-mobile screens should feel like a premium product-entry surface, not a landing page
- the strongest recurring modules are brand header, language switch, headline block, and premium access module
- login is role-agnostic
- create-account actions may lead to role selection, but not directly show Buyer or Seller form fields on shared screens
- copy must be concise, product-grade, and commercially serious
