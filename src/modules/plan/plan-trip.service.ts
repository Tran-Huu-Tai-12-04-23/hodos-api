import { Injectable } from '@nestjs/common';
import { enumData } from 'src/constants/enum-data';
import { TripActivityEntity } from 'src/entities/trip-activity.entity';
import { TripDayEntity } from 'src/entities/trip-day.entity';
import { TripEntity } from 'src/entities/trip.entity';
import { coreHelper } from 'src/helpers';
import { TripRepository } from 'src/repositories';
import { LocationRepository } from 'src/repositories/location.repository';
import { In } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { UserDataDTO } from '../auth/dto';
import { GeminiAIService } from '../geminiAI/geminiAI.service';
import { CreateTripDTO } from './dto';

@Injectable()
export class PlanTripService {
  constructor(
    private readonly gemAiService: GeminiAIService,
    private readonly locationRepo: LocationRepository,
    private readonly repo: TripRepository,
  ) {}

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

  async suggestTripPlan(body: any) {
    return await this.gemAiService.suggestPlanTrip(body);
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

      const trip: Partial<TripEntity> = {
        id: uuidv4(),
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

      return {
        message: 'Save trip successfully!',
        isSave: true,
      };
    });
  }
}
