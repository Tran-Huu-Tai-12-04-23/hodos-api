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
  async detail(id: string) {
    return await this.repo.findOneBy({ id });
  }
  async create(body: BlogCreateDTO) {
    const blog = new BlogEntity();
    blog.title = body.title;
    blog.tag = body.tag;
    blog.content = body.content;
    blog.thumbnail = body.thumbnail;
    await this.repo.insert(blog);
    return 'Create successfully!';
  }

  async pagination(body: PaginationDto<any>) {
    const whereCon: any = {};
    const whereCon2: any = {};
    if (body.where.searchKey) {
      whereCon.title = body.where.searchKey;
      whereCon2.content = body.where.searchKey;
      whereCon.tag = body.where.searchKey;
      whereCon2.tag = body.where.searchKey;
    }

    whereCon.isDeleted = false;
    whereCon2.isDeleted = false;

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
