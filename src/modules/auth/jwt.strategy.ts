import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from '../../repositories';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    public readonly configService: ConfigService,
    private readonly userRepo: UserRepository,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: { uid: string }) {
    const user: any = await this.userRepo.findOne({
      where: { id: payload.uid },
      relations: {
        userDetail: true,
      },
    });
    if (!user) throw new UnauthorizedException('No permission!');

    const detail = user.__userDetail__;
    const dataUserSub = await this.authService.getUserSubscriptionInfo(user.id);
    delete user.__userDetail__;
    delete user.password;
    return {
      ...user,
      userDetail: detail,
      ...(dataUserSub || {}),
    };
  }
}
