import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BillingCycle, PricingPlanEntity } from 'src/entities';
import { UserEntity } from 'src/entities/user.entity';
import { PricingPlanRepository } from 'src/repositories';
import { SepayService } from '../se-pay/sepay.service';

@Injectable()
export class PricingPlanService {
  constructor(
    public readonly configService: ConfigService,
    private readonly repo: PricingPlanRepository,
    private readonly sepayService: SepayService,
  ) {}

  async subscriptionPlan(user: UserEntity, pricingPlanId: string) {
    return await this.sepayService.createUserSubscriptionTransaction(user, {
      pricingPlanId: pricingPlanId,
    });
  }

  async getAllPlans(): Promise<PricingPlanEntity[]> {
    return await this.repo.find({
      where: { isActive: true },
      order: { displayOrder: 'ASC' },
    });
  }

  async getPlanById(id: string): Promise<PricingPlanEntity> {
    const plan = await this.repo.findOne({
      where: { id, isActive: true },
    });
    if (!plan) {
      throw new Error(`Pricing plan with ID ${id} not found or inactive.`);
    }
    return plan;
  }

  async initData(): Promise<{
    message: string;
  }> {
    const testPlan = this.repo.create({
      name: 'Premium Plan',
      planCode: 'premium_monthly',
      description:
        'Access to all premium features, including unlimited trips and advanced analytics.',
      price: 100000,
      currency: 'VND',
      billingCycle: BillingCycle.MONTHLY,
      features: ['Unlimited Trips', 'Advanced Analytics', 'Priority Support'],
      isActive: true,
      trialPeriodDays: 7,
      displayOrder: 1,
      limits: {
        maxTripsPerMonth: 10,
        maxCollaboratorsPerTrip: 5,
      },
    });
    await this.repo.insert(testPlan);
    return {
      message: 'Pricing plan service initialized successfully',
    };
  }
}
