import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json(
    { error: "WAREHOUSE_UNAVAILABLE", message: "Inventory service is temporarily unavailable.", sku: "FIELD-KIT-01" },
    { status: 503, headers: { "Cache-Control": "no-store" } },
  );
}
