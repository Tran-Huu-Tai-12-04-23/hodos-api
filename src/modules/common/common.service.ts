import { BadRequestException, Injectable } from '@nestjs/common';
import { initializeApp } from 'firebase/app';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { FoodService } from '../food/food.service';
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
