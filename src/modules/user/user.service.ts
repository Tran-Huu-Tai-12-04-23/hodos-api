import { Injectable } from '@nestjs/common';
import { UserDetailRepository, UserRepository } from 'src/repositories';
import { AuthService } from '../auth/auth.service';
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
}
