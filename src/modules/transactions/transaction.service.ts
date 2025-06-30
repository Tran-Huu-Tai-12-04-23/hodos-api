import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaginationDto } from 'src/dto/pagination.dto';
import { TransactionEntity, TransactionStatus } from 'src/entities';
import { TransactionRepository } from 'src/repositories';
import { FindOptionsWhere } from 'typeorm';

@Injectable()
export class TransactionService {
  constructor(
    public readonly configService: ConfigService,
    private readonly repo: TransactionRepository,
  ) {}

  async pagination(pagination: PaginationDto<any>): Promise<{
    data: TransactionEntity[];
    total: number;
    totalMoney: number;
    totalSuccessful: number;
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
      where: whereCon,
      skip,
      take,
      order: {
        createdAt: 'DESC',
      },
      relations: {
        user: true,
      },
    });

    const totalMoney = await this.repo.sum('amount', {
      status: TransactionStatus.SUCCESSFUL,
    });

    const totalSuccessful = await this.repo.count({
      where: {
        status: TransactionStatus.SUCCESSFUL,
      },
    });

    return {
      data: data,
      total: total,
      totalMoney: totalMoney || 0,
      totalSuccessful: totalSuccessful,
    };
  }

  async completeTransaction(id: string, repo?: TransactionRepository) {
    const transactionRepo = repo || this.repo;
    const checkTransaction = await transactionRepo.findOne({
      where: {
        id: id,
        status: TransactionStatus.PENDING,
      },
    });
    if (!checkTransaction) {
      throw new Error('Transaction not found or already completed');
    }
    const updateData = {
      status: TransactionStatus.SUCCESSFUL,
      processedAt: new Date(),
      isActive: true,
      updatedAt: new Date(),
      metadata: {
        ...checkTransaction.metadata,
      } as any,
    };
    await transactionRepo.update(checkTransaction.id, updateData);
  }
}
