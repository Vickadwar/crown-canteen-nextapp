"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search, Plus, Download, ChevronRight,
  Filter, FileText, ClipboardList, BadgeCheck,
  Truck, DollarSign, Clock, ShieldCheck,
  ShoppingCart, SlidersHorizontal, Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";

const orders = [
  { id: "PO-2026-088", vendor: "Golden Grain Mills", total: "KES 420,000", status: "Awaiting Delivery", date: "May 12, 2026", payment: "Unpaid" },
  { id: "PO-2026-085", vendor: "Fresh Produce Ltd",  total: "KES 18,500",  status: "Completed",        date: "May 10, 2026", payment: "Paid" },
  { id: "PO-2026-079", vendor: "Crown Kitchens",    total: "KES 95,000",  status: "Partially Received",date: "May 08, 2026", payment: "Unpaid" },
];

const stats = [
  { label: "Total POs",     value: "42",      icon: ShoppingCart, accent: "text-primary" },
  { label: "Active Orders", value: "5",       icon: Activity,      accent: "text-blue-500" },
  { label: "Paid Today",    value: "140k",    icon: DollarSign,    accent: "text-emerald-500" },
  { label: "Pending Vendor", value: "2",       icon: Truck,         accent: "text-amber-500" },
];

export default function LPOListPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] mb-1">Purchase Commitment</p>
          <h1 className="text-2xl font-black text-foreground tracking-tight leading-none">Local Purchase Orders</h1>
          <p className="text-sm text-muted-foreground mt-1.5 font-medium">Final purchase commitments and vendor delivery tracking.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs">
            <Download className="size-3.5" /> Export
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-card">
            <div className={`size-8 rounded-xl bg-muted flex items-center justify-center ${s.accent} shrink-0`}>
              <s.icon className="size-4" />
            </div>
            <div>
              <p className="text-lg font-black text-foreground leading-none">{s.value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 uppercase font-bold tracking-wider">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Action bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search POs by vendor or ID…"
            className="w-full h-9 pl-9 pr-4 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
        </div>
        <Button size="sm" variant="outline" className="h-9 gap-1.5 text-xs shrink-0 px-3">
          <Filter className="size-3.5" /> Filter
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)_120px_100px_120px_80px] px-5 py-3 border-b border-border bg-muted/40">
          {["PO Details & Vendor", "Status", "Order Total", "Payment", "Created At", ""].map(h => (
            <span key={h} className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{h}</span>
          ))}
        </div>
        <div className="divide-y divide-border">
          {orders.map(o => (
            <div key={o.id} className="grid grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)_120px_100px_120px_80px] items-center px-5 py-4 hover:bg-muted/10 transition-colors group cursor-pointer">
              <div className="flex items-center gap-3 pr-4">
                 <div className="size-9 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                    <Truck className="size-4" />
                 </div>
                 <div>
                    <p className="text-[12px] font-bold text-foreground group-hover:text-primary transition-colors">{o.vendor}</p>
                    <p className="text-[10px] text-muted-foreground font-bold tracking-tight uppercase">{o.id}</p>
                 </div>
              </div>
              <div>
                 <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider
                    ${o.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-600' : o.status === 'Awaiting Delivery' ? 'bg-blue-500/10 text-blue-600' : 'bg-amber-500/10 text-amber-600'}`}>
                    {o.status}
                 </span>
              </div>
              <div>
                 <p className="text-xs font-black text-foreground tabular-nums">{o.total}</p>
              </div>
              <div>
                 <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter ${o.payment === 'Paid' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-500'}`}>
                    {o.payment}
                 </span>
              </div>
              <div>
                 <p className="text-[11px] font-bold text-foreground">{o.date}</p>
              </div>
              <div className="flex justify-end">
                 <Link href={`/procurement/lpo/${o.id}`}>
                    <button className="size-7 flex items-center justify-center rounded-lg hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors">
                       <ChevronRight className="size-3.5" />
                    </button>
                 </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
