import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { UserService } from '../user/user.service';
@UseGuards(JwtAuthGuard)
@ApiTags('Admin Notification Controller')
@Controller('admin/user')
export class AdminUserController {
  constructor(private readonly service: UserService) {}

  //#region notification
  @Get('select-box')
  async userSelectBox() {
    return this.service.userSelectBox();
  }
  //#endregion
}
