import { BadRequestException, Injectable } from '@nestjs/common';
import { initializeApp } from 'firebase/app';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { BlogService } from '../blog/blog.service';
import { LocationService } from '../location/location.service';

const firebaseConfig = {
  apiKey: 'AIzaSyC4AF0EvsvapWk6Y09ZyC3Sm3ZsqzqpOHA',
  authDomain: 'hodos-f29d9.firebaseapp.com',
  projectId: 'hodos-f29d9',
  storageBucket: 'hodos-f29d9.appspot.com',
  messagingSenderId: '646639558632',
  appId: '1:646639558632:web:2e89d12a833252cb4c8e5d',
  measurementId: 'G-W9YN4Y4290',
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
@Injectable()
export class CommonService {
  constructor(
    private readonly locationService: LocationService,
    private readonly blog: BlogService,
  ) {}

  async dashBoardData() {
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

    return {
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

  async uploadImage(file: Express.Multer.File): Promise<string | null> {
    console.log('Received file:', file);
    return new Promise((resolve, reject) => {
      if (!file) {
        throw new BadRequestException('No file uploaded.');
      }

      const storageRef = ref(storage, `images/${file.originalname}`);
      const uploadTask = uploadBytesResumable(storageRef, file.buffer);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload progress: ${progress}%`);
        },
        (error) => {
          console.error('Error uploading image:', error.message);
          reject(new Error('Promise rejected.'));
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              console.log('File available at', downloadURL);
              resolve(downloadURL);
            })
            .catch((error) => {
              console.error('Error getting download URL:', error.message);
              reject(new Error('Promise rejected.'));
            });
        },
      );
    });
  }
}
