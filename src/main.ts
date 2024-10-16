import 'reflect-metadata';
import { App } from './app';
import { Router } from 'express';
import { finalErrorMiddleware } from './middlewares';

async function bootstrap() {
  const app = new App();
  const router = Router();

  app.cors();
  app.router(router);
  app.globalErrorHandler(finalErrorMiddleware());
  app.start();
}

bootstrap();
