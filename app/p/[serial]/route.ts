import { NextResponse } from "next/server";

import { parsePassportSerial } from "@/lib/passports";

export async function GET(
  request: Request,
  context: { params: Promise<{ serial: string }> },
) {
  const { serial } = await context.params;
  const parsed = parsePassportSerial(serial);

  if (!parsed) {
    return NextResponse.redirect(new URL("/passport", request.url), 302);
  }

  return NextResponse.redirect(
    new URL(`/passport/${encodeURIComponent(parsed.serial)}`, request.url),
    302,
  );
}
