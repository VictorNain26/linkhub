ALTER TABLE "Tenant" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User"   ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_tenant
  ON "Tenant"
  USING (id = current_setting('app.tenant_id')::text);

CREATE POLICY tenant_isolation_user
  ON "User"
  USING (tenant_id = current_setting('app.tenant_id')::text);
