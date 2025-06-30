export class CreateReceivingBankDto {
  bankName: string;
  bankCode?: string;
  accountNumber: string;
  accountHolderName: string;
  branchName?: string;
  currency: string;
  isActive: boolean;
  createdBy: string;
  updatedBy?: string;
  createdAt?: Date;
}

export class UpdateReceivingBankDto extends CreateReceivingBankDto {
  id: string;
}
