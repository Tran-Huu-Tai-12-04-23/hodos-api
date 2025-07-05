import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotificationEntity, UserEntity } from 'src/entities';

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
  public sendEmailNotification(
    user: UserEntity,
    notification: NotificationEntity,
  ) {
    const object = {
      preheaderText: notification.title || '',
      frontendUrl: this.frontendUrl,
      logoUrl: this.logoUrl,
      notificationType: notification.type || '',
      notificationTitle: notification.title || '',
      mainMessage: notification.message || '',
      userName: user.username || '',
      sentAt: notification.sentAt ? notification.sentAt.toISOString() : '',
      linkTo: notification.linkTo || '',
      companyName: this.companyName,
      companyAddress: this.companyAddress,
    };

    this.mailerService
      .sendMail({
        to: user.email,
        from: 'huutaidev@gmail.com',
        subject: `[${this.companyName}] ${notification.title}`,
        template: 'notification', // Your email template name
        context: { ...object },
      })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.log(err);
      });
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
    this.mailerService
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
