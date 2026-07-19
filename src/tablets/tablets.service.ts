import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateTabletDto } from './dto/create-tablet.dto';
import { UpdateTabletDto } from './dto/update-tablet.dto';
import { ProductType } from '@prisma/client';
import { CatalogQueryDto } from './dto/catalog-query.dto';
import { MyStockQueryDto } from './dto/my-stock-query-dto';

@Injectable()
export class TabletsService {
  constructor(private readonly prisma: PrismaService) {}

  async findCatalog(search?: string, type?: ProductType) {
    if (!search && !type) {
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
  (${search}::text IS NULL OR (
          unaccent(lower(name)) LIKE unaccent(lower(${`%${search ?? ''}%`}))
          OR code LIKE ${`%${search ?? ''}%`}
        ))
        AND
        (${type}::"ProductType" IS NULL OR "productType" = ${type}::"ProductType")
      ORDER BY code ASC
    `;
  }

  /*cez prismu */
  // async findMyStock(userId: number, query: MyStockQueryDto) {
  //   const search = query.search?.trim();
  //   const page = query.page;
  //   const limit = query.limit;

  //   const catalogWhere: Prisma.TabletCatalogWhereInput = {
  //     ...(query.type && {
  //       productType: query.type,
  //     }),

  //     ...(search && {
  //       OR: [
  //         {
  //           code: {
  //             contains: search,
  //             mode: 'insensitive',
  //           },
  //         },
  //         {
  //           name: {
  //             contains: search,
  //             mode: 'insensitive',
  //           },
  //         },
  //       ],
  //     }),
  //   };

  //   const where: Prisma.UserTabletStockWhereInput = {
  //     userId,

  //     ...(Object.keys(catalogWhere).length > 0 && {
  //       tabletCatalog: {
  //         is: catalogWhere,
  //       },
  //     }),
  //   };

  //   const [items, total] = await this.prisma.$transaction([
  //     this.prisma.userTabletStock.findMany({
  //       where,
  //       include: {
  //         tabletCatalog: true,
  //       },
  //       orderBy: {
  //         tabletCatalog: {
  //           code: 'asc',
  //         },
  //       },
  //       skip: (page - 1) * limit,
  //       take: limit,
  //     }),

  //     this.prisma.userTabletStock.count({
  //       where,
  //     }),
  //   ]);

  //   return {
  //     items,
  //     total,
  //     page,
  //     limit,
  //     totalPages: Math.ceil(total / limit),
  //   };
  // }

  async addToMyStock(userId: number, dto: CreateTabletDto) {
    const catalogTablet = await this.prisma.tabletCatalog.findUnique({
      where: {
        id: dto.tabletCatalogId,
      },
    });

    if (!catalogTablet) {
      throw new NotFoundException('Catalog tablet not found');
    }

    const stockLocation = dto.stockLocationId
      ? await this.prisma.stockLocation.findFirst({
          where: {
            id: dto.stockLocationId,
            userId,
          },
        })
      : await this.prisma.stockLocation.findFirst({
          where: {
            userId,
            isDefault: true,
          },
        });

    if (!stockLocation) {
      throw new NotFoundException('Stock location not found');
    }

    const existingStock = await this.prisma.userTabletStock.findUnique({
      where: {
        userId_tabletCatalogId_stockLocationId: {
          userId,
          tabletCatalogId: dto.tabletCatalogId,
          stockLocationId: stockLocation.id,
        },
      },
    });

    if (existingStock) {
      return this.prisma.userTabletStock.update({
        where: {
          id: existingStock.id,
        },
        data: {
          fullQuantity: {
            increment: dto.fullQuantity,
          },
          openedQuantity: {
            increment: dto.openedQuantity,
          },
        },
        include: {
          tabletCatalog: true,
          stockLocation: true,
        },
      });
    }

    return this.prisma.userTabletStock.create({
      data: {
        userId,
        tabletCatalogId: dto.tabletCatalogId,
        stockLocationId: stockLocation.id,
        fullQuantity: dto.fullQuantity,
        openedQuantity: dto.openedQuantity,
      },
      include: {
        tabletCatalog: true,
        stockLocation: true,
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
      where: {
        id: stockItem.id,
      },
      data: {
        fullQuantity: dto.fullQuantity,
        openedQuantity: dto.openedQuantity,
      },
      include: {
        tabletCatalog: true,
        stockLocation: true,
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

  // async getCatalog(query: CatalogQueryDto) {
  //   const search = query.search?.trim();
  //   const page = query.page;
  //   const limit = query.limit;

  //   const where: Prisma.TabletCatalogWhereInput = {
  //     ...(query.type && {
  //       productType: query.type,
  //     }),

  //     ...(search && {
  //       OR: [
  //         {
  //           code: {
  //             contains: search,
  //             mode: 'insensitive',
  //           },
  //         },
  //         {
  //           name: {
  //             contains: search,
  //             mode: 'insensitive',
  //           },
  //         },
  //       ],
  //     }),
  //   };

  //   const [items, total] = await this.prisma.$transaction([
  //     this.prisma.tabletCatalog.findMany({
  //       where,
  //       orderBy: {
  //         code: 'asc',
  //       },
  //       skip: (page - 1) * limit,
  //       take: limit,
  //       select: {
  //         id: true,
  //         code: true,
  //         name: true,
  //         productType: true,
  //       },
  //     }),

  //     this.prisma.tabletCatalog.count({
  //       where,
  //     }),
  //   ]);

  //   return {
  //     items,
  //     total,
  //     page,
  //     limit,
  //     totalPages: Math.ceil(total / limit),
  //   };
  // }

  async getCatalog(query: CatalogQueryDto) {
    const search = query.search?.trim() || null;
    const type = query.type ?? null;
    const page = query.page;
    const limit = query.limit;
    const offset = (page - 1) * limit;

    const items = await this.prisma.$queryRaw<
      Array<{
        id: number;
        code: string;
        name: string;
        productType: ProductType;
      }>
    >`
    SELECT
      id,
      code,
      name,
      "productType"
    FROM tablet_catalog
    WHERE
      (
        ${search}::text IS NULL
        OR unaccent(lower(name)) LIKE unaccent(lower(${`%${search ?? ''}%`}))
        OR lower(code) LIKE lower(${`%${search ?? ''}%`})
      )
      AND (
        ${type}::"ProductType" IS NULL
        OR "productType" = ${type}::"ProductType"
      )
    ORDER BY code ASC
    LIMIT ${limit}
    OFFSET ${offset}
  `;

    const countResult = await this.prisma.$queryRaw<Array<{ count: bigint }>>`
    SELECT COUNT(*) AS count
    FROM tablet_catalog
    WHERE
      (
        ${search}::text IS NULL
        OR unaccent(lower(name)) LIKE unaccent(lower(${`%${search ?? ''}%`}))
        OR lower(code) LIKE lower(${`%${search ?? ''}%`})
      )
      AND (
        ${type}::"ProductType" IS NULL
        OR "productType" = ${type}::"ProductType"
      )
  `;

    const total = Number(countResult[0].count);
    const totalPages = Math.ceil(total / limit);

    return {
      items,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findMyStock(userId: number, query: MyStockQueryDto) {
    const search = query.search?.trim() || null;
    const type = query.type ?? null;
    const status = query.status ?? null;
    const page = query.page;
    const limit = query.limit;
    const offset = (page - 1) * limit;
    const packageStatus = query.packageStatus ?? null;

    const stockLocation = query.stockLocationId
      ? await this.prisma.stockLocation.findFirst({
          where: {
            id: query.stockLocationId,
            userId,
          },
        })
      : await this.prisma.stockLocation.findFirst({
          where: {
            userId,
            isDefault: true,
          },
        });

    if (!stockLocation) {
      throw new NotFoundException('Stock location not found');
    }

    const items = await this.prisma.$queryRaw<
      Array<{
        id: number;
        userId: number;
        tabletCatalogId: number;
        fullQuantity: number;
        openedQuantity: number;
        createdAt: Date;
        updatedAt: Date;
        tabletCatalog: {
          id: number;
          code: string;
          name: string;
          productType: ProductType;
        };
      }>
    >`
  SELECT
    uts.id,
    uts."userId",
    uts."tabletCatalogId",
    uts."fullQuantity",
    uts."openedQuantity",
    uts."createdAt",
    uts."updatedAt",
    json_build_object(
      'id', tc.id,
      'code', tc.code,
      'name', tc.name,
      'productType', tc."productType"
    ) AS "tabletCatalog"

  FROM user_tablet_stocks uts

  INNER JOIN tablet_catalog tc
    ON tc.id = uts."tabletCatalogId"

  WHERE
    uts."userId" = ${userId}
    AND uts."stockLocationId" = ${stockLocation.id}

    AND (
      ${search}::text IS NULL
      OR unaccent(lower(tc.name))
        LIKE unaccent(lower(${`%${search ?? ''}%`}))
      OR lower(tc.code)
        LIKE lower(${`%${search ?? ''}%`})
    )

    AND (
      ${type}::"ProductType" IS NULL
      OR tc."productType" = ${type}::"ProductType"
    )

    AND (
      ${status}::text IS NULL

      OR (
        ${status}::text = 'OUT_OF_STOCK'
        AND (uts."fullQuantity" + uts."openedQuantity") = 0
      )

      OR (
        ${status}::text = 'LOW_STOCK'
        AND (uts."fullQuantity" + uts."openedQuantity") > 0
        AND (uts."fullQuantity" + uts."openedQuantity") < 2
      )
    )
    AND (
  ${packageStatus}::text IS NULL

  OR (
    ${packageStatus}::text = 'OPENED'
    AND uts."openedQuantity" > 0
  )

  OR (
    ${packageStatus}::text = 'CLOSED'
    AND uts."fullQuantity" > 0
  )
)  

  ORDER BY tc.code ASC
  LIMIT ${limit}
  OFFSET ${offset}
`;

    const countResult = await this.prisma.$queryRaw<Array<{ count: bigint }>>`
  SELECT COUNT(*) AS count

  FROM user_tablet_stocks uts

  INNER JOIN tablet_catalog tc
    ON tc.id = uts."tabletCatalogId"

  WHERE
    uts."userId" = ${userId}
    AND uts."stockLocationId" = ${stockLocation.id}

    AND (
      ${search}::text IS NULL
      OR unaccent(lower(tc.name))
        LIKE unaccent(lower(${`%${search ?? ''}%`}))
      OR lower(tc.code)
        LIKE lower(${`%${search ?? ''}%`})
    )

    AND (
      ${type}::"ProductType" IS NULL
      OR tc."productType" = ${type}::"ProductType"
    )

    AND (
      ${status}::text IS NULL

      OR (
        ${status}::text = 'OUT_OF_STOCK'
        AND (uts."fullQuantity" + uts."openedQuantity") = 0
      )
      
      OR (
        ${status}::text = 'LOW_STOCK'
        AND (uts."fullQuantity" + uts."openedQuantity") > 0
        AND (uts."fullQuantity" + uts."openedQuantity") < 2
      )
    )

    AND (
      ${packageStatus}::text IS NULL

      OR (
        ${packageStatus}::text = 'OPENED'
        AND uts."openedQuantity" > 0
      )

      OR (
        ${packageStatus}::text = 'CLOSED'
        AND uts."fullQuantity" > 0
      )
    )
`;

    const summaryResult = await this.prisma.$queryRaw<
      Array<{
        totalProducts: bigint;
        lowStock: bigint;
        outOfStock: bigint;
      }>
    >`
  SELECT
    COUNT(*) AS "totalProducts",

    COUNT(*) FILTER (
      WHERE
        (uts."fullQuantity" + uts."openedQuantity") > 0
        AND (uts."fullQuantity" + uts."openedQuantity") < 2
    ) AS "lowStock",

    COUNT(*) FILTER (
      WHERE
        (uts."fullQuantity" + uts."openedQuantity") = 0
    ) AS "outOfStock"

  FROM user_tablet_stocks uts

  WHERE
    uts."userId" = ${userId}
    AND uts."stockLocationId" = ${stockLocation.id}
`;

    const total = Number(countResult[0]?.count ?? 0);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      summary: {
        totalProducts: Number(summaryResult[0]?.totalProducts ?? 0),
        lowStock: Number(summaryResult[0]?.lowStock ?? 0),
        outOfStock: Number(summaryResult[0]?.outOfStock ?? 0),
      },
    };
  }
}
