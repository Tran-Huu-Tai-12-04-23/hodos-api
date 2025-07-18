import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/dto/pagination.dto';
import { CurrentUser } from 'src/helpers/decorators';
import { UserDataDTO } from '../auth/dto';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { CreateTripDTO } from './dto';
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
  async suggestTripPlan(
    @Body() body: any,
    @Headers('x-device-id') deviceId: string,
  ) {
    return await this.service.suggestTripPlan(body, deviceId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 201 })
  @Post('save-trip')
  async saveTrip(
    @Body() body: CreateTripDTO,
    @CurrentUser() user: UserDataDTO,
  ) {
    return await this.service.saveTrip(body, user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 201 })
  @Post('pagination-trip-user')
  async paginationUserTrip(
    @Body() body: PaginationDto<any>,
    @CurrentUser() user: UserDataDTO,
  ) {
    return await this.service.paginationUserTrip(user, body);
  }

  @ApiResponse({ status: 201 })
  @Get(':id')
  async detail(@Param('id') id: string) {
    return await this.service.detail(id);
  }

  @ApiResponse({ status: 201 })
  @Post('merge-existing-trip')
  async mergeExistTrip() {
    return await this.service.mergeThumbnailExistTrip();
  }

  @ApiResponse({ status: 201 })
  @Post('trip-direction')
  async tripDirection(@Body() body: CreateTripDTO) {
    return await this.service.tripDirectionAndSave(body);
  }

  @ApiResponse({ status: 201 })
  @Post('check-permission-plan-trip')
  async checkPermissionPlanTrip(
    @Body() body: any,
    @Headers('x-device-id') deviceId: string,
  ) {
    return await this.service.checkPermissionPlanTrip(body?.userId, deviceId);
  }
}
