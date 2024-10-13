import { Column, CreateDateColumn, Entity } from 'typeorm';
import { BaseEntityCustom } from './base.entity';

@Entity('location')
export class LocationEntity extends BaseEntityCustom {
  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  label: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'text', nullable: false })
  lstImgs: string;

  @Column({ type: 'text', nullable: false })
  coordinates: string; // lat,lng
}
