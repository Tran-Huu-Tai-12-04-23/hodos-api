import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TravelBlogCreateDTO {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsOptional()
  tag: string;
  @IsString()
  @IsNotEmpty()
  content: string;
  @IsString()
  @IsNotEmpty()
  thumbnail: string;
  @IsArray()
  @IsOptional()
  imgs: string[];
}
