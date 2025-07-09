import { Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/dto/pagination.dto';
import { NotificationEntity, NotificationType, UserEntity } from 'src/entities';
import { PostEntity, PostStatus } from 'src/entities/post.entity';
import { coreHelper } from 'src/helpers';
import { UserRepository } from 'src/repositories';
import { PostRepository } from 'src/repositories/blog.repository';
import { LocationRepository } from 'src/repositories/location.repository';
import { In } from 'typeorm';
import { CreateNotificationDto } from '../notification/dto';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class PostService {
  constructor(
    private readonly repo: PostRepository,
    private readonly userRepo: UserRepository,
    private readonly locationRepo: LocationRepository,
    private readonly notificationService: NotificationService,
  ) {}
  async create(blog: Partial<PostEntity>): Promise<PostEntity> {
    return this.repo.save(blog);
  }

  async pagination(data: PaginationDto<any>) {
    const res: any = await this.repo.findAndCount({
      where: {
        status: PostStatus.PUBLISH,
      },
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
      select: {
        id: true,
        label: true,
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

  /** admin service  */
  adminPagination(data: PaginationDto<any>) {
    const { skip, take, where } = data;
    return this.repo.findAndCount({
      where: {
        ...where,
      },
      take,
      skip,
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async rejected(id: string, user: UserEntity) {
    const post = await this.repo.findOneBy({ id });
    if (!post) {
      throw new Error('Post not found');
    }
    post.status = PostStatus.REJECTED;
    post.updatedBy = user.id;
    post.updatedAt = new Date();

    return this.repo.manager.transaction(async (trans) => {
      const repo = trans.getRepository(PostEntity);
      const notificationRepo = trans.getRepository(NotificationEntity);

      await repo.save(post);

      // send notification to user
      const notificationDto: CreateNotificationDto = {
        title: 'Bài viết của bạn đã bị từ chối',
        message: `Bài viết "${post.title}" của bạn đã bị từ chối.`,
        type: NotificationType.POST_REJECTED,
        isRead: false,
        metaData: {
          post,
        },
        userId: post.userId,
        scheduledNotificationId: null,
      };

      await this.notificationService.createNotification(
        notificationDto,
        post.userId,
        notificationRepo,
        user.username,
      );

      return {
        message: 'Post rejected successfully',
        post,
        notification: {
          title: notificationDto.title,
          message: notificationDto.message,
          type: notificationDto.type,
          userId: notificationDto.userId,
        },
      };
    });
  }
}
