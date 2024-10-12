import { IsOptional, IsString } from 'class-validator';

export class FoodFilter {
  @IsString()
  @IsOptional()
  name: string;
}
