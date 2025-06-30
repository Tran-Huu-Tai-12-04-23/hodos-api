import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { TransactionService } from './transaction.service';
@UseGuards(JwtAuthGuard)
@ApiTags('transaction API')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly service: TransactionService) {}

  @ApiOperation({
    summary: 'Transaction pagination',
    description: '',
  })
  @ApiResponse({ status: 201 })
  @Post('pagination')
  async pagination(@Body() pagination: PaginationDto<any>) {
    return await this.service.pagination(pagination);
  }
}
