export class NotifyUserBodyDto {
  transactionId: string;
  userId: string;
  message: string;
  amount: number;
  transferType: 'in' | 'out';
  referenceCode?: string;
  description?: string;
  subAccount?: string | null;
}
