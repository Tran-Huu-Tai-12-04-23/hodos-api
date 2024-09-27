import { Module } from '@nestjs/common';
import { LocationRepository } from 'src/repositories/location.repository';
import { TypeOrmExModule } from 'src/typeorm';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([LocationRepository])],
  providers: [LocationService],
  controllers: [LocationController],
  exports: [LocationService],
})
export class LocationModule {}
