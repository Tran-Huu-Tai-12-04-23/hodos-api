import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { TelegramService } from './telegramService';
require('dotenv').config();

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  throw new Error(
    'TELEGRAM_BOT_TOKEN is not defined in the environment variables.',
  );
}

console.log('Using Telegram Bot Token:', token);

@Module({
  imports: [
    TelegrafModule.forRoot({
      token: token,
    }),
  ],
  controllers: [],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule {}
