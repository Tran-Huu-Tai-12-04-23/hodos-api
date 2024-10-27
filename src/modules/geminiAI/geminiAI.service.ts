import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { callApiHelper } from 'src/helpers/callApiHelper';

@Injectable()
export class GeminiAIService {
  constructor(public readonly configService: ConfigService) {}
  GEMINI_API_KEY = this.configService.get<string>('GEMINI_API_KEY') || '';
  genAI = new GoogleGenerativeAI('AIzaSyDzj2O9_Ij7f9V9F3CRG40I-Lu3lfugOe8');
  model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  async test() {
    const result = await this.model.generateContent(['Explain how AI works']);
    console.log(result.response.text());

    return result;
  }

  async translate(body: { isEngToVie: boolean; docs: string }) {
    const { isEngToVie, docs } = body;
    const instructionStart =
      'You are an expert in the field of languages, especially in English and Vietnamese.';
    const vieToEng =
      'Translate the following passage from Vietnamese to English, please provide a clear and accurate translation while preserving the original meaning and tone of the text. Just give the translated sentence for output.';
    const engToVie =
      'Translate the following passage from English to Vietnamese, please provide a clear and accurate translation while preserving the original meaning and tone of the text. Just give the translated sentence for output.';
    const instruction = isEngToVie ? engToVie : vieToEng;
    const result = await this.model.generateContent([
      `${instructionStart}\n${instruction}\n"${docs}"`,
    ]);
    return result;
  }

