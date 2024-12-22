import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ErrorLogService } from 'src/modules/webhook/error-log.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly configService: ConfigService,
    private readonly errorLogService: ErrorLogService,
  ) {}
  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const messages = [];
    const detailMessages = exception?.response?.message || [];
    for (const text of detailMessages) {
      const arrText = text.split('.');
      if (arrText.length == 3 && arrText[0] == 'items') {
        messages.push(`Dòng ${+arrText[1] + 3} - ${arrText[2]}`);
      } else messages.push(text);
    }
    const status = exception.getStatus();
    const name =
      exception instanceof HttpException
        ? exception.name
        : 'INTERNAL_SERVER_ERROR';
    //#region log lỗi
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

      if (url) {
      } else {
        try {
          await this.errorLogService.handleBugLog(obj as any);
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }

    //#endregion

    if (exception instanceof HttpException) {
      let message: any = exception.message;
      const name = exception.name;

      if (message === 'INTERNAL_SERVER_ERROR' && exception.message) {
        message = exception.message;
      } else if (message.message) {
        message = message.message;
      }

      if (status == HttpStatus.UNAUTHORIZED && message == 'Unauthorized') {
        if (response?.req?.authInfo?.name == 'TokenExpiredError') {
          message = 'Hết phiên đăng nhập, vui lòng đăng nhập lại để tiếp tục.';
        }
      }

      if (
        status == HttpStatus.BAD_REQUEST &&
        name == 'BadRequestException' &&
        message == 'Bad Request Exception'
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
    } else {
      const err: any = exception;
      const status = err?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const name = err?.name || err?.statusText || 'INTERNAL_SERVER_ERROR';
      let message =
        err?.message || err?.data?.message || 'INTERNAL_SERVER_ERROR';
      if (message.message) {
        message = message.message;
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
}
