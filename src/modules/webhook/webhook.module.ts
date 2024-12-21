import { Module } from '@nestjs/common';
import { BugLogRepository } from 'src/repositories/bug-log.repository';
import { BuildLogRepository } from 'src/repositories/build-log.repository';
import { TypeOrmExModule } from 'src/typeorm';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([BuildLogRepository, BugLogRepository]),
  ],
  providers: [WebhookService],
  controllers: [WebhookController],
  exports: [WebhookService],
})
export class WebhookModule {}
