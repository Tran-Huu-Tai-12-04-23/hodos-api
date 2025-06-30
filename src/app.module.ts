import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { BlogModule } from './modules/blog/blog.module';
import { CommonModule } from './modules/common/common.module';
import { EmailModule } from './modules/email/email.module';
import { GeminiAIModule } from './modules/geminiAI/geminiAI.module';
import { LocationModule } from './modules/location/location.module';
import { LogModule } from './modules/log/log.module';
import { MasterDataModule } from './modules/master-data/master-data.module';
import { MobileModule } from './modules/mobile/mobile.module';
import { PlanTripModule } from './modules/plan/plan-trip.module';
import { PostModule } from './modules/post/post.module';
import { SepayModule } from './modules/se-pay/sepay.module';
import { TransactionModule } from './modules/transactions/transaction.module';
import { UserModule } from './modules/user/user.module';
import { VietMapModule } from './modules/vietMap/vietMap.module';
import { WebhookModule } from './modules/webhook/webhook.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    LocationModule,
    GeminiAIModule,
    CommonModule,
    BlogModule,
    PostModule,
    MobileModule,
    VietMapModule,
    WebhookModule,
    LogModule,
    EmailModule,
    UserModule,
    PlanTripModule,
    SepayModule,
    MasterDataModule,
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
