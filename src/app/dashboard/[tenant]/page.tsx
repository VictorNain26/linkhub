import { getTenantContext } from '@/lib/tenant';
import prisma from '@/lib/prisma';
import LinkForm from '../LinkForm';
import LinkRow from '../LinkRow';
import { LiveHitsProvider } from '../LiveHitsContext';
import LiveTotalClicks from '../LiveTotalClicks';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Link as LinkIcon, BarChart3 } from 'lucide-react';

export default async function TenantDashboard({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const ctx = await getTenantContext(slug);
  const { current: tenant, role } = ctx;

  const links = await prisma.link.findMany({
    where: { tenantId: tenant.id },
    orderBy: { createdAt: 'desc' },
  });

  const initialHits = Object.fromEntries(links.map((l) => [l.id, l.clicks]));
  const canEdit = role !== 'USER';
  const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);

  return (
    <LiveHitsProvider tenantSlug={tenant.slug} initial={initialHits}>
      <main className="container mx-auto p-6 space-y-8 max-w-6xl">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total des liens</p>
                  <p className="text-2xl font-bold">{links.length}</p>
                </div>
                <LinkIcon className="size-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total des clics</p>
                  <p className="text-2xl font-bold">{totalClicks}</p>
                </div>
                <BarChart3 className="size-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Clics en temps réel</p>
                  <div className="text-2xl font-bold">
                    <LiveTotalClicks />
                  </div>
                </div>
                <Activity className="size-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire de création */}
          {canEdit && (
            <div className="lg:col-span-1">
              <LinkForm tenantSlug={tenant.slug} />
            </div>
          )}

          {/* Liste des liens */}
          <div className={canEdit ? "lg:col-span-2" : "lg:col-span-3"}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Liens ({links.length})</span>
                  <Badge variant="secondary">{role}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {links.length ? (
                  <div className="space-y-4">
                    {links.map((l) => (
                      <LinkRow
                        key={l.id}
                        link={l}
                        tenantSlug={tenant.slug}
                        canEdit={canEdit}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <LinkIcon className="size-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground text-lg font-medium">Aucun lien pour le moment</p>
                    {canEdit && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Créez votre premier lien avec le formulaire ci-contre
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </LiveHitsProvider>
  );
}
