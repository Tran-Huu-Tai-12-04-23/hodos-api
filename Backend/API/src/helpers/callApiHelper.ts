import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

class CallApiHelper {
  constructor(private httpService: HttpService) {}

  public async callAPI(url: string, data: any) {
    try {
      const request = this.httpService.post(url, data);
      const response = await lastValueFrom(request);
      return response.data;
    } catch (err) {
      console.error('Error calling API:', err);
      return null;
    }
  }

  public async getDataFromAPI(url: string) {
    try {
      const request = this.httpService.get(url);
      const response = await lastValueFrom(request);
      return response.data;
    } catch (err) {
      console.error('Error calling API:', err);
      return null;
    }
  }
}

export const callApiHelper = new CallApiHelper(new HttpService());
