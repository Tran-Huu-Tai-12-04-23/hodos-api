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

    return deviceTrial.trialUsageCount < deviceTrial.maxTrialCount;
  }

  async incrementTrialUsageCount(
    deviceId: string,
    repo?: DeviceTrialRepository,
  ): Promise<void> {
    const deviceTrial = await (repo || this.repo).findOneBy({
      deviceId: deviceId,
    });
    if (!deviceTrial) {
      throw new Error('Device trial not found');
    }
    await (repo || this.repo).update(deviceTrial.id, {
      trialUsageCount: ++deviceTrial.trialUsageCount,
    });
  }

  private async initTrialForDevice(
    deviceId: string,
    userId: string | null,
  ): Promise<void> {
    const deviceTrial = new DeviceTrialEntity();
    deviceTrial.deviceId = deviceId;
    deviceTrial.trialUsageCount = 1;
    deviceTrial.maxTrialCount = 5;
    if (userId) {
      deviceTrial.userId = userId;
    }
    await this.repo.insert(deviceTrial);
  }
}
