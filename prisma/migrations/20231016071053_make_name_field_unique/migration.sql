/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Audio` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Audio_name_key" ON "Audio"("name");
