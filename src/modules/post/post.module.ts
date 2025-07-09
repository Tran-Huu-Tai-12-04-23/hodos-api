import { Module } from '@nestjs/common';
import { UserRepository } from 'src/repositories';
import { PostRepository } from 'src/repositories/blog.repository';
import { LocationRepository } from 'src/repositories/location.repository';
import { TypeOrmExModule } from 'src/typeorm';
import { NotificationModule } from '../notification/notification.module';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      PostRepository,
      UserRepository,
      LocationRepository,
    ]),
    NotificationModule,
  ],
  providers: [PostService],
  controllers: [PostController],
  exports: [PostService],
})
export class PostModule {}
