import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/dto/pagination.dto';
import { BlogService } from '../blog/blog.service';

@ApiTags('Mobile blog Controller')
@Controller('mobile/blog')
export class MobileBlogController {
  constructor(private readonly service: BlogService) {}
  @Post('top-5')
  async top5() {
    return this.service.top5();
  }
  @Post('pagination')
  async pagination(@Body() body: PaginationDto<any>) {
    return this.service.userPagination(body);
  }
}
