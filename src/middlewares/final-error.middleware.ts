import { Request, Response, ErrorRequestHandler, NextFunction } from 'express';
import { BadRequest, HttpError, InternalServerError } from 'http-errors';
import { Logger } from '../common/logger/logger';
import { ValidationError } from 'class-validator';

export function finalErrorMiddleware(): ErrorRequestHandler {
  return (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ValidationError) {
      err = new BadRequest(err.toString());
    }
    if (Array.isArray(err) && err.some((e) => e instanceof ValidationError)) {
      const validationErr = new ValidationError();
      validationErr.children = err;
      err = new BadRequest(validationErr.toString());
    }
    const { status, message } =
      err instanceof HttpError ? err : new InternalServerError();
    new Logger('ErrorMiddleware').error(message);
    if (status >= 500) {
      console.error(err);
    }
    res.status(status).send(message);
  };
}
