"use client";
import { useState } from "react";
import { ArrowLeft, ArrowUpRight, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { findProduct } from "@/lib/catalog";
import { useStore } from "@/app/store";
export default function CheckoutPage() {
  const { cart, ready, subtotal } = useStore();
  const [shipping, setShipping] = useState("standard");
  const [promo, setPromo] = useState("");
  const [feedback, setFeedback] = useState("Enter a code to update your total.");
  const [total, setTotal] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [region, setRegion] = useState("CA");
  function applyPromo() {
    const coupon = promo.trim().toUpperCase();
    setFeedback("Updating your total…");
    console.warn("Repricing checkout", { coupon, shippingMethod: shipping, region, items: cart });
    // SEED BUG C: API returns 422 for WELCOME15 + express. The frontend
    // assumes every response is a successful quote, then accesses missing
    // `total`. The uncaught rejection is downstream of the actual 422.
    void (async () => {
      const response = await fetch("/api/checkout/quote", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart, coupon, shippingMethod: shipping, region }),
      });
      const quote = (await response.json()) as { total?: number; error?: string; message?: string };
      console.warn("Quote response", response.status, quote);
      const formatted = quote.total!.toFixed(2);
      setTotal(Number(formatted));
      setFeedback(`Code ${coupon} applied.`);
    })();
  }
  return <main className="app-main inner-page"><a className="back-link" href="/cart"><ArrowLeft size={16} /> BACK TO CART</a><p className="eyebrow">FIELDWORK / CHECKOUT</p><h1>Almost there<span className="title-period">.</span></h1>{!ready ? <p>Loading cart…</p> : !cart.length ? <div className="empty-cart"><p>Your cart is empty.</p><a href="/">Browse the collection</a></div> : <div className="checkout-grid"><div className="checkout-form"><section><h2>01 / Contact</h2><label htmlFor="email">Email address</label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></section><section><h2>02 / Delivery</h2><div className="form-two"><div><label htmlFor="name">Full name</label><Input id="name" placeholder="Your name" /></div><div><label htmlFor="postal">ZIP code</label><Input id="postal" placeholder="94704" /></div></div><label htmlFor="region">State</label><Input id="region" value={region} onChange={(e) => setRegion(e.target.value)} maxLength={2} /></section><section><h2>03 / Shipping method</h2><RadioGroup value={shipping} onValueChange={(value) => { setShipping(value); setTotal(null); setFeedback("Shipping changed. Apply your code for a new quote."); }} aria-label="Shipping method"><label className="shipping-option"><RadioGroupItem value="standard" id="standard" /><span><strong>Standard delivery</strong><small>5–7 business days</small></span><b>$6.00</b></label><label className="shipping-option"><RadioGroupItem value="express" id="express" /><span><strong>Express delivery</strong><small>2–3 business days</small></span><b>$18.00</b></label></RadioGroup></section><section><h2>04 / Promo code</h2><label htmlFor="promo">Have a code?</label><div className="promo-row"><Input id="promo" value={promo} onChange={(e) => { setPromo(e.target.value); setTotal(null); }} placeholder="Enter promo code" /><Button variant="outline" onClick={applyPromo}>Apply</Button></div><p className="feedback" aria-live="polite">{feedback}</p></section><p className="demo-note"><LockKeyhole size={14} /> Demo checkout. Payment is intentionally unavailable.</p></div><aside className="summary-box"><p>YOUR ORDER</p>{cart.map((line) => { const product = findProduct(line.slug)!; return <div key={line.slug}><span>{product.name} × {line.quantity}</span><strong>${product.price * line.quantity}.00</strong></div>; })}<hr /><div><span>Subtotal</span><strong>${subtotal}.00</strong></div><div><span>{shipping === "express" ? "Express" : "Standard"} shipping</span><strong>${shipping === "express" ? "18" : "6"}.00</strong></div><div><span>Estimated tax</span><strong>Calculated after quote</strong></div><hr /><div className="total-row"><span>Total</span><strong>{total === null ? "—" : `$${total.toFixed(2)}`}</strong></div><a className="secondary-link" href="/orders/FW-1042">View a sample past order <ArrowUpRight size={15} /></a></aside></div>}</main>;
}
