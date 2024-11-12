-- CreateTable
CREATE TABLE "IncomingCall" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "android" TEXT NOT NULL,
    "ios" TEXT NOT NULL,
    "web" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "IncomingCall_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "IncomingCall_userId_key" ON "IncomingCall"("userId");
