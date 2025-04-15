import { Module } from '@nestjs/common';
import { MapController } from './map.controller';
import { MapService } from './map.service';

@Module({
  imports: [],
  providers: [MapService],
  controllers: [MapController],
  exports: [MapService],
})
export class MapModule {}
