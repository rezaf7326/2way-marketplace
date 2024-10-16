import { NextFunction, Request, RequestHandler, Response } from 'express';
import { BadRequest } from 'http-errors';

export function withQueriesMiddleware(
  queryValidators: Record<string, (val: unknown) => boolean>,
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    for (const [query, isValid] of Object.entries(queryValidators)) {
      if (!isValid(req.query[query])) {
        return next(
          new BadRequest(`request query param "${query}" is not valid`),
        );
      }
    }
    next();
  };
}
