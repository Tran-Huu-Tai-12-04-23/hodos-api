import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntityCustom } from '../base.entity';

@Entity('master_data_receiving_banks')
export class ReceivingBankEntity extends BaseEntityCustom {
  @ApiProperty({
    example: 'Vietcombank',
    description: 'Tên ngân hàng nhận tiền',
  })
  @Column({ type: 'varchar', length: 255 })
  bankName: string;

  @ApiProperty({ example: 'VCB', description: 'Mã ngân hàng (viết tắt)' })
  @Column({ type: 'varchar', length: 20, nullable: true })
  bankCode?: string;

  @ApiProperty({ example: '0123456789', description: 'Số tài khoản ngân hàng' })
  @Column({ type: 'varchar', length: 100 })
  accountNumber: string;

  @ApiProperty({ example: 'Nguyen Van A', description: 'Chủ tài khoản' })
  @Column({ type: 'varchar', length: 255 })
  accountHolderName: string;

  @ApiProperty({
    example: 'Hội sở chính Hà Nội',
    description: 'Chi nhánh ngân hàng',
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  branchName?: string;

  @ApiProperty({ example: 'USD', description: 'Loại tiền tệ (ISO 4217)' })
  @Column({ type: 'varchar', length: 3, default: 'VND' })
  currency: string;

  @ApiProperty({
    example: true,
    description: 'Ngân hàng này đang được sử dụng?',
  })
  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}
