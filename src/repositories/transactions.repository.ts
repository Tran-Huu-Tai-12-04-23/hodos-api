import {
  PricingPlanEntity,
  TransactionEntity,
  UserSubscriptionEntity,
} from 'src/entities';
import { CustomRepository } from 'src/typeorm/typeorm-decorater';
import { Repository } from 'typeorm';

@CustomRepository(TransactionEntity)
export class TransactionRepository extends Repository<TransactionEntity> {}

@CustomRepository(UserSubscriptionEntity)
export class UserSubscriptionRepository extends Repository<UserSubscriptionEntity> {}

@CustomRepository(PricingPlanEntity)
export class PricingPlanRepository extends Repository<PricingPlanEntity> {}
