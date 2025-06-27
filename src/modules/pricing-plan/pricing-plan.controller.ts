import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from 'src/entities';
import { CurrentUser } from 'src/helpers/decorators';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { PricingPlanService } from './pricing-plan.service';
@UseGuards(JwtAuthGuard)
@ApiTags('Pricing plan API')
@Controller('pricing-plan')
export class PricingPlanController {
  constructor(private readonly service: PricingPlanService) {}

  @ApiOperation({
    summary: 'User subscription plan',
    description: '',
  })
  @ApiResponse({ status: 201 })
  @Post(':pricingPlanId/subscribe')
  async genQr(
    @CurrentUser() user: UserEntity,
    @Param('pricingPanId') pricingPlanId: string,
  ) {
    return await this.service.subscriptionPlan(user, pricingPlanId);
  }

  @ApiOperation({
    summary: 'Get all pricing plans',
    description: 'Retrieve all active pricing plans.',
  })
  @ApiResponse({ status: 200, description: 'List of active pricing plans.' })
  @Get('all')
  async getAllPlans() {
    return await this.service.getAllPlans();
  }
  @ApiOperation({
    summary: 'Get pricing plan by ID',
    description: 'Retrieve a specific pricing plan by its ID.',
  })
  @ApiResponse({ status: 200, description: 'Pricing plan details.' })
  @Post(':id')
  async getPlanById(@Param('id') id: string) {
    return await this.service.getPlanById(id);
  }
}
