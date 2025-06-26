export class BodyResponseTransactions {
  status: number;
  error: string | null;
  messages: Messages;
  transactions: Transaction[];
}

export class Messages {
  success: boolean;
}

export class Transaction {
  id: string;
  bank_brand_name: string;
  account_number: string;
  transaction_date: string;
  amount_out: string;
  amount_in: string;
  accumulated: string;
  transaction_content: string;
  reference_number: string;
  code: string | null;
  sub_account: string | null;
  bank_account_id: string;
}

export interface SePayTransaction {
  id: number;
  gateway: string;
  transactionDate: string;
  accountNumber: string;
  code?: string | null;
  content: string;
  transferType: 'in' | 'out';
  transferAmount: number;
  accumulated: number;
  subAccount?: string | null;
  referenceCode: string;
  description: string;
}
