import { NextResponse } from "next/server";
export function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  // SEED BUG D: simulated carrier gateway outage.
  void params;
  return NextResponse.json({ error: "CARRIER_GATEWAY_TIMEOUT", carrier: "northline", retryable: true }, { status: 503, headers: { "Cache-Control": "no-store" } });
}
