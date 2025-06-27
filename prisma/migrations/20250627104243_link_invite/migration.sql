/*
  Warnings:

  - You are about to drop the column `acceptedAt` on the `Invite` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Invite` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Invite_tenantId_email_key";

-- AlterTable
ALTER TABLE "Invite" DROP COLUMN "acceptedAt",
DROP COLUMN "email",
ADD COLUMN     "maxUses" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "uses" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "expiresAt" SET DEFAULT now() + interval '30 days';
