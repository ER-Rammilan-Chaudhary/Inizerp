-- School ERP architecture foundation. Tenant key is intentionally scalar on child tables.

-- PostgreSQL enum types used by the new domain models.
DO $$ BEGIN CREATE TYPE "EnrollmentStatus" AS ENUM ('ACTIVE','COMPLETED','WITHDRAWN','TRANSFERRED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "StaffStatus" AS ENUM ('ACTIVE','INACTIVE','SUSPENDED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "AdmissionStatus" AS ENUM ('PENDING','UNDER_REVIEW','APPROVED','REJECTED','ENROLLED','CANCELLED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "LeaveStatus" AS ENUM ('PENDING','APPROVED','REJECTED','CANCELLED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "HomeworkStatus" AS ENUM ('DRAFT','PUBLISHED','CLOSED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT','ISSUED','PARTIAL','PAID','OVERDUE','CANCELLED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "PaymentMethod" AS ENUM ('CASH','CARD','UPI','BANK_TRANSFER','CHEQUE','ONLINE'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "PaymentStatus" AS ENUM ('CAPTURED','REVERSED','CANCELLED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "ExpenseStatus" AS ENUM ('RECORDED','REVERSED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "PayrollStatus" AS ENUM ('DRAFT','PROCESSED','PAID','CANCELLED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "LibraryIssueStatus" AS ENUM ('ISSUED','RETURNED','OVERDUE','LOST'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "AssignmentStatus" AS ENUM ('ACTIVE','INACTIVE'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "InventoryStatus" AS ENUM ('ACTIVE','INACTIVE'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "InventoryTransactionType" AS ENUM ('PURCHASE','ISSUE','RETURN','ADJUSTMENT','TRANSFER'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "CommunicationChannel" AS ENUM ('EMAIL','SMS','PUSH','WHATSAPP'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "CommunicationStatus" AS ENUM ('DRAFT','SCHEDULED','SENT','FAILED','CANCELLED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "failedLogins" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "lockedUntil" TIMESTAMP(3);
ALTER TABLE "RefreshToken" ADD COLUMN IF NOT EXISTS "schoolId" TEXT;
ALTER TABLE "AuditLog" ADD COLUMN IF NOT EXISTS "beforeData" JSONB;
ALTER TABLE "AuditLog" ADD COLUMN IF NOT EXISTS "afterData" JSONB;
ALTER TABLE "Attendance" ADD COLUMN IF NOT EXISTS "academicYearId" TEXT;
ALTER TABLE "Exam" ADD COLUMN IF NOT EXISTS "academicYearId" TEXT;
ALTER TABLE "Result" ADD COLUMN IF NOT EXISTS "academicYearId" TEXT;
ALTER TABLE "Timetable" ADD COLUMN IF NOT EXISTS "academicYearId" TEXT;
ALTER TABLE "Fee" ADD COLUMN IF NOT EXISTS "academicYearId" TEXT;
ALTER TABLE "Student" ADD COLUMN IF NOT EXISTS "guardianId" TEXT;
ALTER TABLE "Student" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);
ALTER TABLE "Student" ADD COLUMN IF NOT EXISTS "isDeleted" BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS "AcademicYear" (
  "id" TEXT NOT NULL,
  "schoolId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "startDate" TIMESTAMP(3) NOT NULL,
  "endDate" TIMESTAMP(3) NOT NULL,
  "isCurrent" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "deletedAt" TIMESTAMP(3),
  "isDeleted" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AcademicYear_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "AcademicYear_schoolId_code_key" ON "AcademicYear"("schoolId","code");
CREATE INDEX IF NOT EXISTS "AcademicYear_schoolId_isCurrent_idx" ON "AcademicYear"("schoolId","isCurrent");
CREATE INDEX IF NOT EXISTS "AcademicYear_schoolId_startDate_endDate_idx" ON "AcademicYear"("schoolId","startDate","endDate");
CREATE INDEX IF NOT EXISTS "AcademicYear_schoolId_deletedAt_idx" ON "AcademicYear"("schoolId","deletedAt");

CREATE TABLE IF NOT EXISTS "Enrollment" (
  "id" TEXT NOT NULL,
  "schoolId" TEXT NOT NULL,
  "academicYearId" TEXT NOT NULL,
  "studentId" TEXT NOT NULL,
  "classId" TEXT NOT NULL,
  "sectionId" TEXT,
  "rollNo" TEXT,
  "status" "EnrollmentStatus" NOT NULL DEFAULT 'ACTIVE',
  "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "withdrawnAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "deletedAt" TIMESTAMP(3),
  "isDeleted" BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Enrollment_schoolId_academicYearId_studentId_key" ON "Enrollment"("schoolId","academicYearId","studentId");
CREATE INDEX IF NOT EXISTS "Enrollment_schoolId_academicYearId_classId_idx" ON "Enrollment"("schoolId","academicYearId","classId");
CREATE INDEX IF NOT EXISTS "Enrollment_schoolId_academicYearId_sectionId_idx" ON "Enrollment"("schoolId","academicYearId","sectionId");
CREATE INDEX IF NOT EXISTS "Enrollment_schoolId_studentId_idx" ON "Enrollment"("schoolId","studentId");
CREATE INDEX IF NOT EXISTS "Enrollment_schoolId_deletedAt_idx" ON "Enrollment"("schoolId","deletedAt");

CREATE TABLE IF NOT EXISTS "Staff" (
  "id" TEXT NOT NULL,"schoolId" TEXT NOT NULL,"userId" TEXT,"employeeId" TEXT NOT NULL,"fullName" TEXT NOT NULL,"designation" TEXT,"department" TEXT,"phone" TEXT,"email" TEXT,"joiningDate" TIMESTAMP(3),"salary" DECIMAL(12,2),"status" "StaffStatus" NOT NULL DEFAULT 'ACTIVE',"address" TEXT,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,"deletedAt" TIMESTAMP(3),"isDeleted" BOOLEAN NOT NULL DEFAULT false,CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Staff_schoolId_employeeId_key" ON "Staff"("schoolId","employeeId");
CREATE UNIQUE INDEX IF NOT EXISTS "Staff_userId_key" ON "Staff"("userId");
CREATE INDEX IF NOT EXISTS "Staff_schoolId_designation_idx" ON "Staff"("schoolId","designation");
CREATE INDEX IF NOT EXISTS "Staff_schoolId_deletedAt_idx" ON "Staff"("schoolId","deletedAt");

CREATE TABLE IF NOT EXISTS "Guardian" (
  "id" TEXT NOT NULL,"schoolId" TEXT NOT NULL,"userId" TEXT,"fullName" TEXT NOT NULL,"relationship" TEXT,"phone" TEXT,"email" TEXT,"occupation" TEXT,"address" TEXT,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,"deletedAt" TIMESTAMP(3),"isDeleted" BOOLEAN NOT NULL DEFAULT false,CONSTRAINT "Guardian_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Guardian_userId_key" ON "Guardian"("userId");
CREATE INDEX IF NOT EXISTS "Guardian_schoolId_phone_idx" ON "Guardian"("schoolId","phone");
CREATE INDEX IF NOT EXISTS "Guardian_schoolId_deletedAt_idx" ON "Guardian"("schoolId","deletedAt");

CREATE TABLE IF NOT EXISTS "Admission" (
  "id" TEXT NOT NULL,"schoolId" TEXT NOT NULL,"academicYearId" TEXT NOT NULL,"applicationNo" TEXT NOT NULL,"studentName" TEXT NOT NULL,"appliedClassId" TEXT,"guardianName" TEXT,"guardianPhone" TEXT,"status" "AdmissionStatus" NOT NULL DEFAULT 'PENDING',"submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"reviewedAt" TIMESTAMP(3),"reviewedById" TEXT,"remarks" TEXT,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,"deletedAt" TIMESTAMP(3),"isDeleted" BOOLEAN NOT NULL DEFAULT false,CONSTRAINT "Admission_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Admission_schoolId_applicationNo_key" ON "Admission"("schoolId","applicationNo");
CREATE INDEX IF NOT EXISTS "Admission_schoolId_academicYearId_status_idx" ON "Admission"("schoolId","academicYearId","status");
CREATE INDEX IF NOT EXISTS "Admission_schoolId_deletedAt_idx" ON "Admission"("schoolId","deletedAt");

CREATE TABLE IF NOT EXISTS "LeaveRequest" (
  "id" TEXT NOT NULL,"schoolId" TEXT NOT NULL,"academicYearId" TEXT,"applicantUserId" TEXT NOT NULL,"leaveType" TEXT NOT NULL,"startDate" TIMESTAMP(3) NOT NULL,"endDate" TIMESTAMP(3) NOT NULL,"reason" TEXT,"status" "LeaveStatus" NOT NULL DEFAULT 'PENDING',"approvedById" TEXT,"approvedAt" TIMESTAMP(3),"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,"cancelledAt" TIMESTAMP(3),CONSTRAINT "LeaveRequest_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "LeaveRequest_schoolId_applicantUserId_startDate_idx" ON "LeaveRequest"("schoolId","applicantUserId","startDate");
CREATE INDEX IF NOT EXISTS "LeaveRequest_schoolId_status_idx" ON "LeaveRequest"("schoolId","status");

CREATE TABLE IF NOT EXISTS "Homework" (
  "id" TEXT NOT NULL,"schoolId" TEXT NOT NULL,"academicYearId" TEXT,"classId" TEXT NOT NULL,"sectionId" TEXT,"subjectId" TEXT NOT NULL,"teacherId" TEXT,"title" TEXT NOT NULL,"description" TEXT,"assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"dueDate" TIMESTAMP(3) NOT NULL,"attachmentId" TEXT,"status" "HomeworkStatus" NOT NULL DEFAULT 'PUBLISHED',"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,"deletedAt" TIMESTAMP(3),"isDeleted" BOOLEAN NOT NULL DEFAULT false,CONSTRAINT "Homework_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "Homework_schoolId_academicYearId_classId_idx" ON "Homework"("schoolId","academicYearId","classId");
CREATE INDEX IF NOT EXISTS "Homework_schoolId_subjectId_dueDate_idx" ON "Homework"("schoolId","subjectId","dueDate");
CREATE INDEX IF NOT EXISTS "Homework_schoolId_deletedAt_idx" ON "Homework"("schoolId","deletedAt");

CREATE TABLE IF NOT EXISTS "Mark" (
  "id" TEXT NOT NULL,"schoolId" TEXT NOT NULL,"academicYearId" TEXT NOT NULL,"examId" TEXT NOT NULL,"studentId" TEXT NOT NULL,"subjectId" TEXT NOT NULL,"obtainedMarks" DECIMAL(12,2) NOT NULL,"maxMarks" DECIMAL(12,2) NOT NULL,"grade" TEXT,"remarks" TEXT,"enteredById" TEXT,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,CONSTRAINT "Mark_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Mark_schoolId_examId_studentId_subjectId_key" ON "Mark"("schoolId","examId","studentId","subjectId");
CREATE INDEX IF NOT EXISTS "Mark_schoolId_academicYearId_studentId_idx" ON "Mark"("schoolId","academicYearId","studentId");
CREATE INDEX IF NOT EXISTS "Mark_schoolId_examId_subjectId_idx" ON "Mark"("schoolId","examId","subjectId");

CREATE TABLE IF NOT EXISTS "Invoice" (
  "id" TEXT NOT NULL,"schoolId" TEXT NOT NULL,"academicYearId" TEXT,"studentId" TEXT NOT NULL,"invoiceNo" TEXT NOT NULL,"issueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"dueDate" TIMESTAMP(3) NOT NULL,"subtotal" DECIMAL(12,2) NOT NULL,"discount" DECIMAL(12,2) NOT NULL DEFAULT 0,"tax" DECIMAL(12,2) NOT NULL DEFAULT 0,"total" DECIMAL(12,2) NOT NULL,"status" "InvoiceStatus" NOT NULL DEFAULT 'ISSUED',"cancelledAt" TIMESTAMP(3),"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Invoice_schoolId_invoiceNo_key" ON "Invoice"("schoolId","invoiceNo");
CREATE INDEX IF NOT EXISTS "Invoice_schoolId_academicYearId_studentId_idx" ON "Invoice"("schoolId","academicYearId","studentId");
CREATE INDEX IF NOT EXISTS "Invoice_schoolId_status_dueDate_idx" ON "Invoice"("schoolId","status","dueDate");

CREATE TABLE IF NOT EXISTS "Payment" (
  "id" TEXT NOT NULL,"schoolId" TEXT NOT NULL,"studentId" TEXT,"receiptNo" TEXT NOT NULL,"amount" DECIMAL(12,2) NOT NULL,"paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"method" "PaymentMethod" NOT NULL,"referenceNo" TEXT,"status" "PaymentStatus" NOT NULL DEFAULT 'CAPTURED',"receivedById" TEXT,"reversedAt" TIMESTAMP(3),"reversalReason" TEXT,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Payment_schoolId_receiptNo_key" ON "Payment"("schoolId","receiptNo");
CREATE INDEX IF NOT EXISTS "Payment_schoolId_paymentDate_idx" ON "Payment"("schoolId","paymentDate");
CREATE INDEX IF NOT EXISTS "Payment_schoolId_studentId_idx" ON "Payment"("schoolId","studentId");
CREATE INDEX IF NOT EXISTS "Payment_schoolId_status_idx" ON "Payment"("schoolId","status");

CREATE TABLE IF NOT EXISTS "PaymentAllocation" (
  "id" TEXT NOT NULL,"schoolId" TEXT NOT NULL,"paymentId" TEXT NOT NULL,"invoiceId" TEXT NOT NULL,"amount" DECIMAL(12,2) NOT NULL,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,CONSTRAINT "PaymentAllocation_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "PaymentAllocation_paymentId_invoiceId_key" ON "PaymentAllocation"("paymentId","invoiceId");
CREATE INDEX IF NOT EXISTS "PaymentAllocation_schoolId_invoiceId_idx" ON "PaymentAllocation"("schoolId","invoiceId");
CREATE INDEX IF NOT EXISTS "PaymentAllocation_schoolId_paymentId_idx" ON "PaymentAllocation"("schoolId","paymentId");

CREATE TABLE IF NOT EXISTS "Expense" (
  "id" TEXT NOT NULL,"schoolId" TEXT NOT NULL,"expenseNo" TEXT NOT NULL,"category" TEXT NOT NULL,"amount" DECIMAL(12,2) NOT NULL,"expenseDate" TIMESTAMP(3) NOT NULL,"vendor" TEXT,"paymentMethod" "PaymentMethod","status" "ExpenseStatus" NOT NULL DEFAULT 'RECORDED',"description" TEXT,"createdById" TEXT,"reversedAt" TIMESTAMP(3),"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Expense_schoolId_expenseNo_key" ON "Expense"("schoolId","expenseNo");
CREATE INDEX IF NOT EXISTS "Expense_schoolId_expenseDate_idx" ON "Expense"("schoolId","expenseDate");
CREATE INDEX IF NOT EXISTS "Expense_schoolId_category_idx" ON "Expense"("schoolId","category");

CREATE TABLE IF NOT EXISTS "Payroll" (
  "id" TEXT NOT NULL,"schoolId" TEXT NOT NULL,"employeeId" TEXT NOT NULL,"periodStart" TIMESTAMP(3) NOT NULL,"periodEnd" TIMESTAMP(3) NOT NULL,"grossAmount" DECIMAL(12,2) NOT NULL,"deductions" DECIMAL(12,2) NOT NULL DEFAULT 0,"netAmount" DECIMAL(12,2) NOT NULL,"status" "PayrollStatus" NOT NULL DEFAULT 'DRAFT',"paidAt" TIMESTAMP(3),"processedById" TEXT,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,CONSTRAINT "Payroll_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Payroll_schoolId_employeeId_periodStart_periodEnd_key" ON "Payroll"("schoolId","employeeId","periodStart","periodEnd");
CREATE INDEX IF NOT EXISTS "Payroll_schoolId_periodStart_periodEnd_idx" ON "Payroll"("schoolId","periodStart","periodEnd");
CREATE INDEX IF NOT EXISTS "Payroll_schoolId_status_idx" ON "Payroll"("schoolId","status");

CREATE TABLE IF NOT EXISTS "LibraryBook" (
  "id" TEXT NOT NULL,"schoolId" TEXT NOT NULL,"isbn" TEXT,"accessionNo" TEXT NOT NULL,"title" TEXT NOT NULL,"author" TEXT,"publisher" TEXT,"category" TEXT,"quantity" INTEGER NOT NULL DEFAULT 1,"availableQty" INTEGER NOT NULL DEFAULT 1,"price" DECIMAL(12,2),"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,"deletedAt" TIMESTAMP(3),"isDeleted" BOOLEAN NOT NULL DEFAULT false,CONSTRAINT "LibraryBook_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "LibraryBook_schoolId_accessionNo_key" ON "LibraryBook"("schoolId","accessionNo");
CREATE INDEX IF NOT EXISTS "LibraryBook_schoolId_title_idx" ON "LibraryBook"("schoolId","title");
CREATE INDEX IF NOT EXISTS "LibraryBook_schoolId_deletedAt_idx" ON "LibraryBook"("schoolId","deletedAt");

CREATE TABLE IF NOT EXISTS "LibraryIssue" (
  "id" TEXT NOT NULL,"schoolId" TEXT NOT NULL,"bookId" TEXT NOT NULL,"borrowerId" TEXT NOT NULL,"issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"dueAt" TIMESTAMP(3) NOT NULL,"returnedAt" TIMESTAMP(3),"fineAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,"status" "LibraryIssueStatus" NOT NULL DEFAULT 'ISSUED',"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,CONSTRAINT "LibraryIssue_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "LibraryIssue_schoolId_borrowerId_status_idx" ON "LibraryIssue"("schoolId","borrowerId","status");
CREATE INDEX IF NOT EXISTS "LibraryIssue_schoolId_bookId_status_idx" ON "LibraryIssue"("schoolId","bookId","status");

CREATE TABLE IF NOT EXISTS "TransportRoute" (
  "id" TEXT NOT NULL,"schoolId" TEXT NOT NULL,"name" TEXT NOT NULL,"vehicleNo" TEXT,"driverName" TEXT,"driverPhone" TEXT,"stops" JSONB,"fee" DECIMAL(12,2),"isActive" BOOLEAN NOT NULL DEFAULT true,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,"deletedAt" TIMESTAMP(3),"isDeleted" BOOLEAN NOT NULL DEFAULT false,CONSTRAINT "TransportRoute_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "TransportRoute_schoolId_name_key" ON "TransportRoute"("schoolId","name");
CREATE INDEX IF NOT EXISTS "TransportRoute_schoolId_isActive_idx" ON "TransportRoute"("schoolId","isActive");

CREATE TABLE IF NOT EXISTS "TransportAssignment" (
  "id" TEXT NOT NULL,"schoolId" TEXT NOT NULL,"studentId" TEXT NOT NULL,"routeId" TEXT NOT NULL,"pickupStop" TEXT,"dropStop" TEXT,"startDate" TIMESTAMP(3) NOT NULL,"endDate" TIMESTAMP(3),"fee" DECIMAL(12,2),"status" "AssignmentStatus" NOT NULL DEFAULT 'ACTIVE',"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,CONSTRAINT "TransportAssignment_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "TransportAssignment_schoolId_studentId_status_idx" ON "TransportAssignment"("schoolId","studentId","status");
CREATE INDEX IF NOT EXISTS "TransportAssignment_schoolId_routeId_idx" ON "TransportAssignment"("schoolId","routeId");

CREATE TABLE IF NOT EXISTS "Hostel" (
  "id" TEXT NOT NULL,"schoolId" TEXT NOT NULL,"name" TEXT NOT NULL,"address" TEXT,"wardenName" TEXT,"capacity" INTEGER,"isActive" BOOLEAN NOT NULL DEFAULT true,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,"deletedAt" TIMESTAMP(3),"isDeleted" BOOLEAN NOT NULL DEFAULT false,CONSTRAINT "Hostel_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Hostel_schoolId_name_key" ON "Hostel"("schoolId","name");
CREATE INDEX IF NOT EXISTS "Hostel_schoolId_isActive_idx" ON "Hostel"("schoolId","isActive");

CREATE TABLE IF NOT EXISTS "HostelAllocation" (
  "id" TEXT NOT NULL,"schoolId" TEXT NOT NULL,"hostelId" TEXT NOT NULL,"studentId" TEXT NOT NULL,"roomNo" TEXT,"bedNo" TEXT,"startDate" TIMESTAMP(3) NOT NULL,"endDate" TIMESTAMP(3),"status" "AssignmentStatus" NOT NULL DEFAULT 'ACTIVE',"fee" DECIMAL(12,2),"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,CONSTRAINT "HostelAllocation_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "HostelAllocation_schoolId_studentId_status_idx" ON "HostelAllocation"("schoolId","studentId","status");
CREATE INDEX IF NOT EXISTS "HostelAllocation_schoolId_hostelId_roomNo_idx" ON "HostelAllocation"("schoolId","hostelId","roomNo");

CREATE TABLE IF NOT EXISTS "InventoryItem" (
  "id" TEXT NOT NULL,"schoolId" TEXT NOT NULL,"sku" TEXT NOT NULL,"name" TEXT NOT NULL,"category" TEXT,"unit" TEXT,"quantity" DECIMAL(12,2) NOT NULL,"reorderLevel" DECIMAL(12,2) NOT NULL DEFAULT 0,"unitPrice" DECIMAL(12,2),"status" "InventoryStatus" NOT NULL DEFAULT 'ACTIVE',"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,"deletedAt" TIMESTAMP(3),"isDeleted" BOOLEAN NOT NULL DEFAULT false,CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "InventoryItem_schoolId_sku_key" ON "InventoryItem"("schoolId","sku");
CREATE INDEX IF NOT EXISTS "InventoryItem_schoolId_category_idx" ON "InventoryItem"("schoolId","category");
CREATE INDEX IF NOT EXISTS "InventoryItem_schoolId_status_idx" ON "InventoryItem"("schoolId","status");

CREATE TABLE IF NOT EXISTS "InventoryTransaction" (
  "id" TEXT NOT NULL,"schoolId" TEXT NOT NULL,"itemId" TEXT NOT NULL,"type" "InventoryTransactionType" NOT NULL,"quantity" DECIMAL(12,2) NOT NULL,"unitPrice" DECIMAL(12,2),"referenceNo" TEXT,"remarks" TEXT,"createdById" TEXT,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,CONSTRAINT "InventoryTransaction_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "InventoryTransaction_schoolId_itemId_createdAt_idx" ON "InventoryTransaction"("schoolId","itemId","createdAt");
CREATE INDEX IF NOT EXISTS "InventoryTransaction_schoolId_type_idx" ON "InventoryTransaction"("schoolId","type");

CREATE TABLE IF NOT EXISTS "Communication" (
  "id" TEXT NOT NULL,"schoolId" TEXT NOT NULL,"channel" "CommunicationChannel" NOT NULL,"subject" TEXT,"message" TEXT NOT NULL,"recipientCount" INTEGER NOT NULL DEFAULT 0,"status" "CommunicationStatus" NOT NULL DEFAULT 'DRAFT',"scheduledAt" TIMESTAMP(3),"sentAt" TIMESTAMP(3),"createdById" TEXT,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,"deletedAt" TIMESTAMP(3),"isDeleted" BOOLEAN NOT NULL DEFAULT false,CONSTRAINT "Communication_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "Communication_schoolId_channel_status_idx" ON "Communication"("schoolId","channel","status");
CREATE INDEX IF NOT EXISTS "Communication_schoolId_scheduledAt_idx" ON "Communication"("schoolId","scheduledAt");

CREATE TABLE IF NOT EXISTS "Document" (
  "id" TEXT NOT NULL,"schoolId" TEXT NOT NULL,"entityType" TEXT NOT NULL,"entityId" TEXT NOT NULL,"name" TEXT NOT NULL,"fileId" TEXT,"version" INTEGER NOT NULL DEFAULT 1,"metadata" JSONB,"uploadedById" TEXT,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,"deletedAt" TIMESTAMP(3),"isDeleted" BOOLEAN NOT NULL DEFAULT false,CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "Document_schoolId_entityType_entityId_idx" ON "Document"("schoolId","entityType","entityId");
CREATE INDEX IF NOT EXISTS "Document_schoolId_deletedAt_idx" ON "Document"("schoolId","deletedAt");


-- Migrate the old current-class fields into Enrollment before removing them.
INSERT INTO "AcademicYear" ("id","schoolId","name","code","startDate","endDate","isCurrent","isActive","createdAt","updatedAt")
SELECT md5(s."id" || ':default-academic-year'), s."id",
       COALESCE(NULLIF(s."academicYear", ''), 'Current Academic Year'),
       'DEFAULT-' || substr(s."id",1,8),
       CURRENT_DATE, CURRENT_DATE + INTERVAL '1 year', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "schools" s
WHERE NOT EXISTS (SELECT 1 FROM "AcademicYear" ay WHERE ay."schoolId" = s."id" AND ay."isCurrent" = true);

INSERT INTO "Enrollment" ("id","schoolId","academicYearId","studentId","classId","sectionId","rollNo","status","enrolledAt","createdAt","updatedAt","isDeleted")
SELECT md5(st."id" || ay."id"), st."schoolId", ay."id", st."id", st."classId", st."sectionId", st."rollNo", 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false
FROM "Student" st
JOIN "AcademicYear" ay ON ay."schoolId" = st."schoolId" AND ay."isCurrent" = true
WHERE NOT EXISTS (SELECT 1 FROM "Enrollment" e WHERE e."schoolId" = st."schoolId" AND e."academicYearId" = ay."id" AND e."studentId" = st."id");

DROP INDEX IF EXISTS "Student_classId_idx";
DROP INDEX IF EXISTS "Student_sectionId_idx";
ALTER TABLE "Student" DROP CONSTRAINT IF EXISTS "Student_classId_fkey";
ALTER TABLE "Student" DROP CONSTRAINT IF EXISTS "Student_sectionId_fkey";
ALTER TABLE "Student" DROP COLUMN IF EXISTS "classId";
ALTER TABLE "Student" DROP COLUMN IF EXISTS "sectionId";
