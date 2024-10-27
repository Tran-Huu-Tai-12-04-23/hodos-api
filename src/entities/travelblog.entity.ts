import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntityCustom } from './base.entity';
import { UserEntity } from './user.entity';

/** khi người dùng trên app tạo bài viết thì lưu ở đây */
@Entity('travel_blog')
export class TravelBlogEntity extends BaseEntityCustom {
  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;
  @Column({ type: 'varchar', length: 255, nullable: false })
  thumbnail: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  imgs: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  tag: string;
  @Column({ type: 'text', nullable: false })
  content: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  userId: string;
  @OneToMany(() => UserEntity, (user) => user.travelBlog)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: UserEntity;
}
