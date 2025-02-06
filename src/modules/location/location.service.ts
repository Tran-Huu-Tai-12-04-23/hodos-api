import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { locations } from 'src/constants/data';
import { dataINIT } from 'src/data';
import { PaginationDto } from 'src/dto/pagination.dto';
import { LocationEntity } from 'src/entities/location.entity';
import { callApiHelper } from 'src/helpers/callApiHelper';
import { LocationRepository } from 'src/repositories/location.repository';
import { In, Like } from 'typeorm';
import { LocationCreateDTO, LocationCreateMultiDTO } from './dto/create.dto';
import { LocationFilter } from './dto/location.pagination.dto';
import { PredictDTO } from './dto/predict.dto';
import { UpdateLocationDTO } from './dto/update.dto';

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

  async predict(data: PredictDTO) {
    const res = await callApiHelper.post(
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

    return { locations: lstLocation, ...res };
  }

  async findAndCountTop(top?: number, type?: string) {
    const [result, total] = await this.repo.findAndCount({
      where: {
        type: type,
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
    const commonWhere: any = {
      isDeleted: false,
    };

    if (body.where?.type) {
      commonWhere.type = body.where.type;
    }
    if (body.where?.name) {
      where.push({
        ...commonWhere,
        name: Like(`%${body.where.name}%`),
      });
      where.push({
        ...commonWhere,
        label: Like(`%${body.where.name}%`),
      });
      where.push({
        ...commonWhere,
        description: Like(`%${body.where.name}%`),
      });
      where.push({
        ...commonWhere,
        address: Like(`%${body.where.name}%`),
      });
    } else {
      where.push(commonWhere);
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
    locationEntity.coordinates = data.longitude + ',' + data.latitude;
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
          console.log(typeof location.lstImgs);
          locationEntity.lstImgs =
            typeof location.lstImgs == 'string'
              ? location.lstImgs
              : location.lstImgs.join(',');
          locationEntity.label = location.label;
          locationEntity.address = location.address;
          locationEntity.type = location.type || 'LOCATION';
          locationEntity.coordinates =
            location.longitude + ',' + location.latitude;
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
    const [result]: any = await this.findAndCountTop(10, 'LOCATION');
    for (const location of result) {
      location.img =
        location.lstImgs.split(',')?.length > 0
          ? location.lstImgs.split(',')[0]
          : '';
      location.lstImgs = location.lstImgs.split(',');
    }
    return result;
  }
  async initData() {
    const lstData = dataINIT;
    for (const data of lstData) {
      console.log(data);
      const location = new LocationEntity();
      location.name = data.name;
      location.description = data.description;
      location.lstImgs = data.img;
      location.label = '';
      location.address = data.address;
      location.coordinates = data.cor;
      location.type = data.type;
      if (data?.name) {
        await this.repo.insert(location);
      } else {
        console.log(data?.name + ' not found' + data?.description);
      }
    }

    return {
      message: 'Init data success',
    };
  }

  async update(data: UpdateLocationDTO) {
    const location = await this.repo.findOne({
      where: {
        id: data.id,
      },
    });
    if (!location) {
      throw new NotFoundException('Location not found');
    }
    location.name = data.name;
    location.description = data.description;
    location.lstImgs = data.lstImgs.join(',');
    location.label = data.label;
    location.address = data.address;
    location.coordinates = data.longitude + ',' + data.latitude;
    await this.repo.save(location);
    return {
      message: 'Update location success',
    };
  }

  /** find one by arr label */
  async findByLabels(labels: string[]) {
    const result: any = await this.repo.find({
      where: {
        label: In(labels),
        isDeleted: false,
      },
    });

    for (const location of result) {
      location.lstImgs = location.lstImgs.split(',');
      location.img =
        location.lstImgs.split(',')?.length > 0
          ? location.lstImgs.split(',')[0]
          : '';
    }

    return result;
  }
}
