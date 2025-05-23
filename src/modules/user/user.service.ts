import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/entities/user.entity';
import { UserDetailEntity } from 'src/entities/userDetail.entity';
import { UserDetailRepository, UserRepository } from 'src/repositories';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from '../auth/auth.service';
import { UserUpdateDto } from './dto';
import { GetUserInfoDTO } from './dto/userInfo.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly repo: UserRepository,
    private readonly detailRepo: UserDetailRepository,
    private readonly authService: AuthService,
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
}
