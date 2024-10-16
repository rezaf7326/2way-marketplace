import { NextFunction, Request, RequestHandler, Response } from 'express';
import { BadRequest } from 'http-errors';

export function withParamsMiddleware(
  paramValidators: Record<string, (val: unknown) => boolean>,
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    for (const [param, isValid] of Object.entries(paramValidators)) {
      if (!isValid(req.params[param])) {
        return next(new BadRequest(`request param "${param}" is not valid`));
      }
    }
    next();
  };
}
