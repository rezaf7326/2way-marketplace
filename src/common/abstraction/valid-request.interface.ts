import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface ValidRequest<DTO = unknown> extends Request {
  user: JwtPayload;
  body: DTO;
}
