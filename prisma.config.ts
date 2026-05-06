import { defineConfig, env } from 'prisma/config';
import * as dotenv from 'dotenv';
dotenv.config();

function supabaseCliUrl(name: 'DATABASE_URL' | 'DIRECT_URL') {
  const value = process.env[name];
  if (!value) return env(name);
  const url = new URL(value);
  if (url.searchParams.get('sslmode') === 'require') {
    url.searchParams.set('uselibpqcompat', 'true');
  }
  return url.toString();
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'node ../../prisma/seed-runner.cjs',
  },
  datasource: {
    url: supabaseCliUrl('DATABASE_URL'),
    directUrl: supabaseCliUrl('DIRECT_URL'),
  },
});
