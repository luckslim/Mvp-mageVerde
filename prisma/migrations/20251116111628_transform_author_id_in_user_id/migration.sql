/*
  Warnings:

  - You are about to drop the column `authorId` on the `author` table. All the data in the column will be lost.
  - Added the required column `userId` to the `author` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "author" DROP COLUMN "authorId",
ADD COLUMN     "userId" TEXT NOT NULL;
