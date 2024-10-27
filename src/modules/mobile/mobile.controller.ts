import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/dto/pagination.dto';
import { UserEntity } from 'src/entities/user.entity';
import { TravelBlogCreateDTO } from './dto/travel-blog.dto';
import { MobileService } from './mobile.service';

@ApiTags('Mobile Controller')
@Controller('mobile')
export class MobileController {
  constructor(private readonly service: MobileService) {}

  //#region  travel blog
  @Post('travel-blogs/pagination')
  async getTravelBlogs(@Body() paginationDto: PaginationDto<any>) {
    return this.service.travelBlogPagination(paginationDto);
  }

  @Get('travel-blogs/:id')
  async getTravelBlogDetail(@Param('id') id: string) {
    return this.service.travelBlogDetail(id);
  }

  @Post('travel-blogs/create')
  async createTravelBlog(
    @Body() blog: TravelBlogCreateDTO,
    @Body('user') user: UserEntity,
  ) {
    return this.service.travelBlogCreate(user, blog);
  }

  @Delete('travel-blogs/:id')
  async removeTravelBlog(@Param('id') id: string) {
    return this.service.travelBlogRemove(id);
  }
  //#endregion
}
