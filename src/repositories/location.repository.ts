import {
  LocationInteractionEntity,
  LocationMedia360Entity,
} from 'src/entities';
import { LocationEntity } from 'src/entities/location.entity';
import { CustomRepository } from 'src/typeorm/typeorm-decorater';
import { Repository } from 'typeorm';

@CustomRepository(LocationEntity)
export class LocationRepository extends Repository<LocationEntity> {}

@CustomRepository(LocationMedia360Entity)
export class LocationMedia360Repository extends Repository<LocationMedia360Entity> {}

@CustomRepository(LocationInteractionEntity)
export class LocationInteractionRepository extends Repository<LocationInteractionEntity> {}
