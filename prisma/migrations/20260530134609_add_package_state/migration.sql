-- CreateEnum
CREATE TYPE "PackageState" AS ENUM ('FULL', 'OPENED');

-- AlterTable
ALTER TABLE "user_tablet_stocks" ADD COLUMN     "packageState" "PackageState" NOT NULL DEFAULT 'FULL';
