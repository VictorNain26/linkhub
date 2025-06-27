import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { pusherServer } from '@/lib/pusher';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ tenant: string; slug: string }> },
) {
  const { tenant, slug } = await params;

  const link = await prisma.link.findFirst({
    where: { slug, tenant: { slug: tenant } },
    select: { id: true, url: true },
  });
  if (!link)
    return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Ignore les préchargements (Next / Chrome)
  const isPrefetch =
    req.headers.get('purpose') === 'prefetch' ||
    req.headers.get('next-router-prefetch') === '1';

  if (!isPrefetch) {
    // 1) incrément
    prisma.link
      .update({ where: { id: link.id }, data: { clicks: { increment: 1 } } })
      .catch(console.error);

    // 2) temps réel
    await pusherServer.trigger(`tenant-${tenant}`, 'click', { linkId: link.id });
  }

  return NextResponse.redirect(link.url, 302);
}
