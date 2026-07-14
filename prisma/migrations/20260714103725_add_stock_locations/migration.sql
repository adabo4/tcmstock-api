-- CreateTable
CREATE TABLE "stock_locations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_locations_pkey" PRIMARY KEY ("id")
);

-- Add nullable location column first
ALTER TABLE "user_tablet_stocks"
ADD COLUMN "stockLocationId" INTEGER;

-- Create one default location for every existing user
INSERT INTO "stock_locations" (
    "name",
    "isDefault",
    "userId",
    "createdAt",
    "updatedAt"
)
SELECT
    'Hlavný sklad',
    true,
    "id",
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM "users";

-- Assign all existing stock records to the user's default location
UPDATE "user_tablet_stocks" AS stock
SET "stockLocationId" = location."id"
FROM "stock_locations" AS location
WHERE location."userId" = stock."userId"
  AND location."isDefault" = true;

-- stockLocationId can now safely become required
ALTER TABLE "user_tablet_stocks"
ALTER COLUMN "stockLocationId" SET NOT NULL;

-- Remove the old unique constraint
ALTER TABLE "user_tablet_stocks"
DROP CONSTRAINT IF EXISTS "user_tablet_stocks_userId_tabletCatalogId_key";

-- New unique constraint:
-- one product once per location
CREATE UNIQUE INDEX
"user_tablet_stocks_userId_tabletCatalogId_stockLocationId_key"
ON "user_tablet_stocks"(
    "userId",
    "tabletCatalogId",
    "stockLocationId"
);

-- Location name must be unique for each user
CREATE UNIQUE INDEX
"stock_locations_userId_name_key"
ON "stock_locations"("userId", "name");

-- Helpful indexes
CREATE INDEX
"stock_locations_userId_idx"
ON "stock_locations"("userId");

CREATE INDEX
"user_tablet_stocks_stockLocationId_idx"
ON "user_tablet_stocks"("stockLocationId");

-- Foreign keys
ALTER TABLE "stock_locations"
ADD CONSTRAINT "stock_locations_userId_fkey"
FOREIGN KEY ("userId")
REFERENCES "users"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "user_tablet_stocks"
ADD CONSTRAINT "user_tablet_stocks_stockLocationId_fkey"
FOREIGN KEY ("stockLocationId")
REFERENCES "stock_locations"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;