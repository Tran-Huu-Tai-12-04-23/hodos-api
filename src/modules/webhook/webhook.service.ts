import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { BuildLogEntity } from 'src/entities/build-log.entity';
import { BuildLogRepository } from 'src/repositories/build-log.repository';
@Injectable()
export class WebhookService {
  secret: string;
  constructor(
    public readonly configService: ConfigService,
    private readonly buildLogRepo: BuildLogRepository,
  ) {
    this.secret =
      this.configService.get<string>('GITHUB_WEBHOOKS_TOKEN') || 'secret';
  }
  GEMINI_API_KEY = this.configService.get<string>('GEMINI_API_KEY') || '';

  async handleBuildLog(req: any, headers: any) {
    const payload: any = req.body;
    const signature = headers['x-hub-signature-256'];

    if (!this.verifySignature(payload, this.secret, signature)) {
      console.error('Invalid signature');
      return { success: false };
    }
    let event = '';
    event = headers['x-github-event'] as string;
    //#region xử lý data
    try {
      switch (event) {
        case 'workflow_run':
          {
            const deployStatus = payload.workflow_run.status;
            const creator = payload.sender.login;
            // const description = payload.deployment_status.description;
            const wfdisplay_title = payload.workflow_run.display_title;
            const wfname = payload.workflow_run.name;
            const repository = payload.repository.name;
            const branch = payload.workflow_run.head_branch;
            let message = `Dự án: ${repository}
Nhân viên: ${creator}
Nhánh: ${branch}
Commit: ${wfdisplay_title}`;

            const stringStatus = `Tiến trình ${wfname} - ${deployStatus}`;
            message = `${message}
${stringStatus}`;

            const buildLog = new BuildLogEntity();
            buildLog.title = stringStatus;
            buildLog.message = message;
            buildLog.githubBuildLink = payload.workflow_run.html_url;
            await this.buildLogRepo.insert(buildLog);
          }
          break;
        default:
          break;
      }
    } catch (error) {
      return error;
    }

    //#endregion
    return { success: true };
  }

  private verifySignature(payload: any, secret: string, signature: string) {
    const hmac = crypto.createHmac('sha256', secret);
    const digest = Buffer.from(
      'sha256=' + hmac.update(JSON.stringify(payload)).digest('hex'),
      'utf8',
    );
    const checksum = Buffer.from(signature, 'utf8');
    return crypto.timingSafeEqual(digest, checksum);
  }
}
