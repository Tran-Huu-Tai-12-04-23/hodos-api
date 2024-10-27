import { Module } from '@nestjs/common';
import { TravelBlogRepository } from 'src/repositories/blog.repository';
import { TypeOrmExModule } from 'src/typeorm';
import { TravelBlogController } from './travelblog.controller';
import { TravelBlogService } from './travelblog.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([TravelBlogRepository])],
  providers: [TravelBlogService],
  controllers: [TravelBlogController],
  exports: [TravelBlogService],
})
export class TravelBlogModule {}
