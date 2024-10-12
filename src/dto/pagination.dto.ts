import { IsNumber, IsObject, IsOptional } from 'class-validator';

export class PaginationDto<T> {
  @IsObject()
  @IsOptional()
  where?: T;

  @IsObject()
  @IsOptional()
  order?: any;

  @IsNumber()
  skip: number;

  @IsNumber()
  take: number;
}
