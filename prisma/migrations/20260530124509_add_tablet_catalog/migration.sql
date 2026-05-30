/*
  Warnings:

  - You are about to drop the `tablets` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "tablets" DROP CONSTRAINT "tablets_userId_fkey";

-- DropTable
DROP TABLE "tablets";

-- CreateTable
CREATE TABLE "tablet_catalog" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "tablet_catalog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_tablet_stocks" (
    "id" SERIAL NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "userId" INTEGER NOT NULL,
    "tabletCatalogId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_tablet_stocks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tablet_catalog_code_key" ON "tablet_catalog"("code");

-- CreateIndex
CREATE UNIQUE INDEX "user_tablet_stocks_userId_tabletCatalogId_key" ON "user_tablet_stocks"("userId", "tabletCatalogId");

-- AddForeignKey
ALTER TABLE "user_tablet_stocks" ADD CONSTRAINT "user_tablet_stocks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_tablet_stocks" ADD CONSTRAINT "user_tablet_stocks_tabletCatalogId_fkey" FOREIGN KEY ("tabletCatalogId") REFERENCES "tablet_catalog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
