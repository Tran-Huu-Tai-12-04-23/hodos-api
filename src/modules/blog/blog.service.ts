import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaginationDto } from 'src/dto/pagination.dto';
import { BlogEntity } from 'src/entities/blog.entity';
import { BlogRepository } from 'src/repositories/blog.repository';
import { ILike } from 'typeorm';
import { UserEntity } from './../../entities/user.entity';
import { BlogCreateDTO, BlogUpdateDTO } from './dto/create.dto';

@Injectable()
export class BlogService {
  constructor(
    public readonly configService: ConfigService,
    private readonly repo: BlogRepository,
  ) {}
  /** user function */
  async detail(id: string) {
    return await this.repo.findOneBy({ id });
  }

  async top5() {
    const blogs = await this.repo.find({
      where: { isPublish: true, isDeleted: false },
      order: { createdAt: 'DESC' },
      take: 5,
      select: {
        id: true,
        title: true,
        tag: true,
        thumbnail: true,
        createdAt: true,
        updatedAt: true,
        createdBy: true,
        updatedBy: true,
        isPublish: true,
      },
    });
    return blogs;
  }

  async userPagination(body: PaginationDto<any>) {
    const whereCon: any = {};
    const whereCon2: any = {};
    const whereCon3: any = {};
    if (body.where.name) {
      whereCon.title = ILike(`%${body.where.name}%`);
      whereCon2.content = ILike(`%${body.where.name}%`);
      whereCon3.tag = ILike(`%${body.where.name}%`);
    }

    whereCon.isPublish = true;
    whereCon.isDeleted = false;
    whereCon2.isPublish = true;
    whereCon2.isDeleted = false;
    whereCon3.isPublish = true;
    whereCon3.isDeleted = false;

    const [result, total] = await this.repo.findAndCount({
      where: [whereCon, whereCon2, whereCon3],
      skip: body.skip,
      take: body.take,
    });

    return {
      data: result,
      total,
      nextSkip: body.skip + body.take,
      hasNext: body.skip + body.take < total,
      take: body.take,
    };
  }

  /** admin function */

  async create(user: UserEntity, body: BlogCreateDTO) {
    const blog = new BlogEntity();
    blog.title = body.title;
    blog.tag = body.tag;
    blog.content = body.content;
    blog.thumbnail = body.thumbnail;
    blog.isPublish = body.isPublish || false;
    blog.createdBy = user.id;
    blog.createdAt = new Date();
    await this.repo.insert(blog);
    return 'Create successfully!';
  }

  async update(user: UserEntity, body: BlogUpdateDTO) {
    const blog = await this.repo.findOneBy({ id: body.id });
    if (!blog) {
      return 'Blog not found!';
    }
    blog.title = body.title || blog.title;
    blog.tag = body.tag || blog.tag;
    blog.content = body.content || blog.content;
    blog.thumbnail = body.thumbnail || blog.thumbnail;
    blog.isPublish =
      body.isPublish != undefined ? body.isPublish : blog.isPublish;
    blog.updatedBy = user.id;
    blog.updatedAt = new Date();
    await this.repo.save(blog);
    return 'Update successfully!';
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

    const [totalPublished, totalDrafts] = await Promise.all([
      this.repo.count({
        where: { isPublish: true, isDeleted: false },
      }),
      this.repo.count({
        where: { isPublish: false, isDeleted: false },
      }),
    ]);

    return {
      data: result,
      total,
      totalViews: 100,
      totalPublished: totalPublished,
      totalDrafts: totalDrafts,
    };
  }

  async forceDelete(id: string) {
    await this.repo.delete(id);
    return 'Delete successfully!';
  }
}
