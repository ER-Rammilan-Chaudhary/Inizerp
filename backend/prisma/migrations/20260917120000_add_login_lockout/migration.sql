-- Add login lockout state to users
ALTER TABLE "User"
ADD COLUMN "failedLogins" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "lockedUntil" TIMESTAMP(10);

CREATE INDEX "User_lockedUntil_idx" ON "User"("lockedUntil");
