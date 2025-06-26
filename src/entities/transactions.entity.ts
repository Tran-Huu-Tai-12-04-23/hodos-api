import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntityCustom } from './base.entity';
import { UserEntity } from './user.entity'; // Assuming you have a UserEntity
// import { UserSubscriptionEntity } from './user-subscription.entity'; // If linking directly

export enum TransactionType {
  SUBSCRIPTION_PAYMENT = 'subscription_payment',
}

export enum TransactionStatus {
  PENDING = 'pending',
  SUCCESSFUL = 'successful',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
  PROCESSING = 'processing',
}

@Entity('transactions')
@Index(['userId', 'status', 'type'])
@Index(['gatewayTransactionId', 'paymentGateway'])
export class TransactionEntity extends BaseEntityCustom {
  @ApiProperty({
    description: 'ID of the user associated with this transaction',
    example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  })
  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.id, {
    onDelete: 'SET NULL',
    nullable: true,
  }) // Or CASCADE depending on policy
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ApiProperty({
    description: 'Type of the transaction',
    enum: TransactionType,
    example: TransactionType.SUBSCRIPTION_PAYMENT,
  })
  @Column({
    type: 'enum',
    enum: TransactionType,
    nullable: false,
  })
  type: TransactionType;

  @ApiProperty({
    description: 'A brief description of the transaction',
    example: 'Monthly subscription fee for Premium Plan',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({
    description: 'Amount of the transaction',
    example: 19.99,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  amount: number;

  @ApiProperty({
    description: 'Currency of the transaction amount (ISO 4217 code)',
    example: 'USD',
  })
  @Column({ type: 'varchar', length: 3, nullable: false })
  currency: string;

  @ApiProperty({
    description: 'Status of the transaction',
    enum: TransactionStatus,
    example: TransactionStatus.SUCCESSFUL,
  })
  @Column({
    type: 'enum',
    enum: TransactionStatus,
    nullable: false,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @ApiProperty({
    description:
      'Payment gateway used for the transaction (e.g., Stripe, PayPal, MoMo)',
    example: 'Stripe',
    required: false,
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  paymentGateway?: string;

  /** để kiểm tra giao dịch thành công hay chưa , mục này đc gắn vào nội dung */
  @ApiProperty({
    description: 'Transaction ID from the payment gateway (if applicable)',
    example: 'pi_xxxxxxxxxxxxxx',
    required: false,
  })
  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  gatewayTransactionId?: string;

  @ApiProperty({
    description:
      'ID of the related entity (e.g., UserSubscription ID, Booking ID)',
    example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    required: false,
  })
  @Column({ type: 'uuid', nullable: true })
  relatedEntityId?: string;

  @ApiProperty({
    description:
      'Type of the related entity (e.g., "UserSubscription", "Booking")',
    example: 'UserSubscription',
    required: false,
  })
  @Column({ type: 'varchar', length: 100, nullable: true })
  relatedEntityType?: string;

  @ApiProperty({
    description:
      'Additional metadata for the transaction (e.g., payment method details, IP address)',
    type: 'object',
    additionalProperties: true,
    required: false,
  })
  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @ApiProperty({
    description: 'Timestamp when the transaction was processed or completed',
    required: false,
  })
  @Column({ type: 'timestamp with time zone', nullable: true })
  processedAt?: Date;
}
