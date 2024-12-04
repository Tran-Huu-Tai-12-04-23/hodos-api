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
        const lstPath = [];
        for (const path of res?.paths) {
          const points = path.points?.coordinates;
          const lstPoint = points.map((point: number[]) => {
            return {
              latitude: point[0],
              longitude: point[1],
            };
          });
          lstPath.push({
            ...path.points,
            coordinates: lstPoint,
          });
        }
        return {
          data: lstPath,
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
