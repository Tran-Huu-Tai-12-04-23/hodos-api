import { Module } from '@nestjs/common';
import { BlogRepository } from 'src/repositories/blog.repository';
import { TypeOrmExModule } from 'src/typeorm';
import { SepayController } from './sepay.controller';
import { SepayService } from './sepay.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([BlogRepository])],
  providers: [SepayService],
  controllers: [SepayController],
  exports: [SepayService],
})
export class SepayModule {}
