import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaginationDto } from 'src/dto/pagination.dto';
import {
  NotificationEntity,
  NotificationType,
  SubscriptionStatus,
  TransactionEntity,
  TransactionStatus,
  UserEntity,
  UserSubscriptionEntity,
} from 'src/entities';
import {
  getPlanDurationDays,
  PricingPlanEntity,
} from 'src/entities/master-data';
import { TransactionRepository } from 'src/repositories/transactions.repository';
import { FindOptionsWhere } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateNotificationDto } from '../notification/dto';
import { NotificationService } from '../notification/notification.service';
@Injectable()
export class TransactionService {
  constructor(
    public readonly configService: ConfigService,
    private readonly repo: TransactionRepository,
    private readonly notificationService: NotificationService,
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

  async completeTransaction(id: string) {
    return this.repo.manager.transaction(async (trans) => {
      const repo = trans.getRepository(TransactionEntity);
      const userSubscriptionRepo = trans.getRepository(UserSubscriptionEntity);
      const notificationRepo = trans.getRepository(NotificationEntity);
      const userRepo = trans.getRepository(UserEntity);

      const checkTransaction = await repo.findOne({
        where: {
          id: id,
          status: TransactionStatus.PENDING,
        },
      });
      if (!checkTransaction) {
        throw new Error('Transaction not found or already completed');
      }
      // create user subscription if not exists
      const newUserSubscription = new UserSubscriptionEntity();
      newUserSubscription.id = uuidv4();
      newUserSubscription.userId = checkTransaction.userId;
      if (!checkTransaction.relatedEntityId) {
        throw new Error('Related entity ID is required for subscription');
      }
      newUserSubscription.pricingPlanId = checkTransaction.relatedEntityId;
      newUserSubscription.startDate = new Date();
      newUserSubscription.autoRenew = true;
      newUserSubscription.status = SubscriptionStatus.ACTIVE;
      newUserSubscription.isTrial = false;
      newUserSubscription.createdAt = new Date();

      if (checkTransaction.metadata?.pricingPlan) {
        const pricingPlan: PricingPlanEntity =
          checkTransaction.metadata?.pricingPlan;
        const planDurationDays = getPlanDurationDays(pricingPlan);
        if (planDurationDays > 0) {
          newUserSubscription.nextPaymentDate = new Date(
            newUserSubscription.startDate.getTime() +
              planDurationDays * 24 * 60 * 60 * 1000,
          );
          newUserSubscription.currentPeriodEndDate = new Date(
            newUserSubscription.startDate.getTime() +
              planDurationDays * 24 * 60 * 60 * 1000,
          );
        }
      }
      await userSubscriptionRepo.insert(newUserSubscription);

      const updateData = {
        status: TransactionStatus.SUCCESSFUL,
        processedAt: new Date(),
        updatedAt: new Date(),
        metadata: {
          ...checkTransaction.metadata,
          newUserSubscription,
        } as any,
      };

      await repo.update(checkTransaction.id, updateData);
      // update user subscription status if exists
      await userRepo.update(checkTransaction.userId, { isPremium: true });
      // create notification for user
      const notificationDto: CreateNotificationDto = {
        title: 'Transaction Successful',
        message: `Your transaction with ${checkTransaction.description} has been successfully completed.`,
        isRead: false,
        type: NotificationType.ALERT,
        metaData: {
          transaction: checkTransaction,
          userSubscription: newUserSubscription,
          pricingPlan: checkTransaction.metadata?.pricingPlan,
        },
        userId: checkTransaction.userId,
        scheduledNotificationId: null,
      };
      await this.notificationService.createNotification(
        notificationDto,
        checkTransaction.userId,
        notificationRepo,
      );

      // Convert entity to a simple JSON object for storage
      const subscriptionData: Record<string, any> = {
        id: newUserSubscription.id,
        userId: newUserSubscription.userId,
        pricingPlanId: newUserSubscription.pricingPlanId,
        startDate: newUserSubscription.startDate,
        nextPaymentDate: newUserSubscription.nextPaymentDate,
        currentPeriodEndDate: newUserSubscription.currentPeriodEndDate,
        status: newUserSubscription.status,
        autoRenew: newUserSubscription.autoRenew,
        isTrial: newUserSubscription.isTrial,
        createdAt: newUserSubscription.createdAt,
        pricingPlan: checkTransaction.metadata?.pricingPlan,
      };

      await userRepo.update(checkTransaction.userId, {
        subscriptions: subscriptionData,
        updatedAt: new Date(),
      });
    });
  }
}
