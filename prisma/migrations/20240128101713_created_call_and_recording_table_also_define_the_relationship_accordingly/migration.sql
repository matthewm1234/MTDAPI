-- CreateTable
CREATE TABLE "Call" (
    "cId" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "type" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Call_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Recording" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "filename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "callId" TEXT NOT NULL,
    CONSTRAINT "Recording_callId_fkey" FOREIGN KEY ("callId") REFERENCES "Call" ("cId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Call_cId_key" ON "Call"("cId");

-- CreateIndex
CREATE UNIQUE INDEX "Call_type_key" ON "Call"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Recording_filename_key" ON "Recording"("filename");
