import { Module } from '@nestjs/common';
import {
  PricingPlanRepository,
  TransactionRepository,
  UserSubscriptionRepository,
} from 'src/repositories';
import { TypeOrmExModule } from 'src/typeorm';
import { SepayController } from './sepay.controller';
import { SepayService } from './sepay.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      TransactionRepository,
      PricingPlanRepository,
      UserSubscriptionRepository,
    ]),
  ],
  providers: [SepayService],
  controllers: [SepayController],
  exports: [SepayService],
})
export class SepayModule {}
