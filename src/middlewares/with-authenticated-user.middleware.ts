import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ExpressHelper } from '../common/helpers/express.helper';
import { ValidRequest } from '../common/abstraction';
import { ConfigContainer } from '../common/config';
import { Forbidden, Unauthorized } from 'http-errors';
import * as jwt from 'jsonwebtoken';

export function withAuthenticatedUserMiddleware(): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = ExpressHelper.extractAuthToken(req);
    if (!token) {
      return next(new Unauthorized('Authorization token not provided'));
    }
    try {
      (req as ValidRequest).user = jwt.verify(
        token,
        ConfigContainer.config().general.jwtSecret,
      ) as jwt.JwtPayload;

      // TODO further auth logic...

      next();
    } catch (err) {
      next(new Unauthorized('invalid auth token'));
    }
  };
}
