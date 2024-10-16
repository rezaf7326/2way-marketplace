import { NextFunction, RequestHandler, Response } from 'express';
import { ValidRequest } from '../common/abstraction';
import { Unauthorized } from 'http-errors';

/**
 * use this middleware only after both middlewares:
 *    withParamsMiddleware & withAuthenticatedUserMiddleware
 */
export function matchIdParamAndJwtSubMiddleware(): RequestHandler {
  return (req: ValidRequest, res: Response, next: NextFunction) =>
    Number(req.user.sub) === Number(req.params.id)
      ? next()
      : next(new Unauthorized());
}
