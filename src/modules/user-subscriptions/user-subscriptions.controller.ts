import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from 'src/entities';
import { CurrentUser } from 'src/helpers/decorators';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { UserSubscriptionsService } from './user-subscriptions.service';
@UseGuards(JwtAuthGuard)
@ApiTags('User subscriptions API')
@Controller('user-subscriptions')
export class UserSubscriptionsController {
  constructor(private readonly service: UserSubscriptionsService) {}

  @ApiOperation({
    summary: 'Create user subscription trial ',
    description: 'Create a new subscription trial for the user.',
  })
  @ApiResponse({
    status: 201,
    description: 'Subscription trial created successfully.',
  })
  @Post('trial/:pricingPlanId')
  async createSubscriptionTrial(
    @CurrentUser() user: UserEntity,
    @Param('pricingPlanId') pricingPlanId: string,
  ) {
    return await this.service.createSubscriptionTrial(user, pricingPlanId);
  }
}
