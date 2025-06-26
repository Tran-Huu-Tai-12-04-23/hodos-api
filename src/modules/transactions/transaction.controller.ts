import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/dto/pagination.dto';
import { UserEntity } from 'src/entities';
import { CurrentUser } from 'src/helpers/decorators';
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
  async pagination(
    @CurrentUser() user: UserEntity,
    @Body() pagination: PaginationDto<any>,
  ) {
    if (!user.isAdmin) {
      throw new Error('Admin cannot subscribe to a pricing plan');
    }
    return await this.service.pagination(pagination);
  }
}
