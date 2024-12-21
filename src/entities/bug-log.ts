import { Column, Entity } from 'typeorm';
import { BaseEntityCustom } from './base.entity';
@Entity('bug_logs')
export class BugLogEntity extends BaseEntityCustom {
  @Column({
    type: 'varchar',
    length: 250,
    nullable: false,
  })
  project: string;

  @Column({
    type: 'varchar',
    length: 250,
    nullable: false,
  })
  source: string;

  @Column({
    type: 'varchar',
    length: 250,
    nullable: true,
  })
  environments: string;

  @Column({
    type: 'varchar',
    length: 250,
    nullable: true,
  })
  statusCode: string;

  @Column({
    type: 'varchar',
    length: 250,
    nullable: true,
  })
  timestamp: string;

  @Column({
    type: 'varchar',
    length: 250,
    nullable: true,
  })
  path: string;

  @Column({
    type: 'varchar',
    length: 250,
    nullable: true,
  })
  name: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  error: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  request: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  message: string;

  @Column({
    nullable: false,
    default: false,
  })
  isResovled: boolean;
}
