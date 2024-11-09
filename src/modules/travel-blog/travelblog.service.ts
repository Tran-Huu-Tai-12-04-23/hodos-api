import { Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/dto/pagination.dto';
import { TravelBlogEntity } from 'src/entities/travelblog.entity';
import { TravelBlogRepository } from 'src/repositories/blog.repository';

@Injectable()
export class TravelBlogService {
  constructor(private readonly repo: TravelBlogRepository) {}
  async create(blog: Partial<TravelBlogEntity>): Promise<TravelBlogEntity> {
    return this.repo.save(blog);
  }

  async pagination(
    data: PaginationDto<any>,
  ): Promise<[TravelBlogEntity[], number]> {
    const res: any = this.repo.findAndCount({
      where: {},
      take: data.take,
      skip: data.skip,
    });

    for (const item of res[0]) {
      item.imgs = item.imgs.split(',');
    }

    return res;
  }

  async findOne(id: string): Promise<TravelBlogEntity | null> {
    return this.repo.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
