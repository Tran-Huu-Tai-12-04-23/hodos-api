import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LocationCreateDTO {
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
  lstImgs: string[];
}

export class LocationCreateMultiDTO {
  @IsNotEmpty()
  @IsArray()
  locations: LocationCreateDTO[];
}
