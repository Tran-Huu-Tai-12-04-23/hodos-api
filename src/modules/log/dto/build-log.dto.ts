import { IsOptional, IsString } from 'class-validator';

export class BuildLogPaginationDTO {
  @IsString()
  @IsOptional()
  buildDate: string;
}
