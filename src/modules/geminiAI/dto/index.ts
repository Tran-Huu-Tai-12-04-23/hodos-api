import { IsString } from 'class-validator';

export class ChatBoxDto {
  @IsString()
  message: string;
}
