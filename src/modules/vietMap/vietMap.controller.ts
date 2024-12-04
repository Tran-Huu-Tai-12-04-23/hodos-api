import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FindRouteDTO } from './dto';
import { VietMapService } from './vietMap.service';

@ApiTags('VietMap')
@Controller('vietmap')
export class VietMapController {
  constructor(private readonly service: VietMapService) {}

  @ApiOperation({
    summary: 'Find route',
  })
  @ApiResponse({ status: 201 })
  @Post('find-route')
  async findRoute(@Body() body: FindRouteDTO) {
    return this.service.findRoute(body);
  }
}
