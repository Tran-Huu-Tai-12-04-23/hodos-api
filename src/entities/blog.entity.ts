import { Column, Entity } from 'typeorm';
import { BaseEntityCustom } from './base.entity';

@Entity('blog')
export class BlogEntity extends BaseEntityCustom {
  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;
  @Column({ type: 'varchar', length: 255, nullable: false })
  thumbnail: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  tag: string;

  @Column({ type: 'text', nullable: false })
  content: string;
}
