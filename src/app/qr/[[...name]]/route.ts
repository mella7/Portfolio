import type { NextRequest } from "next/server";
import { handleShortLink } from "@/lib/short-links";

// mella7.me/qr and mella7.me/qr/<name> - for printed QR codes.
// See src/lib/short-links.ts and src/data/short-links.ts.

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export function GET(
  request: NextRequest,
  { params }: { params: { name?: string[] } }
) {
  return handleShortLink(request, "qr", params.name);
}
