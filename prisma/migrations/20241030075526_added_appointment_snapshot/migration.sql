/*
  Warnings:

  - The primary key for the `Appointment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Notification` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `appointmentId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Notification` table. All the data in the column will be lost.
  - Added the required column `appointmentSnapshotId` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `participantId` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "AppointmentSnapshot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date" DATETIME NOT NULL,
    "time" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    CONSTRAINT "AppointmentSnapshot_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Appointment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "date" DATETIME NOT NULL,
    "time" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "participantNo" TEXT NOT NULL,
    "shared" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Appointment" ("createdAt", "date", "id", "location", "ownerId", "participantNo", "shared", "time", "title", "updatedAt") SELECT "createdAt", "date", "id", "location", "ownerId", "participantNo", "shared", "time", "title", "updatedAt" FROM "Appointment";
DROP TABLE "Appointment";
ALTER TABLE "new_Appointment" RENAME TO "Appointment";
CREATE TABLE "new_Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "participantId" INTEGER NOT NULL,
    "appointmentSnapshotId" TEXT NOT NULL,
    "counter" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "Notification_appointmentSnapshotId_fkey" FOREIGN KEY ("appointmentSnapshotId") REFERENCES "AppointmentSnapshot" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Notification" ("createdAt", "id", "updatedAt") SELECT "createdAt", "id", "updatedAt" FROM "Notification";
DROP TABLE "Notification";
ALTER TABLE "new_Notification" RENAME TO "Notification";
CREATE TABLE "new__AppointmentToUser" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_AppointmentToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Appointment" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_AppointmentToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new__AppointmentToUser" ("A", "B") SELECT "A", "B" FROM "_AppointmentToUser";
DROP TABLE "_AppointmentToUser";
ALTER TABLE "new__AppointmentToUser" RENAME TO "_AppointmentToUser";
CREATE UNIQUE INDEX "_AppointmentToUser_AB_unique" ON "_AppointmentToUser"("A", "B");
CREATE INDEX "_AppointmentToUser_B_index" ON "_AppointmentToUser"("B");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
