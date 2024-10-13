import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FoodCreateDTO {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  label: string;
  @IsString()
  @IsNotEmpty()
  address: string;
  @IsString()
  @IsOptional()
  description: string;
  @IsNotEmpty()
  @IsArray()
  rangePrice: number[];
  @IsNotEmpty()
  @IsArray()
  lstImgs: string[];
}

export class FoodCreateMultiDTO {
  @IsNotEmpty()
  @IsArray()
  foods: FoodCreateDTO[];
}
