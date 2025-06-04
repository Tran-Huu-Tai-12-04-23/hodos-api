import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntityCustom } from './base.entity';
import { LocationEntity } from './location.entity'; // Assuming LocationEntity is your Location entity

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  THREESIXTY_IMAGE = 'threesixty_image',
  THREESIXTY_VIDEO = 'threesixty_video',
}

@Entity('location_media_360')
export class LocationMedia360Entity extends BaseEntityCustom {
  @ApiProperty({
    description: 'ID of the location this media belongs to',
    example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  })
  @Column({ type: 'uuid' })
  locationId: string;

  @ManyToOne(() => LocationEntity, (location) => location.id, {
    onDelete: 'CASCADE',
  }) // Assuming LocationEntity has a 'media' one-to-many relation
  @JoinColumn({ name: 'locationId' })
  location: LocationEntity;

  @ApiProperty({
    description: 'Type of the media',
    enum: MediaType,
    example: MediaType.THREESIXTY_IMAGE,
  })
  @Column({
    type: 'enum',
    enum: MediaType,
    nullable: false,
  })
  mediaType: MediaType;

  @ApiProperty({
    description: 'URL of the media file',
    example: 'https://example.com/media/file.jpg',
  })
  @Column({ type: 'text', nullable: false })
  mediaUrl: string;

  @ApiProperty({
    description: 'URL of the media thumbnail (optional)',
    example: 'https://example.com/media/thumbnail.jpg',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  thumbnailUrl?: string;

  @ApiProperty({
    description: 'Order of the media item for display',
    example: 1,
    required: false,
  })
  @Column({ type: 'int', nullable: true })
  displayOrder?: number;

  @ApiProperty({
    description: 'Caption or description for the media',
    example: 'Beautiful panoramic view',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  caption?: string;
}
