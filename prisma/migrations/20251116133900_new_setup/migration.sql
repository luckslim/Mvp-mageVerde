/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `author` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "event" DROP CONSTRAINT "event_authorId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "author_userId_key" ON "author"("userId");

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "author"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
