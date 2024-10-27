import { Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/dto/pagination.dto';
import { TravelBlogEntity } from 'src/entities/travelblog.entity';
import { UserEntity } from 'src/entities/user.entity';
import { TravelBlogService } from '../travel-blog/travelblog.service';
import { TravelBlogCreateDTO } from './dto/travel-blog.dto';

@Injectable()
export class MobileService {
  constructor(private readonly travelBlogService: TravelBlogService) {}

  //#region  travel blog
  async travelBlogPagination(data: PaginationDto<any>) {
    return await this.travelBlogService.pagination(data);
  }
  async travelBlogDetail(id: string) {
    return await this.travelBlogService.findOne(id);
  }
  async travelBlogCreate(user: UserEntity, blog: TravelBlogCreateDTO) {
    const newBlog = new TravelBlogEntity();
    newBlog.title = blog.title;
    newBlog.tag = blog.tag;
    newBlog.content = blog.content;
    if (blog.imgs && blog.imgs.length > 0) {
      newBlog.imgs = blog.imgs.join(',');
      newBlog.thumbnail = newBlog.imgs[0];
    }
    newBlog.userId = user.id;
    newBlog.createdBy = user.id;
    newBlog.createdAt = new Date();
    newBlog.createdByName = user.username;
    return await this.travelBlogService.create(newBlog);
  }

  async travelBlogRemove(id: string) {
    return await this.travelBlogService.remove(id);
  }
  //#endregion
}
