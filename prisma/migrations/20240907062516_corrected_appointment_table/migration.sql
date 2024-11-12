/*
  Warnings:

  - You are about to drop the column `userId` on the `Appointment` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Appointment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "date" DATETIME NOT NULL,
    "time" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "location" TEXT NOT NULL
);
INSERT INTO "new_Appointment" ("createdAt", "date", "id", "location", "time", "title", "updatedAt") SELECT "createdAt", "date", "id", "location", "time", "title", "updatedAt" FROM "Appointment";
DROP TABLE "Appointment";
ALTER TABLE "new_Appointment" RENAME TO "Appointment";
PRAGMA foreign_key_check("Appointment");
PRAGMA foreign_keys=ON;
