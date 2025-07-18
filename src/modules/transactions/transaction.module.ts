import { Module } from '@nestjs/common';
import { TransactionRepository } from 'src/repositories/transactions.repository';
import { TypeOrmExModule } from 'src/typeorm';
import { NotificationModule } from '../notification/notification.module';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([TransactionRepository]),
    NotificationModule,
  ],
  providers: [TransactionService],
  controllers: [TransactionController],
  exports: [TransactionService],
})
export class TransactionModule {}
