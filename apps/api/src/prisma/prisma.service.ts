import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error('DATABASE_URL is required to initialize PrismaService.');
    }

    // Try to find the Supabase CA cert in a few possible locations
    const possiblePaths = [
      path.resolve(process.cwd(), 'prod-ca-2021.crt'),
      path.resolve(process.cwd(), '../../prod-ca-2021.crt'),
      path.resolve(__dirname, '../../../../prod-ca-2021.crt'), // from dist/src/prisma
    ];

    const caCertPath = possiblePaths.find((p) => fs.existsSync(p));

    const sslConfig = caCertPath
      ? { ca: fs.readFileSync(caCertPath, 'utf-8'), rejectUnauthorized: true }
      : { rejectUnauthorized: false };

    const databaseUrl = new URL(connectionString);
    const adapter = new PrismaPg({
      host: databaseUrl.hostname,
      port: Number(databaseUrl.port || 5432),
      user: decodeURIComponent(databaseUrl.username),
      password: decodeURIComponent(databaseUrl.password),
      database: databaseUrl.pathname.replace(/^\//, ''),
      ssl: sslConfig,
    });

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', () => {
      void app.close();
    });
  }
}
