import { Column, Entity } from 'typeorm';
import { BaseEntityCustom } from './base.entity';

@Entity('trip_direction')
export class TripDirectionEntity extends BaseEntityCustom {
  @Column({ type: 'varchar', nullable: false })
  tripId: string;

  @Column('float')
  distance: number;

  @Column('float')
  duration: number;

  @Column('text')
  geometry: string;
}
