import { NextFunction, RequestHandler, Response } from 'express';
import { ValidRequest } from '../common/abstraction';
import { Unauthorized } from 'http-errors';
import { Role } from '../common/enums';
import { UserService } from '../services/user.service';

export function WithUserRoleMiddleware(role: Role): RequestHandler {
  return async (req: ValidRequest, res: Response, next: NextFunction) => {
    (await UserService.ref.hasRole(Number(req.user.sub), role))
      ? next()
      : next(new Unauthorized());
  };
}
