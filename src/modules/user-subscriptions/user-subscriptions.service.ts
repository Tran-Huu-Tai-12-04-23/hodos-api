import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  BillingCycle,
  PricingPlanEntity,
  SubscriptionStatus,
  UserSubscriptionEntity,
} from 'src/entities';
import { UserEntity } from 'src/entities/user.entity';
import {
  PricingPlanRepository,
  UserSubscriptionRepository,
} from 'src/repositories';
import { In } from 'typeorm';

@Injectable()
export class UserSubscriptionsService {
  constructor(
    public readonly configService: ConfigService,
    private readonly repo: UserSubscriptionRepository,
    private readonly pricingPlanRepo: PricingPlanRepository,
  ) {}

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
}
