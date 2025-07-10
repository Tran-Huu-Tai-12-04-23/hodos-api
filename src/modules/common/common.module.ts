import { Module } from '@nestjs/common';
import { TypeOrmExModule } from 'src/typeorm';
import { BlogModule } from '../blog/blog.module';
import { LocationModule } from '../location/location.module';
import { NotificationModule } from '../notification/notification.module';
import { CommonController } from './common.controller';
import { CommonService } from './common.service';
import { FirebaseUploadService } from './firebase-upload.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([]),
    LocationModule,
    NotificationModule,
    BlogModule,
  ],
  providers: [CommonService, FirebaseUploadService],
  controllers: [CommonController],
  exports: [CommonService, FirebaseUploadService],
})
export class CommonModule {}
