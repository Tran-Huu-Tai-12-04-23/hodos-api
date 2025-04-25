import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { PlanTripService } from './plan-trip.service';

@ApiTags('Plan trips API')
@Controller('plan-trip')
export class PlanTripController {
  constructor(private readonly service: PlanTripService) {}

  @ApiResponse({ status: 201 })
  @Get('load-question-to-collect')
  async loadQuestionToCollect() {
    return await this.service.loadQuestionToCollect();
  }

  @ApiResponse({ status: 201 })
  @Post('plan-trip')
  async suggestTripPlan(@Body() body: any) {
    return await this.service.suggestTripPlan(body);
  }
}
