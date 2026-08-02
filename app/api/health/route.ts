import { NextResponse } from "next/server";

import { isBrandCleared, isCatalogReleased } from "@/lib/isandre/release";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    {
      brand: isBrandCleared() ? "cleared" : "gated",
      catalog: isCatalogReleased() ? "released" : "gated",
      service: "isandre-taqa",
      status: "ok",
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
