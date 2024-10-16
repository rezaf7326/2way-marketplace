import 'reflect-metadata';
import { App } from './app';
import { Router } from 'express';
import { ConfigContainer } from './common/config';
import { finalErrorMiddleware } from './middlewares';
import { ConfigValidInterface } from './config-valid.interface';
import { Database } from './database/database';

async function bootstrap() {
  const app = new App();
  const router = Router();
  ConfigContainer.config(ConfigValidInterface); // validate .env

  Database.ref.boot();

  app.cors();
  app.router(router);
  app.globalErrorHandler(finalErrorMiddleware());
  app.start();
}

bootstrap();
