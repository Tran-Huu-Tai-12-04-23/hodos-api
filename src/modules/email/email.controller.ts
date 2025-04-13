import { Controller, Get } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller()
export class EmailController {
  constructor(private readonly service: EmailService) {}

  @Get()
  sendMail(): any {
    return this.service.example();
  }
}
