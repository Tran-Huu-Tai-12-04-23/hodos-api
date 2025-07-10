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
        'https://www.kkday.com/en/blog/wp-content/uploads/HCMC-Guide-Banner.jpg',
        'https://i.ytimg.com/vi/ggM8CZAWnKo/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLC2DcETE0pt0SBMWw64RIdqUluOPQ',
        'https://www.thepoortraveler.net/wp-content/uploads/2018/08/Ho-Chi-Minh-City.jpg',
        'https://img.freepik.com/premium-vector/travel-vietnam-concept_98402-1479.jpg',
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
