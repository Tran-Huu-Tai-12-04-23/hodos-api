import { Module } from '@nestjs/common';
import { TravelBlogModule } from '../travel-blog/travelblog.module';
import { MobileController } from './mobile.controller';
import { MobileService } from './mobile.service';

@Module({
  imports: [TravelBlogModule],
  providers: [MobileService],
  controllers: [MobileController],
  exports: [MobileService],
})
export class MobileModule {}
