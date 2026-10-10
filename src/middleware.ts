import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";
import { guestOnlyRoutes, protectedRoutes } from "@/lib/config";

const matches = (routes: string[], pathname: string) =>
  routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = await getToken({ req: request });

  if (!token && matches(protectedRoutes, pathname)) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", pathname + search);
    return NextResponse.redirect(url);
  }

  if (token && matches(guestOnlyRoutes, pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/cart/:path*",
    "/checkout/:path*",
    "/wishlist/:path*",
    "/allorders/:path*",
    "/profile/:path*",
    "/login",
    "/register",
    "/forgot-password",
  ],
};
