-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Call" (
    "cId" TEXT NOT NULL PRIMARY KEY,
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
CREATE UNIQUE INDEX "Call_cId_key" ON "Call"("cId");
CREATE UNIQUE INDEX "Call_type_key" ON "Call"("type");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
