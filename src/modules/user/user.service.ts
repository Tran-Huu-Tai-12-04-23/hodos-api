import { Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/dto/pagination.dto';
import { SubscriptionStatus } from 'src/entities';
import { UserEntity } from 'src/entities/user.entity';
import { UserDetailEntity } from 'src/entities/userDetail.entity';
import { UserDetailRepository, UserRepository } from 'src/repositories';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from '../auth/auth.service';
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
  ) {}

  async detail(data: GetUserInfoDTO) {
    return await this.authService.getTokenFromAccessOrRefreshToken(data);
  }

  async update(user: UserEntity, data: UserUpdateDto) {
    const userFound = await this.repo.findOne({
      where: { id: user.id },
    });

    if (!userFound) {
      throw new Error('User not found');
    }

    if (userFound.isUpdateDetail) {
      await this.detailRepo.update(
        {
          userId: userFound.id,
        },
        {
          address: data.address,
          phoneNumber: data.phoneNumber,
          email: data.email,
          githubLink: data.githubLink,
          telegramLink: data.telegramLink,
          facebookLink: data.facebookLink,
          bio: data.bio,
          profilePictureUrl: data.profilePictureUrl,
          birthDate: data.birthDate,
          gender: data.gender,
          nationality: data.nationality,
          travelInterests: data.travelInterests,
          travelHistory: data.travelHistory,
        },
      );
    } else {
      const userDetail = new UserDetailEntity();
      userDetail.id = uuidv4();
      userDetail.userId = userFound.id;
      userDetail.address = data.address || '';
      userDetail.phoneNumber = data.phoneNumber || '';
      userDetail.email = data.email || '';
      userDetail.githubLink = data.githubLink || '';
      userDetail.telegramLink = data.telegramLink || '';
      userDetail.facebookLink = data.facebookLink || '';
      userDetail.bio = data.bio || '';
      userDetail.profilePictureUrl = data.profilePictureUrl || '';
      userDetail.birthDate = data.birthDate ? new Date(data.birthDate) : null;
      userDetail.gender = data.gender || '';
      userDetail.nationality = data.nationality || '';
      userDetail.travelInterests = data.travelInterests || '';
    }

    return {
      ...userFound,
      ...data,
    };
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
