import {
  PlanQuestionEntity,
  PlanQuestionOptionEntity,
  PricingPlanEntity,
  ReceivingBankEntity,
} from 'src/entities/master-data';
import { CustomRepository } from 'src/typeorm';
import { Repository } from 'typeorm';

@CustomRepository(PricingPlanEntity)
export class PricingPlanRepository extends Repository<PricingPlanEntity> {}

@CustomRepository(PlanQuestionEntity)
export class PlanQuestionRepository extends Repository<PlanQuestionEntity> {}

@CustomRepository(PlanQuestionOptionEntity)
export class PlanQuestionOptionRepository extends Repository<PlanQuestionOptionEntity> {}

@CustomRepository(ReceivingBankEntity)
export class ReceivingBankRepository extends Repository<ReceivingBankEntity> {}
