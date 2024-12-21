import { BuildLogEntity } from 'src/entities/build-log.entity';
import { CustomRepository } from 'src/typeorm/typeorm-decorater';
import { Repository } from 'typeorm';
@CustomRepository(BuildLogEntity)
export class BuildLogRepository extends Repository<BuildLogEntity> {}
