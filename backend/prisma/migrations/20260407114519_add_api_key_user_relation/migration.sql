/*
  Warnings:

  - Added the required column `userId` to the `ApiKey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ApiKey" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "ApiKey_userId_idx" ON "ApiKey"("userId");

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
