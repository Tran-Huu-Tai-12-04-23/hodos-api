import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { coreHelper } from 'src/helpers';
import { callApiHelper } from 'src/helpers/callApiHelper';
import { LocationRepository } from 'src/repositories/location.repository';
import { ChatBoxDto } from './dto';

@Injectable()
export class GeminiAIService {
  private genAI: GoogleGenerativeAI;
  private baseModel: any;
  private contextData: {
    locations: any[];
    foods: any[];
    lastUpdated: Date;
  } = {
    locations: [],
    foods: [],
    lastUpdated: new Date(0),
  };

  constructor(
    public readonly configService: ConfigService,
    private readonly locationRepo: LocationRepository,
  ) {
    const GEMINI_API_KEY =
      this.configService.get<string>('GEMINI_API_KEY') || '';
    this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

    // Tạo base model với system instructions
    this.baseModel = this.genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: `You are a professional AI travel assistant specialized in Ho Chi Minh City, Vietnam.

CORE CONTEXT:
- You have access to a comprehensive database of locations and foods in Ho Chi Minh City
- You understand Vietnamese culture, local customs, and tourist preferences
- You always provide practical, accurate, and helpful travel advice
- You can suggest itineraries, recommend places, translate text, and help with travel planning
- You prioritize authentic local experiences and consider budget constraints

RESPONSE GUIDELINES:
- Always use data from the provided database when recommending places or foods
- Provide specific addresses, coordinates, and descriptions when available
- Consider user preferences, budget, and travel style
- Be friendly, professional, and culturally sensitive
- When asked about places not in the database, politely redirect to available options`,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 4096,
      },
    });
  }

  /**
   * Load và cache database context
   */
  private async loadDatabaseContext(forceRefresh = false): Promise<void> {
    const cacheExpiry = 5 * 60 * 1000; // 5 minutes
    const now = new Date();

    if (
      !forceRefresh &&
      now.getTime() - this.contextData.lastUpdated.getTime() < cacheExpiry
    ) {
      return; // Use cached data
    }

    try {
      const [locations, foods]: any = await Promise.all([
        this.locationRepo.find({
          where: { type: 'LOCATION' },
          select: {
            id: true,
            name: true,
            description: true,
            address: true,
            coordinates: true,
            lstImgs: true,
          },
        }),
        this.locationRepo.find({
          where: { type: 'FOOD' },
          select: {
            id: true,
            name: true,
            description: true,
            address: true,
            coordinates: true,
            lstImgs: true,
          },
        }),
      ]);

      // Format images
      for (const item of [...locations, ...foods]) {
        item.img = item.lstImgs?.split(',')?.[0] || '';
        delete item.lstImgs; // Remove to reduce context size
      }

      this.contextData = {
        locations,
        foods,
        lastUpdated: now,
      };
    } catch (error) {
      console.error('Error loading database context:', error);
      // Keep using old cached data if available
    }
  }

  /**
   * Tạo context string từ database
   */
  private createDatabaseContext(): string {
    return `
CURRENT DATABASE CONTEXT (Updated: ${this.contextData.lastUpdated.toISOString()}):

AVAILABLE LOCATIONS (${this.contextData.locations.length} places):
${JSON.stringify(this.contextData.locations, null, 2)}

AVAILABLE FOODS (${this.contextData.foods.length} restaurants):
${JSON.stringify(this.contextData.foods, null, 2)}

Please use only these locations and foods when making recommendations.
`;
  }

  /**
   * Tạo model với context từ database
   */
  private async getModelWithContext(): Promise<any> {
    await this.loadDatabaseContext();
    return this.baseModel;
  }

  async test() {
    const model = await this.getModelWithContext();
    const contextPrompt = `
${this.createDatabaseContext()}

USER QUESTION: Explain how AI works in the travel industry, specifically for Ho Chi Minh City tourism.

Please provide examples using the locations and foods from our database.
`;

    const result = await model.generateContent(contextPrompt);
    console.log(result.response.text());
    return result;
  }

  async translate(body: { isEngToVie: boolean; docs: string }) {
    const model = await this.getModelWithContext();
    const { isEngToVie, docs } = body;

    const contextPrompt = `
${this.createDatabaseContext()}

TRANSLATION TASK:
- Source language: ${isEngToVie ? 'English' : 'Vietnamese'}
- Target language: ${isEngToVie ? 'Vietnamese' : 'English'}
- Text to translate: "${docs}"

INSTRUCTIONS:
- Provide accurate translation preserving original meaning and tone
- If the text mentions places or foods, check if they exist in our database
- For places in our database, provide additional context (address, description)
- Just give the translated sentence as output

TEXT TO TRANSLATE: "${docs}"
`;

    const result = await model.generateContent(contextPrompt);
    return result;
  }

  async schedule(body: {
    kind: string[];
    long: number;
    lat: number;
    startTime: string;
    endTime: string;
  }) {
    const model = await this.getModelWithContext();
    const { kind, long, lat, startTime, endTime } = body;

    const contextPrompt = `
${this.createDatabaseContext()}

SCHEDULE REQUEST:
- Interests: ${kind.join(', ')}
- Starting coordinates: ${lat}, ${long}
- Start time: ${startTime}
- End time: ${endTime}

INSTRUCTIONS:
- Create optimized itinerary using ONLY locations and foods from the database above
- Minimize travel distance between locations
- Include appropriate meal times with foods from database
- Format as requested in original specification

Please create the schedule using our available locations and foods.
`;

    try {
      const result = await model.generateContent(contextPrompt);
      let placesString = result.response.text();
      placesString = placesString.replace(/[\[\]\n]/g, '');
      console.log('Places:', placesString);

      const formattedPlaces = this.formatPlaces(placesString);
      return formattedPlaces;
    } catch (error) {
      console.error('Error in schedule method:', error);
      throw new Error('Failed to retrieve places');
    }
  }

  async scheduleDetails(body: { place: string }) {
    const model = await this.getModelWithContext();
    const { place } = body;

    const contextPrompt = `
${this.createDatabaseContext()}

PLACE DETAILS REQUEST: "${place}"

INSTRUCTIONS:
- First check if "${place}" exists in our database
- If found, use database information as primary source
- Enhance with additional cultural and historical context
- If not in database, create details but mention it's not in our current database
- Format as JSON as specified in original request

Provide detailed information about: "${place}"
`;

    try {
      const result = await model.generateContent(contextPrompt);
      const responseText = result.response.text().trim();

      if (!responseText) {
        throw new Error('Empty response from model');
      }

      // Find place in our database first
      const dbPlace = [
        ...this.contextData.locations,
        ...this.contextData.foods,
      ].find((item) => item.name.toLowerCase().includes(place.toLowerCase()));

      const lstImgs = await this.getImagesForPlace(place);

      let parsedResponse;
      try {
        const cleanJson = responseText.replace(/```json|```/g, '').trim();
        parsedResponse = JSON.parse(cleanJson);
      } catch {
        // Fallback if JSON parsing fails
        parsedResponse = { name: place, description: responseText };
      }

      return {
        ...parsedResponse,
        lstImgs,
        databaseInfo: dbPlace || null, // Include database info if available
      };
    } catch (error) {
      console.error('Error in scheduleDetails method:', error);
      throw new Error('Failed to retrieve details for the place');
    }
  }

  async chatBot(body: ChatBoxDto) {
    const model = await this.getModelWithContext();

    const contextPrompt = `
${this.createDatabaseContext()}

USER MESSAGE: "${body.message}"

TASK:
- Analyze user's message for travel-related queries about Ho Chi Minh City
- Suggest maximum 2 relevant locations or foods from database
- Provide reasons and descriptions
- Format response as JSON as specified

Please respond using our database information.
`;

    const result = await model.generateContent(contextPrompt);
    const responseText = result.response.text().trim();
    const cleanedJson = responseText.replace(/```json|```/g, '').trim();

    let parsedResult;
    try {
      parsedResult = JSON.parse(cleanedJson);
    } catch (err) {
      return {
        type: 'unknown',
        recommendations: [],
        message: 'Invalid response format. Please try again.',
        reason: '',
        description: '',
      };
    }

    // Use cached context data instead of re-querying
    const dictLocationById = coreHelper.toDict(
      [...this.contextData.locations, ...this.contextData.foods],
      'id',
    );

    const processedIds = new Set();
    const finalRecommendations = [];

    for (const recommendation of parsedResult?.recommendations || []) {
      if (processedIds.has(recommendation.id)) continue;

      const location = dictLocationById[recommendation.id];
      if (location) {
        finalRecommendations.push({
          id: location.id,
          name: location.name,
          description: location.description,
          address: location.address,
          coordinates: location.coordinates,
          img: location.img,
        });

        processedIds.add(recommendation.id);
      }
    }

    return {
      ...parsedResult,
      recommendations: finalRecommendations,
      message:
        finalRecommendations.length > 0
          ? ''
          : "Sorry, I don't have any recommendations for you. Please try again.",
    };
  }

  async suggestPlanTrip(body: any) {
    const model = await this.getModelWithContext();

    const contextPrompt = `
${this.createDatabaseContext()}

TRIP PLANNING REQUEST:
${JSON.stringify(body, null, 2)}

INSTRUCTIONS:
- Use ONLY the locations and foods from the database above
- Create comprehensive itinerary from startDate to endDate
- Consider user preferences: budget, group type, favorites
- Include 3-5 activities per day with appropriate meal times
- Format as specified JSON structure
- Ensure all activity IDs match database IDs

Create the trip plan using our available locations and foods.
`;

    const result = await model.generateContent(contextPrompt);
    const responseText = result.response.text().trim();
    const cleanedJson = responseText.replace(/```json|```/g, '').trim();
    const parsedResult = JSON.parse(cleanedJson);

    // Use cached context data
    const mergedList = [
      ...this.contextData.locations,
      ...this.contextData.foods,
    ];
    const dictLocation = mergedList.reduce<Record<string, any>>((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {});

    for (const day of parsedResult.days) {
      day.activities = day.activities
        .map((activity: any) => {
          const location = dictLocation[activity.id];
          if (location) {
            return {
              ...activity,
              id: location.id,
              name: location.name,
              description: location.description,
              address: location.address,
              coordinates: location.coordinates,
              img: location.img,
              dayName: day.dayOfWeek,
              date: day.date,
            };
          }
          return null;
        })
        .filter(Boolean);
    }

    return {
      result: parsedResult,
      message:
        parsedResult?.days.length > 0
          ? ''
          : "Sorry, I don't have any recommendations for you. Please try again.",
    };
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

  async getImagesForPlace(place: string) {
    const data = await callApiHelper.get(
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

  async chatDashboard() {
    return [
      {
        message:
          'Where should I go for the best local food in Ho Chi Minh City?',
        img: 'https://ling-app.com/wp-content/uploads/2023/03/vietnamese-food-featured-image-ling-app.jpg',
      },
      {
        message:
          'What are some must-visit tourist attractions in Ho Chi Minh City?',
        img: 'https://media.loveitopcdn.com/41316/kcfinder/upload//images/%C4%90%E1%BB%8AA%20%C4%90I%E1%BB%82M%20DU%20L%E1%BB%8ACH%20S%C3%80I%20G%C3%92N.png',
      },
      {
        message: 'Can you suggest a fun place to explore at night?',
        img: 'https://www.vietnamvisa.org.vn/wp-content/uploads/2023/11/Best-Places-for-Nightlife-in-Ho-Chi-Minh-City.jpg',
      },
      {
        message:
          'I want a relaxing spot to chill during the afternoon. Any suggestions?',
        img: 'https://media-cdn.tripadvisor.com/media/photo-s/1c/90/b1/d5/a-chill-afternoon-at.jpg',
      },
    ];
  }
}
