import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/dto/pagination.dto';
import { UserEntity } from 'src/entities';
import { CurrentUser } from 'src/helpers/decorators';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { BlogService } from './blog.service';
import { BlogCreateDTO, BlogUpdateDTO } from './dto/create.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('Blog API')
@Controller('blog')
export class BlogController {
  constructor(private readonly service: BlogService) {}

  @ApiOperation({
    summary: 'Blog create',
  })
  @ApiResponse({ status: 201 })
  @Post()
  async create(@Body() body: BlogCreateDTO, @CurrentUser() user: UserEntity) {
    return await this.service.create(user, body);
  }

  @ApiOperation({
    summary: 'Blog update',
  })
  @ApiResponse({ status: 201 })
  @Patch('')
  async update(@CurrentUser() user: UserEntity, @Body() body: BlogUpdateDTO) {
    return await this.service.update(user, body);
  }

  @ApiOperation({
    summary: 'Blog pagination',
  })
  @ApiResponse({ status: 201 })
  @Post('pagination')
  async pagination(@Body() body: PaginationDto<any>) {
    return await this.service.pagination(body);
  }
  @ApiResponse({ status: 201 })
  @Get(':id')
  async detail(@Param('id') id: string) {
    return await this.service.detail(id);
  }
  @ApiResponse({ status: 201 })
  @Delete('force/:id')
  async forceDelete(@Param('id') id: string) {
    return await this.service.forceDelete(id);
  }
}
