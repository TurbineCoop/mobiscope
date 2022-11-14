/*
  Warnings:

  - You are about to drop the column `drivingLicence` on the `Beneficiary` table. All the data in the column will be lost.
  - You are about to drop the column `qualification` on the `Beneficiary` table. All the data in the column will be lost.
  - You are about to drop the column `rqth` on the `Beneficiary` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Beneficiary" DROP COLUMN "drivingLicence",
DROP COLUMN "qualification",
DROP COLUMN "rqth";
