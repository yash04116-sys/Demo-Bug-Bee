"use client";
import { ShoppingBag } from "lucide-react";
import { useStore } from "./store";
export function Nav() {
  const { count } = useStore();
  return <><header className="topbar"><a href="/" className="brand"><span className="brand-mark">F</span>FIELDWORK<span className="brand-period">.</span></a><nav aria-label="Main navigation" className="new-nav"><a href="/">Shop</a><a href="/orders">Orders</a><a href="/lab">Bug lab</a><a href="/cart" className="cart-link"><ShoppingBag size={18} /> Cart <span>{count}</span></a></nav></header><div className="notice">COMPLIMENTARY SHIPPING ON ORDERS OVER $75</div></>;
}
