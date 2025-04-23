import { Controller, Get } from '@nestjs/common';
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
}
