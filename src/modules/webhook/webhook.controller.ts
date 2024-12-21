import { Controller, Headers, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WebhookService } from './webhook.service';

@ApiTags('Webhook API')
@Controller('webhook')
export class WebhookController {
  constructor(private readonly service: WebhookService) {}

  @Post('github-build-log')
  public async handleBuildLog(@Req() req: Request, @Headers() headers: any) {
    return await this.service.handleBuildLog(req, headers);
  }
}
