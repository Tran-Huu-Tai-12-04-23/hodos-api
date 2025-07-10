import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/dto/pagination.dto';
import { CurrentUser } from 'src/helpers/decorators';
import { UserDataDTO } from '../auth/dto';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { PostCreateDTO } from './dto/post.dto';
import { MobileService } from './mobile.service';

@ApiTags('Mobile post Controller')
@Controller('mobile/post')
export class MobilePostController {
  constructor(private readonly service: MobileService) {}

  //#region post
  @Post('pagination')
  async postPagination(@Body() paginationDto: PaginationDto<any>) {
    return this.service.postPagination(paginationDto);
  }

  @Get(':id')
  async postDetail(@Param('id') id: string) {
    return this.service.postDetail(id);
  }

  @UseInterceptors(FilesInterceptor('imgs'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create new travel blog post',
    type: PostCreateDTO,
  })
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async postCreate(
    @CurrentUser() user: UserDataDTO,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: PostCreateDTO,
  ) {
    return this.service.postCreate(user, body, files);
  }

  @Delete(':id')
  async postRemove(@Param('id') id: string) {
    return this.service.postRemove(id);
  }
  //#endregion
}
