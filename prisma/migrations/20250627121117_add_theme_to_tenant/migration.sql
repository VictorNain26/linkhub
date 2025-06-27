/*
  Warnings :

  - You are about to drop the column `bgColor` on the `Tenant` table.
  - You are about to drop the column `primaryColor` on the `Tenant` table.
    All the data in the column will be lost.
*/

-- Tenant : on sécurise les DROP pour qu’ils passent même si les colonnes
-- n’existent pas encore (base fraîche).
-- Invite : on laisse la modification du default inchangée.

-- AlterTable Invite
ALTER TABLE "Invite"
  ALTER COLUMN "expiresAt"
  SET DEFAULT now() + interval '30 days';

-- AlterTable Tenant
ALTER TABLE "Tenant"
  DROP COLUMN IF EXISTS "bgColor",
  DROP COLUMN IF EXISTS "primaryColor",
  ADD COLUMN "theme" JSONB;
