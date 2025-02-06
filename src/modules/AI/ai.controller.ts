import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { callApiHelper } from 'src/helpers/callApiHelper';
import { LocationService } from '../location/location.service';
import { TelegramService } from '../telegram/telegramService';
import { AiService } from './ai.service';

@ApiTags('AI API')
@Controller('ai')
export class AiController {
  constructor(
    private readonly service: AiService,
    private readonly configService: ConfigService,
    private readonly locationService: LocationService,
    private readonly teleService: TelegramService,
  ) {}

  @ApiOperation({
    summary: 'predict ',
  })
  @Post('predict')
  @UseInterceptors(FileInterceptor('file'))
  async predictImg(@UploadedFile() file: Express.Multer.File) {
    try {
      const downloadURL = await this.service.uploadImage(file);
      const predictUrlApi = this.configService.get('MODEL_API_LINK');

      const [locationLabel, foodLabel] = await Promise.all([
        callApiHelper.post(predictUrlApi + '/classifyLocationYolo', {
          image_url: downloadURL,
        }),
        callApiHelper.post(predictUrlApi + '/classifyFoodYolo', {
          image_url: downloadURL,
        }),
      ]);

      /** lấy label từ nhận dạng */
      const labels = [locationLabel?.result, foodLabel?.result];

      console.log(labels);
      await this.teleService.sendMessage({
        labels: labels,
      });

      /// labels

      /** tìm location theo label */
      const location = await this.locationService.findByLabels(labels);

      return {
        result: location,
        preImg: downloadURL,
      };
    } catch (error) {
      return {
        message: 'Can not predict img!',
      };
    }
  }
}
