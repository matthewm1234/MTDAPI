/*
  Warnings:

  - The primary key for the `Call` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `callId` on the `Recording` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Added the required column `id` to the `Call` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Call" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "type" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Call_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Call" ("cId", "createdAt", "number", "type", "updatedAt", "userId") SELECT "cId", "createdAt", "number", "type", "updatedAt", "userId" FROM "Call";
DROP TABLE "Call";
ALTER TABLE "new_Call" RENAME TO "Call";
CREATE TABLE "new_Recording" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "filename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "callId" INTEGER NOT NULL,
    CONSTRAINT "Recording_callId_fkey" FOREIGN KEY ("callId") REFERENCES "Call" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Recording" ("callId", "createdAt", "duration", "filename", "id", "updatedAt", "url") SELECT "callId", "createdAt", "duration", "filename", "id", "updatedAt", "url" FROM "Recording";
DROP TABLE "Recording";
ALTER TABLE "new_Recording" RENAME TO "Recording";
CREATE UNIQUE INDEX "Recording_filename_key" ON "Recording"("filename");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
