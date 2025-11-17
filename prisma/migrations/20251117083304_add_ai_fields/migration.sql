-- AlterTable
ALTER TABLE "comments" ADD COLUMN     "aiAutoReply" TEXT,
ADD COLUMN     "aiChecked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "aiCheckedAt" TIMESTAMP(3),
ADD COLUMN     "aiSpamScore" DOUBLE PRECISION,
ADD COLUMN     "aiToxicScore" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "aiKeywords" TEXT,
ADD COLUMN     "aiSummary" TEXT,
ADD COLUMN     "aiSummaryAt" TIMESTAMP(3),
ADD COLUMN     "vectorized" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "comments_aiChecked_idx" ON "comments"("aiChecked");

-- CreateIndex
CREATE INDEX "posts_vectorized_idx" ON "posts"("vectorized");
