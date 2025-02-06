import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AiModule } from './modules/AI/ai.module';
import { AuthModule } from './modules/auth/auth.module';
import { BlogModule } from './modules/blog/blog.module';
import { CommonModule } from './modules/common/common.module';
import { GeminiAIModule } from './modules/geminiAI/geminiAI.module';
import { LocationModule } from './modules/location/location.module';
import { LogModule } from './modules/log/log.module';
import { MobileModule } from './modules/mobile/mobile.module';
import { TelegramModule } from './modules/telegram/telegram.module';
import { TravelBlogModule } from './modules/travel-blog/travelblog.module';
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
    TravelBlogModule,
    MobileModule,
    VietMapModule,
    WebhookModule,
    LogModule,
    AiModule,
    TelegramModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
