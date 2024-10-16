import { Request } from 'express';

export class ExpressHelper {
  static extractAuthToken(request: Request) {
    return request.header('Authorization')?.replace('Bearer ', '') || '';
  }
}
