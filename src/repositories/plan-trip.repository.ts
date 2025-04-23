import { PlanningEntity } from 'src/entities/planning.entity';
import { PlanningLocationEntity } from 'src/entities/planning_location.entity';
import { CustomRepository } from 'src/typeorm/typeorm-decorater';
import { Repository } from 'typeorm';
@CustomRepository(PlanningEntity)
export class PlanningRepository extends Repository<PlanningEntity> {}

@CustomRepository(PlanningLocationEntity)
export class PlanningLocationRepository extends Repository<PlanningLocationEntity> {}
