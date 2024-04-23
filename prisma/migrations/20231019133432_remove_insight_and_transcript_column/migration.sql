/*
  Warnings:

  - You are about to drop the column `insight` on the `Audio` table. All the data in the column will be lost.
  - You are about to drop the column `transcript` on the `Audio` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Audio" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "conversationId" TEXT,
    "jobId" TEXT
);
INSERT INTO "new_Audio" ("conversationId", "createdAt", "id", "jobId", "name", "updatedAt") SELECT "conversationId", "createdAt", "id", "jobId", "name", "updatedAt" FROM "Audio";
DROP TABLE "Audio";
ALTER TABLE "new_Audio" RENAME TO "Audio";
CREATE UNIQUE INDEX "Audio_name_key" ON "Audio"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
