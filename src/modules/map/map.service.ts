import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { callApiHelper } from 'src/helpers/callApiHelper';
import { FindRouteDTO } from './dto';
import { GOONG_ROUTE } from './endpoint';

@Injectable()
export class MapService {
  constructor(public readonly configService: ConfigService) {}
  GOONG_API_KEY = this.configService.get<string>('GOONG_API_KEY') || '';

  async findRoute(body: FindRouteDTO) {
    // car, bike, taxi, truck, hd;
    try {
      const url = GOONG_ROUTE.direction(
        body.origin.lat + ',' + body.origin.lng,
        body.destination.lat + ',' + body.destination.lng,
        this.GOONG_API_KEY,
      );
      const res = await callApiHelper.get(url);
      return res;
    } catch (error) {
      throw new error('Invalid request');
    }
  }
}
