import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  TransactionEntity,
  TransactionStatus,
  TransactionType,
  UserEntity,
} from 'src/entities';
import { callApiHelper } from 'src/helpers/callApiHelper';
import { TransactionRepository } from 'src/repositories';
import {
  PricingPlanRepository,
  ReceivingBankRepository,
} from 'src/repositories/master-data.repository';
import { v4 as uuidv4 } from 'uuid';
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
    private readonly receivingBankRepo: ReceivingBankRepository,
  ) {}

  private readonly sepayApiKey =
    this.configService.get<string>('SEPAY_API_KEY') || '';
  async createQRCode(data: GenQrDto): Promise<{ qrCode: string }> {
    const receivingBank = await this.receivingBankRepo.findOne({
      where: { isActive: true },
    });
    if (!receivingBank) {
      throw new Error(
        'No active receiving bank found. Please contact support Admin [123123123]',
      );
    }
    const { amount, content } = data;
    const qrCode = `https://qr.sepay.vn/img?acc=${receivingBank.accountNumber}&bank=${receivingBank.bankCode}&amount=${amount}&des=${encodeURIComponent(content)}`;
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
      const updateData = {
        status: TransactionStatus.SUCCESSFUL,
        processedAt: new Date(),
        metadata: {
          ...checkTransaction.metadata,
        },
      };
      await this.transactionRepo.update(checkTransaction.id, updateData);

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
    // kiểm tra xem đã có pricing plan nào với id này chưa
    const transactionExist = await this.transactionRepo.findOne({
      where: {
        userId: user.id,
        relatedEntityId: body.pricingPlanId,
        relatedEntityType: 'PricingPlanEntity',
        type: TransactionType.SUBSCRIPTION_PAYMENT,
      },
    });
    if (transactionExist) {
      if (transactionExist.status === TransactionStatus.SUCCESSFUL) {
        throw new Error(
          'You have already successfully upgraded to this pricing plan.',
        );
      }
      return {
        message: 'Transaction already exists',
        metaData: transactionExist,
      };
    }

    const pricingPlan = await this.pricingPlanRepo.findOne({
      where: { id: body.pricingPlanId },
    });
    if (!pricingPlan) {
      throw new Error('Pricing plan not found');
    }
    // tạo. code cho transaction bao gồm type = SUBSCRIPTION_PAYMENT + 5 number randoms
    const transactionCode = `SUBSCRIPTIONPAYMENT${Math.floor(
      Math.random() * 100000,
    )}`;
    const transaction = new TransactionEntity();
    transaction.id = uuidv4();
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
    transaction.metadata = {
      ...(await this.createQRCode({
        amount: pricingPlan.price,
        content: transactionCode,
      })),
      pricingPlan: pricingPlan,
    };
    transaction.createdByName = user.username;
    transaction.createdBy = user.id;

    await this.transactionRepo.insert(transaction);

    return {
      message: 'Create transaction successfully',
      metaData: transaction,
    };
  }
}
