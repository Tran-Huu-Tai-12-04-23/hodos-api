import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { enumData } from 'src/constants/enum-data';
import { PaginationDto } from 'src/dto/pagination.dto';
import { TripActivityEntity } from 'src/entities/trip-activity.entity';
import { TripDayEntity } from 'src/entities/trip-day.entity';
import { TripDirectionEntity } from 'src/entities/trip-direction.entity';
import { TripEntity } from 'src/entities/trip.entity';
import { coreHelper } from 'src/helpers';
import { callApiHelper } from 'src/helpers/callApiHelper';
import { TripDirectionRepository, TripRepository } from 'src/repositories';
import { LocationRepository } from 'src/repositories/location.repository';
import { In } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { UserDataDTO } from '../auth/dto';
import { DeviceTrialService } from '../device-trial/device-trial.service';
import { GeminiAIService } from '../geminiAI/geminiAI.service';
import { UploadService } from '../upload/upload.service';
import { UserSubscriptionsService } from '../user-subscriptions/user-subscriptions.service';
import { CreateTripDTO } from './dto';

@Injectable()
export class PlanTripService {
  constructor(
    private readonly gemAiService: GeminiAIService,
    private readonly locationRepo: LocationRepository,
    private readonly repo: TripRepository,
    private readonly uploadService: UploadService,
    public readonly configService: ConfigService,
    public readonly tripDirectionRepo: TripDirectionRepository,
    private readonly userSubService: UserSubscriptionsService,
    private readonly deviceTrialService: DeviceTrialService,
  ) {}
  GOONG_API = this.configService.get<string>('GOONG_API') || '';
  GOONG_API_KEY = this.configService.get<string>('GOONG_API_KEY') || '';

  async loadQuestionToCollect() {
    return [
      {
        type: 'SINGLE_CHOICE',
        question: 'Who is going?',
        options: [
          {
            label: 'Only me',
            desc: 'Traveling around alone!',
            icon: '🧍',
            value: 'only_me',
          },
          {
            label: 'Couple',
            desc: 'Traveling with a partner',
            icon: '👫',
            value: 'couple',
          },
          {
            label: 'Family',
            desc: 'Traveling with family',
            icon: '👨‍👩‍👧‍👦',
            value: 'family',
          },
          {
            label: 'Friends',
            desc: 'Traveling with friends',
            icon: '🧑‍🤝‍🧑',
            value: 'friends',
          },
          {
            label: 'Work',
            desc: 'Traveling with a work group',
            icon: '💼',
            value: 'Work_Group',
          },
        ],
      },
      {
        type: 'SINGLE_CHOICE',
        question:
          'During which time of the day do you prefer to go out when traveling?',
        options: [
          {
            label: '05:00 – 15:00',
            desc: 'Start early and finish in the afternoon',
            icon: '🌅',
            value: '05:00-15:00',
          },
          {
            label: '05:00 – 22:00',
            desc: 'From sunrise to late evening',
            icon: '☀️🌙',
            value: '05:00-22:00',
          },
          {
            label: '09:00 – 22:00',
            desc: 'Relaxed morning start to night',
            icon: '🌤️🌙',
            value: '09:00-22:00',
          },
          {
            label: '11:00 – 23:00',
            desc: 'Late start and end the day late',
            icon: '🌞🌃',
            value: '11:00-23:00',
          },
        ],
      },
      {
        type: 'DATE_RANGE',
        question: 'We will your trip begin and end?',
      },
      {
        type: 'SINGLE_CHOICE',
        question: 'Set your trip budget',
        options: [
          {
            label: 'Cheap',
            desc: 'I am on a budget',
            icon: '💰',
            value: 'cheap',
          },
          {
            label: 'Moderate',
            desc: 'I can spend a little more',
            icon: '💵',
            value: 'moderate',
          },
          {
            label: 'Luxury',
            desc: 'I want to enjoy the best',
            icon: '💎',
            value: 'luxury',
          },
          {
            label: 'Flexible',
            desc: "I don't have a specific budget",
            icon: '💳',
            value: 'flexible',
          },
        ],
      },
      {
        type: 'MULTI_CHOICE',
        question: 'What are your interests?',
        options: [
          {
            label: 'Adventure',
            desc: 'I love adventure and outdoor activities',
            icon: '🏞️',
            value: 'adventure',
          },
          {
            label: 'Culture',
            desc: 'I enjoy learning about different cultures',
            icon: '🏛️',
            value: 'culture',
          },
          {
            label: 'Food',
            desc: 'I love trying new foods and cuisines',
            icon: '🍽️',
            value: 'food',
          },
          {
            label: 'Relaxation',
            desc: 'I want to relax and unwind',
            icon: '🏖️',
            value: 'relaxation',
          },
        ],
      },
    ];
  }

