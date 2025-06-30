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
import { UserEntity } from 'src/entities';
import { CurrentUser } from 'src/helpers/decorators';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { MasterDataService } from './master-data.service';
@UseGuards(JwtAuthGuard)
@ApiTags('master-data API')
@Controller('master-data')
export class MasterDataController {
  constructor(private readonly service: MasterDataService) {}

  //#region  pricing plan
  @ApiOperation({
    summary: 'User subscription plan',
    description: '',
  })
  @ApiResponse({ status: 201 })
  @Post('pricing-plan/:pricingPlanId/subscribe')
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
  @Get('pricing-plan')
  async getAllPlans() {
    return await this.service.getAllPlans();
  }
  @ApiOperation({
    summary: 'Get pricing plan by ID',
    description: 'Retrieve a specific pricing plan by its ID.',
  })
  @ApiResponse({ status: 200, description: 'Pricing plan details.' })
  @Get('pricing-plan/:id')
  async getPlanById(@Param('id') id: string) {
    return await this.service.getPlanById(id);
  }

  @ApiOperation({ summary: 'Create pricing plan' })
  @Post('pricing-plan')
  async createPricingPlan(@Body() body: any) {
    return await this.service.createPricingPlan(body);
  }

  @ApiOperation({ summary: 'Update pricing plan' })
  @Patch('pricing-plan/:id')
  async updatePricingPlan(@Param('id') id: string, @Body() body: any) {
    return await this.service.updatePricingPlan(id, body);
  }

  @ApiOperation({ summary: 'Delete pricing plan' })
  @Delete('pricing-plan/:id')
  async deletePricingPlan(@Param('id') id: string) {
    return await this.service.deletePricingPlan(id);
  }
  //#endregion pricing plan

  //#region Receiving Bank
  @ApiOperation({ summary: 'Get all receiving banks' })
  @Get('receiving-bank')
  async getAllReceivingBanks() {
    return await this.service.getAllReceivingBanks();
  }

  @ApiOperation({ summary: 'Get receiving bank by ID' })
  @Get('receiving-bank/:id')
  async getReceivingBankById(@Param('id') id: string) {
    return await this.service.getReceivingBankById(id);
  }

  @ApiOperation({ summary: 'Create receiving bank' })
  @Post('receiving-bank')
  async createReceivingBank(@Body() body: any) {
    return await this.service.createReceivingBank(body);
  }

  @ApiOperation({ summary: 'Update receiving bank' })
  @Patch('receiving-bank/:id')
  async updateReceivingBank(@Param('id') id: string, @Body() body: any) {
    return await this.service.updateReceivingBank(id, body);
  }

  @ApiOperation({ summary: 'Delete receiving bank' })
  @Delete('receiving-bank/:id')
  async deleteReceivingBank(@Param('id') id: string) {
    return await this.service.deleteReceivingBank(id);
  }
  //#endregion

  //#region Plan Question
  @ApiOperation({ summary: 'Get all plan questions' })
  @Get('plan-question')
  async getAllPlanQuestions() {
    return await this.service.getAllPlanQuestions();
  }

  @ApiOperation({ summary: 'Get plan question by ID' })
  @Get('plan-question/:id')
  async getPlanQuestionById(@Param('id') id: string) {
    return await this.service.getPlanQuestionById(id);
  }

  @ApiOperation({ summary: 'Create plan question' })
  @Post('plan-question')
  async createPlanQuestion(@Body() body: any) {
    return await this.service.createPlanQuestion(body);
  }

  @ApiOperation({ summary: 'Update plan question' })
  @Patch('plan-question/:id')
  async updatePlanQuestion(@Param('id') id: string, @Body() body: any) {
    return await this.service.updatePlanQuestion(id, body);
  }

  @ApiOperation({ summary: 'Delete plan question' })
  @Delete('plan-question/:id')
  async deletePlanQuestion(@Param('id') id: string) {
    return await this.service.deletePlanQuestion(id);
  }

  @ApiOperation({ summary: 'Delete option by option ID' })
  @Delete('plan-question-option/:id')
  async deleteOptionByOptionId(@Param('id') id: string) {
    return await this.service.deleteOptionByOptionId(id);
  }
  @ApiOperation({
    summary: 'Create plan question option',
    description: 'Create a new option for a plan question.',
  })
  @Post('plan-question-option')
  async createPlanQuestionOption(@Body() body: any) {
    return await this.service.createPlanQuestionOption(body);
  }

  @ApiOperation({
    summary: 'Update plan question option',
    description: 'Update an existing option for a plan question.',
  })
  @Patch('plan-question-option/:id')
  async updatePlanQuestionOption(@Param('id') id: string, @Body() body: any) {
    return await this.service.updatePlanQuestionOptions(id, body);
  }
  //#endregion
}
