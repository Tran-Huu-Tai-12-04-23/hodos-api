import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/repositories/user.repository';
import { RefreshTokenDTO, SignInDTO, SignUpDTO } from './dto';

import { ConfigService } from '@nestjs/config';
import { enumData } from '../../constants/enum-data';
import { UserEntity } from '../../entities/user.entity';
import { EmailService } from '../email/email.service';
import { GetUserInfoDTO } from '../user/dto/userInfo.dto';

@Injectable()
export class AuthService {
  constructor(
    private repo: UserRepository,
    private jwtService: JwtService,
    private emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  JWT_SECRET = this.configService.get<string>('JWT_SECRET');

  async signIn(signInDto: SignInDTO) {
    const user: any = await this.repo.findOne({
      where: [
        { username: signInDto.username, isDeleted: false },
        { email: signInDto.username, isDeleted: false },
      ],
      relations: {
        userDetail: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found!');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('User not active!');
    }
    if (!user.verifyAt) {
      throw new UnauthorizedException('User not verified!');
    }

    const isMatch = await user.comparePassword(signInDto.password);
    if (!isMatch) {
      throw new UnauthorizedException('Password incorrect!');
    }

    const payload = {
      uid: user.id,
    };
    const accessToken = this.jwtService.sign(payload);

    const refreshPayload = {
      uid: user.id,
    };
    const refreshToken = this.jwtService.sign(refreshPayload, {
      expiresIn: '7d',
    });

    const userDetail = user.__userDetail__;
    delete user.__userDetail__;
    delete user.password;

    return {
      accessToken,
      refreshToken,
      enumData,
      user: { ...user, userDetail },
    };
  }

  async signUp(signUpDTO: SignUpDTO) {
    if (await this.repo.findOneBy({ username: signUpDTO.username })) {
      throw new UnauthorizedException('User already exists!');
    }

    if (signUpDTO.password !== signUpDTO.confirmPassword) {
      throw new UnauthorizedException('Password not match!');
    }

    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const newUser = new UserEntity();
    newUser.username = signUpDTO.username;
    newUser.password = signUpDTO.password;
    newUser.email = signUpDTO.email;
    newUser.avatar =
      'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg';
    newUser.isActive = true;
    newUser.verifyCode = verificationCode;
    newUser.verifyExpiredTime = new Date(new Date().getTime() + 10 * 60 * 1000);

    await this.repo.insert(newUser);

    await this.emailService.sendEmailVerification(
      signUpDTO.email,
      verificationCode,
    );

    return {
      message: 'User registered successfully!',
    };
  }

  async verifyUser(data: {
    username: string;
    verifyCode: string;
    email: string;
  }) {
    const user = await this.repo.findOneBy({
      username: data.username,
      email: data.email,
      verifyCode: data.verifyCode,
      isDeleted: false,
    });

    if (!user) throw new NotFoundException('User not found!');
    /// check code is expired
    const currentTime = new Date();
    const timeDifference =
      user.verifyExpiredTime.getTime() - currentTime.getTime();

    if (timeDifference <= 0) {
      throw new UnauthorizedException('Verification code expired!');
    }

    user.verifyAt = new Date();
    await this.repo.save(user);
    return { message: 'User verified successfully!' };
  }

  async resendVerificationCode(data: { username: string; email: string }) {
    if (!data.username || !data.email) {
      throw new UnauthorizedException('Username or email is required!');
    }
    const user = await this.repo.findOneBy({
      username: data.username,
      email: data.email,
      isDeleted: false,
    });

    if (!user) throw new NotFoundException('User not found!');

    if (user.verifyAt) {
      throw new UnauthorizedException('User already verified!');
    }

    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
    user.verifyCode = verificationCode;
    user.verifyExpiredTime = new Date(new Date().getTime() + 10 * 60 * 1000);
    await this.repo.save(user);

    await this.emailService.sendEmailVerification(data.email, verificationCode);
    return { message: 'Verification code sent successfully!' };
  }

  async checkUserExist(username: string): Promise<boolean> {
    const user = await this.repo.findOneBy({ username });
    return !!user;
  }

  async refreshToken(data: RefreshTokenDTO) {
    if (!this.JWT_SECRET) {
      throw new UnauthorizedException('JWT_SECRET not found!');
    }
    const { id } = this.jwtService.verify(data.refreshToken, {
      secret: this.JWT_SECRET,
    });
    const user: any = await this.repo.findOne({
      where: { id },
      relations: {
        userDetail: true,
      },
    });
    if (!user) throw new UnauthorizedException('User not found!');

    const payload = {
      uid: user.id,
    };
    const accessToken = this.jwtService.sign(payload);

    const refreshPayload = {
      uid: user.id,
    };
    const refreshToken = this.jwtService.sign(refreshPayload, {
      expiresIn: '7d',
    });

    if (!user) {
      throw new UnauthorizedException('User not found!');
    }

    const userDetail = user.__userDetail__;
    delete user.__userDetail__;

    /// delay 3s
    return {
      accessToken,
      refreshToken,
      enumData,
      user: { ...user, userDetail },
    };
  }

  async getUserById(id: string) {
    const user = await this.repo.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found!');
    return user;
  }

  async getTokenFromAccessOrRefreshToken(data: GetUserInfoDTO) {
    const res: RefreshTokenDTO = {
      refreshToken: data.refreshToken,
    };
    return await this.refreshToken(res);
  }
}
