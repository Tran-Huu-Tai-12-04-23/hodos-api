import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntityCustom } from './base.entity';
import { UserEntity } from './user.entity';

/**
 * Entity for tracking device trial usage
 */
@Entity('device_trials')
export class DeviceTrialEntity extends BaseEntityCustom {
  @Column({ nullable: true })
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ nullable: false })
  deviceId: string;

  @Column({ length: 255, nullable: true })
  deviceName: string;

  @Column({ nullable: true })
  deviceModel: string;

  @Column({ nullable: true })
  deviceType: string;

  @Column({ default: 0 })
  trialUsageCount: number;

  @Column({ default: 3 })
  maxTrialCount: number;
}
