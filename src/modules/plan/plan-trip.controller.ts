import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PlanTripService } from './plan-trip.service';

@ApiTags('Plan trips API')
@Controller('plan-trip')
export class PlanTripController {
  constructor(private readonly service: PlanTripService) {}
}
