import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntityCustom } from './base.entity';
import { LocationEntity } from './location.entity';
import { UserEntity } from './user.entity';

export enum LocationInteractionType {
  VIEW = 'view',
  LIKE = 'like',
  UNLIKE = 'unlike',
  SHARE = 'share',
  VIRTUAL_TOUR_START = 'virtual_tour_start',
  VIRTUAL_TOUR_END = 'virtual_tour_end',
  SAVE_TO_TRIP = 'save_to_trip',
  REVIEW = 'review',
  CHECK_IN = 'check_in',
}

@Entity('location_interactions')
export class LocationInteractionEntity extends BaseEntityCustom {
  @ApiProperty({
    description: 'ID of the location interacted with',
    example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  })
  @Column({ type: 'uuid' })
  locationId: string;

  @ManyToOne(() => LocationEntity, (location) => location.id, {
    onDelete: 'CASCADE',
  }) // Assuming LocationEntity has an 'interactions' one-to-many relation
  @JoinColumn({ name: 'locationId' })
  location: LocationEntity;

  @ApiProperty({
    description: 'ID of the user who performed the interaction',
    example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  })
  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' }) // Assuming UserEntity has a 'placeInteractions' one-to-many relation
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ApiProperty({
    description: 'Type of interaction',
    enum: LocationInteractionType,
    example: LocationInteractionType.LIKE,
  })
  @Column({
    type: 'enum',
    enum: LocationInteractionType,
    nullable: false,
  })
  interactionType: LocationInteractionType;

  @ApiProperty({
    description:
      'Additional data related to the interaction (e.g., share platform, duration of view)',
    required: false,
    type: 'object',
    additionalProperties: true,
  })
  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;
}
