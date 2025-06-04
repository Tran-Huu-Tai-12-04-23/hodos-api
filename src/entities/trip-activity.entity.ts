import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntityCustom } from './base.entity';
import { LocationEntity } from './location.entity';
import { TripDayEntity } from './trip-day.entity';

@Entity('trip_activity')
export class TripActivityEntity extends BaseEntityCustom {
  @Column()
  timeStart: string;

  @Column()
  timeEnd: string;

  @ApiProperty({
    description: 'Primary key ID',
    example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  })
  @Column({ type: 'varchar', nullable: false })
  locationId: string;
  @ManyToOne(() => LocationEntity, (p) => p.id)
  @JoinColumn({ name: 'locationId', referencedColumnName: 'id' })
  location: Promise<LocationEntity>;

  @Column({ type: 'varchar', nullable: false })
  tripDayId: string;
  @ManyToOne(() => TripDayEntity, (p) => p.activities)
  @JoinColumn({ name: 'tripDayId', referencedColumnName: 'id' })
  tripDays: Promise<TripDayEntity>;
}
