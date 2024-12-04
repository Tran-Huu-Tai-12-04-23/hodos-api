import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { BlogModule } from './modules/blog/blog.module';
import { CommonModule } from './modules/common/common.module';
import { FoodModule } from './modules/food/food.module';
import { GeminiAIModule } from './modules/geminiAI/geminiAI.module';
import { LocationModule } from './modules/location/location.module';
import { MobileModule } from './modules/mobile/mobile.module';
import { TravelBlogModule } from './modules/travel-blog/travelblog.module';
import { VietMapModule } from './modules/vietMap/vietMap.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    FoodModule,
    LocationModule,
    GeminiAIModule,
    CommonModule,
    BlogModule,
    TravelBlogModule,
    MobileModule,
    VietMapModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
