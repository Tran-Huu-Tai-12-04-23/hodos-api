import { IsNotEmpty, IsString } from 'class-validator';

export class RejectPostDTO {
  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsString()
  @IsNotEmpty()
  details: string;
}
