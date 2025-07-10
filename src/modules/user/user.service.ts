import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { PaginationDto } from 'src/dto/pagination.dto';
import { SubscriptionStatus } from 'src/entities';
import { UserEntity } from 'src/entities/user.entity';
import { UserDetailEntity } from 'src/entities/userDetail.entity';
import { UserDetailRepository, UserRepository } from 'src/repositories';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from '../auth/auth.service';
import { CommonService } from '../common/common.service';
import { UserSubscriptionsService } from '../user-subscriptions/user-subscriptions.service';
import { UserUpdateDto } from './dto';
import { GetUserInfoDTO } from './dto/userInfo.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly repo: UserRepository,
    private readonly detailRepo: UserDetailRepository,
    private readonly authService: AuthService,
    private readonly userSubscriptionService: UserSubscriptionsService,
    private readonly commonService: CommonService,
  ) {}

  async detail(data: GetUserInfoDTO) {
    return await this.authService.getTokenFromAccessOrRefreshToken(data);
  }

  async update(
    user: UserEntity,
    data: UserUpdateDto,
    avatarFile?: Express.Multer.File,
  ) {
    const userFound: any = await this.repo.findOne({
      where: { id: user.id },
      relations: {
        userDetail: true,
      },
    });

    if (!userFound) {
      throw new Error('User not found');
    }

    // ✅ Cập nhật avatar nếu có file upload
    if (avatarFile) {
      const avatarUrl = await this.commonService.uploadImage(avatarFile);
      userFound.avatar = avatarUrl;
    } else if (data.avatar) {
      userFound.avatar = data.avatar;
    }

    // ✅ Cập nhật thông tin đơn giản
    if (data.email) {
      userFound.email = data.email;
    }
    userFound.isUpdateDetail = true;
    userFound.updatedAt = new Date();

    // ✅ Cập nhật chi tiết
    if (userFound.__userDetail__) {
      const detail = await userFound.userDetail;

      if (data.fullName) detail.fullName = data.fullName;
      if (data.phoneNumber) detail.phoneNumber = data.phoneNumber;
      if (data.birthDate) {
        detail.birthDate = moment(data.birthDate, 'YYYY-MM-DD').toDate();
      }
      if (data.gender) detail.gender = data.gender;

      await this.detailRepo.save(detail);
    } else {
      const detail = new UserDetailEntity();
      detail.id = uuidv4();
      detail.userId = userFound.id;
      detail.fullName = data.fullName || '';
      detail.phoneNumber = data.phoneNumber || '';
      detail.birthDate =
        data.birthDate && moment(data.birthDate, 'YYYY-MM-DD', true).isValid()
          ? new Date(data.birthDate)
          : null;
      detail.gender = data.gender || '';

      await this.detailRepo.save(detail);
    }

    await this.repo.save(userFound);

    // ✅ Return full user with detail
    return await this.authService.signIn({
      username: userFound.email,
      password: process.env.JWT_SECRET || '',
    });
  }

  async pagination(data: PaginationDto<any>) {
    const { skip, take, where } = data;
    const whereCon: any = {};
    if (where?.searchText) {
      whereCon.username = {
        $like: `%${where.searchText}%`,
      };
    }
    if (where?.isActive !== undefined) {
      whereCon.isActive = where.isActive;
    }
    if (where?.isAdmin !== undefined) {
      whereCon.isAdmin = where.isAdmin;
    }

    const [items, total]: any = await this.repo.findAndCount({
      where: whereCon,
      skip: skip || 0,
      take: take || 10,
      order: {
        createdAt: 'DESC',
      },
    });

    for (const res of items) {
      const [userSubscription, isHasPremium] = await Promise.all([
        this.userSubscriptionService.getCurrentUserSubscription(res.id),
        this.userSubscriptionService.hasPremiumAccess(res.id),
      ]);

      const dataInfo = {
        isPremium: isHasPremium,
        isAutoRenew: userSubscription?.autoRenew ?? false,
        subscriptionStatus:
          userSubscription?.status ?? SubscriptionStatus.EXPIRED,
        subscriptionEndDate: userSubscription?.nextPaymentDate,
      };
      res.userSubscriptionInfo = dataInfo;
      res.userSubscription = userSubscription;
      res.isNeedVerify = !res.verifyAt;
    }

    const [totalUser, totalActiveUser, totalAdminUser, totalPremium] =
      await Promise.all([
        this.repo.count(),
        this.repo.count({ where: { isActive: true } }),
        this.repo.count({ where: { isAdmin: true } }),
        this.repo.count({ where: { isPremium: true } }),
      ]);

    return {
      data: items,
      total,
      totalUser,
      totalActiveUser,
      totalAdminUser,
      totalPremium,
    };
  }

  // userSelectBox
  async userSelectBox() {
    const users = await this.repo.find({
      where: { isActive: true, isAdmin: false },
      select: ['id', 'username', 'email'],
      order: { createdAt: 'DESC' },
    });

    return users.map((user) => ({
      value: user.id,
      label: user.username,
      email: user.email,
      username: user.username,
      id: user.id,
    }));
  }
}
