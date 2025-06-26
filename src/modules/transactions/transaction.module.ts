import { Module } from '@nestjs/common';
import { TransactionRepository } from 'src/repositories';
import { TypeOrmExModule } from 'src/typeorm';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([TransactionRepository])],
  providers: [TransactionService],
  controllers: [TransactionController],
  exports: [TransactionService],
})
export class TransactionModule {}
