/*
  Warnings:

  - You are about to drop the column `userId` on the `Recording` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_RecordingToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_RecordingToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Recording" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_RecordingToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Recording" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "filename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "duration" TEXT NOT NULL
);
INSERT INTO "new_Recording" ("createdAt", "duration", "filename", "id", "updatedAt", "url") SELECT "createdAt", "duration", "filename", "id", "updatedAt", "url" FROM "Recording";
DROP TABLE "Recording";
ALTER TABLE "new_Recording" RENAME TO "Recording";
CREATE UNIQUE INDEX "Recording_filename_key" ON "Recording"("filename");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_RecordingToUser_AB_unique" ON "_RecordingToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_RecordingToUser_B_index" ON "_RecordingToUser"("B");
