/*
  Warnings:

  - A unique constraint covering the columns `[ownerId]` on the table `schools` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "schools_ownerId_key" ON "schools"("ownerId");

-- CreateIndex
CREATE INDEX "schools_ownerId_idx" ON "schools"("ownerId");

-- AddForeignKey
ALTER TABLE "schools" ADD CONSTRAINT "schools_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
