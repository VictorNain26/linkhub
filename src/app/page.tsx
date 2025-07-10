import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Link as LinkIcon, Zap, Shield } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Bienvenue sur LinkHub
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Créez et gérez vos liens courts en toute simplicité. Partagez, suivez et optimisez vos liens.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/login">
                Commencer
                <ArrowRight className="ml-2 size-5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center space-y-4">
              <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <LinkIcon className="size-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Liens courts personnalisés</h3>
              <p className="text-muted-foreground">
                Créez des liens courts avec des slugs personnalisés pour une meilleure mémorisation.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center space-y-4">
              <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Zap className="size-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Suivi en temps réel</h3>
              <p className="text-muted-foreground">
                Analysez les performances de vos liens avec des statistiques en temps réel.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center space-y-4">
              <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Shield className="size-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Multi-tenant</h3>
              <p className="text-muted-foreground">
                Gérez plusieurs espaces de travail avec différents niveaux d'accès.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <Card className="border-0 shadow-xl bg-gradient-to-r from-primary/5 to-primary/10">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">Prêt à simplifier vos liens ?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Rejoignez des milliers d'utilisateurs qui font confiance à LinkHub.
              </p>
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/login">
                  Créer mon espace
                  <ArrowRight className="ml-2 size-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
