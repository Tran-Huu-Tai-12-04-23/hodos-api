import {
  Body,
  Controller,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/dto/pagination.dto';
import { UserEntity } from 'src/entities/user.entity';
import { CurrentUser } from 'src/helpers/decorators';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
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

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update user profile' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UserUpdateDto })
  @Put()
  @UseInterceptors(FileInterceptor('avatar'))
  async update(
    @CurrentUser() user: UserEntity,
    @Body() data: UserUpdateDto,
    @UploadedFile() avatarFile?: Express.Multer.File,
  ) {
    return await this.service.update(user, data, avatarFile);
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
