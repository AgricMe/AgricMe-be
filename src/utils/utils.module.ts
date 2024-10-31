import { Module } from '@nestjs/common';
import { UtilService } from './utils.service';

@Module({
  providers: [UtilService],
  exports: [UtilService],
})
export class UtilModule {}
