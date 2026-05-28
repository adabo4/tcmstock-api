import { Module } from '@nestjs/common';
import { TabletsController } from './tablets.controller';
import { TabletsService } from './tablets.service';

@Module({
  controllers: [TabletsController],
  providers: [TabletsService]
})
export class TabletsModule {}
