import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

export async function GET(
  _req: NextRequest,
  ctx: { params: { tenant: string; slug: string } },
) {
  const { tenant, slug } = await ctx.params;

  const link = await prisma.link.findFirst({
    where: { slug, tenant: { slug: tenant } },
    select: { id: true, url: true },
  });

  if (!link) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  prisma.link
    .update({ where: { id: link.id }, data: { clicks: { increment: 1 } } })
    .catch(console.error);

  await pusherServer.trigger(`tenant-${tenant}`, "click", {
    linkId: link.id,
  });

  return NextResponse.redirect(link.url, 302);
}
