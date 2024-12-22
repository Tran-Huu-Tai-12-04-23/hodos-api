import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { PaginationDto } from 'src/dto/pagination.dto';
import { ErrorLogRepository } from 'src/repositories';
import { BuildLogRepository } from 'src/repositories/build-log.repository';
import { Raw } from 'typeorm';
import { ErrorLogPaginationDTO } from './dto';
import { BuildLogPaginationDTO } from './dto/build-log.dto';
@Injectable()
export class LogService {
  secret: string;
  constructor(
    private readonly buildLogRepo: BuildLogRepository,
    private readonly errorLogRepo: ErrorLogRepository,
  ) {}

  async buildLogPagination(body: PaginationDto<BuildLogPaginationDTO>) {
    const where: any = {};
    if (body?.where?.buildDate) {
      const startOfDay = moment(body.where.buildDate)
        .startOf('day')
        .format('YYYY-MM-DD HH:mm:ss');
      const endOfDay = moment(body.where.buildDate)
        .endOf('day')
        .format('YYYY-MM-DD HH:mm:ss');
      where.createdAt = Raw(
        (alias) => `${alias} BETWEEN "${startOfDay}" AND "${endOfDay}"`,
      );
    }
    return await this.buildLogRepo.findAndCount({
      where,
      order: {
        createdAt: 'DESC',
      },
      skip: body?.skip,
      take: body?.take,
    });
  }

  async errorLogPagination(body: PaginationDto<ErrorLogPaginationDTO>) {
    const where: any = {};
    if (body?.where?.logDate) {
      const startOfDay = moment(body.where.logDate)
        .startOf('day')
        .format('YYYY-MM-DD HH:mm:ss');
      const endOfDay = moment(body.where.logDate)
        .endOf('day')
        .format('YYYY-MM-DD HH:mm:ss');
      where.createdAt = Raw(
        (alias) => `DATE(${alias}) BETWEEN "${startOfDay}" AND "${endOfDay}"`,
      );
    }
    return await this.errorLogRepo.findAndCount({
      where,
      order: {
        createdAt: 'DESC',
      },
      skip: body?.skip,
      take: body?.take,
    });
  }
}
