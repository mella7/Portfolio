// GET /qr and /qr/<name>: the address behind a printed QR code. Counts the
// scan, then always goes on to the homepage (tagged ?ref=qr-<name>).

import { qrCode, qrHit, qrRedirect } from "../../server/core.mjs";
import { SECURITY_HEADERS, recordHit } from "../lib/stats-store.mjs";

export default async (request, context) => {
  const code = qrCode(new URL(request.url));
  try {
    await recordHit(request, context, qrHit(code));
  } catch (error) {
    console.error("qr:", error.message); // the visitor still gets through
  }
  return new Response(null, {
    status: 302,
    headers: { Location: qrRedirect(process.env.QR_TARGET, code), ...SECURITY_HEADERS },
  });
};

export const config = { path: ["/qr", "/qr/*"] };
