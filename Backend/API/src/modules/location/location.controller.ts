import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LocationService } from './location.service';

@ApiTags('Location API')
@Controller('location')
export class LocationController {
  constructor(private readonly service: LocationService) {}

  @ApiOperation({
    summary: 'Init location',
  })
  @ApiResponse({ status: 201 })
  @Get('init')
  async initLocation() {
    return await this.service.initLocation();
  }

  @ApiOperation({
    summary: 'Lst location',
  })
  @ApiResponse({ status: 201 })
  @Post('')
  async lstHomeData(@Body() data: { where: any; skip: number; take: number }) {
    return await this.service.find(data);
  }

  @ApiOperation({
    summary: 'Predict   location',
  })
  @ApiResponse({ status: 201 })
  @Post('predict')
  async predict(@Body() data: { imgUrl: string }) {
    return await this.service.predict(data);
  }
}
