import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TravelBlogCreateDTO {
  @ApiProperty({ description: 'Title of the travel blog' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    description: 'Optional tag for categorizing the blog',
  })
  @IsString()
  @IsOptional()
  tag: string;

  @ApiProperty({ description: 'Content of the blog post' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'Thumbnail image URL for the blog' })
  @IsString()
  @IsNotEmpty()
  thumbnail: string;

  @ApiPropertyOptional({
    description: 'Additional image URLs related to the blog',
    type: [String],
  })
  @IsArray()
  @IsOptional()
  imgs: string[];
}
