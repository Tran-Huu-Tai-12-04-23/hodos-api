import { Module } from '@nestjs/common';
import { UserDetailRepository, UserRepository } from 'src/repositories';
import { TypeOrmExModule } from 'src/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmExModule.forCustomRepository([UserRepository, UserDetailRepository]),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
