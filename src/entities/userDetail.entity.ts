import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntityCustom } from './base.entity';
import { UserEntity } from './user.entity';

/** Thông tin chi tiết của người dùng dùng cho ứng dụng du lịch */
@Entity('user_details')
export class UserDetailEntity extends BaseEntityCustom {
  /** Họ và tên */
  @Column()
  fullName: string;

  /** Địa chỉ hiện tại */
  @Column({ nullable: true })
  address: string;

  /** Số điện thoại */
  @Column({ nullable: true })
  phoneNumber: string;

  /** Email */
  @Column({ nullable: true })
  email: string;

  /** Liên kết GitHub */
  @Column({ nullable: true })
  githubLink: string;

  /** Liên kết Telegram */
  @Column({ nullable: true })
  telegramLink: string;

  /** Liên kết Facebook */
  @Column({ nullable: true })
  facebookLink: string;

  /** Tiểu sử / mô tả ngắn về bản thân */
  @Column({ type: 'text', nullable: true })
  bio: string;

  /** Ảnh đại diện */
  @Column({ type: 'varchar', nullable: true })
  profilePictureUrl: string;

  /** Ngày sinh */
  @Column({ type: 'date', nullable: true })
  birthDate: Date | null;

  /** Giới tính */
  @Column({ type: 'varchar', nullable: true })
  gender: string;

  /** Quốc tịch */
  @Column({ type: 'varchar', nullable: true })
  nationality: string;

  /** Sở thích du lịch */
  @Column({ type: 'text', nullable: true })
  travelInterests: string;

  /** Danh sách địa điểm đã đi (dưới dạng JSON hoặc comma-separated IDs) */
  @Column({ type: 'text', nullable: true })
  travelHistory: string;

  /** Ngôn ngữ sử dụng (ví dụ: "vi,en,fr") */
  @Column({ type: 'varchar', nullable: true })
  languages: string;

  /** Đánh giá tổng thể (nếu có hệ thống điểm cộng đồng) */
  @Column({ type: 'float', default: 0 })
  reputationScore: number;

  /** ID người dùng liên kết */
  @Column({ type: 'varchar' })
  userId: string;

  /** Mối quan hệ 1-1 với bảng người dùng chính */
  @OneToOne(() => UserEntity, (user) => user.userDetail)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: Promise<UserEntity>;
}
