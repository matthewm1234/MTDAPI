-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "image" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Call" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "type" TEXT NOT NULL,
    "number" TEXT NOT NULL,
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
    "conversationId" TEXT,
    "jobId" TEXT,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "processed" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Token" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "type" TEXT NOT NULL,
    "emailToken" TEXT,
    "valid" BOOLEAN NOT NULL DEFAULT true,
    "expiration" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Audio" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "conversationId" TEXT,
    "jobId" TEXT
);

-- CreateTable
CREATE TABLE "Task" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "description" TEXT NOT NULL,
    "recordId" INTEGER,
    CONSTRAINT "Task_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "Recording" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StatusChange" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "taskId" INTEGER NOT NULL,
    CONSTRAINT "StatusChange_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Insight" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "recordId" INTEGER,
    CONSTRAINT "Insight_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "Recording" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Summary" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "text" TEXT NOT NULL,
    "insightId" INTEGER NOT NULL,
    CONSTRAINT "Summary_insightId_fkey" FOREIGN KEY ("insightId") REFERENCES "Insight" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Topics" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "text" TEXT NOT NULL,
    "insightId" INTEGER NOT NULL,
    CONSTRAINT "Topics_insightId_fkey" FOREIGN KEY ("insightId") REFERENCES "Insight" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Transcription" (
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

-- CreateTable
CREATE TABLE "_RecordingToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_RecordingToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Recording" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_RecordingToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Token_emailToken_key" ON "Token"("emailToken");

-- CreateIndex
CREATE UNIQUE INDEX "Audio_name_key" ON "Audio"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Task_recordId_key" ON "Task"("recordId");

-- CreateIndex
CREATE UNIQUE INDEX "Insight_recordId_key" ON "Insight"("recordId");

-- CreateIndex
CREATE UNIQUE INDEX "Summary_insightId_key" ON "Summary"("insightId");

-- CreateIndex
CREATE UNIQUE INDEX "_RecordingToUser_AB_unique" ON "_RecordingToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_RecordingToUser_B_index" ON "_RecordingToUser"("B");
