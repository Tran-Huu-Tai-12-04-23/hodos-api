import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntityCustom } from './base.entity';
import { PlanningLocationEntity } from './planning_location.entity';
import { UserEntity } from './user.entity'; // assuming you have this

@Entity('planning')
export class PlanningEntity extends BaseEntityCustom {
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'timestamp', nullable: true })
  startDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate: Date;

  @ManyToOne(() => UserEntity, (user) => user.plannings)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
  @Column({
    nullable: true,
  })
  userId: string;

  @OneToMany(
    () => PlanningLocationEntity,
    (planningLocation) => planningLocation.planning,
  )
  locations: Promise<PlanningLocationEntity[]>;
}
