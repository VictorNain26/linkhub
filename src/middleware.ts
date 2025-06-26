import { auth } from "@/auth";
import { NextResponse, type NextRequest } from "next/server";

export const config = {
  matcher: ["/dashboard/:path*"],
};

export async function middleware(req: NextRequest) {
  const session = await auth();

  if (!session) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
