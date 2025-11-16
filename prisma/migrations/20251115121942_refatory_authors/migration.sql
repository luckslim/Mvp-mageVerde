/*
  Warnings:

  - You are about to drop the column `adminId` on the `author` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `author` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `author` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "author" DROP CONSTRAINT "author_adminId_fkey";

-- DropForeignKey
ALTER TABLE "author" DROP CONSTRAINT "author_userId_fkey";

-- AlterTable
ALTER TABLE "author" DROP COLUMN "adminId",
DROP COLUMN "userId",
ADD COLUMN     "authorId" TEXT NOT NULL;
