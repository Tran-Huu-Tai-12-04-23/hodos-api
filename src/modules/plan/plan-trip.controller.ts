import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/helpers/decorators';
import { UserDataDTO } from '../auth/dto';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { CreateTripDTO } from './dto';
import { PlanTripService } from './plan-trip.service';

@ApiTags('Plan trips API')
@Controller('plan-trip')
@UseGuards(JwtAuthGuard)
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

  @ApiResponse({ status: 201 })
  @Post('save-trip')
  async saveTrip(
    @Body() body: CreateTripDTO,
    @CurrentUser() user: UserDataDTO,
  ) {
    return await this.service.saveTrip(body, user);
  }
}
