// r2.module.ts
import { Module } from '@nestjs/common';
import { R2Provider } from './cloudflare-r2.provider';

@Module({
  providers: [R2Provider],
  exports: [R2Provider],
})
export class R2Module {}
