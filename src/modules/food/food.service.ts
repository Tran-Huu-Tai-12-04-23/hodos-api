import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { foods } from 'src/constants/data';
import { PaginationDto } from 'src/dto/pagination.dto';
import { FoodEntity } from 'src/entities/food.entity';
import { callApiHelper } from 'src/helpers/callApiHelper';
import { FoodRepository } from 'src/repositories/food.repository';
import { In, Like } from 'typeorm';
import { FoodCreateDTO, FoodCreateMultiDTO } from './dto/create.dto';
import { FoodFilter } from './dto/food.pagination.dto';

@Injectable()
export class FoodService {
  constructor(
    public readonly configService: ConfigService,
    private readonly repo: FoodRepository,
  ) {}
  GEMINI_API_KEY = this.configService.get<string>('GEMINI_API_KEY') || '';
  MODEL_API_LINK = this.configService.get<string>('MODEL_API_LINK') || '';
  genAI = new GoogleGenerativeAI(this.GEMINI_API_KEY);
  model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  async initFood() {
    const isCheckExist = await this.repo.find();

    if (isCheckExist.length > 0) {
      return {};
    }
    for (const food of foods) {
      const foodEntity = new FoodEntity();
      foodEntity.name = food.name;
      foodEntity.description = food.description;
      foodEntity.lstImgs = food.lstImgs.join(',');
      foodEntity.rangePrice = food.rangePrice.join(',');
      foodEntity.coordinates = food.coordinates.join(',');
      foodEntity.label = food.label;
      foodEntity.address = food.address;
      await this.repo.insert(foodEntity);
    }
    return {
      message: 'Init food success',
    };
  }

  async find(data: { where: any; skip: number; take: number }) {
    const [result, total] = await this.repo.findAndCount({
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
    const result = await callApiHelper.post(
      this.MODEL_API_LINK + '/classifyFood',
      {
        image_url: data.imgUrl,
      },
    );

    const lstLocation = await this.repo.find({
      where: {
        label: In(result?.result || []),
      },
    });

    return lstLocation;
  }

  async findAndCountTop(top?: number) {
    const [result, total] = await this.repo.findAndCount({
      where: {
        isDeleted: false,
      },
      order: {
        name: 'ASC',
      },
      take: top || 10,
    });
    return [result, total];
  }

  async pagination(body: PaginationDto<FoodFilter>) {
    const where: any = [];
    if (body.where?.name) {
      where.push({
        name: Like(`%${body.where.name}%`),
        isDeleted: false,
      });
      where.push({
        label: Like(`%${body.where.name}%`),
        isDeleted: false,
      });
      where.push({
        description: Like(`%${body.where.name}%`),
        isDeleted: false,
      });
      where.push({
        address: Like(`%${body.where.name}%`),
        isDeleted: false,
      });
    }

    const [result, total]: any = await this.repo.findAndCount({
      where: where,
      order: {
        createdAt: 'DESC',
      },
      skip: body.skip,
      take: body.take,
    });
    for (const food of result) {
      food.img =
        food.lstImgs.split(',')?.length > 0 ? food.lstImgs.split(',')[0] : '';
    }
    return [result, total];
  }

  async create(data: FoodCreateDTO) {
    const isCheckExist = await this.repo.findOne({
      where: [
        {
          name: data.name,
        },
        {
          label: data.label,
        },
      ],
    });
    if (isCheckExist) {
      return {
        message: 'Location already exist',
      };
    }
    const foodEntity = new FoodEntity();
    foodEntity.name = data.name;
    foodEntity.description = data.description;
    foodEntity.lstImgs = data.lstImgs.join(',');
    foodEntity.rangePrice = data.rangePrice.join(',');
    foodEntity.label = data.label;
    foodEntity.address = data.address;
    foodEntity.coordinates = data.coordinates.join(',');
    await this.repo.insert(foodEntity);
    return foodEntity;
  }

  async multiCreate(data: FoodCreateMultiDTO) {
    return this.repo.manager.transaction(async (transactionalEntityManager) => {
      const repo = transactionalEntityManager.getRepository(FoodEntity);
      const foodEntities: FoodEntity[] = [];
      for (const food of data.foods) {
        const isCheckExist = await repo.findOne({
          where: [
            {
              name: food.name,
            },
            {
              label: food.label,
            },
          ],
        });
        if (isCheckExist) {
          continue;
        }
        const foodEntity = new FoodEntity();
        foodEntity.name = food.name;
        foodEntity.description = food.description;
        foodEntity.lstImgs = food.lstImgs.join(',');
        foodEntity.rangePrice = food.rangePrice.join(',');
        foodEntity.label = food.label;
        foodEntity.address = food.address;
        foodEntity.coordinates = food.coordinates.join(',');
        foodEntities.push(foodEntity);
      }

      await repo.insert(foodEntities);

      return {
        message: 'Create success',
      };
    });
  }
  async removeSoft(id: string) {
    await this.repo.delete(id);
    return {
      message: 'Remove success',
    };
  }

  async restore(id: string) {
    await this.repo.update(id, { isDeleted: false });
    return {
      message: 'Restore success',
    };
  }

  async forceRemove(id: string) {
    await this.repo.delete(id);
    return {
      message: 'Remove success',
    };
  }
}
