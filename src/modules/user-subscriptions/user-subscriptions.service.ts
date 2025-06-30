import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  SubscriptionStatus,
  TransactionEntity,
  TransactionStatus,
  UserSubscriptionEntity,
} from 'src/entities';
import { BillingCycle, PricingPlanEntity } from 'src/entities/master-data';
import { UserEntity } from 'src/entities/user.entity';
import {
  TransactionRepository,
  UserSubscriptionRepository,
} from 'src/repositories';
import {
  PricingPlanRepository,
  ReceivingBankRepository,
} from 'src/repositories/master-data.repository';
import { In } from 'typeorm';
import { SepayService } from '../se-pay/sepay.service';
import { TransactionService } from '../transactions/transaction.service';

@Injectable()
export class UserSubscriptionsService {
  constructor(
    public readonly configService: ConfigService,
    private readonly repo: UserSubscriptionRepository,
    private readonly pricingPlanRepo: PricingPlanRepository,
    private readonly receivingBankRepo: ReceivingBankRepository,
    private readonly sePayService: SepayService,
    private readonly transactionRepo: TransactionRepository,
    private readonly transactionService: TransactionService,
  ) {}

  /** get all plan active  */
  async getAllActivePlans(): Promise<PricingPlanEntity[]> {
    const res = await this.pricingPlanRepo.find({
      where: { isActive: true },
      order: {
        displayOrder: 'ASC',
      },
    });
    return res;
  }
  /** get suggest pricing plan for user  */
  async getSuggestPricingPlanForUser(): Promise<PricingPlanEntity | null> {
    const res = await this.pricingPlanRepo.findOne({
      where: { isActive: true },
      order: {
        displayOrder: 'ASC',
      },
    });

    return res;
  }

  async createSubscription(
    user: UserEntity,
    pricingPlan: PricingPlanEntity,
    repo?: UserSubscriptionRepository,
  ): Promise<void> {
    const newSubscription = new UserSubscriptionEntity();
    newSubscription.userId = user.id;
    newSubscription.pricingPlanId = pricingPlan.id;
    newSubscription.startDate = new Date();
    newSubscription.autoRenew = false;
    newSubscription.status = SubscriptionStatus.ACTIVE;

    switch (pricingPlan.billingCycle) {
      case BillingCycle.MONTHLY: {
        newSubscription.nextPaymentDate = new Date(
          newSubscription.startDate.getFullYear(),
          newSubscription.startDate.getMonth() + 1,
          newSubscription.startDate.getDate(),
        );
        break;
      }
      case BillingCycle.QUARTERLY: {
        newSubscription.nextPaymentDate = new Date(
          newSubscription.startDate.getFullYear(),
          newSubscription.startDate.getMonth() + 3,
          newSubscription.startDate.getDate(),
        );
        break;
      }
      case BillingCycle.YEARLY: {
        newSubscription.nextPaymentDate = new Date(
          newSubscription.startDate.getFullYear() + 1,
          newSubscription.startDate.getMonth(),
          newSubscription.startDate.getDate(),
        );
        break;
      }
      default: {
        throw new Error(
          `Unsupported billing cycle: ${pricingPlan.billingCycle}`,
        );
      }
    }
    newSubscription.currentPeriodEndDate = newSubscription.nextPaymentDate;
    if (repo) {
      await repo.insert(newSubscription);
    } else {
      await this.repo.insert(newSubscription);
    }
  }

  async createSubscriptionTrial(
    user: UserEntity,
    pricingPlanId: string,
  ): Promise<void> {
    const pricingPlan = await this.pricingPlanRepo.findOne({
      where: { id: pricingPlanId, isActive: true },
    });

    if (!pricingPlan) {
      throw new Error(
        `Pricing plan with ID ${pricingPlanId} not found or inactive.`,
      );
    }

    const newSubscription = new UserSubscriptionEntity();
    newSubscription.userId = user.id;
    newSubscription.pricingPlanId = pricingPlan.id;
    newSubscription.startDate = new Date();
    newSubscription.autoRenew = false;
    newSubscription.status = SubscriptionStatus.TRIALING;
    newSubscription.currentPeriodEndDate = new Date(
      newSubscription.startDate.getTime() +
        pricingPlan.trialPeriodDays * 24 * 60 * 60 * 1000,
    );
    newSubscription.nextPaymentDate = newSubscription.currentPeriodEndDate;
    newSubscription.isTrial = true;
    newSubscription.cancelledAt = newSubscription.currentPeriodEndDate;
    newSubscription.trialEndsAt = newSubscription.currentPeriodEndDate;
    await this.repo.insert(newSubscription);
  }

  // get current user subscription
  async getCurrentUserSubscription(
    userId: string,
  ): Promise<UserSubscriptionEntity | null> {
    return await this.repo.findOne({
      where: {
        userId: userId,
        status: In([SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIALING]),
      },
      relations: {
        pricingPlan: true,
      },
    });
  }

  async hasPremiumAccess(userId: string): Promise<boolean> {
    const subscription = await this.repo.findOne({
      where: {
        userId: userId,
        status: In([SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIALING]),
      },
      order: {
        startDate: 'DESC',
      },
    });
    if (!subscription) return false;

    const now = new Date();

    if (
      subscription.isTrial &&
      subscription.status === SubscriptionStatus.TRIALING
    ) {
      return !!subscription.trialEndsAt && subscription.trialEndsAt > now;
    }

    if (subscription.status === SubscriptionStatus.ACTIVE) {
      return true;
    }

    return false;
  }

  /** get info payment of pricing plan */
  async subPricingPlan(user: UserEntity, pricingPlanId: string) {
    const receivingBank = await this.receivingBankRepo.findOne({
      where: { isActive: true },
    });
    if (!receivingBank) {
      throw new Error(
        'No active receiving bank found. Please contact support Admin [123123123]',
      );
    }

    const result = await this.sePayService.createUserSubscriptionTransaction(
      user,
      {
        pricingPlanId: pricingPlanId,
      },
    );

    return {
      result,
      receivingBank,
    };
  }

  // user have completed payment
  async userHaveCompletedPayment(
    userId: string,
    transactionId: string,
  ): Promise<{
    message: string;
    isCompleted: boolean;
  }> {
    const transaction = await this.transactionRepo.findOne({
      where: {
        userId: userId,
        id: transactionId,
      },
    });
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    return this.repo.manager.transaction(async (trans) => {
      const transactionRepo = trans.getRepository(TransactionEntity);
      // if webhook is not called yet, we can check the transaction status then call api sepay to get the latest status
      if (
        transaction.status !== TransactionStatus.SUCCESSFUL &&
        transaction.gatewayTransactionId
      ) {
        const { isSuccess } =
          await this.sePayService.checkTransactionSuccessInDay({
            amount: transaction.amount,
            content: transaction.gatewayTransactionId,
          });

        if (isSuccess) {
          await this.transactionService.completeTransaction(
            transaction.id,
            transactionRepo,
          );
          return {
            message: 'Transaction already completed',
            isCompleted: true,
          };
        } else {
          return {
            message: 'Transaction is still pending',
            isCompleted: false,
          };
        }
      }

      if (transaction.status === TransactionStatus.SUCCESSFUL) {
        return {
          message: 'Transaction already completed',
          isCompleted: true,
        };
      } else {
        return {
          message: 'Transaction is still pending',
          isCompleted: false,
        };
      }
    });
  }
}
