import { BlogEntity } from 'src/entities/blog.entity';
import { TravelBlogEntity } from 'src/entities/travelblog.entity';
import { CustomRepository } from 'src/typeorm/typeorm-decorater';
import { Repository } from 'typeorm';

@CustomRepository(BlogEntity)
export class BlogRepository extends Repository<BlogEntity> {}

@CustomRepository(TravelBlogEntity)
export class TravelBlogRepository extends Repository<TravelBlogEntity> {}
