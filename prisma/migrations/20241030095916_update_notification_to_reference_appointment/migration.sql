/*
  Warnings:

  - Added the required column `appointmentId` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "participantId" INTEGER NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "appointmentSnapshotId" TEXT NOT NULL,
    "counter" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "Notification_appointmentSnapshotId_fkey" FOREIGN KEY ("appointmentSnapshotId") REFERENCES "AppointmentSnapshot" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Notification_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Notification" ("appointmentSnapshotId", "counter", "createdAt", "id", "participantId", "updatedAt") SELECT "appointmentSnapshotId", "counter", "createdAt", "id", "participantId", "updatedAt" FROM "Notification";
DROP TABLE "Notification";
ALTER TABLE "new_Notification" RENAME TO "Notification";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
