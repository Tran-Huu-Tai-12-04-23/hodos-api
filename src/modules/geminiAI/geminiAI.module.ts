import { Module } from '@nestjs/common';
import { LocationRepository } from 'src/repositories/location.repository';
import { TypeOrmExModule } from 'src/typeorm';
import { GeminiAIController } from './geminiAI.controller';
import { GeminiAIService } from './geminiAI.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([LocationRepository])],
  providers: [GeminiAIService],
  controllers: [GeminiAIController],
  exports: [GeminiAIService],
})
export class GeminiAIModule {}
