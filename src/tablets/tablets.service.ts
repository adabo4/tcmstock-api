import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateTabletDto } from './dto/create-tablet.dto';
import { UpdateTabletDto } from './dto/update-tablet.dto';

@Injectable()
export class TabletsService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: number, dto: CreateTabletDto) {
    return this.prisma.tablet.create({
      data: {
        name: dto.name,
        code: dto.code,
        quantity: dto.quantity,
        userId,
      },
    });
  }

  findAll(userId: number) {
    return this.prisma.tablet.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    });
  }

  async update(userId: number, id: number, dto: UpdateTabletDto) {
    const tablet = await this.prisma.tablet.findFirst({
      where: { id, userId },
    });

    if (!tablet) {
      throw new NotFoundException('Tablet not found');
    }

    return this.prisma.tablet.update({
      where: { id },
      data: dto,
    });
  }

  async remove(userId: number, id: number) {
    const tablet = await this.prisma.tablet.findFirst({
      where: { id, userId },
    });

    if (!tablet) {
      throw new NotFoundException('Tablet not found');
    }

    await this.prisma.tablet.delete({
      where: { id },
    });

    return { message: 'Tablet deleted' };
  }
}
