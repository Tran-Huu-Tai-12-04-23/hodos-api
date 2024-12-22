import { Injectable } from '@nestjs/common';
import { ErrorLogEntity } from 'src/entities/error-log.entity';
import { ErrorLogRepository } from 'src/repositories';
import { BugLogDto } from './dto/bug-log.dto';
@Injectable()
export class ErrorLogService {
  secret: string;
  constructor(private readonly errorLogRepo: ErrorLogRepository) {}

  async handleBugLog(bugLog: BugLogDto) {
    const errorLog = new ErrorLogEntity();
    errorLog.project = bugLog.project;
    errorLog.source = bugLog.source;
    errorLog.environments = bugLog.environments;
    errorLog.error = JSON.stringify(bugLog.error);
    errorLog.request = bugLog.request;
    errorLog.message = bugLog.message;
    errorLog.statusCode = bugLog.status?.toString();
    errorLog.timestamp = bugLog.timestamp;
    errorLog.path = bugLog.path;
    errorLog.name = bugLog.name;
    await this.errorLogRepo.insert(errorLog);
    return {
      status: 200,
    };
  }
}
