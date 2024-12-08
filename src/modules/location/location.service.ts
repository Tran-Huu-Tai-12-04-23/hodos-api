import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { locations } from 'src/constants/data';
import { PaginationDto } from 'src/dto/pagination.dto';
import { LocationEntity } from 'src/entities/location.entity';
import { callApiHelper } from 'src/helpers/callApiHelper';
import { LocationRepository } from 'src/repositories/location.repository';
import { In, Like } from 'typeorm';
import { LocationCreateDTO, LocationCreateMultiDTO } from './dto/create.dto';
import { LocationFilter } from './dto/location.pagination.dto';

@Injectable()
export class LocationService {
  constructor(
    public readonly configService: ConfigService,
    private readonly repo: LocationRepository,
  ) {}
  GEMINI_API_KEY = this.configService.get<string>('GEMINI_API_KEY') || '';
  MODEL_API_LINK = this.configService.get<string>('MODEL_API_LINK') || '';
  genAI = new GoogleGenerativeAI(this.GEMINI_API_KEY);
  model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  async initLocation() {
    const isCheckExist = await this.repo.find();

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
      locationEntity.coordinates = location.coordinates.join(',');
      await this.repo.save(locationEntity);
    }
    return {
      message: 'Init food success',
    };
  }

  async find(data: { query: string }) {
    const whereClause = data.query
      ? { name: Like(`%${data.query}%`), isDeleted: false }
      : { isDeleted: false };

    const result: any = await this.repo.find({
      where: whereClause,
      skip: 0,
      take: 10,
    });

    for (const location of result) {
      const images = location.lstImgs.split(',');
      location.img = images.length > 0 ? images[0] : '';
    }

    return result;
  }

  async predict(data: { imgUrl: string }) {
    const res = await callApiHelper.callAPI(
      this.MODEL_API_LINK + '/classifyLocation',
      {
        image_url: data.imgUrl,
      },
    );

    const lstLocation = await this.repo.find({
      where: {
        label: In(res?.result || []),
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

  async pagination(body: PaginationDto<LocationFilter>) {
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
    for (const location of result) {
      location.img =
        location.lstImgs.split(',')?.length > 0
          ? location.lstImgs.split(',')[0]
          : '';
    }
    return [result, total];
  }

  async create(data: LocationCreateDTO) {
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
    const locationEntity = new LocationEntity();
    locationEntity.name = data.name;
    locationEntity.description = data.description;
    locationEntity.lstImgs = data.lstImgs.join(',');
    locationEntity.label = data.label;
    locationEntity.address = data.address;
    locationEntity.coordinates = data.coordinates.join(',');
    await this.repo.insert(locationEntity);
    return {
      message: 'Create location success',
    };
  }

  async multiCreate(data: LocationCreateMultiDTO) {
    return await this.repo.manager.transaction(
      async (transactionalEntityManager) => {
        const repo = transactionalEntityManager.getRepository(LocationEntity);
        const locationEntities: LocationEntity[] = [];
        for (const location of data.locations) {
          const isCheckExist = await repo.findOne({
            where: [
              {
                name: location.name,
              },
              {
                label: location.label,
              },
            ],
          });
          if (isCheckExist) {
            continue;
          }
          const locationEntity = new LocationEntity();
          locationEntity.name = location.name;
          locationEntity.description = location.description;
          locationEntity.lstImgs = location.lstImgs.join(',');
          locationEntity.label = location.label;
          locationEntity.address = location.address;
          locationEntity.coordinates = location.coordinates.join(',');
          locationEntities.push(locationEntity);
        }
        await repo.insert(locationEntities);
        return {
          message: 'Create success',
        };
      },
    );
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

  async detail(id: string) {
    const location: any = await this.repo.findOne({
      where: {
        id,
        isDeleted: false,
      },
    });
    if (!location) {
      throw new NotFoundException('Location not found');
    }
    location.lstImgs = location.lstImgs.split(',');
    return location;
  }

  async top10() {
    const [result]: any = await this.findAndCountTop(10);
    for (const location of result) {
      location.img =
        location.lstImgs.split(',')?.length > 0
          ? location.lstImgs.split(',')[0]
          : '';
      location.lstImgs = location.lstImgs.split(',');
    }
    return result;
  }
}
