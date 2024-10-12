import { IsOptional, IsString } from 'class-validator';

export class LocationFilter {
  @IsString()
  @IsOptional()
  name: string;
}
