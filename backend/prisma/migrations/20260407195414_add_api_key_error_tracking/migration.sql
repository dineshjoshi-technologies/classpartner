-- AlterTable
ALTER TABLE "ApiKey" ADD COLUMN     "errorCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastErrorAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'completed',
ADD COLUMN     "type" TEXT,
ALTER COLUMN "content" SET DEFAULT '';

-- CreateIndex
CREATE INDEX "Document_status_idx" ON "Document"("status");
