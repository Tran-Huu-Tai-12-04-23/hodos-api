import { Module } from '@nestjs/common';
import { BlogModule } from '../blog/blog.module';
import { CommonModule } from '../common/common.module';
import { NotificationModule } from '../notification/notification.module';
import { PostModule } from '../post/post.module';
import { UploadModule } from '../upload/upload.module';
import { UserSubscriptionsModule } from '../user-subscriptions/user-subscriptions.module';
import { MobileBlogController } from './mobile-blog.controller';
import { MobileNotificationController } from './mobile-notification.controller';
import { MobilePostController } from './mobile-post.controller';
import { MobilePricingPlanController } from './mobile-pricing-plan.controller';
import { MobileService } from './mobile.service';

@Module({
  imports: [
    PostModule,
    CommonModule,
    UserSubscriptionsModule,
    NotificationModule,
    BlogModule,
    UploadModule,
  ],
  providers: [MobileService],
  controllers: [
    MobilePricingPlanController,
    MobilePostController,
    MobileNotificationController,
    MobileBlogController,
  ],
  exports: [MobileService],
})
export class MobileModule {}
