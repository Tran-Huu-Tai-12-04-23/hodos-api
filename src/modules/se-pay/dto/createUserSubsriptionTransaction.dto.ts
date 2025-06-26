import { IsNotEmpty } from 'class-validator';

export class CreateUserSubscriptionTransactionDto {
  @IsNotEmpty()
  pricingPlanId: string;
}
