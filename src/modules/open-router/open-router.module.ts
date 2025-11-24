import { Module } from '@nestjs/common';
import { OpenRouterService } from './open-router.service';

@Module({
  imports: [],
  providers: [OpenRouterService],
  controllers: [],
  exports: [OpenRouterService],
})
export class OpenRouterModule {}
