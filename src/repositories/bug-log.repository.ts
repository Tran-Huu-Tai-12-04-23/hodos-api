import { BugLogEntity } from 'src/entities/bug-log';
import { CustomRepository } from 'src/typeorm/typeorm-decorater';
import { Repository } from 'typeorm';

@CustomRepository(BugLogEntity)
export class BugLogRepository extends Repository<BugLogEntity> {}
