import { Injectable } from '@nestjs/common';
import { FoodService } from '../food/food.service';
import { LocationService } from '../location/location.service';

@Injectable()
export class CommonService {
  constructor(
    private readonly foodService: FoodService,
    private readonly locationService: LocationService,
  ) {}

  async dashBoardData() {
    const [top10Food, top10Location] = await Promise.all([
      this.foodService.findAndCountTop(9),
      this.locationService.findAndCountTop(9),
    ]);

    return {
      foodData: {
        lst: top10Food[0],
        total: top10Food[1],
      },
      locationData: {
        lst: top10Location[0],
        total: top10Location[1],
      },
    };
  }
}
