"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowUpRight, PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function OrderPage() {
  const { id } = useParams<{ id: string }>();
  const [status, setStatus] = useState("Last update: label created");
  function refreshTracking() {
    setStatus("Fetching latest carrier scan…");
    console.warn("Tracking refresh requested", { orderId: id, carrier: "Northline" });
    // SEED BUG D: a carrier dependency fails and the UI throws the
    // resulting error without showing a useful recovery state.
    void (async () => {
      const response = await fetch(`/api/shipments/${encodeURIComponent(id)}?carrier=northline`);
      const body = (await response.json()) as { error?: string; latestScan?: string };
      if (!response.ok) {
        console.error("Shipment refresh failed", response.status, body);
        throw new Error(`Tracking unavailable: ${response.status} ${body.error}`);
      }
      setStatus(body.latestScan || "No new scans");
    })();
  }
  return <main className="app-main inner-page"><a className="back-link" href="/orders"><ArrowLeft size={16} /> ALL ORDERS</a><p className="eyebrow">ORDER DETAILS / SEPTEMBER 12, 2026</p><h1>Order {id}<span className="title-period">.</span></h1><div className="order-detail-grid"><section className="tracking-panel"><p className="small-heading">DELIVERY STATUS</p><div className="tracking-steps"><span className="complete">✓ Order placed</span><span className="complete">✓ Label created</span><span>○ In transit</span><span>○ Delivered</span></div><div className="tracking-current"><PackageCheck size={24} /><span>{status}</span></div><Button className="reserve-button" onClick={refreshTracking}>Refresh tracking <ArrowUpRight size={17} /></Button></section><aside className="summary-box"><p>ORDER SUMMARY</p><div><span>The Field Kit</span><strong>$48.00</strong></div><div><span>The Trail Lamp</span><strong>$86.00</strong></div><hr /><div className="total-row"><span>Total</span><strong>$134.00</strong></div><p className="demo-note">Sample order. No physical shipment exists.</p></aside></div></main>;
}
