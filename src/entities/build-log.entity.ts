import { Column, Entity } from 'typeorm';
import { BaseEntityCustom } from './base.entity';

@Entity('build_log')
export class BuildLogEntity extends BaseEntityCustom {
  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  message: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  githubBuildLink: string;
}
