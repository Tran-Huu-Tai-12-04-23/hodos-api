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
  @IsString()
  @IsOptional()
  type: string;
  @IsNotEmpty()
  @IsArray()
  lstImgs: string[];
  @IsNotEmpty()
  @IsString()
  longitude: string;
  @IsNotEmpty()
  @IsString()
  latitude: string;
}

export class LocationCreateMultiDTO {
  @IsNotEmpty()
  @IsArray()
  locations: LocationCreateDTO[];
}
