import { Module } from '@nestjs/common';
import {
  PlanQuestionOptionRepository,
  PlanQuestionRepository,
  PricingPlanRepository,
  ReceivingBankRepository,
} from 'src/repositories/master-data.repository';
import { TypeOrmExModule } from 'src/typeorm';
import { SepayModule } from '../se-pay/sepay.module';
import { MasterDataController } from './master-data.controller';
import { MasterDataService } from './master-data.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      PricingPlanRepository,
      PlanQuestionRepository,
      PlanQuestionOptionRepository,
      ReceivingBankRepository,
    ]),
    SepayModule,
  ],
  providers: [MasterDataService],
  controllers: [MasterDataController],
  exports: [MasterDataService],
})
export class MasterDataModule {}
