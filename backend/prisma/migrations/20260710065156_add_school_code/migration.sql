/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `School` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `School` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_examId_fkey";

-- AlterTable
ALTER TABLE "School" ADD COLUMN     "code" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Result_examId_idx" ON "Result"("examId");

-- CreateIndex
CREATE INDEX "Result_studentId_idx" ON "Result"("studentId");

-- CreateIndex
CREATE INDEX "Result_subjectId_idx" ON "Result"("subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "School_code_key" ON "School"("code");

-- CreateIndex
CREATE INDEX "Timetable_schoolId_idx" ON "Timetable"("schoolId");

-- CreateIndex
CREATE INDEX "Timetable_classId_idx" ON "Timetable"("classId");

-- CreateIndex
CREATE INDEX "Timetable_subjectId_idx" ON "Timetable"("subjectId");

-- CreateIndex
CREATE INDEX "Timetable_teacherId_idx" ON "Timetable"("teacherId");

-- AddForeignKey
ALTER TABLE "Timetable" ADD CONSTRAINT "Timetable_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Timetable" ADD CONSTRAINT "Timetable_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Timetable" ADD CONSTRAINT "Timetable_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
