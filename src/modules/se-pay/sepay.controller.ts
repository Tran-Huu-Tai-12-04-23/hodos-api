import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GenQrDto, SePayTransaction } from './dto';
import { SepayService } from './sepay.service';

@ApiTags('sepay API')
@Controller('sepay')
export class SepayController {
  constructor(private readonly service: SepayService) {}

  @ApiOperation({
    summary: 'Gen QR Code for payment',
    description:
      'Generates a QR code for payment using the provided content and amount.',
  })
  @ApiResponse({ status: 201 })
  @Post('gen-qr')
  async genQr(@Body() body: GenQrDto) {
    return await this.service.createQRCode(body);
  }

  @ApiOperation({
    summary: 'Load all transactions',
    description: 'Fetches all transactions from SEPAY.',
  })
  @ApiResponse({ status: 200 })
  @Post('load-all-transactions')
  async loadAllTransactions() {
    return await this.service.loadAllTransactions();
  }

  @ApiOperation({
    summary: 'Check transaction success in a day',
    description:
      'Checks if a transaction was successful within the last day based on the provided content and amount.',
  })
  @ApiResponse({ status: 200 })
  @Post('check-transaction-success-in-day')
  async checkTransactionSuccessInDay(@Body() body: GenQrDto) {
    return await this.service.checkTransactionSuccessInDay(body);
  }

  // received webhook from SEPAY
  @ApiOperation({
    summary: 'Receive webhook from SEPAY',
    description: 'Handles incoming webhook notifications from SEPAY.',
  })
  @ApiResponse({ status: 200 })
  @Post('webhook')
  async handleWebhook(@Body() body: SePayTransaction) {
    return await this.service.handleWebhook(body);
  }
}
