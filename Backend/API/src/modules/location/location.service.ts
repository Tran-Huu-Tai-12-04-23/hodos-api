import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { locations } from 'src/constants/data';
import { LocationEntity } from 'src/entities/location.entity';
import { callApiHelper } from 'src/helpers/callApiHelper';
import { LocationRepository } from 'src/repositories/location.repository';
import { In } from 'typeorm';

@Injectable()
export class LocationService {
  constructor(
    public readonly configService: ConfigService,
    private readonly locationRepo: LocationRepository,
  ) {}
  GEMINI_API_KEY = this.configService.get<string>('GEMINI_API_KEY') || '';
  MODEL_API_LINK = this.configService.get<string>('MODEL_API_LINK') || '';
  genAI = new GoogleGenerativeAI(this.GEMINI_API_KEY);
  model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  async initLocation() {
    const isCheckExist = await this.locationRepo.find();

    if (isCheckExist.length > 0) {
      return {};
    }
    for (const location of locations) {
      const locationEntity = new LocationEntity();
      locationEntity.name = location.name;
      locationEntity.description = location.description;
      locationEntity.lstImgs = location.lstImgs.join(',');
      locationEntity.label = location.label;
      locationEntity.address = location.address;
      await this.locationRepo.save(locationEntity);
    }
    return {
      message: 'Init food success',
    };
  }

  async find(data: { where: any; skip: number; take: number }) {
    const [result, total] = await this.locationRepo.findAndCount({
      where: data.where,
      skip: data.skip,
      take: data.take,
    });
    return {
      result,
      total,
    };
  }

  async predict(data: { imgUrl: string }) {
    const res = await callApiHelper.callAPI(
      this.MODEL_API_LINK + '/classifyLocation',
      {
        image_url: data.imgUrl,
      },
    );

    const lstLocation = await this.locationRepo.find({
      where: {
        label: In(res?.result || []),
      },
    });

    return lstLocation;
  }
}
