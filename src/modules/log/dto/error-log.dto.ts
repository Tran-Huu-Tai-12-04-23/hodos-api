import { IsOptional, IsString } from 'class-validator';

export class ErrorLogPaginationDTO {
  @IsString()
  @IsOptional()
  logDate: string;
}
