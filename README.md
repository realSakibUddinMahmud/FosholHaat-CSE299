# FosholHaat

FosholHaat is a deployable B2B produce marketplace for the Bogura to Dhaka supply corridor. It connects sellers, buyers, and hub managers through one Supabase-backed system for live supply, single buying, group buying, order tracking, and hub fulfillment.

Live web app: [https://fosholhaat-web.vercel.app/](https://fosholhaat-web.vercel.app/)

## Purpose

Small produce businesses often depend on opaque market chains, manual coordination, and unclear fulfillment status. FosholHaat is built to make supply, demand, settlement, and hub movement visible from one operational platform.

The MVP focuses on:

- Buyer procurement from verified seller supply.
- Seller supply listing, order review, and hub handoff.
- Group buying for bulk demand aggregation.
- Hub receiving, sorting, dispatch, coordination, and exceptions.
- Bangla and English workflows.
- Real database-backed operation, not dummy production data.

## Core Roles

- **Buyer**: browses live single-buy lots, joins group buys, checks out, tracks orders, and views invoices.
- **Seller**: creates supply with photos and purchase-mode controls, receives orders, confirms demand, prints QR/seal handoff labels, and sends produce to hub.
- **Hub Manager**: receives seller handoffs by QR/seal verification, manages sorting, dispatch, coordination, and exception queues.

## Main Features

- Phone/email/password authentication.
- Seller profile and business identity from signup data.
- Supply creation with product category, quantity, grade, pricing, photos, single-buy controls, and group-buy controls.
- Buyer home for single-buy lots only.
- Group-buy page for group opportunities only.
- Cart and checkout with separate `SINGLE` and `GROUP` modes.
- Single orders enter seller review immediately.
- Group orders wait for target lock before seller review.
- Seller order queue with needs review, group progress, in progress, and ready states.
- Buyer/seller/hub tracking from real order events.
- Hub handoff QR and seal workflow.
- Branded invoice and shipment views.
- Web and Expo mobile surfaces.

## Architecture

Monorepo structure:

```text
apps/api      NestJS API
apps/web      Next.js web app
apps/mobile   Expo mobile app
packages/types shared domain types
packages/tokens shared design tokens
prisma        Prisma schema and database setup
```

Production data path:

```text
Web/Mobile UI -> NestJS API -> Prisma -> Supabase PostgreSQL
```

Frontend production screens must not read dummy business records. Supabase access is through the backend API.

## Tech Stack

- **Web**: Next.js
- **Mobile**: Expo / React Native
- **API**: NestJS
- **Database**: Supabase PostgreSQL
- **ORM**: Prisma
- **Deployment**: Vercel for web/API, Expo/EAS or local Android build for mobile

## Environment

Copy `.env.example` and set:

```bash
DATABASE_URL=
DIRECT_URL=
API_URL=
NEXT_PUBLIC_API_URL=
EXPO_PUBLIC_API_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Use Supabase PostgreSQL URLs for `DATABASE_URL` and `DIRECT_URL`. Use the deployed API origin for production web/mobile builds.

## Development

Install dependencies:

```bash
npm install
```

Generate Prisma client:

```bash
npm run db:generate
```

Start local stack with the project scripts under `scripts/dev` or preview scripts under `scripts/preview`.

Useful checks:

```bash
npm run typecheck
npm run test
npm run build
```

Mobile preview:

```bash
npm -w apps/mobile run web:preview
```

Local Android APK:

```bash
npm -w apps/mobile run build:android:local
```

APK output:

```text
apps/mobile/fosholhaat-preview.apk
```

## Deployment

Web is live at:

[https://fosholhaat-web.vercel.app/](https://fosholhaat-web.vercel.app/)

Production deployment requires:

- `API_URL` on the web deployment pointing to the deployed NestJS API.
- API deployment configured with Supabase `DATABASE_URL` and `DIRECT_URL`.
- Mobile builds configured with `EXPO_PUBLIC_API_URL` pointing to the deployed API.

## Quality Rules

- No production dummy users, orders, supply lots, payouts, DWR records, cart rows, or hub tasks.
- Protected API routes require authentication.
- Seller/buyer/hub data must be filtered by the current authenticated account and role.
- Tests, typecheck, and build should pass before release.

## Maintainer

Maintained by realSakibMahmud.
