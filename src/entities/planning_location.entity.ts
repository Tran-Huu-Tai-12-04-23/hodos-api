import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntityCustom } from './base.entity';
import { LocationEntity } from './location.entity';
import { PlanningEntity } from './planning.entity';

@Entity('planning_location')
export class PlanningLocationEntity extends BaseEntityCustom {
  @Column()
  planningId: string;
  @ManyToOne(() => PlanningEntity, (planning) => planning.locations)
  @JoinColumn({ name: 'planningId' })
  planning: PlanningEntity;

  @Column()
  locationId: string;
  @ManyToOne(() => LocationEntity)
  @JoinColumn({ name: 'locationId' })
  location: LocationEntity;

  @Column({ type: 'int' })
  order: number;

  @Column({ type: 'timestamp', nullable: true })
  estimatedArrival: Date;

  @Column({ type: 'int', nullable: true })
  durationMinutes: number;

  @Column({ type: 'text', nullable: true })
  notes: string;
}
