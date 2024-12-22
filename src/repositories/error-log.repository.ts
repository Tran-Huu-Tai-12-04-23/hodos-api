import { ErrorLogEntity } from 'src/entities/error-log.entity';
import { CustomRepository } from 'src/typeorm/typeorm-decorater';
import { Repository } from 'typeorm';

@CustomRepository(ErrorLogEntity)
export class ErrorLogRepository extends Repository<ErrorLogEntity> {}
