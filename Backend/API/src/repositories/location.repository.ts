import { LocationEntity } from 'src/entities/location.entity';
import { CustomRepository } from 'src/typeorm/typeorm-decorater';
import { Repository } from 'typeorm';

@CustomRepository(LocationEntity)
export class LocationRepository extends Repository<LocationEntity> {}
