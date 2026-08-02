import { NextResponse, type NextRequest } from "next/server";
import { canonicalOriginForLegacyHost } from "@/lib/isandre/legacy-origin";

export function proxy(request: NextRequest) {
  const canonicalOrigin = canonicalOriginForLegacyHost(
    request.headers.get("x-forwarded-host") ?? request.headers.get("host"),
  );
  if (canonicalOrigin) {
    return NextResponse.redirect(
      new URL(`${request.nextUrl.pathname}${request.nextUrl.search}`, canonicalOrigin),
      308,
    );
  }

  const pathname = request.nextUrl.pathname;
  const explicitLocale =
    pathname === "/fr" || pathname.startsWith("/fr/") ? "fr" : "en";

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-isandre-locale", explicitLocale);

  const savedMarket = request.cookies.get("isandre-market")?.value;
  const detectedCountry =
    savedMarket ??
    request.headers.get("cf-ipcountry") ??
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("x-country-code");

  if (detectedCountry) {
    requestHeaders.set("x-isandre-country", detectedCountry.toUpperCase());
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
    "/robots.txt",
    "/sitemap.xml",
  ],
};
