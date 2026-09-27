"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { findProduct } from "@/lib/catalog";
import { useStore } from "@/app/store";
export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = findProduct(slug);
  const { add } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  if (!product) return <main className="app-main"><h1>Object not found.</h1><a href="/">Back to shop</a></main>;
  return <main className="app-main"><a className="back-link" href="/"><ArrowLeft size={16} /> ALL OBJECTS</a><div className="detail-grid"><div className={`item-art detail-art ${product.tone}`}><span className="item-number">{product.number} / FW</span><span className="item-monogram">{product.name.split(" ").at(-1)?.charAt(0)}</span><span className="item-caption">FIELDWORK<br />OBJECTS</span></div><div className="detail-copy"><p className="eyebrow">{product.category} / {product.number}</p><h1>{product.name}<span className="title-period">.</span></h1><p className="lead">{product.description}</p><div className="price-line"><strong>${product.price}.00</strong><span>IN STOCK <b /></span></div><div className="included"><p>THE DETAILS</p>{product.details.map((detail) => <div key={detail}><Check size={16} /> {detail}</div>)}</div><div className="action-area"><p>QUANTITY</p><div className="purchase-row"><div className="quantity-control"><button onClick={() => setQuantity(Math.max(quantity - 1, 1))} aria-label="Decrease quantity">−</button><span>{quantity}</span><button onClick={() => setQuantity(Math.min(quantity + 1, 9))} aria-label="Increase quantity">+</button></div><Button className="reserve-button" onClick={() => { add(product.slug, quantity); setAdded(true); }}>Add to cart <ArrowUpRight size={18} /></Button></div>{added && <a className="view-cart-link" href="/cart">Added to cart. View cart <ArrowUpRight size={16} /></a>}</div><p className="demo-note">Demo storefront. No real payments or shipments.</p></div></div></main>;
}
