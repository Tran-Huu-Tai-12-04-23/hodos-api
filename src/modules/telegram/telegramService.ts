import { Injectable } from '@nestjs/common';
import { Help, InjectBot, On, Start } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';

@Injectable()
export class TelegramService {
  constructor(@InjectBot() private bot: Telegraf<Context>) {}

  @Start()
  async startCommand(ctx: Context) {
    console.log('Connect to Start');
    await ctx.reply('Welcome');
  }

  @Help()
  async helpCommand(ctx: Context) {
    console.log('Connect to Help');
    await ctx.reply('Send me a sticker');
  }

  @On('sticker')
  async onSticker(ctx: Context) {
    console.log('Connect to sticker');
    await ctx.reply('👍');
  }

  /** id of group tele -1002272104008 */
  async sendMessage(data: any) {
    try {
      await this.bot.telegram.sendMessage(-1002272104008, data); // ID group error
    } catch (error) {
      console.log(error);
    }
  }
}
