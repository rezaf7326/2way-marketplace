import { Route } from '../common/enums';
import { Logger } from '../common/logger/logger';
import { Request, Response, Router } from 'express';
import { Bootable, Singleton } from '../common/abstraction';
import { StaticImplements } from '../common/custom-decorators';

@StaticImplements<Singleton<HealthCheckController>>()
export class HealthCheckController implements Bootable {
  private static instance: HealthCheckController;
  private readonly logger: Logger;

  private constructor() {
    this.logger = new Logger(this.constructor.name);
  }

  static get ref(): HealthCheckController {
    if (!this.instance) {
      this.instance = new HealthCheckController();
    }
    return this.instance;
  }

  async boot(router: Router) {
    this.logger.verbose('registering routes to global router');

    router.get(Route.HealthCheck, this.healthCheck.bind(this));
    this.logger.info(`registered GET ${Route.HealthCheck}`);
  }

  async healthCheck(req: Request, res: Response) {
    this.logger.verbose('health check');
    res.status(200).send(true);
  }
}
