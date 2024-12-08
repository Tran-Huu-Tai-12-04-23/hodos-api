import { Module } from '@nestjs/common';
import { TypeOrmExModule } from 'src/typeorm';
import { LocationModule } from '../location/location.module';
import { CommonController } from './common.controller';
import { CommonService } from './common.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([]), LocationModule],
  providers: [CommonService],
  controllers: [CommonController],
  exports: [CommonService],
})
export class CommonModule {}
