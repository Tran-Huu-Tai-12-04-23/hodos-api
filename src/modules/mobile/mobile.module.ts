import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { PostModule } from '../post/post.module';
import { MobileController } from './mobile.controller';
import { MobileService } from './mobile.service';

@Module({
  imports: [PostModule, CommonModule],
  providers: [MobileService],
  controllers: [MobileController],
  exports: [MobileService],
})
export class MobileModule {}
