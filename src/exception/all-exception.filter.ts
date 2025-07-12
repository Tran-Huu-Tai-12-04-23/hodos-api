import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/modules/auth/auth.service';
import { ErrorLogService } from 'src/modules/webhook/error-log.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly configService: ConfigService,
    private readonly errorLogService: ErrorLogService,
    private readonly authService: AuthService,
  ) {}

  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const messages = [];
    const detailMessages = exception?.response?.message || [];

    for (const text of detailMessages) {
      const arrText = text.split('.');
      if (arrText.length === 3 && arrText[0] === 'items') {
        messages.push(`Dòng ${+arrText[1] + 3} - ${arrText[2]}`);
      } else messages.push(text);
    }

    console.error('Exception:', exception); // Better for full stack trace
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : exception?.status || HttpStatus.INTERNAL_SERVER_ERROR;

    const name =
      exception instanceof HttpException
        ? exception.name
        : exception?.name || 'INTERNAL_SERVER_ERROR';

    //#region Log error
    const jsonRequest = {
      body: request.body,
      header: request.headers,
      ip: request.ip,
      user: request.user,
    };

    try {
      const obj = {
        project: this.configService.get<string>('PROJECT') || 'CHUA CONFIG ENV',
        source: this.configService.get<string>('SOURCE') || 'CHUA CONFIG ENV',
        environments:
          this.configService.get<string>('ENVIRONMENT') || 'LOCALHOST',
        error: exception,
        request: JSON.stringify(jsonRequest),
        message: messages?.join('<br>+ ') || '',
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        name: name,
      };

      const url = this.configService.get<string>('LOG_URL');
      if (!url) {
        try {
          await this.errorLogService.handleBugLog(obj as any);
        } catch (error) {
          console.error('Error logging exception:', error);
        }
      }
    } catch (error) {
      console.error('Exception during error handling:', error);
    }
    //#endregion

    // ✅ Build clean response
    let message =
      exception?.message ||
      exception?.response?.message ||
      'INTERNAL_SERVER_ERROR';

    if (typeof message === 'object' && message.message) {
      message = message.message;
    }

    if (
      status === HttpStatus.UNAUTHORIZED &&
      message === 'Unauthorized' &&
      response?.req?.authInfo?.name === 'TokenExpiredError'
    ) {
      message = 'Hết phiên đăng nhập, vui lòng đăng nhập lại để tiếp tục.';

      // get device id and remove it from the request
      // get device id from req from header
      if (request.headers['x-device-id']) {
        const deviceId = request.headers['x-device-id'];
        await this.authService.removeDeviceId(jsonRequest.user.id, deviceId);
      }
    }

    if (
      status === HttpStatus.BAD_REQUEST &&
      name === 'BadRequestException' &&
      message === 'Bad Request Exception'
    ) {
      const detailMessage = messages.join('<br>+ ') || '';
      message = `Dữ liệu không hợp lệ, chi tiết:<br>+ ${detailMessage}`;
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
      name: name,
    });
  }
}
