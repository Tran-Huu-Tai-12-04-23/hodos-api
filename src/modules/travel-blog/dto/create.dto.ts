import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class BlogCreateDTO {
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
}
