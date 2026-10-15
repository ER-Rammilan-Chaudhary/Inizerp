/*
  Warnings:

  - Made the column `academicYearId` on table `Timetable` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Timetable" DROP CONSTRAINT "Timetable_classId_fkey";

-- DropIndex
DROP INDEX "Timetable_classId_day_period_key";

-- DropIndex
DROP INDEX "Timetable_classId_idx";

-- DropIndex
DROP INDEX "Timetable_teacherId_idx";

-- AlterTable
ALTER TABLE "Timetable" ALTER COLUMN "academicYearId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Timetable_schoolId_academicYearId_idx" ON "Timetable"("schoolId", "academicYearId");

-- CreateIndex
CREATE INDEX "Timetable_schoolId_academicYearId_sectionId_idx" ON "Timetable"("schoolId", "academicYearId", "sectionId");

-- CreateIndex
CREATE INDEX "Timetable_schoolId_academicYearId_teacherId_day_idx" ON "Timetable"("schoolId", "academicYearId", "teacherId", "day");

-- CreateIndex
CREATE INDEX "Timetable_schoolId_academicYearId_day_period_idx" ON "Timetable"("schoolId", "academicYearId", "day", "period");

-- AddForeignKey
ALTER TABLE "Timetable" ADD CONSTRAINT "Timetable_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Timetable" ADD CONSTRAINT "Timetable_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;
