import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LocationModule } from '../location/location.module';
import { TelegramModule } from '../telegram/telegram.module';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';

@Module({
  imports: [LocationModule, TelegramModule],
  providers: [AiService, ConfigService],
  controllers: [AiController],
  exports: [AiService],
})
export class AiModule {}
