import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntityCustom } from './base.entity';
import { TripActivityEntity } from './trip-activity.entity';
import { TripEntity } from './trip.entity';

@Entity('trip_day')
export class TripDayEntity extends BaseEntityCustom {
  @Column()
  dayNumber: number;

  @Column()
  date: string;

  @Column()
  dayOfWeek: string;

  @Column({ type: 'varchar', length: 36, nullable: false })
  tripId: string;
  @ManyToOne(() => TripEntity, (p) => p.days)
  @JoinColumn({ name: 'tripId', referencedColumnName: 'id' })
  trip: Promise<TripEntity>;

  @OneToMany(() => TripActivityEntity, (activity) => activity.tripDays)
  activities: Promise<TripActivityEntity[]>;
}
