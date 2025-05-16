import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PostService } from './post.service';

@ApiTags('Post API')
@Controller('post')
export class PostController {
  constructor(private readonly service: PostService) {}
}
