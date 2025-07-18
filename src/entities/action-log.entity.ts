// entities/action-log.entity.ts
import { Column, Entity } from 'typeorm';
import { BaseEntityCustom } from './base.entity';

@Entity('action_log')
export class ActionLog extends BaseEntityCustom {
  @Column()
  action: string;

  @Column()
  entityName: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @Column({ nullable: true })
  performedBy?: string;

  @Column({ nullable: true })
  ip?: string;
}
