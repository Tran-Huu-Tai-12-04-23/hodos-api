import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TravelBlogService } from './travelblog.service';

@ApiTags('Travel Blog API')
@Controller('travel-blogs')
export class TravelBlogController {
  constructor(private readonly service: TravelBlogService) {}
}
