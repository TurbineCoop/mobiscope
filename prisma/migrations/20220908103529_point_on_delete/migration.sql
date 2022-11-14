-- DropForeignKey
ALTER TABLE "Point" DROP CONSTRAINT "Point_benefId_fkey";

-- AddForeignKey
ALTER TABLE "Point" ADD CONSTRAINT "Point_benefId_fkey" FOREIGN KEY ("benefId") REFERENCES "Beneficiary"("id") ON DELETE CASCADE ON UPDATE CASCADE;
