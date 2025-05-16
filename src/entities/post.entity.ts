import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntityCustom } from './base.entity';
import { UserEntity } from './user.entity';

/** khi người dùng trên app tạo bài viết thì lưu ở đây */
@Entity('post')
export class PostEntity extends BaseEntityCustom {
  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;
  @Column('text')
  thumbnail: string;

  @Column('text')
  imgs: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  tag: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  @Column({
    default: 0,
    type: 'int',
  })
  timePosted: number;

  @Column({
    default: 0,
    type: 'int',
  })
  commentCount: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  userId: string;
  @OneToMany(() => UserEntity, (user) => user.posts)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: UserEntity;
}
