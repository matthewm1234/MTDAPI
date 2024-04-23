/*
  Warnings:

  - You are about to drop the column `conversationId` on the `Task` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Task" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "description" TEXT NOT NULL,
    "recordId" INTEGER NOT NULL,
    CONSTRAINT "Task_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "Recording" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Task" ("createdAt", "description", "id", "recordId", "updatedAt") SELECT "createdAt", "description", "id", "recordId", "updatedAt" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
CREATE UNIQUE INDEX "Task_recordId_key" ON "Task"("recordId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
