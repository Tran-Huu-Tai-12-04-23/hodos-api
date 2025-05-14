import { Column, Entity, OneToMany } from 'typeorm';
import { enumData } from '../constants/enum-data';
import { BaseEntityCustom } from './base.entity';
import { TripDayEntity } from './trip-day.entity';
import { TripUserEntity } from './trip-user.entity';

@Entity('trip')
export class TripEntity extends BaseEntityCustom {
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    default: enumData.TRIP_TYPE.SYSTEM.code, // default value is system trip
  })
  type: string;

  @Column('text')
  thumbnail: string;

  @Column({ type: 'int' })
  totalDays: number;

  @Column()
  typeTrip: string;

  @Column()
  startDate: string;

  @Column()
  endDate: string;

  @Column()
  budget: string;

  @Column()
  favorites: string;

  @Column()
  totalSave: number;

  @OneToMany(() => TripDayEntity, (day) => day.trip)
  days: Promise<TripDayEntity[]>;

  @OneToMany(() => TripUserEntity, (tripUser) => tripUser.trip)
  tripUsers: Promise<TripUserEntity[]>;

  @Column({ type: 'varchar', length: 255, nullable: true })
  tripDirectionId: string;
}
