import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntityCustom } from './base.entity';
import { PricingPlanEntity } from './pricing-plans.entity';
import { UserEntity } from './user.entity';

export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled', // User initiated cancellation, might still be active until period end
  EXPIRED = 'expired', // Period ended, not renewed
  PENDING_PAYMENT = 'pending_payment',
  TRIALING = 'trialing',
  PAST_DUE = 'past_due', // Payment failed
  INCOMPLETE = 'incomplete', // Initial setup not finished
}

@Entity('user_subscriptions')
@Index(['userId', 'status'])
@Index(['pricingPlanId', 'status'])
export class UserSubscriptionEntity extends BaseEntityCustom {
  @ApiProperty({
    description: 'ID of the user who owns this subscription',
    example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  })
  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' }) // Assuming UserEntity has a 'subscriptions' one-to-many relation
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ApiProperty({
    description: 'ID of the pricing plan this subscription is for',
    example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  })
  @Column({ type: 'uuid' })
  pricingPlanId: string;

  @ManyToOne(() => PricingPlanEntity, (plan) => plan.subscriptions, {
    onDelete: 'RESTRICT',
  }) // Prevent plan deletion if active subscriptions exist
  @JoinColumn({ name: 'pricingPlanId' })
  pricingPlan: PricingPlanEntity;

  @ApiProperty({
    description: 'Timestamp when the subscription started (or trial started)',
    example: '2024-06-01T00:00:00Z',
  })
  @Column({ type: 'timestamp with time zone', nullable: false })
  startDate: Date;

  @ApiProperty({
    description:
      'Timestamp when the current billing period ends / subscription expires if not renewed',
    example: '2024-07-01T00:00:00Z',
    required: false,
  })
  @Column({ type: 'timestamp with time zone', nullable: true })
  currentPeriodEndDate?: Date;

  @ApiProperty({
    description: 'Timestamp when the subscription was cancelled by the user',
    example: '2024-06-15T00:00:00Z',
    required: false,
  })
  @Column({ type: 'timestamp with time zone', nullable: true })
  cancelledAt?: Date;

  @ApiProperty({
    description: 'Status of the subscription',
    enum: SubscriptionStatus,
    example: SubscriptionStatus.ACTIVE,
  })
  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    nullable: false,
  })
  status: SubscriptionStatus;

  @ApiProperty({
    description:
      'Indicates if the subscription will auto-renew at the end of the current period',
    example: true,
    default: true,
  })
  @Column({ type: 'boolean', default: true })
  autoRenew: boolean;

  @ApiProperty({
    description:
      'Timestamp of the last successful payment for this subscription',
    required: false,
  })
  @Column({ type: 'timestamp with time zone', nullable: true })
  lastPaymentDate?: Date;

  @ApiProperty({
    description: 'Timestamp for the next scheduled payment attempt',
    required: false,
  })
  @Column({ type: 'timestamp with time zone', nullable: true })
  nextPaymentDate?: Date;

  @ApiProperty({
    description:
      'ID from the payment gateway for this subscription (e.g., Stripe Subscription ID)',
    example: 'sub_xxxxxxxxxxxxxx',
    required: false,
  })
  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  gatewaySubscriptionId?: string;

  // Optional: If you want to link transactions directly to a subscription
  // @OneToMany(() => TransactionEntity, transaction => transaction.userSubscription)
  // transactions: TransactionEntity[];

  @ApiProperty({
    description: 'Reason for cancellation, if applicable',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  cancellationReason?: string;
}
