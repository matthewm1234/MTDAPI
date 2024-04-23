-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Insight" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "recordId" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Insight_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "Recording" ("id") ON DELETE SET DEFAULT ON UPDATE CASCADE
);
INSERT INTO "new_Insight" ("createdAt", "id", "recordId", "updatedAt") SELECT "createdAt", "id", "recordId", "updatedAt" FROM "Insight";
DROP TABLE "Insight";
ALTER TABLE "new_Insight" RENAME TO "Insight";
CREATE TABLE "new_Task" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "description" TEXT NOT NULL,
    "recordId" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Task_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "Recording" ("id") ON DELETE SET DEFAULT ON UPDATE CASCADE
);
INSERT INTO "new_Task" ("createdAt", "description", "id", "recordId", "updatedAt") SELECT "createdAt", "description", "id", "recordId", "updatedAt" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
