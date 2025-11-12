/*
  Warnings:

  - Added the required column `colaborators` to the `event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "event" ADD COLUMN     "colaborators" TEXT NOT NULL,
ADD COLUMN     "time" TEXT NOT NULL;
