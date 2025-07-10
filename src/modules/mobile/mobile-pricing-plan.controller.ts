import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserEntity } from 'src/entities';
import { CurrentUser } from 'src/helpers/decorators';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { UserSubscriptionsService } from '../user-subscriptions/user-subscriptions.service';

@ApiTags('Mobile pricing-plan Controller')
@Controller('mobile/pricing-plan')
export class MobilePricingPlanController {
  constructor(
    private readonly userSubscriptionService: UserSubscriptionsService,
  ) {}

  //#region user subscriptions
  @UseGuards(JwtAuthGuard)
  @Get('active-plan')
  async getUserSubscriptions() {
    return this.userSubscriptionService.getAllActivePlans();
  }

  @UseGuards(JwtAuthGuard)
  @Post('sub')
  async subPricingPlan(@CurrentUser() user: UserEntity, @Body() body: any) {
    if (!body?.pricingPlanId) {
      throw new Error('Pricing plan ID is required');
    }
    return this.userSubscriptionService.subPricingPlan(
      user,
      body?.pricingPlanId,
    );
  }

  // check transaction status
  @UseGuards(JwtAuthGuard)
  @Post('check-transaction')
  async userHaveCompletedPayment(
    @CurrentUser() user: UserEntity,
    @Body() body: { transactionId: string },
  ): Promise<{
    message: string;
    isCompleted: boolean;
  }> {
    if (!body?.transactionId) {
      throw new Error('Transaction ID is required');
    }
    return this.userSubscriptionService.userHaveCompletedPayment(
      user.id,
      body.transactionId,
    );
  }

  // Get user subscriptions
}
