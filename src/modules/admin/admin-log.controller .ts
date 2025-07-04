import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { BuildLogPaginationDTO, ErrorLogPaginationDTO } from '../log/dto';
import { LogService } from '../log/log.service';

@UseGuards(JwtAuthGuard)
@ApiTags('Admin Log Controller')
@Controller('admin/log')
export class AdminLogController {
  constructor(private readonly service: LogService) {}
  @ApiOperation({
    summary: 'Build log pagination',
  })
  @ApiResponse({ status: 201 })
  @Post('build-log')
  async buildLogPagination(@Body() body: PaginationDto<BuildLogPaginationDTO>) {
    return await this.service.buildLogPagination(body);
  }

  @ApiOperation({
    summary: 'Error log pagination',
  })
  @ApiResponse({ status: 201 })
  @Post('error-log')
  async ErrorLogPagination(@Body() body: PaginationDto<ErrorLogPaginationDTO>) {
    return await this.service.errorLogPagination(body);
  }
}
