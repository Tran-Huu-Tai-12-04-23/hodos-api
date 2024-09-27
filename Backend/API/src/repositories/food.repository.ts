import { FoodEntity } from 'src/entities/food.entity';
import { CustomRepository } from 'src/typeorm/typeorm-decorater';
import { Repository } from 'typeorm';

@CustomRepository(FoodEntity)
export class FoodRepository extends Repository<FoodEntity> {}
