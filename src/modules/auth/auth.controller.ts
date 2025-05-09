import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserEntity } from 'src/entities/user.entity';
import { CurrentUser } from 'src/helpers/decorators';
import { enumData } from '../../constants/enum-data';
import { AuthService } from './auth.service';
import { RefreshTokenDTO, SignInDTO, SignUpDTO } from './dto';
import { JwtAuthGuard } from './jwt.auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly service: AuthService,
    private readonly configService: ConfigService,
  ) {}
  private FRONT_END_LINK = this.configService.get<string>('FRONT_END_LINK');

  @ApiOperation({
    summary: 'Get profile of user',
  })
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getProfile(@CurrentUser() user: UserEntity) {
    return {
      user,
      enumData: enumData,
    };
  }

  @ApiOperation({
    summary: 'Login with username and password',
  })
  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDTO) {
    return await this.service.signIn(signInDto);
  }
  @ApiOperation({
    summary: 'Register user with username and password',
  })
  @Post('sign-up')
  async signUp(@Body() signupDTO: SignUpDTO) {
    return await this.service.signUp(signupDTO);
  }

  @ApiOperation({
    summary: 'Verify user with verification code',
  })
  @Post('verify')
  async verify(
    @Body() data: { verifyCode: string; email: string; username: string },
  ) {
    return await this.service.verifyUser(data);
  }

  @ApiOperation({
    summary: 'Resend verification code to email',
  })
  @Post('resend-verification-code')
  async resendVerificationCode(
    @Body() data: { email: string; username: string },
  ) {
    return await this.service.resendVerificationCode(data);
  }

  @ApiOperation({
    summary: 'Refresh ac token when ac token expired',
  })
  @Post('refresh-token')
  async refreshToken(@Body() data: RefreshTokenDTO) {
    return await this.service.refreshToken(data);
  }
}
