import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { callApiHelper } from 'src/helpers/callApiHelper';
import { FindRouteDTO } from './dto';
import { VIETMAP_ROUTE } from './endpoint';

@Injectable()
export class VietMapService {
  constructor(public readonly configService: ConfigService) {}
  VIETMAP_API_KEY = this.configService.get<string>('VIETMAP_API_KEY') || '';

  async findRoute(body: FindRouteDTO) {
    try {
      const url =
        VIETMAP_ROUTE.FIND_ROUTE +
        `?apiKey=${this.VIETMAP_API_KEY}&points_encoded=false&point=${body?.origin.lat},${body?.origin.lng}&point=${body?.destination.lat},${body?.destination.lng}`;
      const res = await callApiHelper.get(url);
      if (res) {
        return {
          data: res?.paths,
        };
      }
      return {
        data: [],
      };
    } catch (error) {
      throw new error('Invalid request');
    }
  }
}
