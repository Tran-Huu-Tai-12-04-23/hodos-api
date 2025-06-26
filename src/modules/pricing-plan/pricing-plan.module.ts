import { Module } from '@nestjs/common';
import { PricingPlanRepository } from 'src/repositories';
import { TypeOrmExModule } from 'src/typeorm';
import { SepayModule } from '../se-pay/sepay.module';
import { PricingPlanController } from './pricing-plan.controller';
import { PricingPlanService } from './pricing-plan.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([PricingPlanRepository]),
    SepayModule,
  ],
  providers: [PricingPlanService],
  controllers: [PricingPlanController],
  exports: [PricingPlanService],
})
export class PricingPlanModule {}
