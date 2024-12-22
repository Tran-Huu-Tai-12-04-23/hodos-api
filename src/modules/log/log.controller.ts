import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/dto/pagination.dto';
import { BuildLogPaginationDTO, ErrorLogPaginationDTO } from './dto';
import { LogService } from './log.service';

@ApiTags('Log API')
@Controller('log')
export class LogController {
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
