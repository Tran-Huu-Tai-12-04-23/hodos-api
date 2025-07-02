import { Body, Controller, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/dto/pagination.dto';
import { UserEntity } from 'src/entities/user.entity';
import { CurrentUser } from 'src/helpers/decorators';
import { UserUpdateDto } from './dto';
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

  @ApiOperation({
    summary: 'Update user ',
  })
  @Put('')
  async update(@CurrentUser() user: UserEntity, @Body() data: UserUpdateDto) {
    return await this.service.update(user, data);
  }

  //#region  admin manager user
  @ApiOperation({
    summary: 'User pagination',
  })
  @Post('pagination')
  async pagination(@Body() data: PaginationDto<any>) {
    return await this.service.pagination(data);
  }
  //#endregion
}
