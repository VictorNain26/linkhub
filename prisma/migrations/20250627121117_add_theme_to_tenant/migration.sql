/*
  Warnings:

  - You are about to drop the column `bgColor` on the `Tenant` table. All the data in the column will be lost.
  - You are about to drop the column `primaryColor` on the `Tenant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Invite" ALTER COLUMN "expiresAt" SET DEFAULT now() + interval '30 days';

-- AlterTable
ALTER TABLE "Tenant"
  DROP COLUMN IF EXISTS "bgColor",
  DROP COLUMN IF EXISTS "primaryColor",
  ADD COLUMN "theme" JSONB;
