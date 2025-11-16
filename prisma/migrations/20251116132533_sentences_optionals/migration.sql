-- AlterTable
ALTER TABLE "answer" ALTER COLUMN "authorId" DROP NOT NULL,
ALTER COLUMN "questionId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "event" ALTER COLUMN "authorId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "question" ALTER COLUMN "authorId" DROP NOT NULL,
ALTER COLUMN "eventId" DROP NOT NULL;
