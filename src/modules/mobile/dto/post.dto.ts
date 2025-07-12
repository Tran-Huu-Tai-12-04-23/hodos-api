import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class PostCreateDTO {
  @ApiProperty({ description: 'Content of the blog post' })
  @IsString()
  @IsOptional()
  content: string;

  @ApiPropertyOptional({
    description: 'Additional images related to the blog',
    type: 'string',
    format: 'binary',
    isArray: true,
  })
  @IsOptional()
  imgs?: any[];
}