  async suggestTripPlan(body: any, deviceId: string) {
    await this.checkPermissionPlanTrip(body?.userId, deviceId);
    return await this.gemAiService.suggestPlanTrip(body);
  }
  private async getRandomFourImg(data: CreateTripDTO) {
    const lstActivity = data.days.flatMap((day) =>
      day.activities.map((activity) => activity.img),
    );

    // get 4 random images from lstActivity
    const randomImages = [];
    const uniqueImages = new Set<string>();
    while (randomImages.length < 4 && uniqueImages.size < lstActivity.length) {
      const randomIndex = Math.floor(Math.random() * lstActivity.length);
      const randomImage = lstActivity[randomIndex];
      if (!uniqueImages.has(randomImage)) {
        uniqueImages.add(randomImage);
        randomImages.push(randomImage);
      }
    }
    return randomImages;
  }

  /// save trip
  async saveTrip(body: CreateTripDTO, user: UserDataDTO) {
    const locationOfActivityIds = body.days.flatMap((day) =>
      day.activities.map((activity) => activity.id),
    );
    const locations = await this.locationRepo.find({
      where: {
        id: In(locationOfActivityIds),
        isDeleted: false,
      },
    });

    const dictLocationById = coreHelper.toDict(locations, 'id');

    return this.repo.manager.transaction(async (trans) => {
      const repo = trans.getRepository(TripEntity);
      const tripDayRepo = trans.getRepository(TripDayEntity);
      const tripActivityRepo = trans.getRepository(TripActivityEntity);
      const tripDirectionRepo = trans.getRepository(TripDirectionEntity);

      const randomImages = await this.getRandomFourImg(body);
      const imgMerged = await this.uploadService.mergeAndUploadImages(
        randomImages,
        `${Date.now()}-${uuidv4()}.png`,
        'trip',
      );
      if (!imgMerged) {
        throw new Error('Error when upload image');
      }
      const trip: Partial<TripEntity> = {
        id: uuidv4(),
        thumbnail: imgMerged,
        type: enumData.TRIP_TYPE.USER.code,
        typeTrip: body.typeTrip,
        totalDays: body.totalDays,
        startDate: body.startDate,
        endDate: body.endDate,
        budget: body.budget,
        favorites: body.favorites.join(','),
        totalSave: 1,
        createdAt: new Date(),
        createdBy: user.id,
      };

      const tripEntity = repo.create(trip);
      await repo.insert(tripEntity);

      for (const day of body.days) {
        const tripDay: Partial<TripDayEntity> = {
          id: uuidv4(),
          dayNumber: day.dayNumber,
          date: day.date,
          dayOfWeek: day.dayOfWeek,
          tripId: tripEntity.id,
          createdAt: new Date(),
          createdBy: user.id,
        };

        const tripDayEntity = tripDayRepo.create(tripDay);
        await tripDayRepo.insert(tripDayEntity);

        const activities: Partial<TripActivityEntity>[] = [];
        for (const activity of day.activities) {
          const location = dictLocationById[activity.id];
          if (!location) {
            throw new Error(`Location with ID ${activity.id} not found`);
          }
          const tripActivity: Partial<TripActivityEntity> = {
            id: uuidv4(),
            tripDayId: tripDay.id,
            locationId: location.id,
            timeStart: activity.timeStart,
            timeEnd: activity.timeEnd,
            createdAt: new Date(),
            createdBy: user.id,
          };
          activities.push(tripActivity);
        }

        await tripActivityRepo.insert(activities);
      }

      /// save trip direction
      const tripData = await this.tripDirectionAndSave(body);
      const tripDirection: Partial<TripDirectionEntity> = {
        id: uuidv4(),
        tripId: tripEntity.id,
        geometry: tripData.geometry,
        distance: tripData.distance,
        duration: tripData.duration,
        createdAt: new Date(),
        createdBy: user.id,
      };
      const tripDirectionEntity = tripDirectionRepo.create(tripDirection);
      await tripDirectionRepo.insert(tripDirectionEntity);
      await repo.update(tripEntity.id, {
        tripDirectionId: tripDirectionEntity.id,
        updatedAt: new Date(),
        updatedBy: user.id,
      });
      return {
        message: 'Save trip successfully!',
        isSave: true,
      };
    });
  }

