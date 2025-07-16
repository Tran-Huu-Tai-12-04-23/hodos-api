import { Injectable } from '@nestjs/common';
import { BlogService } from '../blog/blog.service';
import { LocationService } from '../location/location.service';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class CommonService {
  constructor(
    private readonly locationService: LocationService,
    private readonly blog: BlogService,
    private readonly notificationService: NotificationService,
  ) {}

  async dashBoardData(userId?: string) {
    const [top10Location, top10Food, topBlog]: any = await Promise.all([
      this.locationService.findAndCountTop(10, 'LOCATION'),
      this.locationService.findAndCountTop(10, 'FOOD'),
      this.blog.top5(),
    ]);

    for (const i of top10Location[0]) {
      i.img = i.lstImgs.split(',')[0];
      i.lstImgs = i.lstImgs.split(',');
      delete i.detail;
    }
    for (const i of top10Food[0]) {
      i.img = i.lstImgs.split(',')[0];
      i.lstImgs = i.lstImgs.split(',');
      delete i.detail;
    }

    const unreadCount = userId
      ? await this.notificationService.getTotalUnreadNotificationCount(userId)
      : 0;

    return {
      unreadCount,
      banners: [
        {
          thumbnail:
            'https://tinviettravel.com/uploads/tours/images/mien_nam/du_lich_sai_gon/tour-ho-chi-minh.jpg',
          title: 'Ho Chi Minh City',
          description:
            'Ho Chi Minh City, formerly known as Saigon, is the largest city in Vietnam and ',
        },
        {
          thumbnail:
            'https://cdn.antoursvietnam.com/wp-content/uploads/2023/08/9-amazing-reasons-to-travel-to-Ho-Chi-Minh-City-at-least-once-AN-Tours-Vietnam-2.jpg',
          title: 'Vietnam Travel Guide',
          description:
            'Explore the vibrant culture and rich history of Vietnam.',
        },
        {
          thumbnail:
            'https://bizweb.dktcdn.net/100/414/214/products/landtour-sai-gon.jpg?v=1685935578077',
          title: 'Discover Ho Chi Minh City',
          description:
            'Uncover the best attractions, food, and experiences in Ho Chi Minh City.',
        },
        {
          thumbnail:
            'https://miahotels.com.vn/UploadFile/Tours/Update-tour/avatar/ho-chi-minh-city-1-day-tour.jpg',
          title: 'Travel Vietnam',
          description:
            'Plan your unforgettable journey to Vietnam with our comprehensive guide.',
        },
        {
          thumbnail:
            'https://bizweb.dktcdn.net/100/539/761/files/du-lich-sai-gon-ben-nha-rong-6f3b0c58-ff94-4f55-bff3-ebe5e7e0c5c4.jpg?v=1744795589687',
          title: 'Ho Chi Minh City',
          description:
            'Ho Chi Minh City, formerly known as Saigon, is the largest city in Vietnam and ',
        },
        {
          thumbnail:
            'https://cleverads.vn/wp-content/uploads/2022/06/Ho-Chi-Minh-Travel-Agency.png',
          title: 'Vietnam Travel Guide',
          description:
            'Explore the vibrant culture and rich history of Vietnam, with a focus on Ho Chi Minh City.',
        },
        {
          thumbnail:
            'https://bizweb.dktcdn.net/thumb/grande/100/072/558/products/nha-tho-duc-ba-cinvestratravel-sp.jpg?v=1606652112813',
          title: 'Discover Ho Chi Minh City',
          description:
            'Uncover the best attractions, food, and experiences in Ho Chi Minh City.',
        },
        {
          thumbnail:
            'https://media.vneconomy.vn/images/upload/2022/08/06/ho-chi-minh-city-travel-guide-2021-vietnamnomad.jpg',
          title: 'Travel Ho Chi Minh City',
          description:
            'Plan your unforgettable journey to Ho Chi Minh City with our comprehensive guide.',
        },
      ],
      foodData: {
        lst: top10Food[0],
        total: top10Food[1],
      },
      locationData: {
        lst: top10Location[0],
        total: top10Location[1],
      },
      blogs: topBlog,
    };
  }
}
