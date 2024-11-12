/*
  Warnings:

  - You are about to alter the column `android` on the `IncomingCall` table. The data in that column could be lost. The data in that column will be cast from `String` to `Boolean`.
  - You are about to alter the column `ios` on the `IncomingCall` table. The data in that column could be lost. The data in that column will be cast from `String` to `Boolean`.
  - You are about to alter the column `web` on the `IncomingCall` table. The data in that column could be lost. The data in that column will be cast from `String` to `Boolean`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_IncomingCall" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "android" BOOLEAN NOT NULL,
    "ios" BOOLEAN NOT NULL,
    "web" BOOLEAN NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "IncomingCall_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_IncomingCall" ("android", "createdAt", "id", "ios", "updatedAt", "userId", "web") SELECT "android", "createdAt", "id", "ios", "updatedAt", "userId", "web" FROM "IncomingCall";
DROP TABLE "IncomingCall";
ALTER TABLE "new_IncomingCall" RENAME TO "IncomingCall";
CREATE UNIQUE INDEX "IncomingCall_userId_key" ON "IncomingCall"("userId");
PRAGMA foreign_key_check("IncomingCall");
PRAGMA foreign_keys=ON;
