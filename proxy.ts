import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const explicitLocale =
    pathname === "/fr" || pathname.startsWith("/fr/") ? "fr" : "en";
  const savedLocale = request.cookies.get("viaire-locale")?.value;
  const acceptedFrench = request.headers
    .get("accept-language")
    ?.toLowerCase()
    .split(",")
    .some((entry) => {
      const language = entry.trim().split(";")[0];
      return language === "fr" || language.startsWith("fr-");
    });
  const userAgent = request.headers.get("user-agent") ?? "";
  const isCrawler = /bot|crawler|spider|slurp|bingpreview/i.test(userAgent);

  if (
    pathname === "/" &&
    !savedLocale &&
    acceptedFrench &&
    !isCrawler
  ) {
    const destination = request.nextUrl.clone();
    destination.pathname = "/fr";
    const response = NextResponse.redirect(destination);
    response.cookies.set("viaire-locale", "fr", {
      maxAge: 31_536_000,
      path: "/",
      sameSite: "lax",
    });
    return response;
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-viaire-locale", explicitLocale);

  const savedMarket = request.cookies.get("viaire-market")?.value;
  const detectedCountry =
    savedMarket ??
    request.headers.get("cf-ipcountry") ??
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("x-country-code");

  if (detectedCountry) {
    requestHeaders.set("x-viaire-country", detectedCountry.toUpperCase());
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
