import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateStockLocationDto } from './dto/create-stock-location.dto';
import { UpdateStockLocationDto } from './dto/update-stock-location.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class StockLocationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: number) {
    return this.prisma.stockLocation.findMany({
      where: {
        userId,
      },
      orderBy: [
        {
          isDefault: 'desc',
        },
        {
          name: 'asc',
        },
      ],
      include: {
        _count: {
          select: {
            tabletStocks: true,
          },
        },
      },
    });
  }

  async findOne(userId: number, locationId: number) {
    const location = await this.prisma.stockLocation.findFirst({
      where: {
        id: locationId,
        userId,
      },
      include: {
        _count: {
          select: {
            tabletStocks: true,
          },
        },
      },
    });

    if (!location) {
      throw new NotFoundException('Skladové miesto nebolo nájdené');
    }

    return location;
  }

  async create(userId: number, dto: CreateStockLocationDto) {
    const name = dto.name.trim();

    const existingLocation = await this.prisma.stockLocation.findFirst({
      where: {
        userId,
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
    });

    if (existingLocation) {
      throw new ConflictException('Skladové miesto s týmto názvom už existuje');
    }

    const locationCount = await this.prisma.stockLocation.count({
      where: {
        userId,
      },
    });

    return this.prisma.stockLocation.create({
      data: {
        userId,
        name,
        // Ak používateľ zatiaľ nemá žiadny sklad,
        // prvý vytvorený sklad sa stane predvoleným.
        isDefault: locationCount === 0,
      },
    });
  }

  async update(
    userId: number,
    locationId: number,
    dto: UpdateStockLocationDto,
  ) {
    const location = await this.findOne(userId, locationId);

    const name = dto.name?.trim();

    if (name) {
      const existingLocation = await this.prisma.stockLocation.findFirst({
        where: {
          userId,
          name: {
            equals: name,
            mode: 'insensitive',
          },
          NOT: {
            id: location.id,
          },
        },
      });

      if (existingLocation) {
        throw new ConflictException(
          'Skladové miesto s týmto názvom už existuje',
        );
      }
    }

    return this.prisma.stockLocation.update({
      where: {
        id: location.id,
      },
      data: {
        ...(name && {
          name,
        }),
      },
    });
  }

  async setDefault(userId: number, locationId: number) {
    const location = await this.findOne(userId, locationId);

    return this.prisma.$transaction(async (tx) => {
      await tx.stockLocation.updateMany({
        where: {
          userId,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });

      return tx.stockLocation.update({
        where: {
          id: location.id,
        },
        data: {
          isDefault: true,
        },
      });
    });
  }

  async remove(userId: number, locationId: number) {
    const location = await this.findOne(userId, locationId);

    if (location.isDefault) {
      throw new BadRequestException(
        'Predvolené skladové miesto nie je možné odstrániť',
      );
    }

    const stockCount = await this.prisma.userTabletStock.count({
      where: {
        userId,
        stockLocationId: location.id,
      },
    });

    if (stockCount > 0) {
      throw new BadRequestException(
        'Skladové miesto nie je možné odstrániť, pretože obsahuje produkty',
      );
    }

    await this.prisma.stockLocation.delete({
      where: {
        id: location.id,
      },
    });

    return {
      message: 'Stock location deleted successfully',
    };
  }
}
