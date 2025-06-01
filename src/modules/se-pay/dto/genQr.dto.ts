import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GenQrDto {
  @ApiProperty({ description: 'Content' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ description: 'AMOUNT' })
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
