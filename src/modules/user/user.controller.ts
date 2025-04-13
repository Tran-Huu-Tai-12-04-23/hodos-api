import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUserInfoDTO } from './dto/userInfo.dto';
import { UserService } from './user.service';

@ApiTags('USer API')
@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @ApiOperation({
    summary: 'user info ',
  })
  @Post('detail')
  async detail(@Body() data: GetUserInfoDTO) {
    return await this.service.detail(data);
  }
}
