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
  id: number; // ID giao dịch trên SePay
  gateway: string; // Tên ngân hàng
  transactionDate: string; // Thời gian giao dịch (ISO string)
  accountNumber: string; // Số tài khoản ngân hàng
  code?: string | null; // Mã code thanh toán (có thể null)
  content: string; // Nội dung chuyển khoản
  transferType: 'in' | 'out'; // Loại giao dịch
  transferAmount: number; // Số tiền giao dịch
  accumulated: number; // Số dư tài khoản sau giao dịch
  subAccount?: string | null; // Tài khoản phụ (có thể null)
  referenceCode: string; // Mã tham chiếu của tin nhắn SMS
  description: string; // Mô tả thêm
}
