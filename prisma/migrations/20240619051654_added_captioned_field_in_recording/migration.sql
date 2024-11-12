-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Recording" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "filename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "conversationId" TEXT,
    "jobId" TEXT,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "captioned" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Recording" ("conversationId", "createdAt", "duration", "filename", "id", "jobId", "processed", "updatedAt", "url", "visible") SELECT "conversationId", "createdAt", "duration", "filename", "id", "jobId", "processed", "updatedAt", "url", "visible" FROM "Recording";
DROP TABLE "Recording";
ALTER TABLE "new_Recording" RENAME TO "Recording";
PRAGMA foreign_key_check("Recording");
PRAGMA foreign_keys=ON;
