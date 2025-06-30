import { BillingCycle } from 'src/entities/master-data/pricing-plans.entity';

export class CreatePricingPlanDto {
  name: string;
  planCode: string;
  description?: string;
  price: number;
  currency: string;
  billingCycle: BillingCycle;
  features?: string[];
  isActive?: boolean;
  trialPeriodDays?: number;
  displayOrder?: number;
  limits?: Record<string, number>;
}

export class UpdatePricingPlanDto extends CreatePricingPlanDto {
  id: string;
}
