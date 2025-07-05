import { Injectable } from '@nestjs/common';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class ScaleService {
  constructor(private readonly notificationService: NotificationService) {}

  // nếu là localhost thì ko run job
  private isLocalhost(): boolean {
    return process.env.NODE_ENV === 'development';
  }
  /** Hàm chạy 10 phút */
  public async autoRunMightMinute() {
    this.notificationService.runScheduledNotification();
    return true;
  }

  /** Hàm chạy giữa đêm */
  public async autoRunMidNight() {
    return true;
  }

  /** Hàm chạy 10 phút */
  public async autoRunEvery1OMinutes() {
    return true;
  }

  /** Hàm chạy cuối tháng */
  public async autoRunEveryEndOfMonth() {
    return true;
  }

  public async autoRunEveryYear() {}
  /** Hàm chạy 1 giờ sáng */
  public async autoRunAtOneAM() {
    return true;
  }

  /** Hàm chạy 23 giờ mỗi ngày */
  public async autoRun23hEveryDay() {
    return true;
  }

  /** Hàm chạy 7 sáng mỗi ngày */
  public async autoRunAt7AM() {
    return true;
  }

  /** Hàm chạy mỗi giờ */
  public async autoRunEveryHour() {
    return true;
  }
}
