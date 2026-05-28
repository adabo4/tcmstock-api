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
import { TabletsService } from './tablets.service';
import { CreateTabletDto } from './dto/create-tablet.dto';
import { UpdateTabletDto } from './dto/update-tablet.dto';
import type { AuthenticatedRequest } from 'src/types/authenticated-request';

@Controller('tablets')
@UseGuards(AuthGuard('jwt'))
export class TabletsController {
  constructor(private readonly tabletsService: TabletsService) {}

  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateTabletDto) {
    return this.tabletsService.create(req.user.userId, dto);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.tabletsService.findAll(req.user.userId);
  }

  @Patch(':id')
  update(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTabletDto,
  ) {
    return this.tabletsService.update(req.user.userId, id, dto);
  }

  @Delete(':id')
  remove(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.tabletsService.remove(req.user.userId, id);
  }
}