  formatPlaces(placesString: string) {
    const placesArray = placesString
      .split('),')
      .map((item) => item.trim() + ')');

    const formattedPlaces = placesArray.map((item) => {
      if (!item) return null;

      const [placeInfo, timeInfo] = item.split('-');
      if (!placeInfo || !timeInfo) return null;

      const timeDetails = timeInfo.split('_')[0].trim().split(',');
      if (timeDetails.length < 2) return null;

      const coordinatesMatch = item.match(/\(\(([^)]+)\)\)/);
      if (!coordinatesMatch || coordinatesMatch.length < 2) return null;

      const coordinates = coordinatesMatch[1].split(',').map(Number);
      if (coordinates.length < 2) return null;
      const descriptionMatch = timeInfo.match(/_description:\s*\(([^)]+)\)/);
      const costMatch = timeInfo.match(/_cost:\s*\(([^)]+)\)/);
      const imageMatch = timeInfo.match(/_image:\s*\(([^)]+)\)/);

      return {
        name: placeInfo.trim(),
        startTime: timeDetails[0].trim().substring(1),
        endTime: timeDetails[1].trim().substring(0, timeDetails[1].length - 2),
        longitude: coordinates[0],
        latitude: coordinates[1],
        description: descriptionMatch ? descriptionMatch[1].trim() : '',
        cost: costMatch ? costMatch[1].trim() : '',
        image: imageMatch ? imageMatch[1].trim() : '',
      };
    });

    return formattedPlaces.filter((place) => place !== null);
  }

  async schedule(body: {
    kind: string[];
    long: number;
    lat: number;
    startTime: string;
    endTime: string;
  }) {
    const { kind, long, lat, startTime, endTime } = body;
    try {
      const kindString = kind.join(', ');
      const prompt = `You are a famous tour guide in Ho Chi Minh City. Suggest a tour focused on ${kindString}, starting at ${startTime} and ending at ${endTime}, from coordinates ${lat}, ${long}. Ensure there are food stops for breakfast, lunch, and dinner, along with historical sites. Optimize the itinerary so that the travel distance between the starting point and the ending point is minimized.
Response format: [Place 1-(hh:mm yyyy:mm:dd, hh:mm yyyy:mm:dd)_((longitude, latitude))_description: (activities)_cost: (USD)_image: (specific URL from https://travelsaigon.org/ or another reliable source), Place 2-(hh:mm yyyy:mm:dd, hh:mm yyyy:mm:dd)_((longitude, latitude))_description: (activities)_cost: (USD)_image: (specific URL from https://travelsaigon.org/ or another reliable source)]
Example: [Dinh Doc Lap-(10:00 2024:09:26,11:15 2024:09:26)_((10.744089, 106.683914))_description: (Visit the Independence Palace)_cost: (10 USD)_image: (https://travelsaigon.org/image1.jpg), Banh Mi Huynh Hoa-(12:00 2024:09:26,13:00 2024:09:26)_((10.744089, 106.683914))_description: (Enjoy a Vietnamese sandwich)_cost: (5 USD)_image: (https://travelsaigon.org/image2.jpg)]
Do not include any additional text or explanation, just the list. Ensure that the image URL is a valid and specific link from https://travelsaigon.org/ or another reliable source.`;

      const places = await this.model.generateContent([prompt]);

      let placesString = places.response.text();

      placesString = placesString.replace(/[\[\]\n]/g, '');

      console.log('Places:', placesString);

      const formattedPlaces = this.formatPlaces(placesString);

      // const promiseAll = lstPlace.map(async (place) => {
      //   console.log(place.trim().split('-')[0]);
      //   const location = place.trim().split(')_((')[1]?.substring(0);
      //   const newLocation = location?.substring(0, location.length - 1);
      //   return await this.scheduleDetails({
      //     place: place.trim().split('-')[0],
      //     long,
      //     lat,
      //     placeLat: parseFloat(newLocation?.split('*')[0]),
      //     placeLong: parseFloat(newLocation?.split('*')[1]),
      //   });
      // });

      return formattedPlaces;
    } catch (error) {
      console.error('Error in schedule method:', error);
      throw new Error('Failed to retrieve places');
    }
  }

  async scheduleDetails(body: { place: string }) {
    const { place } = body;
    const prompt = `Provide details for "${place}" in JSON format example:
    {
      "name": "Café Giảng",
      "location": "39 Nguyen Huu Huan Street, Hoan Kiem District, Hanoi",
      "history": "Founded in 1946 by Nguyễn Văn Giảng, it is one of the oldest cafes in Hanoi.",
      "legend": "The story goes that Giảng, a former chef, ran out of milk one day. In a moment of ingenuity, he decided to use egg yolks instead. The result was the creation of egg coffee, a drink that quickly gained popularity.",
      "coffee": "Café Giảng serves a rich, strong coffee with a distinct eggy flavour. The coffee is brewed with robusta beans and topped with a thick layer of whipped egg yolk mixed with condensed milk and sugar.",
      "ambiance": "Café Giảng retains a traditional, almost nostalgic atmosphere, with its simple wooden furniture, vintage decor, and bustling atmosphere.",
      "popularity": "It remains a popular tourist destination and a must-visit for coffee lovers.",
      "special": {
        "originality": "It is considered the birthplace of egg coffee, a unique Vietnamese specialty that has spread worldwide.",
        "historicalSignificance": "The cafe has been a staple of Hanoi for over 70 years, witnessing the city's transformation.",
        "authenticity": "Café Giảng offers a taste of traditional Vietnamese coffee culture and an experience that captures the spirit of Hanoi."
      },
      "beyondCoffee": {
        "otherDrinks": "Café Giảng also serves other Vietnamese coffee specialties, such as cà phê sữa đá (iced coffee with condensed milk) and cà phê đen (black coffee).",
        "snacks": "They offer light snacks like pastries and sandwiches."
      },
      "visiting": {
        "bestTimeToVisit": "Weekdays during the afternoon or early evening, as it can get crowded during peak hours.",
        "expectQueue": "The cafe is always popular, so be prepared to wait for a table.",
        "mustTry": "Don't forget to try the Egg Coffee: The reason for its popularity is the unique flavor, so make sure to try the signature drink!"
      },
      "summary": "Café Giảng is not just a cafe; it is a historical landmark, a culinary icon, and a testament to the ingenuity of Vietnamese coffee culture."
    }`;

    try {
      const result = await this.model.generateContent(prompt);
      const responseText = result.response.text().trim();

      if (!responseText) {
        throw new Error('Empty response from model');
      }

      const lstImgs = await this.getImagesForPlace(place);

      return {
        ...JSON.parse(responseText.substring(7, responseText.length - 3)),
        lstImgs,
      };
    } catch (error) {
      console.error('Error in scheduleDetails method:', error);
      throw new Error('Failed to retrieve details for the place');
    }
  }

  async getImagesForPlace(place: string) {
    const data = await callApiHelper.getDataFromAPI(
      'https://serpapi.com/search.json?engine=google_images&q=' +
        place +
        '&api_key=3e5985fc2cb6cffcc8324b6ed49db0e9dab516a9f136cb4f8f515e6b7f57d754',
    );

    const lstImg = [];
    for (const item of data?.images_results) {
      lstImg.push(item?.original);
    }
    return lstImg;
  }

  async chatBot(body: { place: string }) {
    console.log(body);
    const instruction =
      'You are a professional tour guide in Ho Chi Minh City, Vietnam. Please interact, chat, and answer questions in English in a friendly manner';

    const result = await this.model.generateContent(instruction);
    console.log(result.response.text());
    return result;
  }
}
