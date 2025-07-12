import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/repositories/user.repository';
import {
  LoginWithGoogleDto,
  RefreshTokenDTO,
  SignInDTO,
  SignUpDTO,
} from './dto';

import { ConfigService } from '@nestjs/config';
import { SubscriptionStatus } from 'src/entities';
import { UserDeviceEntity } from 'src/entities/user-device.entity';
import { UserDetailEntity } from 'src/entities/userDetail.entity';
import { v4 as uuidv4 } from 'uuid';
import { enumData } from '../../constants/enum-data';
import { UserEntity } from '../../entities/user.entity';
import { EmailService } from '../email/email.service';
import { UserSubscriptionsService } from '../user-subscriptions/user-subscriptions.service';
import { GetUserInfoDTO } from '../user/dto/userInfo.dto';

@Injectable()
export class AuthService {
  constructor(
    private repo: UserRepository,
    private jwtService: JwtService,
    private emailService: EmailService,
    private readonly configService: ConfigService,
    private readonly userSubscriptionService: UserSubscriptionsService,
  ) {}

  JWT_SECRET = this.configService.get<string>('JWT_SECRET');

  async getUserInfo(userId: string) {
    const user: any = await this.repo.findOne({
      where: { id: userId },
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

    const userSubInfo = await this.getUserSubscriptionInfo(user.id);

    const userDetail = user.__userDetail__;
    delete user.__userDetail__;
    delete user.password;

    return {
      accessToken,
      refreshToken,
      enumData,
      user: {
        ...user,
        userDetail,
        isNeedVerify: !user.verifyAt,
        ...(userSubInfo || {}),
      },
    };
  }
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

    const userSubInfo = await this.getUserSubscriptionInfo(user.id);

    const userDetail = user.__userDetail__;
    delete user.__userDetail__;
    delete user.password;

    return {
      accessToken,
      refreshToken,
      enumData,
      user: {
        ...user,
        userDetail,
        isNeedVerify: !user.verifyAt,
        ...(userSubInfo || {}),
      },
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
    });

    if (!user) throw new NotFoundException('User not found!');

    if (user.verifyCode !== data.verifyCode) {
      throw new UnauthorizedException('Verification code is incorrect!');
    }
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
    const dataPayload = this.jwtService.verify(data.refreshToken, {
      secret: this.JWT_SECRET,
    });
    const [user, userSubInfo]: any = await Promise.all([
      this.repo.findOne({
        where: {
          id: dataPayload.uid,
        },
        relations: {
          userDetail: true,
        },
      }),
      this.getUserSubscriptionInfo(dataPayload.uid),
    ]);
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
    return {
      accessToken,
      refreshToken,
      enumData,
      user: {
        ...user,
        isNeedVerify: !user.verifyAt,
        userDetail,
        ...(userSubInfo || {}),
      },
    };
  }

  async getUserById(id: string) {
    const [user, userSubInfo] = await Promise.all([
      this.repo.findOneBy({ id }),
      this.getUserSubscriptionInfo(id),
    ]);

    if (!user) throw new NotFoundException('User not found!');
    return {
      ...user,
      ...userSubInfo,
    };
  }

  async getTokenFromAccessOrRefreshToken(data: GetUserInfoDTO) {
    const res: RefreshTokenDTO = {
      refreshToken: data.refreshToken,
    };
    return await this.refreshToken(res);
  }

  /** get info subscriptions  */
  async getUserSubscriptionInfo(userId: string) {
    if (!userId) {
      return {
        isPremium: false,
      };
    }
    const [userSubscription, isHasPremium] = await Promise.all([
      this.userSubscriptionService.getCurrentUserSubscription(userId),
      this.userSubscriptionService.hasPremiumAccess(userId),
    ]);

    const res = {
      isPremium: isHasPremium,
      isAutoRenew: userSubscription?.autoRenew ?? false,
      subscriptionStatus:
        userSubscription?.status ?? SubscriptionStatus.EXPIRED,
      subscriptionEndDate: userSubscription?.nextPaymentDate,
    };
    if (!isHasPremium) {
      const pricingPlanSuggest =
        await this.userSubscriptionService.getSuggestPricingPlanForUser();

      return { ...res, pricingPlanSuggest };
    }
    return {
      ...res,
      userSubscription,
    };
  }

