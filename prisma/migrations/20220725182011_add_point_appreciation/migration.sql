-- CreateEnum
CREATE TYPE "PointAppreciation" AS ENUM ('LIKE', 'DISLIKE', 'INDIFFERENT');

-- AlterTable
ALTER TABLE "Point" ADD COLUMN     "appreciation" "PointAppreciation" NOT NULL DEFAULT 'LIKE';
