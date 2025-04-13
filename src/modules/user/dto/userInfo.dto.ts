import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GetUserInfoDTO {
  @ApiProperty({ description: 'Access token ' })
  @IsNotEmpty()
  accessToken: string;

  @ApiProperty({ description: 'Refresh token ' })
  @IsNotEmpty()
  refreshToken: string;
}
