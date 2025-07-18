import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { dataSource } from '../typeorm/typeorm.config';

// Define custom Request interface with the properties we need
interface ExtendedRequest {
  user?: {
    id?: string;
    [key: string]: any;
  };
  queryRunner?: any;
  ip?: string;
  headers: {
    [key: string]: string | string[] | undefined;
  };
}

@Injectable()
export class LogContextMiddleware implements NestMiddleware {
  use(req: ExtendedRequest, res: Response, next: NextFunction) {
    const queryRunner = dataSource.createQueryRunner();
    queryRunner.data = {
      user: req.user?.id || null,
      ip: req.ip || (req.headers['x-forwarded-for'] as string),
    };
    req.queryRunner = queryRunner;
    next();
  }
}
