import 'reflect-metadata';
import { App } from './app';
import { Router } from 'express';
import { ConfigContainer } from './common/config';
import { finalErrorMiddleware } from './middlewares';
import { ConfigValidInterface } from './config-valid.interface';
import { Database } from './database/database';
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { HealthCheckController } from './controllers/health-check.controller';
import { ProductController } from './controllers/product.controller';
import { RabbitMQ } from './rabbitmq/rabbitmq';

async function bootstrap() {
  const app = new App();
  const router = Router();
  ConfigContainer.config(ConfigValidInterface); // validate .env

  await Database.ref.boot();
  await RabbitMQ.ref.boot();
  await RabbitMQ.ref.assertQueue(ConfigContainer.get('NOTIFICATION_QUEUE'));
  await HealthCheckController.ref.boot(router);
  await AuthController.ref.boot(router);
  await UserController.ref.boot(router);
  await ProductController.ref.boot(router);

  app.cors();
  app.router(router);
  app.globalErrorHandler(finalErrorMiddleware());
  app.start();
}

bootstrap();
