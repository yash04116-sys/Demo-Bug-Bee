"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { findProduct } from "@/lib/catalog";
export type CartLine = { slug: string; quantity: number };
type StoreValue = { cart: CartLine[]; ready: boolean; add: (slug: string, quantity?: number) => void; update: (slug: string, quantity: number) => void; count: number; subtotal: number };
const StoreContext = createContext<StoreValue | null>(null);
const STORAGE_KEY = "fieldwork-demo-cart-v2";
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try { const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); if (Array.isArray(value)) setCart(value.filter((line) => line && findProduct(line.slug) && Number.isInteger(line.quantity) && line.quantity > 0)); } catch { /* Ignore corrupt local demo data. */ }
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); }, [cart, ready]);
  const update = (slug: string, quantity: number) => setCart((current) => quantity <= 0 ? current.filter((line) => line.slug !== slug) : current.map((line) => line.slug === slug ? { ...line, quantity: Math.min(quantity, 9) } : line));
  const add = (slug: string, quantity = 1) => {
    const next = cart.some((line) => line.slug === slug) ? cart.map((line) => line.slug === slug ? { ...line, quantity: Math.min(line.quantity + quantity, 9) } : line) : [...cart, { slug, quantity }];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setCart(next);
  };
  const count = cart.reduce((total, line) => total + line.quantity, 0);
  const subtotal = cart.reduce((total, line) => total + (findProduct(line.slug)?.price || 0) * line.quantity, 0);
  return <StoreContext.Provider value={{ cart, ready, add, update, count, subtotal }}>{children}</StoreContext.Provider>;
}
export function useStore() { const value = useContext(StoreContext); if (!value) throw new Error("Missing StoreProvider"); return value; }
