import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

export class TripActivityDTO {
  @ApiProperty({ description: 'LOCATION ID' })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({ description: 'Start time of activity (e.g. 09:00)' })
  @IsNotEmpty()
  @IsString()
  timeStart: string;

  @ApiProperty({ description: 'End time of activity (e.g. 11:00)' })
  @IsNotEmpty()
  @IsString()
  timeEnd: string;

  @ApiProperty({ description: 'Total time of activity (e.g. 02:00)' })
  @IsNotEmpty()
  @IsString()
  totalTime: string;

  @ApiProperty({ description: 'Name of the activity' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Description of the activity' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: 'Address of the activity' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ description: 'Coordinates of the activity (lat,lng)' })
  @IsNotEmpty()
  @IsString()
  coordinates: string;

  @ApiProperty({ description: 'Image URL for the activity' })
  @IsNotEmpty()
  @IsString()
  img: string;
}

export class TripDayDTO {
  @ApiProperty({ description: 'Day number in the trip (starting from 1)' })
  @IsNotEmpty()
  @IsInt()
  dayNumber: number;

  @ApiProperty({ description: 'Date for this day (e.g. 05-05-2025)' })
  @IsNotEmpty()
  @IsString()
  date: string;

  @ApiProperty({ description: 'Day of the week (e.g. Monday)' })
  @IsNotEmpty()
  @IsString()
  dayOfWeek: string;

  @ApiProperty({
    type: [TripActivityDTO],
    description: 'List of activities for the day',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TripActivityDTO)
  activities: TripActivityDTO[];
}

export class CreateTripDTO {
  @ApiProperty({ description: 'Total number of days of the trip' })
  @IsNotEmpty()
  @IsInt()
  totalDays: number;

  @ApiProperty({ description: 'Type of trip (e.g. couple, family)' })
  @IsNotEmpty()
  @IsString()
  typeTrip: string;

  @ApiProperty({ description: 'Start date (e.g. 05-05-2025)' })
  @IsNotEmpty()
  @IsString()
  startDate: string;

  @ApiProperty({ description: 'End date (e.g. 07-05-2025)' })
  @IsNotEmpty()
  @IsString()
  endDate: string;

  @ApiProperty({
    description: 'Trip budget type (e.g. flexible, low, medium, high)',
  })
  @IsNotEmpty()
  @IsString()
  budget: string;

  @ApiProperty({
    description: 'List of trip favorite types (e.g. Food, Relaxation)',
  })
  @IsArray()
  @IsString({ each: true })
  favorites: string[];

  @ApiProperty({
    type: [TripDayDTO],
    description: 'List of days and their activities',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TripDayDTO)
  days: TripDayDTO[];
}
