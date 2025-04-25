import { Module } from '@nestjs/common';
import { BlogRepository } from 'src/repositories/blog.repository';
import { TypeOrmExModule } from 'src/typeorm';
import { GeminiAIModule } from '../geminiAI/geminiAI.module';
import { PlanTripController } from './plan-trip.controller';
import { PlanTripService } from './plan-trip.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([BlogRepository]),
    GeminiAIModule,
  ],
  providers: [PlanTripService],
  controllers: [PlanTripController],
  exports: [PlanTripService],
})
export class PlanTripModule {}
