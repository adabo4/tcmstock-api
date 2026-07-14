import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { AuthenticatedRequest } from '../types/authenticated-request';
import { CreateStockLocationDto } from './dto/create-stock-location.dto';
import { UpdateStockLocationDto } from './dto/update-stock-location.dto';
import { StockLocationsService } from './stock-locations.service';

@Controller('stock-locations')
@UseGuards(AuthGuard('jwt'))
export class StockLocationsController {
  constructor(private readonly stockLocationsService: StockLocationsService) {}

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.stockLocationsService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.stockLocationsService.findOne(req.user.userId, id);
  }

  @Post()
  create(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateStockLocationDto,
  ) {
    return this.stockLocationsService.create(req.user.userId, dto);
  }

  @Patch(':id')
  update(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStockLocationDto,
  ) {
    return this.stockLocationsService.update(req.user.userId, id, dto);
  }

  @Patch(':id/default')
  setDefault(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.stockLocationsService.setDefault(req.user.userId, id);
  }

  @Delete(':id')
  remove(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.stockLocationsService.remove(req.user.userId, id);
  }
}
