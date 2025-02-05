import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';

@Module({
  imports: [],
  providers: [AiService, ConfigService],
  controllers: [AiController],
  exports: [AiService],
})
export class AiModule {}
