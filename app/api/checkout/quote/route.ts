import { NextResponse } from "next/server";
import { findProduct } from "@/lib/catalog";
export async function POST(request: Request) {
  let payload: { cart?: { slug: string; quantity: number }[]; coupon?: string; shippingMethod?: string; region?: string };
  try { payload = await request.json(); } catch { return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 }); }
  if (!Array.isArray(payload.cart) || !payload.cart.length) return NextResponse.json({ error: "EMPTY_CART" }, { status: 400 });
  // SEED BUG C source: legacy promotion rules exclude express delivery,
  // but the checkout UI presents the code field for every shipping choice.
  if (payload.coupon === "WELCOME15" && payload.shippingMethod === "express") {
    return NextResponse.json({ error: "PROMO_SHIPPING_CONFLICT", message: "WELCOME15 is unavailable for express delivery.", eligibleShipping: "standard", requestContext: { shippingMethod: payload.shippingMethod, region: payload.region } }, { status: 422, headers: { "Cache-Control": "no-store" } });
  }
  const subtotal = payload.cart.reduce((sum, line) => sum + (findProduct(line.slug)?.price || 0) * line.quantity, 0);
  const discount = payload.coupon === "WELCOME15" ? Math.round(subtotal * .15 * 100) / 100 : 0;
  const shipping = payload.shippingMethod === "express" ? 18 : 6;
  return NextResponse.json({ subtotal, discount, shipping, tax: Math.round((subtotal - discount) * .08 * 100) / 100, total: Math.round((subtotal - discount + shipping + (subtotal - discount) * .08) * 100) / 100 }, { headers: { "Cache-Control": "no-store" } });
}
