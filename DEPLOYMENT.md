# Deployment Readiness

## Required secrets

- `DATABASE_URL`: Supabase transaction pooler URL.
- `DIRECT_URL`: Supabase session/direct URL for Prisma migrations.
- `API_URL`: public NestJS API origin used by Next.js proxy routes.
- `NEXT_PUBLIC_API_URL`: public API origin for browser-only code if needed.
- `EXPO_PUBLIC_API_URL`: public API origin for Expo builds.
- Supabase publishable keys for web and mobile.

## Backend

Build:

```bash
npm -w apps/api run prisma:generate
npm -w apps/api run build
```

Container:

```bash
docker build -f apps/api/Dockerfile -t fosholhaat-api .
```

Run migrations before production start:

```bash
npm run db:push
```

## Web

Deploy `apps/web` to Vercel and set `API_URL` to the deployed backend origin.

Validation:

```bash
npm -w apps/web run build
```

## Mobile

Set `EXPO_PUBLIC_API_URL` in EAS profile before release builds.

Validation:

```bash
npm -w apps/mobile run build
```

Production builds:

```bash
npx eas build --platform android --profile production
npx eas build --platform ios --profile production
```

## Final gate

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```
