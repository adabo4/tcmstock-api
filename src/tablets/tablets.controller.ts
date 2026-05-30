import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TabletsService } from './tablets.service';
import { CreateTabletDto } from './dto/create-tablet.dto';
import { UpdateTabletDto } from './dto/update-tablet.dto';
import type { AuthenticatedRequest } from '../types/authenticated-request';
import { ProductType } from '@prisma/client';

@Controller('tablets')
@UseGuards(AuthGuard('jwt'))
export class TabletsController {
  constructor(private readonly tabletsService: TabletsService) {}

  @Get('catalog')
  findCatalog(
    @Query('search') search?: string,
    @Query('type') type?: ProductType,
  ) {
    return this.tabletsService.findCatalog(search, type);
  }

  @Get('my')
  findMyStock(@Req() req: AuthenticatedRequest) {
    return this.tabletsService.findMyStock(req.user.userId);
  }

  @Post('my')
  addToMyStock(@Req() req: AuthenticatedRequest, @Body() dto: CreateTabletDto) {
    return this.tabletsService.addToMyStock(req.user.userId, dto);
  }

  @Patch('my/:id')
  updateMyStock(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTabletDto,
  ) {
    return this.tabletsService.updateMyStock(req.user.userId, id, dto);
  }

  @Delete('my/:id')
  removeFromMyStock(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.tabletsService.removeFromMyStock(req.user.userId, id);
  }
}
