import {
  dtoValidationMiddleware,
  withAuthenticatedUserMiddleware,
} from '../middlewares';
import { Route } from '../common/enums';
import { Logger } from '../common/logger/logger';
import { NotFound } from 'http-errors';
import { Bootable, Singleton, ValidRequest } from '../common/abstraction';
import { NextFunction, Response, Router } from 'express';
import { StaticImplements } from '../common/custom-decorators';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { SignInDto } from '../dtos';

@StaticImplements<Singleton<AuthController>>()
export class AuthController implements Bootable {
  private static instance: AuthController;
  private readonly logger: Logger;

  private constructor() {
    this.logger = new Logger(this.constructor.name);
  }

  static get ref(): AuthController {
    if (!this.instance) {
      this.instance = new AuthController();
    }
    return this.instance;
  }

  async boot(router: Router) {
    this.logger.verbose('registering routes to global router');

    router.post(
      Route.AuthLogin,
      dtoValidationMiddleware(SignInDto),
      this.signIn.bind(this),
    );
    this.logger.info(`registered POST ${Route.AuthLogin}`);

    router.post(
      Route.AuthLogout,
      withAuthenticatedUserMiddleware(),
      this.signOut.bind(this),
    );
    this.logger.info(`registered POST ${Route.AuthLogout}`);
  }

  async signIn(
    { body, headers }: ValidRequest<SignInDto>,
    res: Response,
    next: NextFunction,
  ) {
    this.logger.verbose(`signing in user with email: ${body.email}`);
    try {
      const user = await UserService.ref.findOne({ email: body.email });
      if (!user) {
        return next(new NotFound(`user not found for email: ${body.email}`));
      }
      res
        .status(200)
        .send(await AuthService.ref.signIn(body, headers['user-agent']));
      this.logger.info(`successfully signed-in with email: ${body.email}`);
    } catch (error) {
      next(error);
    }
  }

  async signOut(req: ValidRequest, res: Response, next: NextFunction) {
    this.logger.verbose(`signing out user: ${req.user.sub}`);
    try {
      // TODO use req.headers['user-agent'] || req.user.sub to know user session
      // ...
      this.logger.info(`successfully signed-out user: ${req.user.sub}`);
      res.status(200).end();
    } catch (error) {
      next(error);
    }
  }
}
