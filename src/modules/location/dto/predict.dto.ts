import { IsNotEmpty, IsString } from 'class-validator';

export class PredictDTO {
  @IsString()
  @IsNotEmpty()
  imgUrl: string;
}
