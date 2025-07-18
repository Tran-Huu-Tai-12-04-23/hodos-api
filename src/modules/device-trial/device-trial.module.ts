import { Module } from '@nestjs/common';
import { DeviceTrialRepository } from 'src/repositories/transactions.repository';
import { TypeOrmExModule } from 'src/typeorm';
import { DeviceTrialService } from './device-trial.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([DeviceTrialRepository])],
  providers: [DeviceTrialService],
  controllers: [],
  exports: [DeviceTrialService],
})
export class DeviceTrialModule {}
