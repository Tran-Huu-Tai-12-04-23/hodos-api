import { Module } from '@nestjs/common';
import { UserRepository } from 'src/repositories';
import { PostRepository } from 'src/repositories/blog.repository';
import { TypeOrmExModule } from 'src/typeorm';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([PostRepository, UserRepository]),
  ],
  providers: [PostService],
  controllers: [PostController],
  exports: [PostService],
})
export class PostModule {}
