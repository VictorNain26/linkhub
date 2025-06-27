/*
  Warnings:

  - A unique constraint covering the columns `[tenantId,slug]` on the table `Link` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Link_slug_key";

-- CreateIndex
CREATE UNIQUE INDEX "Link_tenantId_slug_key" ON "Link"("tenantId", "slug");
