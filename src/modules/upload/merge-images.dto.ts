// merge-images.dto.ts
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsOptional,
  IsString,
} from 'class-validator';

export class MergeImagesDto {
  @IsArray()
  @ArrayMinSize(4)
  @ArrayMaxSize(4)
  @IsString({ each: true })
  imagePaths: string[];

  @IsOptional()
  @IsString()
  filename?: string;

  @IsOptional()
  @IsString()
  folder?: string;
}
