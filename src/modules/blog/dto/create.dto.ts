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
  @IsOptional()
  isPublish?: boolean = false;
}

export class BlogUpdateDTO extends BlogCreateDTO {
  @IsString()
  @IsNotEmpty()
  id: string;
}
