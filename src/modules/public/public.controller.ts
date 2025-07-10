import { Controller, Get, Param } from '@nestjs/common';

import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { BlogService } from '../blog/blog.service';

@ApiTags('public API')
@Controller('public')
export class PublicController {
  constructor(private readonly blogService: BlogService) {}

  @ApiResponse({ status: 201 })
  @Get('blog/:id')
  async detail(@Param('id') id: string) {
    return await this.blogService.detail(id);
  }
}
