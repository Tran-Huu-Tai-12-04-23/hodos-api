import { BlogEntity } from 'src/entities/blog.entity';
import { PostRejectionEntity } from 'src/entities/post-rejection.entity';
import { PostEntity } from 'src/entities/post.entity';
import { CustomRepository } from 'src/typeorm/typeorm-decorater';
import { Repository } from 'typeorm';

@CustomRepository(BlogEntity)
export class BlogRepository extends Repository<BlogEntity> {}

@CustomRepository(PostEntity)
export class PostRepository extends Repository<PostEntity> {}

@CustomRepository(PostRejectionEntity)
export class PostRejectionRepository extends Repository<PostRejectionEntity> {}
