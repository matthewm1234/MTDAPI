-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transcription" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "sentiment" TEXT NOT NULL,
    "speaker" TEXT,
    "message" TEXT NOT NULL,
    "insightId" INTEGER NOT NULL,
    CONSTRAINT "Transcription_insightId_fkey" FOREIGN KEY ("insightId") REFERENCES "Insight" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Transcription" ("createdAt", "endTime", "id", "insightId", "message", "sentiment", "speaker", "startTime") SELECT "createdAt", "endTime", "id", "insightId", "message", "sentiment", "speaker", "startTime" FROM "Transcription";
DROP TABLE "Transcription";
ALTER TABLE "new_Transcription" RENAME TO "Transcription";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
