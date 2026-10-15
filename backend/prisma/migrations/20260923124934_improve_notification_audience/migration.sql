/*
  Warnings:

  - You are about to drop the column `classId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `scope` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `sectionId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Notification` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "NotificationTargetType" AS ENUM ('GLOBAL', 'SCHOOL', 'ROLE', 'CLASS', 'SECTION', 'USER', 'STUDENT');

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_classId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- DropForeignKey
ALTER TABLE "NotificationRead" DROP CONSTRAINT "NotificationRead_notificationId_fkey";

-- DropIndex
DROP INDEX "Notification_classId_idx";

-- DropIndex
DROP INDEX "Notification_scope_idx";

-- DropIndex
DROP INDEX "Notification_sectionId_idx";

-- DropIndex
DROP INDEX "Notification_studentId_idx";

-- DropIndex
DROP INDEX "Notification_userId_idx";

-- DropIndex
DROP INDEX "User_lockedUntil_idx";

-- AlterTable
ALTER TABLE "Fee" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "paidAmount" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "LibraryIssue" ALTER COLUMN "fineAmount" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "classId",
DROP COLUMN "scope",
DROP COLUMN "sectionId",
DROP COLUMN "studentId",
DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Result" ALTER COLUMN "marks" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "totalMarks" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "Subscription" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "discount" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "finalAmount" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "tax" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "SubscriptionPlan" ALTER COLUMN "price" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "lockedUntil" SET DATA TYPE TIMESTAMP(3);

-- DropEnum
DROP TYPE "NotificationScope";

-- CreateTable
CREATE TABLE "NotificationAudience" (
    "id" TEXT NOT NULL,
    "notificationId" TEXT NOT NULL,
    "targetType" "NotificationTargetType" NOT NULL,
    "schoolId" TEXT,
    "role" "RoleEnum",
    "classId" TEXT,
    "sectionId" TEXT,
    "userId" TEXT,
    "studentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotificationAudience_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "NotificationAudience_notificationId_idx" ON "NotificationAudience"("notificationId");

-- CreateIndex
CREATE INDEX "NotificationAudience_targetType_idx" ON "NotificationAudience"("targetType");

-- CreateIndex
CREATE INDEX "NotificationAudience_schoolId_idx" ON "NotificationAudience"("schoolId");

-- CreateIndex
CREATE INDEX "NotificationAudience_role_idx" ON "NotificationAudience"("role");

-- CreateIndex
CREATE INDEX "NotificationAudience_classId_idx" ON "NotificationAudience"("classId");

-- CreateIndex
CREATE INDEX "NotificationAudience_sectionId_idx" ON "NotificationAudience"("sectionId");

-- CreateIndex
CREATE INDEX "NotificationAudience_userId_idx" ON "NotificationAudience"("userId");

-- CreateIndex
CREATE INDEX "NotificationAudience_studentId_idx" ON "NotificationAudience"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationAudience_notificationId_targetType_schoolId_rol_key" ON "NotificationAudience"("notificationId", "targetType", "schoolId", "role", "classId", "sectionId", "userId", "studentId");

-- CreateIndex
CREATE INDEX "Attendance_schoolId_academicYearId_attendanceDate_idx" ON "Attendance"("schoolId", "academicYearId", "attendanceDate");

-- CreateIndex
CREATE INDEX "Exam_schoolId_academicYearId_startDate_idx" ON "Exam"("schoolId", "academicYearId", "startDate");

-- CreateIndex
CREATE INDEX "Notification_status_idx" ON "Notification"("status");

-- CreateIndex
CREATE INDEX "Notification_scheduledAt_idx" ON "Notification"("scheduledAt");

-- CreateIndex
CREATE INDEX "Notification_expiresAt_idx" ON "Notification"("expiresAt");

-- CreateIndex
CREATE INDEX "Notification_schoolId_status_idx" ON "Notification"("schoolId", "status");

-- CreateIndex
CREATE INDEX "Notification_schoolId_createdAt_idx" ON "Notification"("schoolId", "createdAt");

-- CreateIndex
CREATE INDEX "NotificationRead_notificationId_idx" ON "NotificationRead"("notificationId");

-- CreateIndex
CREATE INDEX "RefreshToken_schoolId_idx" ON "RefreshToken"("schoolId");

-- CreateIndex
CREATE INDEX "Result_schoolId_academicYearId_studentId_idx" ON "Result"("schoolId", "academicYearId", "studentId");

-- CreateIndex
CREATE INDEX "Student_schoolId_admissionNo_idx" ON "Student"("schoolId", "admissionNo");

-- CreateIndex
CREATE INDEX "Student_schoolId_deletedAt_idx" ON "Student"("schoolId", "deletedAt");

-- CreateIndex
CREATE INDEX "Subscription_schoolId_idx" ON "Subscription"("schoolId");

-- CreateIndex
CREATE INDEX "Timetable_schoolId_academicYearId_classId_idx" ON "Timetable"("schoolId", "academicYearId", "classId");

-- AddForeignKey
ALTER TABLE "NotificationAudience" ADD CONSTRAINT "NotificationAudience_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationAudience" ADD CONSTRAINT "NotificationAudience_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationAudience" ADD CONSTRAINT "NotificationAudience_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationAudience" ADD CONSTRAINT "NotificationAudience_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationAudience" ADD CONSTRAINT "NotificationAudience_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationAudience" ADD CONSTRAINT "NotificationAudience_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationRead" ADD CONSTRAINT "NotificationRead_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;
