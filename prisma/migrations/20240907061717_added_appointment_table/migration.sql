-- CreateTable
CREATE TABLE "Appointment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "date" DATETIME NOT NULL,
    "time" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "userId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_AppointmentToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_AppointmentToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Appointment" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_AppointmentToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_userId_key" ON "Appointment"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_AppointmentToUser_AB_unique" ON "_AppointmentToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_AppointmentToUser_B_index" ON "_AppointmentToUser"("B");
