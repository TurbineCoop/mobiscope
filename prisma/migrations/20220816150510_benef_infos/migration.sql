-- AlterTable
ALTER TABLE "Beneficiary" ADD COLUMN     "activitySector" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "drivingLicence" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "qualification" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "rqth" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sectorCode" TEXT NOT NULL DEFAULT '';
