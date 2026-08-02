import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
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
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
