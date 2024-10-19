import { BlogEntity } from 'src/entities/blog.entity';
import { CustomRepository } from 'src/typeorm/typeorm-decorater';
import { Repository } from 'typeorm';

@CustomRepository(BlogEntity)
export class BlogRepository extends Repository<BlogEntity> {}
