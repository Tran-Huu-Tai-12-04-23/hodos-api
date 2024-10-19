import { Module } from '@nestjs/common';
import { BlogRepository } from 'src/repositories/blog.repository';
import { TypeOrmExModule } from 'src/typeorm';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([BlogRepository])],
  providers: [BlogService],
  controllers: [BlogController],
  exports: [BlogService],
})
export class BlogModule {}
