import { TransactionEntity, UserSubscriptionEntity } from 'src/entities';
import { DeviceTrialEntity } from 'src/entities/device-trial.entity';
import { CustomRepository } from 'src/typeorm/typeorm-decorater';
import { Repository } from 'typeorm';

@CustomRepository(TransactionEntity)
export class TransactionRepository extends Repository<TransactionEntity> {}

@CustomRepository(UserSubscriptionEntity)
export class UserSubscriptionRepository extends Repository<UserSubscriptionEntity> {}

@CustomRepository(DeviceTrialEntity)
export class DeviceTrialRepository extends Repository<DeviceTrialEntity> {}
