import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/dto/pagination.dto';
import { FoodCreateDTO, FoodCreateMultiDTO } from './dto/create.dto';
import { FoodFilter } from './dto/food.pagination.dto';
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
    summary: 'Lst food',
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

  @ApiOperation({
    summary: 'Food pagination',
  })
  @ApiResponse({ status: 201 })
  @Post('pagination')
  async pagination(@Body() body: PaginationDto<FoodFilter>) {
    return await this.service.pagination(body);
  }

  @ApiOperation({
    summary: 'Food create',
  })
  @ApiResponse({ status: 201 })
  @Post('create')
  async create(@Body() body: FoodCreateDTO) {
    return await this.service.create(body);
  }

  @ApiOperation({
    summary: 'Food multi create',
  })
  @ApiResponse({ status: 201 })
  @Post('multi-create')
  async multiCreate(@Body() body: FoodCreateMultiDTO) {
    return await this.service.multiCreate(body);
  }

  @ApiResponse({ status: 201 })
  @Delete('soft/:id')
  async removeSoft(@Param('id') id: string) {
    return await this.service.removeSoft(id);
  }
}
