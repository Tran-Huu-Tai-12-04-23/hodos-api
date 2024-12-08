import { Module } from '@nestjs/common';
import { VietMapController } from './vietMap.controller';
import { VietMapService } from './vietMap.service';

@Module({
  imports: [],
  providers: [VietMapService],
  controllers: [VietMapController],
  exports: [VietMapService],
})
export class VietMapModule {}
