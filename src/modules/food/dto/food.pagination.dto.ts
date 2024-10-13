import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FoodFilter {
  @IsString()
  @IsOptional()
  name: string;
}

export class FoodDetailDTO {
  @IsString()
  @IsNotEmpty()
  id: string;
}
