import { Module } from '@nestjs/common';
import { BuildLogRepository } from 'src/repositories/build-log.repository';
import { ErrorLogRepository } from 'src/repositories/error-log.repository';
import { TypeOrmExModule } from 'src/typeorm';
import { ErrorLogService } from './error-log.service';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      BuildLogRepository,
      ErrorLogRepository,
    ]),
  ],
  providers: [WebhookService, ErrorLogService],
  controllers: [WebhookController],
  exports: [WebhookService, ErrorLogService],
})
export class WebhookModule {}
