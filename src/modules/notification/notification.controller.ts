import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { NotificationService } from './notification.service';
@UseGuards(JwtAuthGuard)
@ApiTags('notification API')
@Controller('notification')
export class NotificationController {
  constructor(private readonly service: NotificationService) {}
}
