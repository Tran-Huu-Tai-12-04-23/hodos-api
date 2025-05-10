import { Module } from '@nestjs/common';
import { TypeOrmExModule } from 'src/typeorm';
import { LocationModule } from '../location/location.module';
import { CommonController } from './common.controller';
import { CommonService } from './common.service';
import { FirebaseUploadService } from './firebase-upload.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([]), LocationModule],
  providers: [CommonService, FirebaseUploadService],
  controllers: [CommonController],
  exports: [CommonService, FirebaseUploadService],
})
export class CommonModule {}
