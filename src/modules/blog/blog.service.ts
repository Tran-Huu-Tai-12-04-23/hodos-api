import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaginationDto } from 'src/dto/pagination.dto';
import { BlogEntity } from 'src/entities/blog.entity';
import { BlogRepository } from 'src/repositories/blog.repository';
import { BlogCreateDTO } from './dto/create.dto';

@Injectable()
export class BlogService {
  constructor(
    public readonly configService: ConfigService,
    private readonly repo: BlogRepository,
  ) {}

  async create(body: BlogCreateDTO) {
    const blog = new BlogEntity();
    blog.title = body.title;
    blog.tag = body.tag;
    blog.content = body.content;
    await this.repo.insert(blog);
    return 'Create successfully!';
  }

  async pagination(body: PaginationDto<any>) {
    const whereCon: any = {};
    const whereCon2: any = {};
    if (body.where.title) {
      whereCon.title = body.where.title;
      whereCon2.content = body.where.title;
    }
    if (body.where.tag) {
      whereCon.tag = body.where.tag;
      whereCon2.tag = body.where.tag;
    }

    whereCon.isDelete = false;
    whereCon2.isDelete = false;

    const [result, total] = await this.repo.findAndCount({
      where: [whereCon, whereCon2],
      skip: body.skip,
      take: body.take,
    });

    return [result, total];
  }

  async forceDelete(id: string) {
    await this.repo.delete(id);
    return 'Delete successfully!';
  }
}
