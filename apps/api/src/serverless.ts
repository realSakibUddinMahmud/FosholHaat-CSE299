import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import express from 'express';
import { AppModule } from './app.module';

const server = express();
let app: NestExpressApplication | null = null;

async function bootstrap(): Promise<express.Express> {
  if (!app) {
    app = await NestFactory.create<NestExpressApplication>(
      AppModule,
      new ExpressAdapter(server),
    );
    app.enableCors({ origin: true, credentials: true });
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidUnknownValues: true,
      }),
    );
    await app.init();
  }
  return server;
}

export default async function handler(
  req: express.Request,
  res: express.Response,
) {
  const app = await bootstrap();
  app(req, res);
}
