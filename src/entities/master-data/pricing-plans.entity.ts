import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntityCustom } from '../base.entity';
import { UserSubscriptionEntity } from '../user-subscription.entity';

export enum BillingCycle {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  QUARTERLY = 'quarterly',
  ONE_TIME = 'one_time',
  CUSTOM = 'custom', // For plans with non-standard billing
}

@Entity('master_data_pricing_plans')
export class PricingPlanEntity extends BaseEntityCustom {
  @ApiProperty({
    description: 'Name of the pricing plan',
    example: 'Premium Plan',
    uniqueItems: true,
  })
  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  name: string;

  @ApiProperty({
    description: 'Unique code or slug for the plan, for easy reference',
    example: 'premium_monthly',
    uniqueItems: true,
  })
  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  planCode: string;

  @ApiProperty({
    description: 'Detailed description of the pricing plan',
    example:
      'Access to all premium features, including unlimited trips and advanced analytics.',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({
    description: 'Price of the plan',
    example: 19.99,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  @ApiProperty({
    description: 'Currency of the price (ISO 4217 code)',
    example: 'USD',
  })
  @Column({ type: 'varchar', length: 3, nullable: false })
  currency: string;

  @ApiProperty({
    description: 'Billing cycle for the plan',
    enum: BillingCycle,
    example: BillingCycle.MONTHLY,
  })
  @Column({
    type: 'enum',
    enum: BillingCycle,
    nullable: false,
  })
  billingCycle: BillingCycle;

  @ApiProperty({
    description:
      'List of features included in this plan. Can be stored as JSON array of strings or objects.',
    example: ['Unlimited Trips', 'Advanced Analytics', 'Priority Support'],
    type: 'array',
    items: { type: 'string' },
    required: false,
  })
  @Column({ type: 'jsonb', nullable: true })
  features?: string[] | Record<string, any>[];

  @ApiProperty({
    description:
      'Indicates if the plan is currently active and available for new subscriptions',
    example: true,
    default: true,
  })
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'Trial period in days for this plan (0 if no trial)',
    example: 7,
    default: 0,
  })
  @Column({ type: 'int', default: 0 })
  trialPeriodDays: number;

  @ApiProperty({
    description: 'Display order for the pricing plans on a pricing page',
    example: 1,
    required: false,
  })
  @Column({ type: 'int', nullable: true })
  displayOrder?: number;

  @ApiProperty({
    description:
      'Limits associated with this plan (e.g., max_trips, max_users)',
    type: 'object',
    additionalProperties: { type: 'number' },
    required: false,
  })
  @Column({ type: 'jsonb', nullable: true })
  limits?: Record<string, number>; // e.g., { "maxTripsPerMonth": 10, "maxCollaboratorsPerTrip": 5 }

  @OneToMany(
    () => UserSubscriptionEntity,
    (subscription) => subscription.pricingPlan,
  )
  subscriptions: UserSubscriptionEntity[];
}
export const getPlanDurationDays = (plan: PricingPlanEntity): number => {
  switch (plan.billingCycle) {
    case BillingCycle.MONTHLY:
      return 30;
    case BillingCycle.QUARTERLY:
      return 90;
    case BillingCycle.YEARLY:
      return 365;
    case BillingCycle.ONE_TIME:
      return 0;
    case BillingCycle.CUSTOM:
      return plan.trialPeriodDays || 0;
    default:
      return 0;
  }
};
