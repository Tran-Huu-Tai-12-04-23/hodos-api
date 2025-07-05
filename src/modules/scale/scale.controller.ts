import { Body, Controller, Post } from '@nestjs/common';
import { ScaleService } from './scale.service';

@Controller('scale')
export class ScaleController {
  constructor(private readonly service: ScaleService) {}

  @Post('mid-night')
  public async autoRunMidNight(@Body() data: { keySecret: string }) {
    if (!data.keySecret) return null;
    else {
      if (data.keySecret !== process.env.KEY_SECRET) return null;
    }
    return await this.service.autoRunMidNight();
  }

  @Post('23h-every-day')
  public async autoRun23hEveryDay(@Body() data: { keySecret: string }) {
    if (!data.keySecret) return null;
    else {
      if (data.keySecret !== process.env.KEY_SECRET) return null;
    }
    return await this.service.autoRun23hEveryDay();
  }

  @Post('every-minutes')
  public async autoRunEveryMinutes(@Body() data: { keySecret: string }) {
    if (!data.keySecret) return null;
    else {
      if (data.keySecret !== process.env.KEY_SECRET) return null;
    }
    return await this.service.autoRunMightMinute();
  }
  @Post('every-10-minutes')
  public async autoRunEvery1OMinutes(@Body() data: { keySecret: string }) {
    if (!data.keySecret) return null;
    else {
      if (data.keySecret !== process.env.KEY_SECRET) return null;
    }
    return await this.service.autoRunEvery1OMinutes();
  }

  @Post('every-end-of-month')
  public async autoRunEveryEndOfMonth(@Body() data: { keySecret: string }) {
    if (!data.keySecret) return null;
    else {
      if (data.keySecret !== process.env.KEY_SECRET) return null;
    }
    return await this.service.autoRunEveryEndOfMonth();
  }

  @Post('every-year')
  public async autoRunEveryYear(@Body() data: { keySecret: string }) {
    if (!data.keySecret) return null;
    else {
      if (data.keySecret !== process.env.KEY_SECRET) return null;
    }
    return await this.service.autoRunEveryYear();
  }

  @Post('1-am')
  public async autoRunAtOneAM(@Body() data: { keySecret: string }) {
    if (!data.keySecret) return null;
    else {
      if (data.keySecret !== process.env.KEY_SECRET) return null;
    }
    return await this.service.autoRunAtOneAM();
  }

  @Post('every-7-am')
  public async autoRunAt7AM(@Body() data: { keySecret: string }) {
    if (!data.keySecret) return null;
    else {
      if (data.keySecret !== process.env.KEY_SECRET) return null;
    }
    return await this.service.autoRunAt7AM();
  }

  @Post('every-hour')
  public async autoRunEveryHour(@Body() data: { keySecret: string }) {
    if (!data.keySecret) return null;
    else {
      if (data.keySecret !== process.env.KEY_SECRET) return null;
    }
    return await this.service.autoRunEveryHour();
  }
}
