/*
  Warnings:

  - You are about to drop the column `name` on the `Task` table. All the data in the column will be lost.
  - Added the required column `recordId` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Task" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "description" TEXT NOT NULL,
    "conversationId" TEXT,
    "recordId" INTEGER NOT NULL,
    CONSTRAINT "Task_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "Recording" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Task" ("conversationId", "createdAt", "description", "id", "updatedAt") SELECT "conversationId", "createdAt", "description", "id", "updatedAt" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
CREATE UNIQUE INDEX "Task_recordId_key" ON "Task"("recordId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
