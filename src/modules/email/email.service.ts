import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private configService: ConfigService,
  ) {}
  frontendUrl = this.configService.get<string>('FRONTEND_URL');
  companyName = this.configService.get<string>('COMPANY_NAME');
  companyAddress = this.configService.get<string>('COMPANY_ADDRESS');
  logoUrl = this.configService.get<string>('LOGO_URL');
  expirationTime =
    this.configService.get<number>('VERIFICATION_CODE_EXPIRATION_MINUTES') ||
    30;

  getHello(): string {
    return 'Hello World!';
  }

  public async sendEmailVerification(
    email: string,
    verCode: string,
  ): Promise<void> {
    const object = {
      verificationCode: verCode,
      frontendUrl: this.frontendUrl,
      companyName: this.companyName,
      companyAddress: this.companyAddress,
      logoUrl: this.logoUrl,
      expirationTime: this.expirationTime,
    };
    await this.mailerService
      .sendMail({
        to: email,
        from: 'huutaidev@gmail.com',
        subject: 'HODOS Verification Code',
        template: 'account-send-verify-code',
        context: { ...object },
      })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
