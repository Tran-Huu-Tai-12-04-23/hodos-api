import { Module } from '@nestjs/common';
import { BuildLogRepository } from 'src/repositories/build-log.repository';
import { ErrorLogRepository } from 'src/repositories/error-log.repository';
import { TypeOrmExModule } from 'src/typeorm';
import { LogController } from './log.controller';
import { LogService } from './log.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      BuildLogRepository,
      ErrorLogRepository,
    ]),
  ],
  providers: [LogService],
  controllers: [LogController],
  exports: [LogService],
})
export class LogModule {}
