/*
  Warnings:

  - You are about to drop the column `callId` on the `Recording` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Recording` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Recording" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "filename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Recording_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Recording" ("createdAt", "duration", "filename", "id", "updatedAt", "url") SELECT "createdAt", "duration", "filename", "id", "updatedAt", "url" FROM "Recording";
DROP TABLE "Recording";
ALTER TABLE "new_Recording" RENAME TO "Recording";
CREATE UNIQUE INDEX "Recording_filename_key" ON "Recording"("filename");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
