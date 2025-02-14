import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/dto/pagination.dto';
import { LocationCreateDTO, LocationCreateMultiDTO } from './dto/create.dto';
import { LocationFilter } from './dto/location.pagination.dto';
import { PredictDTO } from './dto/predict.dto';
import { UpdateLocationDTO } from './dto/update.dto';
import { LocationService } from './location.service';

@ApiTags('Location API')
@Controller('location')
export class LocationController {
  constructor(private readonly service: LocationService) {}

  @ApiOperation({
    summary: 'Export to  json',
  })
  @ApiResponse({ status: 201 })
  @Get('export-to-json')
  async exportToJson() {
    return await this.service.exportToJson();
  }

  @ApiOperation({
    summary: 'Init location',
  })
  @ApiResponse({ status: 201 })
  @Get('init')
  async initLocation() {
    return await this.service.initLocation();
  }

  @ApiOperation({
    summary: 'Init location',
  })
  @ApiResponse({ status: 201 })
  @Get('top-10')
  async top10() {
    return await this.service.top10();
  }
  @ApiResponse({ status: 201 })
  @Post('init-data')
  async initData() {
    return await this.service.initData();
  }

  @ApiOperation({
    summary: 'Lst location',
  })
  @ApiResponse({ status: 201 })
  @Post('find')
  async find(@Body() data: { query: string }) {
    return await this.service.find(data);
  }

  @ApiOperation({
    summary: 'Predict   location',
  })
  @ApiResponse({ status: 201 })
  @Post('predict')
  async predict(@Body() data: PredictDTO) {
    return await this.service.predict(data);
  }
  @ApiResponse({ status: 201 })
  @Get('/:id')
  async detail(@Param('id') id: string) {
    return await this.service.detail(id);
  }
  @ApiResponse({ status: 201 })
  @Post('pagination')
  async pagination(@Body() body: PaginationDto<LocationFilter>) {
    return await this.service.pagination(body);
  }

  @ApiOperation({
    summary: 'Location create',
  })
  @ApiResponse({ status: 201 })
  @Post('create')
  async create(@Body() body: LocationCreateDTO) {
    return await this.service.create(body);
  }

  @ApiOperation({
    summary: 'Location multi create',
  })
  @ApiResponse({ status: 201 })
  @Post('multi-create')
  async multiCreate(@Body() body: LocationCreateMultiDTO) {
    return await this.service.multiCreate(body);
  }

  @ApiResponse({ status: 201 })
  @Delete('soft/:id')
  async removeSoft(@Param('id') id: string) {
    return await this.service.removeSoft(id);
  }

  @ApiResponse({ status: 201 })
  @Put('update')
  async update(@Body() body: UpdateLocationDTO) {
    return await this.service.update(body);
  }
}
