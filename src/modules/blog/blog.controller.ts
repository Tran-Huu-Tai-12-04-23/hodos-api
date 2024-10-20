import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/dto/pagination.dto';
import { BlogService } from './blog.service';
import { BlogCreateDTO } from './dto/create.dto';

@ApiTags('Blog API')
@Controller('blog')
export class BlogController {
  constructor(private readonly service: BlogService) {}

  @ApiOperation({
    summary: 'Blog create',
  })
  @ApiResponse({ status: 201 })
  @Post()
  async create(@Body() body: BlogCreateDTO) {
    return await this.service.create(body);
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
