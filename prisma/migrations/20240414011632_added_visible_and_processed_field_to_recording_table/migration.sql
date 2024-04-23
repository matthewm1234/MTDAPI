-- AlterTable
ALTER TABLE "Recording" ADD COLUMN "processed" BOOLEAN DEFAULT false;
ALTER TABLE "Recording" ADD COLUMN "visible" BOOLEAN DEFAULT true;
