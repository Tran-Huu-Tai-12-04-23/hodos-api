import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/dto/pagination.dto';
import { UserEntity } from 'src/entities';
import { CurrentUser } from 'src/helpers/decorators';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { RejectPostDTO } from '../post/dto';
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

  @Patch('reject/:id')
  async rejectPost(
    @CurrentUser() user: UserEntity,
    @Param('id') id: string,
    @Body() data: RejectPostDTO,
  ) {
    return this.service.rejected(id, user, data);
  }
}
