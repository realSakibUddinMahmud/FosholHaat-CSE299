import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { Pool, type PoolConfig } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error('DATABASE_URL is required to initialize PrismaService.');
    }

    const possiblePaths = [
      path.resolve(process.cwd(), 'prod-ca-2021.crt'),
      path.resolve(process.cwd(), '../../prod-ca-2021.crt'),
      path.resolve(__dirname, '../../../../prod-ca-2021.crt'),
    ];

    const caCertPath = possiblePaths.find((p) => fs.existsSync(p));

    const sslConfig = caCertPath
      ? { ca: fs.readFileSync(caCertPath, 'utf-8'), rejectUnauthorized: true }
      : { rejectUnauthorized: false };

    const parsedUrl = new URL(connectionString);
    parsedUrl.searchParams.delete('sslmode');

    const poolConfig: PoolConfig = {
      connectionString: parsedUrl.toString(),
      ssl: sslConfig,
      connectionTimeoutMillis: 10_000,
      idleTimeoutMillis: 30_000,
    };
    const pool = new Pool(poolConfig);

    const adapter = new PrismaPg(pool);

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
