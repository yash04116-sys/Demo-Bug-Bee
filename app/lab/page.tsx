"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
export default function BugLab() {
  const [activity, setActivity] = useState("Ready for a controlled test.");
  function reservationFailure() {
    setActivity("Creating reservation…");
    console.warn("Reservation started for guest-204; looking up customer profile");
    setTimeout(() => { const customers = [{ id: "member-101", profile: { id: "profile-101" } }]; const customer = customers.find((entry) => entry.id === "guest-204"); console.log(customer!.profile.id); }, 120);
  }
  function inventoryFailure() {
    setActivity("Checking warehouse…");
    console.warn("Stock check started for SKU FIELD-KIT-01");
    setTimeout(() => { void (async () => { const response = await fetch("/api/inventory?sku=FIELD-KIT-01"); const body = (await response.json()) as { error: string }; if (!response.ok) { console.error("Inventory request failed", response.status, body); throw new Error(`Stock check failed: ${response.status} ${body.error}`); } })(); }, 120);
  }
  return <main className="app-main inner-page"><p className="eyebrow">FIELDWORK / TEST BENCH</p><h1>Quick triggers<span className="title-period">.</span></h1><p className="lead">The original one-click failures are here for capture-layer checks. Use the shop and checkout for a full journey.</p><div className="lab-grid"><section><small>JAVASCRIPT / TYPEERROR</small><h2>Missing customer profile</h2><p>A reservation handler uses a customer ID that does not exist in the loaded list.</p><Button className="reserve-button" onClick={reservationFailure}>Reserve kit</Button></section><section><small>NETWORK / UNHANDLED REJECTION</small><h2>Warehouse unavailable</h2><p>The inventory endpoint returns a 503 and the caller throws with its error code.</p><Button className="reserve-button" onClick={inventoryFailure}>Check live warehouse stock</Button></section></div><p className="feedback" aria-live="polite">{activity}</p></main>;
}
