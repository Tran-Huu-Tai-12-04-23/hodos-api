import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaginationDto } from 'src/dto/pagination.dto';
import { TransactionEntity } from 'src/entities';
import { TransactionRepository } from 'src/repositories';
import { FindOptionsWhere } from 'typeorm';

@Injectable()
export class TransactionService {
  constructor(
    public readonly configService: ConfigService,
    private readonly repo: TransactionRepository,
  ) {}

  async pagination(pagination: PaginationDto<any>): Promise<{
    result: TransactionEntity[];
    total: number;
  }> {
    const { skip, take, where } = pagination;

    const whereCon: FindOptionsWhere<TransactionEntity> = {};
    if (where?.userId) {
      whereCon.userId = where.userId;
    }
    if (where?.pricingPlanId) {
      whereCon.relatedEntityId = where.pricingPlanId;
      whereCon.relatedEntityType = 'pricingPlan';
    }
    if (where?.type) {
      whereCon.type = where.type;
    }
    if (where?.status) {
      whereCon.status = where.status;
    }

    const [data, total] = await this.repo.findAndCount({
      skip,
      take,
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      result: data,
      total: total,
    };
  }
}
