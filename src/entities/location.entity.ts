import { Column, CreateDateColumn, Entity, OneToMany } from 'typeorm';
import { BaseEntityCustom } from './base.entity';
import { LocationInteractionEntity } from './locationInteraction.entity';
import { LocationMedia360Entity } from './locationMedia360.entity';

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
  coordinates: string;

  @Column({ default: 'LOCATION' })
  type: string;

  @Column({ type: 'text' })
  detail: string;

  @OneToMany(() => LocationMedia360Entity, (media) => media.location)
  mediaItems: LocationMedia360Entity[];

  @OneToMany(
    () => LocationInteractionEntity,
    (interaction) => interaction.location,
  )
  interactions: LocationInteractionEntity[];
}