  async paginationUserTrip(user: UserDataDTO, body: PaginationDto<any>) {
    const where = {
      isDeleted: false,
      createdBy: user.id,
      type: enumData.TRIP_TYPE.USER.code,
    };
    const [result, total]: any = await this.repo.findAndCount({
      where: where,
      order: {
        startDate: 'ASC',
        createdAt: 'DESC',
      },
      skip: body.skip,
      take: body.take,
    });

    for (const item of result) {
      item.favorites = item.favorites.split(',');
    }

    return {
      data: result,
      total: total,
      nextSkip: body.skip + body.take,
      hasNext: body.skip + body.take < total,
      take: body.take,
    };
  }

  // detail trip
  async detail(id: string) {
    const trip: any = await this.repo.findOne({
      where: {
        id,
        isDeleted: false,
      },
      relations: {
        days: {
          activities: true,
        },
      },
    });

    if (!trip) {
      throw new Error('Trip not found');
    }

    // Parse favorites nếu có
    trip.favorites = trip.favorites ? trip.favorites.split(',') : [];

    // Lấy toàn bộ locationIds duy nhất
    const locationIds = Array.from(
      new Set(
        trip.__days__.flatMap((day: any) =>
          day.__activities__.map((act: any) => act.locationId),
        ),
      ),
    );

    const locations = await this.locationRepo.find({
      where: {
        id: In(locationIds),
        isDeleted: false,
      },
    });

    const locationMap = new Map(locations.map((loc) => [loc.id, loc]));

    // Chuẩn hóa lại `days` và `activities`
    const days = trip.__days__.map((day: any) => {
      const activities = day.__activities__.map((activity: any) => {
        const location = locationMap.get(activity.locationId);
        if (!location) {
          throw new Error(`Location not found for activity ${activity.id}`);
        }

        return {
          ...activity,
          location,
          img: location.lstImgs ? location.lstImgs.split(',')[0] : '',
          name: location.name,
          address: location.address,
          description: location.description,
          coordinates: location.coordinates,
          type: location.type,
          dayName: day.dayOfWeek,
          date: day.date,
          id: location.id,
        };
      });

      delete day.__activities__;

      return {
        ...day,
        activities,
      };
    });
    delete trip.__days__;

    const tripDirection = await this.tripDirectionRepo.findOne({
      where: {
        tripId: trip.id,
        isDeleted: false,
      },
    });
    if (!tripDirection) {
      throw new Error('Trip direction not found');
    }
    const result = {
      ...trip,
      days: days,
      tripDirection,
    };
    return result;
  }

  async mergeThumbnailExistTrip() {
    const lstTripExist: any = await this.repo.find({
      where: {
        isDeleted: false,
      },
      relations: {
        days: {
          activities: true,
        },
      },
    });
    for (const trip of lstTripExist) {
      const lstAcId: any = [];
      for (const day of trip.__days__) {
        for (const activity of day.__activities__) {
          lstAcId.push(activity.locationId);
        }
      }
      const locations = await this.locationRepo.find({
        where: {
          id: In(lstAcId),
          isDeleted: false,
        },
      });
      const imgs = locations
        .map((location) => location.lstImgs?.split(',')[0])
        .filter((img) => img); // Filter out undefined or null images

      const uniqueImgs = Array.from(new Set(imgs)); // Ensure unique images
      const randomImgs = [];
      while (randomImgs.length < 4 && uniqueImgs.length > 0) {
        const randomIndex = Math.floor(Math.random() * uniqueImgs.length);
        randomImgs.push(uniqueImgs.splice(randomIndex, 1)[0]);
      }

      const mergedImg = await this.uploadService.mergeAndUploadImages(
        randomImgs,
        `merged-${Date.now()}-${uuidv4()}.png`,
        'trip',
      );

      if (!mergedImg) {
        throw new Error('Error when upload image');
      }
      await this.repo.update(trip.id, {
        thumbnail: mergedImg,
        updatedAt: new Date(),
        updatedBy: trip.createdBy,
      });
    }
  }

