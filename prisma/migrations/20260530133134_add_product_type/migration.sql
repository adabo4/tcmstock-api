-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('TABLET', 'DRINK', 'BOOK', 'OIL', 'SYRUP', 'CELL_SALT', 'CREAM', 'SUPPOSITORY');

-- AlterTable
ALTER TABLE "tablet_catalog" ADD COLUMN     "productType" "ProductType" NOT NULL DEFAULT 'TABLET';
