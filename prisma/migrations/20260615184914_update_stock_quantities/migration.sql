/*
  Warnings:

  - You are about to drop the column `packageState` on the `user_tablet_stocks` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `user_tablet_stocks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user_tablet_stocks" DROP COLUMN "packageState",
DROP COLUMN "quantity",
ADD COLUMN     "fullQuantity" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "openedQuantity" INTEGER NOT NULL DEFAULT 0;

-- DropEnum
DROP TYPE "PackageState";