  async getTripFromCreateDto(body: CreateTripDTO) {
    const locationOfActivityIds = body.days.flatMap((day) =>
      day.activities.map((activity) => activity.id),
    );
    const locations = await this.locationRepo.find({
      where: {
        id: In(locationOfActivityIds),
        isDeleted: false,
      },
    });

    const dictLocationById = coreHelper.toDict(locations, 'id');

    return this.repo.manager.transaction(async () => {
      const trip: any = {
        id: uuidv4(),
        type: enumData.TRIP_TYPE.USER.code,
        typeTrip: body.typeTrip,
        totalDays: body.totalDays,
        startDate: body.startDate,
        endDate: body.endDate,
        budget: body.budget,
        favorites: body.favorites.join(','),
        totalSave: 1,
      };

      const days: any[] = [];

      for (const day of body.days) {
        const tripDay: any = {
          id: uuidv4(),
          dayNumber: day.dayNumber,
          date: day.date,
          dayOfWeek: day.dayOfWeek,
          tripId: trip.id,
          createdAt: new Date(),
        };

        const activities: any[] = [];
        for (const activity of day.activities) {
          const location = dictLocationById[activity.id];
          if (!location) {
            throw new Error(`Location with ID ${activity.id} not found`);
          }
          const tripActivity: any = {
            id: uuidv4(),
            tripDayId: tripDay.id,
            locationId: location.id,
            timeStart: activity.timeStart,
            timeEnd: activity.timeEnd,
            ...location,
          };
          activities.push(tripActivity);
        }
        tripDay.activities = activities;
        days.push(tripDay);
      }
      trip.days = days;
      return trip;
    });
  }
  async getTripFromGoong(trip: any) {
    const apiKey = this.GOONG_API_KEY;
    const baseUrl = this.GOONG_API;

    if (!apiKey || !baseUrl) {
      throw new Error('API key or base URL is not defined');
    }

    let originAc: any | null = null;
    let descAc: any | null = null;
    if (trip && trip.days && trip.days.length > 0) {
      const firstDay = trip.days[0];
      if (firstDay && firstDay.activities && firstDay.activities.length > 0) {
        originAc = firstDay.activities[0];
      }
      if (firstDay && firstDay.activities && firstDay.activities.length > 0) {
        descAc = firstDay.activities[firstDay.activities.length - 1];
      }
    }

    if (!originAc) {
      throw new Error('No origin activity found in the trip');
    }

    if (!descAc) {
      throw new Error('No destination activity found in the trip');
    }

    const origin = originAc.coordinates;
    const destination = descAc.coordinates;

    const waypoints = trip?.days?.flatMap((day: any) =>
      day.activities
        .filter(
          (activity: any) =>
            activity.id !== originAc.id && activity.id !== descAc.id,
        )
        .map((activity: any) => activity.coordinates),
    );

    const queryParams = new URLSearchParams({
      origin,
      destination,
      waypoints: waypoints.join(';'),
      api_key: apiKey,
    });

    const url = `${baseUrl}?${queryParams.toString()}`;
    return await callApiHelper.get(url);
  }
  // get trip direction and save
  async tripDirectionAndSave(body: CreateTripDTO) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const trip: TripEntity = await this.getTripFromCreateDto(body);
    const tripDirection = await this.getTripFromGoong(trip);
    if (!tripDirection) {
      throw new Error('No trip direction found');
    }
    let result: any = null;
    if (tripDirection && tripDirection?.trips?.length > 0) {
      result = tripDirection.trips[0];
    }
    return result;
  }

  /** check permission to plan  */
  async checkPermissionPlanTrip(userId: string | null, deviceId: string) {
    if (userId) {
      const isHasTrial = await this.deviceTrialService.checkTotalRestTrial(
        userId,
        deviceId,
      );
      if (isHasTrial) {
        throw new Error(
          'You have reached the maximum number of trial requests ( max 3 plan for each device). Please subscribe to continue using this feature.',
        );
      }

      // check iff user has subscription
      const isUserHasSubscription =
        await this.userSubService.checkUserExpiredSubscription(userId);
      if (!isUserHasSubscription) {
        throw new Error(
          'You have reached the maximum number of requests ( max 3 plan for each device). Please subscribe to continue using this feature.',
        );
      }
    } else {
      // just check if deviceId is valid
      const isHasTrial = await this.deviceTrialService.checkTotalRestTrial(
        deviceId,
        null,
      );
      if (!isHasTrial) {
        throw new Error(
          'You have reached the maximum number of trial requests ( max 3 plan for each device). Please subscribe to continue using this feature.',
        );
      }
    }

    await this.deviceTrialService.incrementTrialUsageCount(deviceId);
  }
}
