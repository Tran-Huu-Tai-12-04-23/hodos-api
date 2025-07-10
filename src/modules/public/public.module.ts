import { Module } from '@nestjs/common';
import { TypeOrmExModule } from 'src/typeorm';
import { BlogModule } from '../blog/blog.module';
import { PublicController } from './public.controller';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([]), BlogModule],
  providers: [],
  controllers: [PublicController],
  exports: [],
})
export class PublicModule {}
