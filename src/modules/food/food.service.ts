import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { foods } from 'src/constants/data';
import { FoodEntity } from 'src/entities/food.entity';
import { callApiHelper } from 'src/helpers/callApiHelper';
import { FoodRepository } from 'src/repositories/food.repository';
import { In } from 'typeorm';

@Injectable()
export class FoodService {
  constructor(
    public readonly configService: ConfigService,
    private readonly foodRepo: FoodRepository,
  ) {}
  GEMINI_API_KEY = this.configService.get<string>('GEMINI_API_KEY') || '';
  MODEL_API_LINK = this.configService.get<string>('MODEL_API_LINK') || '';
  genAI = new GoogleGenerativeAI(this.GEMINI_API_KEY);
  model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  async initFood() {
    const isCheckExist = await this.foodRepo.find();

    if (isCheckExist.length > 0) {
      return {};
    }
    for (const food of foods) {
      const foodEntity = new FoodEntity();
      foodEntity.name = food.name;
      foodEntity.description = food.description;
      foodEntity.lstImgs = food.lstImgs.join(',');
      foodEntity.rangePrice = food.rangePrice.join(',');
      foodEntity.label = food.label;
      foodEntity.address = food.address;
      await this.foodRepo.save(foodEntity);
    }
    return {
      message: 'Init food success',
    };
  }

  async find(data: { where: any; skip: number; take: number }) {
    const [result, total] = await this.foodRepo.findAndCount({
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
    const result = await callApiHelper.callAPI(
      this.MODEL_API_LINK + '/classifyFood',
      {
        image_url: data.imgUrl,
      },
    );

    const lstLocation = await this.foodRepo.find({
      where: {
        label: In(result?.result || []),
      },
    });

    return lstLocation;
  }
}
