import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChatBoxDto } from './dto';
import { GeminiAIService } from './geminiAI.service';

@ApiTags('GeminiAI')
@Controller('ai')
export class GeminiAIController {
  constructor(private readonly service: GeminiAIService) {}

  @ApiOperation({
    summary: 'Gemini AI test',
  })
  @ApiResponse({ status: 201 })
  @Get('test')
  async sendMail() {
    return await this.service.test();
  }

  @ApiOperation({
    summary: 'Gemini AI translate ',
  })
  @ApiResponse({ status: 200, description: 'Translation successful' })
  @Get('translate')
  async translate(
    @Body()
    body: {
      isEngToVie: boolean;
      docs: string;
    },
  ) {
    return await this.service.translate(body);
  }

  @ApiOperation({
    summary: 'Schedule a tour',
  })
  @ApiResponse({ status: 200, description: 'Tour scheduled successfully' })
  @Post('schedule')
  async schedule(
    @Body()
    body: {
      kind: string[];
      long: number;
      lat: number;
      startTime: string;
      endTime: string;
    },
  ) {
    return await this.service.schedule(body);
  }

  @ApiOperation({
    summary: 'Get details for scheduled tour places',
  })
  @ApiResponse({ status: 200, description: 'Details retrieved successfully' })
  @Post('schedule-detail')
  async scheduleDetail(
    @Body()
    body: {
      place: string;
    },
  ) {
    return await this.service.scheduleDetails(body);
  }

  @ApiOperation({
    summary: 'Chat box for travel',
  })
  @ApiResponse({ status: 200, description: 'Chat box for travel' })
  @Post('chat-box')
  async chatBox(
    @Body()
    body: ChatBoxDto,
  ) {
    return await this.service.chatBot(body);
  }

  @ApiResponse({ status: 200, description: 'Chat Dash board' })
  @Post('chat-dashboard')
  async chatDashboard() {
    return await this.service.chatDashboard();
  }
}
