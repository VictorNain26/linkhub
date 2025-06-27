import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { pusherServer } from '@/lib/pusher';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ tenant: string; slug: string }> },
) {
  /* 1 — on résout la promesse */
  const { tenant, slug } = await params;

  /* 2 — on cherche le lien */
  const link = await prisma.link.findFirst({
    where: { slug, tenant: { slug: tenant } },
    select: { id: true, url: true },
  });

  if (!link) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  /* 3 — +1 clic (fire-and-forget) */
  prisma.link
    .update({ where: { id: link.id }, data: { clicks: { increment: 1 } } })
    .catch(console.error);

  /* 4 — push temps réel */
  await pusherServer.trigger(`tenant-${tenant}`, 'click', { linkId: link.id });

  /* 5 — redirection */
  return NextResponse.redirect(link.url, 302);
}
