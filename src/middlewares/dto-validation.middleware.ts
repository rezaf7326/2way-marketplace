import { NextFunction, Request, RequestHandler, Response } from 'express';
import { validate, ValidationError } from 'class-validator';
import { ClassType } from 'class-transformer-validator';
import { plainToInstance } from 'class-transformer';

export function dtoValidationMiddleware(
  dtoClass: ClassType<any>,
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    req.body = plainToInstance(dtoClass, req.body);
    validate(req.body).then((errors: ValidationError[]) => {
      errors.length > 0 ? next(errors) : next();
    });
  };
}
