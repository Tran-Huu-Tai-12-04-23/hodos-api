import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FindRouteDTO } from './dto';
import { MapService } from './map.service';

@ApiTags('Map')
@Controller('map')
export class MapController {
  constructor(private readonly service: MapService) {}

  @ApiOperation({
    summary: 'Find route',
  })
  @ApiResponse({ status: 201 })
  @Post('find-route')
  async findRoute(@Body() body: FindRouteDTO) {
    return this.service.findRoute(body);
  }
}
