import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TripEntity } from './trip.entity';
import { UserEntity } from './user.entity';

@Entity('trip_user')
export class TripUserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 36, nullable: false })
  tripId: string;
  @ManyToOne(() => TripEntity, (p) => p.tripUsers)
  @JoinColumn({ name: 'tripId', referencedColumnName: 'id' })
  trip: Promise<TripEntity>;

  @Column({ type: 'varchar', length: 36, nullable: false })
  userId: string;
  @ManyToOne(() => UserEntity, (p) => p.tripUsers)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: Promise<UserEntity>;

  @Column({ default: false })
  isOwner: boolean;
}
