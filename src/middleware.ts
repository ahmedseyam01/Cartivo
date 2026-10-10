import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";
import { guestOnlyRoutes, protectedRoutes } from "@/lib/config";
import { defaultLocale, isLocale, LOCALE_COOKIE, type Locale } from "@/i18n/config";

const ONE_YEAR = 60 * 60 * 24 * 365;

const matches = (routes: string[], pathname: string) =>
  routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

function detectLocale(request: NextRequest): Locale {
  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(saved)) return saved;
  return /^ar\b/i.test(request.headers.get("accept-language") ?? "") ? "ar" : defaultLocale;
}

/**
 * URLs stay language-free (/products). The locale comes from a cookie and the request is
 * rewritten internally to /[locale]/products, so both languages are statically cached.
 */
export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // /ar/products → remember Arabic, then show /products.
  const [, prefix] = pathname.split("/");
  if (isLocale(prefix)) {
    const url = new URL(pathname.slice(prefix.length + 1) || "/", request.url);
    url.search = search;
    const response = NextResponse.redirect(url);
    response.cookies.set(LOCALE_COOKIE, prefix, { path: "/", maxAge: ONE_YEAR });
    return response;
  }

  const isProtected = matches(protectedRoutes, pathname);
  const isGuestOnly = matches(guestOnlyRoutes, pathname);

  if (isProtected || isGuestOnly) {
    const token = await getToken({ req: request });
    if (!token && isProtected) {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", pathname + search);
      return NextResponse.redirect(url);
    }
    if (token && isGuestOnly) return NextResponse.redirect(new URL("/", request.url));
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${detectLocale(request)}${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Everything except API routes, Next internals and files with an extension.
  matcher: ["/((?!api|_next|apple-icon|.*\\..*).*)"],
};