  /** login with google  */
  async loginWithGoogle(data: LoginWithGoogleDto, deviceId: string) {
    if (!deviceId) {
      throw new UnauthorizedException(
        'Device ID is required! You just can login with mobile device',
      );
    }
    const user: any = await this.repo.findOne({
      where: { email: data.email, isDeleted: false },
      relations: {
        userDetail: true,
        devices: true,
      },
    });

    if (user) {
      // add fcm token if not exist
      const devices = user?.__devices__ || [];
      await this.checkDevices(devices, deviceId, user.id, data.fcmToken);
      return await this.signIn({
        username: data.email,
        password: process.env.JWT_SECRET || '',
      });
    }

    await this.repo.manager.transaction(async (trans) => {
      const repo = trans.getRepository(UserEntity);
      const detailRepo = trans.getRepository(UserDetailEntity);
      // If user not found, create a new one
      const newUser = new UserEntity();
      newUser.id = uuidv4();
      newUser.username = data.email;
      newUser.email = data.email;
      newUser.avatar = data.avatar;
      newUser.isActive = true;
      newUser.isLoginWithGoogle = true;
      newUser.isLoginWithFacebook = false;
      newUser.createdAt = new Date();
      newUser.createdBy = data.email;
      newUser.password = process.env.JWT_SECRET || 'default_password';
      // add user detail
      const userDetail = new UserDetailEntity();
      userDetail.id = uuidv4();
      userDetail.fullName = data.fullname;
      userDetail.email = data.email;
      userDetail.createdAt = new Date();
      userDetail.userId = newUser.id;

      await repo.insert(newUser);
      await detailRepo.insert(userDetail);

      // add fcm token if not exist
      const devices: any = [];
      await this.checkDevices(devices, deviceId, user.id, data.fcmToken);
    });

    return await this.signIn({
      username: data.email,
      password: process.env.JWT_SECRET || 'default_password',
    });
  }

  /** login with facebook  */
  async loginWithFacebook(data: LoginWithGoogleDto, deviceId: string) {
    if (!deviceId) {
      throw new UnauthorizedException(
        'Device ID is required! You just can login with mobile device',
      );
    }
    const user: any = await this.repo.findOne({
      where: { email: data.email, isDeleted: false },
      relations: {
        userDetail: true,
        devices: true,
      },
    });

    if (user) {
      // add fcm token if not exist
      const devices = user.__devices__ || [];
      await this.checkDevices(devices, deviceId, user.id, data.fcmToken);
      return await this.signIn({
        username: data.email,
        password: process.env.JWT_SECRET || '',
      });
    }

    await this.repo.manager.transaction(async (trans) => {
      const repo = trans.getRepository(UserEntity);
      const detailRepo = trans.getRepository(UserDetailEntity);
      // If user not found, create a new one
      const newUser = new UserEntity();
      newUser.id = uuidv4();
      newUser.username = data.email;
      newUser.email = data.email;
      newUser.avatar = data.avatar;
      newUser.isActive = true;
      newUser.isLoginWithGoogle = false;
      newUser.isLoginWithFacebook = true;
      newUser.createdAt = new Date();
      newUser.createdBy = data.email;
      newUser.password = process.env.JWT_SECRET || '';
      // add user detail
      const userDetail = new UserDetailEntity();
      userDetail.id = uuidv4();
      userDetail.fullName = data.fullname;
      userDetail.email = data.email;
      userDetail.createdAt = new Date();
      userDetail.userId = newUser.id;
      await repo.insert(newUser);
      await detailRepo.insert(userDetail);

      // add fcm token if not exist
      const devices: any = [];
      await this.checkDevices(devices, deviceId, data.fcmToken, user.id);
    });

    return await this.signIn({
      username: data.email,
      password: process.env.JWT_SECRET || '',
    });
  }

  /** sign in mobile  */
  async signInMobile(signInDto: SignInDTO, deviceId: string) {
    if (!deviceId) {
      throw new UnauthorizedException(
        'Device ID is required! You just can login with mobile device',
      );
    }
    const user: any = await this.repo.findOne({
      where: [
        { username: signInDto.username, isDeleted: false },
        { email: signInDto.username, isDeleted: false },
      ],
      relations: {
        userDetail: true,
        devices: true,
      },
    });

    // add fcm token if not exist
    const devices = user?.__devices__ || [];
    await this.checkDevices(devices, deviceId, user.id, signInDto.fcmToken);

    if (!user) {
      throw new NotFoundException('User not found!');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('User not active!');
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

    const userSubInfo = await this.getUserSubscriptionInfo(user.id);

    const userDetail = user.__userDetail__;
    delete user.__userDetail__;
    delete user.password;

    return {
      accessToken,
      refreshToken,
      enumData,
      user: {
        ...user,
        userDetail,
        isNeedVerify: !user.verifyAt,
        ...(userSubInfo || {}),
      },
    };
  }

  private async checkDevices(
    devices: UserDeviceEntity[],
    deviceId: string,
    userId: string,
    fcmToken?: string,
  ) {
    // check if device already exists
    const existingDevice = devices.find(
      (device) => device.deviceId === deviceId,
    );
    if (existingDevice && fcmToken === existingDevice.fcmToken) {
      return;
    } else {
      // if device not exists, add new device
      if (!fcmToken) {
        throw new UnauthorizedException('FCM token is required!');
      }
      const newDevice = new UserDeviceEntity();
      newDevice.id = uuidv4();
      newDevice.deviceId = deviceId;
      newDevice.fcmToken = fcmToken;
      newDevice.userId = userId;
      await this.repo.manager.getRepository(UserDeviceEntity).insert(newDevice);
    }
  }
  /// remove old devices when token expired
  removeDeviceId(userId: string, deviceId: string) {
    return this.repo.manager.transaction(async (trans) => {
      const userDeviceRepo = trans.getRepository(UserDeviceEntity);
      const device = await userDeviceRepo.findOne({
        where: { userId, deviceId },
      });
      if (!device) {
        throw new NotFoundException('Device not found!');
      }
      await userDeviceRepo.delete(device.id);
    });
  }
}
