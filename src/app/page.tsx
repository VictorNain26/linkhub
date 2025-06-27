import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center gap-4 p-8 bg-[--background]">
      <Button size="lg">Hello shadcn</Button>

      <Button variant="secondary" asChild>
        <a href="/login">Commencer</a>
      </Button>
    </main>
  );
}
