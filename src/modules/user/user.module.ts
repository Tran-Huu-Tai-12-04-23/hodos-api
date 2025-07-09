import { Module } from '@nestjs/common';
import { UserDetailRepository, UserRepository } from 'src/repositories';
import { TypeOrmExModule } from 'src/typeorm';
import { AuthModule } from '../auth/auth.module';
import { CommonModule } from '../common/common.module';
import { UserSubscriptionsModule } from '../user-subscriptions/user-subscriptions.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    AuthModule,
    UserSubscriptionsModule,
    TypeOrmExModule.forCustomRepository([UserRepository, UserDetailRepository]),
    CommonModule,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
