import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { callApiHelper } from 'src/helpers/callApiHelper';
import {
  BodyResponseTransactions,
  GenQrDto,
  SePayTransaction,
  Transaction,
} from './dto';

@Injectable()
export class SepayService {
  constructor(public readonly configService: ConfigService) {}

  private readonly bankName = this.configService.get<string>('BANK_NAME');
  private readonly bankAccount = this.configService.get<string>('BANK_ACCOUNT');
  private readonly sepayApiKey =
    this.configService.get<string>('SEPAY_API_KEY') || ''; // eslint-disable-line @typescript-eslint/naming-convention
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
  async handleWebhook(body: SePayTransaction): Promise<any> {
    // This method is called when a webhook notification is received from SEPAY
    // const {
    //   id,
    //   gateway,
    //   transactionDate,
    //   accountNumber,
    //   code,
    //   content,
    //   transferType,
    //   transferAmount,
    //   accumulated,
    //   subAccount,
    //   referenceCode,
    //   description,
    // } = body;
    // Here you can implement the logic to handle the webhook notification
    /**todo add log */

    return body;
  }
  async notifySuccessTransaction() {
    // This method can be implemented to notify about successful transactions
    // For example, sending an email or a message to a webhook
    // Currently, it is left empty as per the original code
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
}
