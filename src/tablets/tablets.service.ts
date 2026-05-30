import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateTabletDto } from './dto/create-tablet.dto';
import { UpdateTabletDto } from './dto/update-tablet.dto';

@Injectable()
export class TabletsService {
  constructor(private readonly prisma: PrismaService) {}

  async findCatalog(search?: string) {
    if (!search) {
      return this.prisma.tabletCatalog.findMany({
        orderBy: {
          code: 'asc',
        },
      });
    }

    return this.prisma.$queryRaw`
    SELECT *
    FROM tablet_catalog
    WHERE
      unaccent(lower(name)) LIKE unaccent(lower(${`%${search}%`}))
      OR
      code LIKE ${`%${search}%`}
    ORDER BY code ASC
  `;
  }

  findMyStock(userId: number) {
    return this.prisma.userTabletStock.findMany({
      where: { userId },
      include: {
        tabletCatalog: true,
      },
      orderBy: {
        tabletCatalog: {
          code: 'asc',
        },
      },
    });
  }

  async addToMyStock(userId: number, dto: CreateTabletDto) {
    const catalogTablet = await this.prisma.tabletCatalog.findUnique({
      where: {
        id: dto.tabletCatalogId,
      },
    });

    if (!catalogTablet) {
      throw new NotFoundException('Catalog tablet not found');
    }

    const existingStock = await this.prisma.userTabletStock.findUnique({
      where: {
        userId_tabletCatalogId: {
          userId,
          tabletCatalogId: dto.tabletCatalogId,
        },
      },
    });

    if (existingStock) {
      throw new BadRequestException('Tablet is already in your stock');
    }

    return this.prisma.userTabletStock.create({
      data: {
        userId,
        tabletCatalogId: dto.tabletCatalogId,
        quantity: dto.quantity,
        packageState: dto.packageState,
      },
      include: {
        tabletCatalog: true,
      },
    });
  }

  async updateMyStock(userId: number, id: number, dto: UpdateTabletDto) {
    const stockItem = await this.prisma.userTabletStock.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!stockItem) {
      throw new NotFoundException('Stock item not found');
    }

    return this.prisma.userTabletStock.update({
      where: { id },
      data: {
        quantity: dto.quantity,
        packageState: dto.packageState,
      },
      include: {
        tabletCatalog: true,
      },
    });
  }

  async removeFromMyStock(userId: number, id: number) {
    const stockItem = await this.prisma.userTabletStock.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!stockItem) {
      throw new NotFoundException('Stock item not found');
    }

    await this.prisma.userTabletStock.delete({
      where: { id },
    });

    return {
      message: 'Stock item deleted',
    };
  }
}
