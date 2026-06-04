"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search, Truck, Plus, Download, SlidersHorizontal,
  ChevronRight, Star, Clock, Package, AlertTriangle,
  TrendingUp, ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const categoryColor: Record<string, string> = {
  "Vegetables & Fruits": "bg-emerald-500/10 text-emerald-600",
  "Butchery":            "bg-rose-500/10 text-rose-500",
  "Grains & Dry Goods":  "bg-amber-500/10 text-amber-600",
  "Dairy":               "bg-blue-500/10 text-blue-600",
  "Beverages":           "bg-violet-500/10 text-violet-600",
  "Packaging":           "bg-muted text-muted-foreground",
};

const statusStyle: Record<string, string> = {
  Verified:  "bg-emerald-500/10 text-emerald-600",
  Warning:   "bg-amber-500/10 text-amber-600",
  Suspended: "bg-rose-500/10 text-rose-500",
  Pending:   "bg-muted text-muted-foreground",
};

const suppliers = [
  {
    id: "SUP-001", short: "FP", name: "Fresh Produce Ltd",
    category: "Vegetables & Fruits", email: "info@freshproduce.co.ke",
    phone: "+254 712 345 678",   city: "Nairobi",
    monthlyOrders: "KES 480k",  lastDelivery: "Today, 7:00 AM",
    qualityScore: 98, onTime: 99, status: "Verified",
    portalAccess: true,
  },
  {
    id: "SUP-002", short: "PM", name: "Premium Meats Kenya",
    category: "Butchery",         email: "sales@premiummeats.co.ke",
    phone: "+254 722 999 000",   city: "Nairobi",
    monthlyOrders: "KES 320k",  lastDelivery: "Yesterday, 6:30 AM",
    qualityScore: 92, onTime: 95, status: "Verified",
    portalAccess: true,
  },
  {
    id: "SUP-003", short: "GG", name: "Golden Grain Millers",
    category: "Grains & Dry Goods", email: "orders@goldengrain.co.ke",
    phone: "+254 733 111 222",   city: "Eldoret",
    monthlyOrders: "KES 210k",  lastDelivery: "May 10, 2026",
    qualityScore: 75, onTime: 70, status: "Warning",
    portalAccess: false,
  },
  {
    id: "SUP-004", short: "DB", name: "Dairy Best Kenya",
    category: "Dairy",             email: "dairy@dairybest.co.ke",
    phone: "+254 711 444 555",   city: "Nakuru",
    monthlyOrders: "KES 175k",  lastDelivery: "Today, 5:45 AM",
    qualityScore: 95, onTime: 98, status: "Verified",
    portalAccess: true,
  },
  {
    id: "SUP-005", short: "BK", name: "BevKe Distributors",
    category: "Beverages",         email: "biz@bevke.co.ke",
    phone: "+254 720 777 888",   city: "Mombasa",
    monthlyOrders: "KES 90k",   lastDelivery: "May 12, 2026",
    qualityScore: 88, onTime: 90, status: "Verified",
    portalAccess: false,
  },
];

const stats = [
  { label: "Total suppliers",   value: "5",        icon: Truck },
  { label: "Monthly spend",     value: "KES 1.27M",icon: Package },
  { label: "Avg quality score", value: "89.6%",    icon: Star },
  { label: "Pending issues",    value: "1",        icon: AlertTriangle },
];

export default function SuppliersPage() {
  const [search, setSearch] = useState("");
  const filtered = suppliers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] mb-1">Supply chain</p>
          <h1 className="text-2xl font-black text-foreground tracking-tight leading-none">Suppliers</h1>
          <p className="text-sm text-muted-foreground mt-1.5">Manage supply partners, delivery performance and portal access.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs"><Download className="size-3.5" /> Export</Button>
          <Link href="/suppliers/new">
            <Button size="sm" className="h-8 gap-1.5 text-xs bg-primary hover:bg-primary/90 shadow-md shadow-primary/20">
              <Plus className="size-3.5" /> Add supplier
            </Button>
          </Link>
        </div>
      </div>

      {/* Stat strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-card">
            <div className="size-8 rounded-xl bg-muted flex items-center justify-center text-primary shrink-0">
              <s.icon className="size-4" />
            </div>
            <div>
              <p className="text-lg font-black text-foreground leading-none">{s.value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or supplier ID…"
            className="w-full h-9 pl-9 pr-4 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
        </div>
        <Button size="sm" variant="outline" className="h-9 gap-1.5 text-xs shrink-0">
          <SlidersHorizontal className="size-3.5" /> Filter
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.2fr)_90px_80px] px-5 py-3 border-b border-border bg-muted/40">
          {["Supplier","Category","Contact","Monthly spend","Status",""].map(h => (
            <span key={h} className="text-[11px] font-semibold text-muted-foreground">{h}</span>
          ))}
        </div>
        <div className="divide-y divide-border">
          {filtered.map(s => (
            <div key={s.id}
              className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.2fr)_90px_80px] items-center px-5 py-3.5 hover:bg-muted/20 transition-colors group cursor-pointer">
              {/* Supplier */}
              <div className="flex items-center gap-3 min-w-0 pr-3">
                <div className="size-9 rounded-xl bg-muted text-foreground flex items-center justify-center font-black text-[10px] shrink-0 group-hover:ring-2 group-hover:ring-primary/30 transition-all">{s.short}</div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-[12px] font-bold text-foreground truncate group-hover:text-primary transition-colors">{s.name}</p>
                    {s.portalAccess && <ExternalLink className="size-3 text-primary/60 shrink-0" />}
                  </div>
                  <p className="text-[10px] text-muted-foreground truncate">{s.id} · {s.city}</p>
                </div>
              </div>
              {/* Category */}
              <div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg leading-none ${categoryColor[s.category] ?? "bg-muted text-muted-foreground"}`}>
                  {s.category}
                </span>
              </div>
              {/* Contact */}
              <div className="min-w-0 pr-2">
                <p className="text-[11px] font-semibold text-foreground truncate">{s.phone}</p>
                <p className="text-[10px] text-muted-foreground truncate">{s.email}</p>
              </div>
              {/* Spend + quality */}
              <div>
                <p className="text-[13px] font-bold text-foreground">{s.monthlyOrders}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="h-1 flex-1 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full rounded-full ${s.qualityScore >= 90 ? "bg-emerald-500" : s.qualityScore >= 80 ? "bg-primary/60" : "bg-amber-500"}`}
                      style={{width:`${s.qualityScore}%`}} />
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground tabular-nums">{s.qualityScore}%</span>
                </div>
              </div>
              {/* Status */}
              <div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg leading-none flex items-center gap-1.5 w-fit ${statusStyle[s.status]}`}>
                  <span className={`size-1.5 rounded-full ${s.status === "Verified" ? "bg-emerald-500" : s.status === "Warning" ? "bg-amber-500" : "bg-rose-500"}`} />
                  {s.status}
                </span>
              </div>
              {/* Arrow */}
              <div className="flex justify-end">
                <Link href={`/suppliers/${s.id}`}>
                  <button className="size-7 flex items-center justify-center rounded-lg hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors">
                    <ChevronRight className="size-3.5" />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="px-5 py-3 border-t border-border bg-muted/20 flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">Showing {filtered.length} of {suppliers.length} suppliers</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="h-7 px-3 text-xs" disabled>Previous</Button>
            <Button size="sm" variant="outline" className="h-7 px-3 text-xs">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
