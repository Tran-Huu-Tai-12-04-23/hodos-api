import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/dto/pagination.dto';
import { UserEntity } from 'src/entities';
import { CurrentUser } from 'src/helpers/decorators';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { NotificationService } from '../notification/notification.service';

@ApiTags('Mobile notification Controller')
@Controller('mobile/notification')
@UseGuards(JwtAuthGuard)
export class MobileNotificationController {
  constructor(private readonly service: NotificationService) {}

  @Post('pagination')
  async pagination(
    @CurrentUser() user: UserEntity,
    @Body() body: PaginationDto<any>,
  ) {
    return this.service.notificationPagination(user.id, body);
  }

  @Get(':id')
  async getNotificationById(@Param('id') id: string) {
    return this.service.getNotificationById(id);
  }

  @Put('read/:id')
  async read(@CurrentUser() user: UserEntity, @Param('id') id: string) {
    return this.service.read(user, id);
  }
}
