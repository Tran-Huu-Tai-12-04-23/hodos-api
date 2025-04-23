import { compare, hash } from 'bcrypt';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { BaseEntityCustom } from './base.entity';
import { PlanningEntity } from './planning.entity';
import { TravelBlogEntity } from './travelblog.entity';
import { UserDetailEntity } from './userDetail.entity';
@Entity(`Users`)
export class UserEntity extends BaseEntityCustom {
  @Column({ length: 500 })
  username: string;

  @Column({ length: 500 })
  email: string;

  @Column({ length: 500 })
  password: string;

  @Column()
  avatar: string;

  @Column({
    nullable: true,
  })
  verifyAt: Date;

  @Column({
    nullable: true,
  })
  verifyCode: string;

  @Column()
  isActive: boolean;

  @Column({
    nullable: true,
  })
  verifyExpiredTime: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && !this.password.startsWith('$2b$')) {
      const hashedPassword = await hash(this.password, 10);
      this.password = hashedPassword;
    }
  }

  comparePassword(candidate: string) {
    console.log('Candidate Password:', candidate);
    console.log('Stored Password:', this.password);
    return compare(candidate, this.password);
  }
  @OneToOne(() => UserDetailEntity, (userDetail) => userDetail.user)
  userDetail: Promise<UserDetailEntity>;

  @OneToMany(() => TravelBlogEntity, (travelBlog) => travelBlog.user)
  travelBlog: Promise<TravelBlogEntity[]>;

  @OneToMany(() => PlanningEntity, (plan) => plan.user)
  plannings: Promise<PlanningEntity[]>;
}
