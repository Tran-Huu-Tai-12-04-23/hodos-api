import { Injectable } from '@nestjs/common';
import { DeviceTrialEntity } from 'src/entities/device-trial.entity';
import { DeviceTrialRepository } from 'src/repositories/transactions.repository';

@Injectable()
export class DeviceTrialService {
  constructor(private readonly repo: DeviceTrialRepository) {}

  async checkTotalRestTrial(
    deviceId: string,
    userId: string | null,
  ): Promise<boolean> {
    const deviceTrial = await this.repo.findOneBy({
      deviceId: deviceId,
    });

    if (!deviceTrial) {
      await this.initTrialForDevice(deviceId, userId);
      return true;
    }

    await this.repo.increment({ deviceId: deviceId }, 'trialUsageCount', 1);
    return deviceTrial.trialUsageCount < deviceTrial.maxTrialCount;
  }

  private async initTrialForDevice(
    deviceId: string,
    userId: string | null,
  ): Promise<void> {
    const deviceTrial = new DeviceTrialEntity();
    deviceTrial.deviceId = deviceId;
    deviceTrial.trialUsageCount = 1;
    if (userId) {
      deviceTrial.userId = userId;
    }
    await this.repo.insert(deviceTrial);
  }
}
