import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntityCustom } from './base.entity';
import { UserEntity } from './user.entity';

@Entity('user_devices')
export class UserDeviceEntity extends BaseEntityCustom {
  @Column({ length: 500 })
  deviceId: string; // Unique ID của thiết bị (tự tạo trên client hoặc lấy từ Firebase Instance ID)

  @Column({ length: 1000 })
  fcmToken: string;

  @Column({ nullable: true })
  platform: string; // android / ios / web

  @Column({ nullable: true })
  deviceModel: string; // ví dụ: Pixel 7 / iPhone 14

  @Column({ default: true })
  isLoggedIn: boolean;

  @Column({ type: 'uuid' })
  userId: string;
  @ManyToOne(() => UserEntity, (user) => user.devices, { onDelete: 'CASCADE' })
  user: UserEntity;
}
