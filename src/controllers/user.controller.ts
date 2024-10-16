import { dtoValidationMiddleware } from '../middlewares';
import { Route } from '../common/enums';
import { Logger } from '../common/logger/logger';
import { Conflict } from 'http-errors';
import { Bootable, Singleton, ValidRequest } from '../common/abstraction';
import { NextFunction, Response, Router } from 'express';
import { StaticImplements } from '../common/custom-decorators';
import { UserService } from '../services/user.service';
import { SignUpDto } from '../dtos';

@StaticImplements<Singleton<UserController>>()
export class UserController implements Bootable {
  private static instance: UserController;
  private readonly logger: Logger;

  private constructor() {
    this.logger = new Logger(this.constructor.name);
  }

  static get ref(): UserController {
    if (!this.instance) {
      this.instance = new UserController();
    }
    return this.instance;
  }

  async boot(router: Router) {
    this.logger.verbose('registering routes to global router');

    router.post(
      Route.User,
      dtoValidationMiddleware(SignUpDto),
      this.signUp.bind(this),
    );
    this.logger.info(`registered POST ${Route.User}`);
  }

  async signUp(
    { body }: ValidRequest<SignUpDto>,
    res: Response,
    next: NextFunction,
  ) {
    this.logger.verbose('user sign-up');
    try {
      if (await UserService.ref.findOne({ email: body.email })) {
        return next(new Conflict('email already exists'));
      }
      const user = await UserService.ref.createUser(body);
      res.status(201).send(user);
      this.logger.info(
        `successfully signed-up new user with email: ${body.email}`,
      );
    } catch (error) {
      next(error);
    }
  }
}
