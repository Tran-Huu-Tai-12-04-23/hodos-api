import { Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/dto/pagination.dto';
import { PostEntity } from 'src/entities/post.entity';
import { coreHelper } from 'src/helpers';
import { UserRepository } from 'src/repositories';
import { PostRepository } from 'src/repositories/blog.repository';
import { LocationRepository } from 'src/repositories/location.repository';
import { In } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    private readonly repo: PostRepository,
    private readonly userRepo: UserRepository,
    private readonly locationRepo: LocationRepository,
  ) {}
  async create(blog: Partial<PostEntity>): Promise<PostEntity> {
    return this.repo.save(blog);
  }

  async pagination(data: PaginationDto<any>) {
    const res: any = await this.repo.findAndCount({
      where: {},
      take: data.take,
      skip: data.skip,
      order: {
        createdAt: 'DESC',
      },
    });

    for (const item of res[0]) {
      item.imgs = item.imgs.split(',');
      item.tag = item.tag.trim().split(',');
    }

    const userIds = res[0].map((item: any) => item.createdBy);
    const users = await this.userRepo.find({
      where: {
        id: In(userIds),
      },
    });
    const dictUserById: any = coreHelper.toDict(users, 'id');

    for (const item of res[0]) {
      item.user = dictUserById[item.createdBy];
      item.username = dictUserById[item.createdBy].username;
    }

    const allLabels = res[0]
      .map((item: any) => item.tag)
      .flat()
      .filter((item: any) => item !== '');

    const locationsByLabels = await this.locationRepo.find({
      where: {
        label: In(allLabels),
        isDeleted: false,
      },
    });
    const dictLocationsByLabel: any = coreHelper.toDict(
      locationsByLabels,
      'label',
    );
    for (const item of res[0]) {
      const locations: any = [];
      for (const label of item.tag) {
        if (dictLocationsByLabel[label]) {
          locations.push(dictLocationsByLabel[label]);
        }
      }
      item.locations = locations;
    }

    return {
      data: res[0],
      total: res[1],
      nextSkip: data.skip + data.take,
      hasNext: data.skip + data.take < res[1],
      take: data.take,
    };
  }

  async findOne(id: string): Promise<PostEntity | null> {
    return this.repo.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
