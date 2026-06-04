"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search, Package, Plus, Download, SlidersHorizontal,
  ChevronRight, AlertTriangle, TrendingDown, ShoppingCart,
  ArrowUpRight, Clock, Box, ShieldCheck, History, Filter,
  ArrowLeftRight, FileCheck, Warehouse, DownloadCloud
} from "lucide-react";
import { Button } from "@/components/ui/button";

const warehouseStocks = [
  { id: "W-NRB", name: "Main Kitchen Stores", location: "Nairobi HQ", capacity: "85%", status: "Active", items: 420 },
  { id: "W-MSA", name: "Mombasa Cold Room",  location: "Mombasa Plant", capacity: "42%", status: "Active", items: 115 },
  { id: "W-KSM", name: "Kisumu Dry Store",   location: "Kisumu Depot", capacity: "12%", status: "Maintenance", items: 45 },
];

const stats = [
  { label: "Warehouse Value", value: "KES 4.2M", icon: Warehouse, accent: "text-primary" },
  { label: "Pending Receipts", value: "5",        icon: DownloadCloud, accent: "text-blue-500" },
  { label: "Active Transfers", value: "3",        icon: ArrowLeftRight, accent: "text-amber-500" },
  { label: "Stock Accuracy",   value: "98.4%",    icon: ShieldCheck, accent: "text-emerald-500" },
];

export default function WarehouseDashboard() {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] mb-1">Logistics & Supply Chain</p>
          <h1 className="text-2xl font-black text-foreground tracking-tight leading-none">Warehouse Operations</h1>
          <p className="text-sm text-muted-foreground mt-1.5">Stock receipts, inter-location transfers, and digital audits.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/warehouse/transfer/new">
            <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs">
              <ArrowLeftRight className="size-3.5" /> Transfer
            </Button>
          </Link>
          <Link href="/warehouse/reconcile">
            <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs">
              <FileCheck className="size-3.5" /> Reconcile
            </Button>
          </Link>
          <Link href="/warehouse/receipt/new">
            <Button size="sm" className="h-8 gap-1.5 text-xs bg-primary hover:bg-primary/90 shadow-md shadow-primary/20">
              <Plus className="size-3.5" /> Stock receipt
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-card hover:border-primary/20 transition-colors cursor-default">
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

      {/* Warehouse Summary Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-muted/40 flex items-center justify-between">
           <h3 className="text-xs font-black uppercase tracking-widest text-foreground">Storage Locations</h3>
           <div className="flex gap-2">
              <Button size="xs" variant="ghost" className="h-6 text-[9px] uppercase font-black">View all</Button>
           </div>
        </div>
        <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_120px_100px_80px] px-5 py-3 border-b border-border bg-muted/20">
          {["Warehouse Name","Location","Capacity","Status",""].map(h => (
            <span key={h} className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{h}</span>
          ))}
        </div>
        <div className="divide-y divide-border">
          {warehouseStocks.map(w => (
            <div key={w.id} className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_120px_100px_80px] items-center px-5 py-4 hover:bg-muted/10 transition-colors group cursor-pointer">
              <div className="flex items-center gap-3 pr-4">
                 <div className="size-9 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                    <Warehouse className="size-4" />
                 </div>
                 <div>
                    <p className="text-[12px] font-bold text-foreground group-hover:text-primary transition-colors">{w.name}</p>
                    <p className="text-[10px] text-muted-foreground font-bold tracking-tight uppercase">{w.id}</p>
                 </div>
              </div>
              <div>
                 <p className="text-[11px] font-bold text-foreground">{w.location}</p>
              </div>
              <div className="pr-6">
                 <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-foreground">{w.capacity}</span>
                    <span className="text-[9px] text-muted-foreground font-bold">{w.items} SKUs</span>
                 </div>
                 <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: w.capacity }} />
                 </div>
              </div>
              <div>
                 <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider ${w.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                    {w.status}
                 </span>
              </div>
              <div className="flex justify-end">
                 <button className="size-7 flex items-center justify-center rounded-lg hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors">
                    <ChevronRight className="size-3.5" />
                 </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Insights */}
      <div className="grid md:grid-cols-2 gap-4">
         <div className="p-5 rounded-2xl border border-border bg-card flex items-start gap-4">
            <div className="size-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
               <AlertTriangle className="size-5" />
            </div>
            <div>
               <p className="text-sm font-black text-foreground uppercase tracking-tight">Stock Discrepancy Alert</p>
               <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                  Weekly reconciliation shows a <strong className="text-foreground">2% variance</strong> in Cold Storage. Review the audit logs to approve adjustments.
               </p>
               <Link href="/warehouse/reconcile" className="text-[10px] font-bold text-primary mt-3 inline-flex items-center gap-1 hover:underline">
                  Start reconciliation <ArrowUpRight className="size-3" />
               </Link>
            </div>
         </div>
         <div className="p-5 rounded-2xl border border-border bg-card flex items-start gap-4">
            <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
               <ShieldCheck className="size-5" />
            </div>
            <div>
               <p className="text-sm font-black text-foreground uppercase tracking-tight">Logistics Compliance</p>
               <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                  Internal transfers are currently <strong className="text-foreground">100% verified</strong>. All branch receipts are synced with ERPNext.
               </p>
               <Link href="/warehouse/history" className="text-[10px] font-bold text-primary mt-3 inline-flex items-center gap-1 hover:underline">
                  View activity log <ArrowUpRight className="size-3" />
               </Link>
            </div>
         </div>
      </div>
    </div>
  );
}
