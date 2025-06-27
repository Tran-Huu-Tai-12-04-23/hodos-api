import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  TransactionEntity,
  TransactionStatus,
  TransactionType,
  UserEntity,
} from 'src/entities';
import { callApiHelper } from 'src/helpers/callApiHelper';
import { PricingPlanRepository, TransactionRepository } from 'src/repositories';
import {
  BodyResponseTransactions,
  GenQrDto,
  NotifyUserBodyDto,
  SePayTransaction,
  Transaction,
} from './dto';
import { CreateUserSubscriptionTransactionDto } from './dto/createUserSubsriptionTransaction.dto';

@Injectable()
export class SepayService {
  constructor(
    public readonly configService: ConfigService,
    private readonly transactionRepo: TransactionRepository,
    private readonly pricingPlanRepo: PricingPlanRepository,
  ) {}

  private readonly bankName = this.configService.get<string>('BANK_NAME');
  private readonly bankAccount = this.configService.get<string>('BANK_ACCOUNT');
  private readonly sepayApiKey =
    this.configService.get<string>('SEPAY_API_KEY') || '';
  async createQRCode(data: GenQrDto): Promise<{ qrCode: string }> {
    const { amount, content } = data;
    const qrCode = `https://qr.sepay.vn/img?acc=${this.bankAccount}&bank=${this.bankName}&amount=${amount}&des=${encodeURIComponent(content)}`;
    return { qrCode };
  }

  async loadAllTransactions(): Promise<any> {
    if (!this.sepayApiKey) {
      throw new Error('SEPAY_API_KEY is not configured');
    }

    const params: Record<string, string> = {
      // transaction_date_min: '2023-04-30 08:00:00',
      // transaction_date_max: '2023-05-02 12:00:00',
      amount_in: '2000',
    };

    const queryParams = new URLSearchParams();
    for (const key in params) {
      if (params[key]) {
        queryParams.append(key, params[key]);
      }
    }

    const url = `https://my.sepay.vn/userapi/transactions/list?${queryParams.toString()}`;
    return await callApiHelper.get(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.sepayApiKey}`,
      },
    });
  }
  async checkTransactionSuccessInDay(data: GenQrDto): Promise<any> {
    const { amount, content } = data;
    if (!this.sepayApiKey) {
      throw new Error('SEPAY_API_KEY is not configured');
    }

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const params: Record<string, string> = {
      transaction_date_min: `${yesterday.toISOString().split('T')[0]} 00:00:00`,
      transaction_date_max: `${tomorrow.toISOString().split('T')[0]} 23:59:59`,
      amount_in: amount.toString(),
    };

    const queryParams = new URLSearchParams();
    for (const key in params) {
      if (params[key]) {
        queryParams.append(key, params[key]);
      }
    }

    const url = `https://my.sepay.vn/userapi/transactions/list?${queryParams.toString()}`;
    const transactions: BodyResponseTransactions = await callApiHelper.get(
      url,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.sepayApiKey}`,
        },
      },
    );

    const transactionFound = transactions.transactions.find(
      (transaction: any) => transaction.transaction_content.includes(content),
    );

    return {
      isSuccess: transactionFound
        ? this.isTransactionSuccess(transactionFound)
        : false,
      transaction: transactionFound || null,
    };
  }
  private isTransactionSuccess(tx: Transaction): boolean {
    const amountIn = parseFloat(tx.amount_in);
    const amountOut = parseFloat(tx.amount_out);

    return amountIn > 0 || amountOut > 0;
  }
  /** web hook */
  async hooksPayment(body: SePayTransaction): Promise<any> {
    const checkTransaction = await this.transactionRepo.findOne({
      where: {
        gatewayTransactionId: body.content,
        amount: body.transferAmount,
      },
    });

    if (!checkTransaction) {
      throw new Error('Transaction not found');
    }
    if (checkTransaction.status === TransactionStatus.SUCCESSFUL) {
      return { message: 'Transaction already processed' };
    } else {
      checkTransaction.status = TransactionStatus.SUCCESSFUL;
      checkTransaction.processedAt = new Date();
      checkTransaction.metadata = {
        ...checkTransaction.metadata,
        ...body,
      };
      await this.transactionRepo.save(checkTransaction);

      // create user subscription
      if (checkTransaction.type === TransactionType.SUBSCRIPTION_PAYMENT) {
      }

      const notifyBody: NotifyUserBodyDto = {
        userId: checkTransaction.userId,
        transactionId: checkTransaction.id,
        amount: checkTransaction.amount,
        description: checkTransaction.description,
        message: 'Your transaction has been successfully processed.',
        transferType: 'in',
      };
      await this.notifySuccessTransaction(notifyBody);
      return {
        message: 'Transaction updated successfully',
      };
    }
  }
  async notifySuccessTransaction(body: NotifyUserBodyDto) {
    //todo
    // This method can be implemented to notify about successful transactions
    // For example, sending an email or a message to a webhook
    // Currently, it is left empty as per the original code
    return body;
  }
  async notifyFailedTransaction() {
    // This method can be implemented to notify about failed transactions
    // For example, sending an email or a message to a webhook
    // Currently, it is left empty as per the original code
  }
  async notifyPendingTransaction() {
    // This method can be implemented to notify about pending transactions
    // For example, sending an email or a message to a webhook
    // Currently, it is left empty as per the original code
  }

  // ham tạo transaction cho giao dịch nâng cấp người dùng
  async createUserSubscriptionTransaction(
    user: UserEntity,
    body: CreateUserSubscriptionTransactionDto,
  ) {
    const pricingPlan = await this.pricingPlanRepo.findOne({
      where: { id: body.pricingPlanId },
    });
    if (!pricingPlan) {
      throw new Error('Pricing plan not found');
    }
    // tạo. code cho transaction bao gồm type = SUBSCRIPTION_PAYMENT + 5 number randoms
    const transactionCode = `SUBSCRIPTION_PAYMENT_${Math.floor(
      Math.random() * 100000,
    )}`;
    const transaction = new TransactionEntity();
    transaction.userId = user.id;
    transaction.relatedEntityId = pricingPlan.id;
    transaction.relatedEntityType = 'PricingPlanEntity';
    transaction.amount = pricingPlan.price;
    transaction.description = `Upgrade to ${pricingPlan.name} plan`;
    transaction.status = TransactionStatus.PENDING;
    transaction.currency = pricingPlan.currency;
    transaction.paymentGateway = 'SEPAY';
    transaction.type = TransactionType.SUBSCRIPTION_PAYMENT;
    transaction.description = `Upgrade to ${pricingPlan.name} plan`;
    transaction.gatewayTransactionId = transactionCode;
    transaction.metadata = await this.createQRCode({
      amount: pricingPlan.price,
      content: transactionCode,
    });
    transaction.createdByName = user.username;
    transaction.createdBy = user.id;

    await this.transactionRepo.insert(transaction);

    return {
      message: 'Create transaction successfully',
      metaData: transaction.metadata,
    };
  }
}
