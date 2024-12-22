import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class BugLogDto {
  @IsString()
  @IsNotEmpty()
  project: string;

  @IsString()
  @IsNotEmpty()
  source: string;

  @IsString()
  @IsNotEmpty()
  environments: string;

  @IsString()
  @IsNotEmpty()
  error: string;

  @IsString()
  @IsOptional()
  request: string;

  @IsString()
  @IsOptional()
  message: string;

  @IsNumber()
  status: number;

  @IsString()
  @IsNotEmpty()
  timestamp: string;

  @IsString()
  @IsNotEmpty()
  path: string;

  @IsString()
  @IsOptional()
  name: string;
}
