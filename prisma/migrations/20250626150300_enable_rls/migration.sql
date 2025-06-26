/* ────────────────────────────────────────────────────────────────
   Row-Level-Security pour l’isolation multitenant
   ──────────────────────────────────────────────────────────────── */

/* 1. Activer le RLS sur les deux tables concernées */
ALTER TABLE "Tenant" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User"   ENABLE ROW LEVEL SECURITY;

/* 2. (Re)créer les politiques — on les DROP d’abord pour que
      la migration soit idempotente en dev / CI */
DROP POLICY IF EXISTS tenant_isolation_tenant ON "Tenant";
CREATE POLICY tenant_isolation_tenant
    ON "Tenant"
    USING (id = current_setting('app.tenant_id'));          -- id est un CUID (text)

/* Même idée pour la table User, mais sur la colonne tenantId */
DROP POLICY IF EXISTS tenant_isolation_user ON "User";
CREATE POLICY tenant_isolation_user
    ON "User"
    USING ("tenantId" = current_setting('app.tenant_id'));

/* 3. (Facultatif) – on peut aussi prohiber l’accès par défaut
      en empêchant toute requête sans politique correspondante   */
ALTER TABLE "Tenant" FORCE ROW LEVEL SECURITY;
ALTER TABLE "User"   FORCE ROW LEVEL SECURITY;
