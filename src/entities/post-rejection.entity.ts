import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntityCustom } from './base.entity';
import { PostEntity } from './post.entity';
import { UserEntity } from './user.entity';

@Entity('post_rejection')
export class PostRejectionEntity extends BaseEntityCustom {
  @Column({ type: 'varchar', length: 255, nullable: false })
  reason: string;

  @Column({ type: 'text', nullable: true })
  details?: string;

  @Column({ type: 'uuid', nullable: false })
  adminId: string;
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'adminId', referencedColumnName: 'id' })
  admin: UserEntity;
  @Column({ type: 'uuid', nullable: false })
  postId: string;
  @ManyToOne(() => PostEntity)
  @JoinColumn({ name: 'postId', referencedColumnName: 'id' })
  post: PostEntity;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  rejectedAt: Date;
}
