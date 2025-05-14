import { TripActivityEntity } from 'src/entities/trip-activity.entity';
import { TripDayEntity } from 'src/entities/trip-day.entity';
import { TripDirectionEntity } from 'src/entities/trip-direction.entity';
import { TripUserEntity } from 'src/entities/trip-user.entity';
import { TripEntity } from 'src/entities/trip.entity';
import { CustomRepository } from 'src/typeorm/typeorm-decorater';
import { Repository } from 'typeorm';

@CustomRepository(TripEntity)
export class TripRepository extends Repository<TripEntity> {}

@CustomRepository(TripDayEntity)
export class TripDayRepository extends Repository<TripDayEntity> {}

@CustomRepository(TripActivityEntity)
export class TripActivityRepository extends Repository<TripActivityEntity> {}

@CustomRepository(TripUserEntity)
export class TripUserRepository extends Repository<TripUserEntity> {}

@CustomRepository(TripDirectionEntity)
export class TripDirectionRepository extends Repository<TripDirectionEntity> {}
