import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { PostService } from '../post/post.service';
@UseGuards(JwtAuthGuard)
@ApiTags('Admin User Post Controller')
@Controller('admin/user-post')
export class AdminUserPostController {
  constructor(private readonly service: PostService) {}

  @Post('pagination')
  async scheduleNotificationPagination(@Body() body: PaginationDto<any>) {
    return this.service.adminPagination(body);
  }

  @Put('reject/:id')
  async rejectPost(@Body() body: any, @Param('id') id: string) {
    return this.service.rejected(id, body);
  }
}
