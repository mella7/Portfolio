import type { NextRequest } from "next/server";
import { handleShortLink } from "@/lib/short-links";

// mella7.me/go/<name> - for links in applications, emails and slides.
// Use a different name per company to see which one opened your site,
// e.g. mella7.me/go/vshn. See src/lib/short-links.ts.

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export function GET(
  request: NextRequest,
  { params }: { params: { name?: string[] } }
) {
  return handleShortLink(request, "go", params.name);
}
