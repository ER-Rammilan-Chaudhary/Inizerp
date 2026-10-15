-- CreateEnum
CREATE TYPE "HomeworkSubmissionStatus" AS ENUM ('SUBMITTED', 'LATE', 'GRADED', 'RETURNED');

-- CreateTable
CREATE TABLE "HomeworkSubmission" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "homeworkId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "HomeworkSubmissionStatus" NOT NULL DEFAULT 'SUBMITTED',
    "attachmentId" TEXT,
    "content" TEXT,
    "marks" DOUBLE PRECISION,
    "remarks" TEXT,
    "gradedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "HomeworkSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HomeworkSubmission_schoolId_homeworkId_idx" ON "HomeworkSubmission"("schoolId", "homeworkId");

-- CreateIndex
CREATE INDEX "HomeworkSubmission_schoolId_studentId_idx" ON "HomeworkSubmission"("schoolId", "studentId");

-- CreateIndex
CREATE INDEX "HomeworkSubmission_schoolId_status_idx" ON "HomeworkSubmission"("schoolId", "status");

-- CreateIndex
CREATE INDEX "HomeworkSubmission_schoolId_submittedAt_idx" ON "HomeworkSubmission"("schoolId", "submittedAt");

-- CreateIndex
CREATE INDEX "HomeworkSubmission_schoolId_deletedAt_idx" ON "HomeworkSubmission"("schoolId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "HomeworkSubmission_schoolId_homeworkId_studentId_key" ON "HomeworkSubmission"("schoolId", "homeworkId", "studentId");

-- AddForeignKey
ALTER TABLE "HomeworkSubmission" ADD CONSTRAINT "HomeworkSubmission_homeworkId_fkey" FOREIGN KEY ("homeworkId") REFERENCES "Homework"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomeworkSubmission" ADD CONSTRAINT "HomeworkSubmission_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
