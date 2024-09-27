import { Module } from '@nestjs/common';
import { FoodRepository } from 'src/repositories/food.repository';
import { TypeOrmExModule } from 'src/typeorm';
import { FoodController } from './food.controller';
import { FoodService } from './food.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([FoodRepository])],
  providers: [FoodService],
  controllers: [FoodController],
  exports: [FoodService],
})
export class FoodModule {}
