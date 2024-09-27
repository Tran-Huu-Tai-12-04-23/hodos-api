import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FoodService } from './food.service';

@ApiTags('Food API')
@Controller('food')
export class FoodController {
  constructor(private readonly service: FoodService) {}

  @ApiOperation({
    summary: 'Init food',
  })
  @ApiResponse({ status: 201 })
  @Get('init')
  async initFood() {
    return await this.service.initFood();
  }

  @ApiOperation({
    summary: 'Lst   food',
  })
  @ApiResponse({ status: 201 })
  @Post('')
  async lstHomeData(@Body() data: { where: any; skip: number; take: number }) {
    return await this.service.find(data);
  }

  @ApiOperation({
    summary: 'Predict food',
  })
  @ApiResponse({ status: 201 })
  @Post('predict')
  async predict(@Body() data: { imgUrl: string }) {
    return await this.service.predict(data);
  }
}
