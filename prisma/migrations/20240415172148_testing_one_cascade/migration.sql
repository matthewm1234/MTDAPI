-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Insight" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "recordId" INTEGER NOT NULL
);
INSERT INTO "new_Insight" ("createdAt", "id", "recordId", "updatedAt") SELECT "createdAt", "id", "recordId", "updatedAt" FROM "Insight";
DROP TABLE "Insight";
ALTER TABLE "new_Insight" RENAME TO "Insight";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
