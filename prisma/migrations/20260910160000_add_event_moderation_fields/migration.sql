-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "event"
ADD COLUMN "date" TIMESTAMP(3),
ADD COLUMN "location" TEXT,
ADD COLUMN "status" "EventStatus" NOT NULL DEFAULT 'PENDING';
