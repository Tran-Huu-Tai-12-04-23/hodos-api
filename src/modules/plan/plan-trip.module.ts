import { Module } from '@nestjs/common';
import { TripDirectionRepository, TripRepository } from 'src/repositories';
import { BlogRepository } from 'src/repositories/blog.repository';
import { LocationRepository } from 'src/repositories/location.repository';
import { TypeOrmExModule } from 'src/typeorm';
import { CommonModule } from '../common/common.module';
import { DeviceTrialModule } from '../device-trial/device-trial.module';
import { GeminiAIModule } from '../geminiAI/geminiAI.module';
import { UploadModule } from '../upload/upload.module';
import { UserSubscriptionsModule } from '../user-subscriptions/user-subscriptions.module';
import { PlanTripController } from './plan-trip.controller';
import { PlanTripService } from './plan-trip.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      BlogRepository,
      LocationRepository,
      TripRepository,
      TripDirectionRepository,
    ]),
    GeminiAIModule,
    CommonModule,
    UploadModule,
    UserSubscriptionsModule,
    DeviceTrialModule,
  ],
  providers: [PlanTripService],
  controllers: [PlanTripController],
  exports: [PlanTripService],
})
export class PlanTripModule {}
