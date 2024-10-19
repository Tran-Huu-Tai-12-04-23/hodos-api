import { IsNotEmpty, IsString } from 'class-validator';

export class BlogCreateDTO {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsNotEmpty()
  tag: string;
  @IsString()
  @IsNotEmpty()
  content: string;
}
