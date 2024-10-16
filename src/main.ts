import 'reflect-metadata';
import { App } from './app';
import { Router } from 'express';
import { ConfigContainer } from './common/config';
import { finalErrorMiddleware } from './middlewares';
import { ConfigValidInterface } from './config-valid.interface';

async function bootstrap() {
  const app = new App();
  const router = Router();
  ConfigContainer.config(ConfigValidInterface);

  app.cors();
  app.router(router);
  app.globalErrorHandler(finalErrorMiddleware());
  app.start();
}

bootstrap();
