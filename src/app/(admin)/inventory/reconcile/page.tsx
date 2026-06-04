"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft, ChevronDown, Check, Save,
  FileCheck, AlertCircle, History, Filter,
  Search, Package, Plus, ArrowRight,
  TrendingDown, TrendingUp, RefreshCw, Box
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ── Shared UI Components ──────────────────────────────────────────────────────

function CustomSelect({ id, label, options, value, onChange, placeholder }: any) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: any) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const sel = options.find((o: any) => o.value === value);
  return (
    <div className="space-y-1.5" ref={ref}>
      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{label}</label>
      <div className="relative">
        <button type="button" onClick={() => setOpen(!open)}
          className={`w-full h-10 px-4 rounded-xl border bg-card text-sm text-left flex items-center gap-2.5 transition-all ${open ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-muted-foreground/40"}`}>
          <span className={`flex-1 font-bold ${sel ? "text-foreground" : "text-muted-foreground"}`}>{sel?.label ?? placeholder ?? "Select…"}</span>
          <ChevronDown className={`size-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        {open && (
          <div className="absolute z-[200] top-full mt-2 w-full rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 origin-top">
            {options.map((o: any) => (
              <button key={o.value} type="button" onClick={() => { onChange(o.value); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/60 transition-colors border-b border-border/50 last:border-0 ${value === o.value ? "bg-primary/5" : ""}`}>
                <p className={`text-[12px] font-black ${value === o.value ? "text-primary" : "text-foreground"}`}>{o.label}</p>
                {value === o.value && <Check className="size-4 text-primary ml-auto" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ReconcilePage() {
  const [warehouse, setWarehouse] = useState("main");
  const [items, setItems] = useState([
    { id: "SKU-401", name: "Rice (Basmati) 50kg", system: 14, physical: 14, reason: "" },
    { id: "SKU-402", name: "Cooking Oil 20L", system: 2, physical: 2, reason: "" },
    { id: "SKU-403", name: "Wheat Flour 50kg", system: 8, physical: 8, reason: "" },
  ]);

  const updatePhysical = (id: string, val: number) => {
    setItems(items.map(i => i.id === id ? { ...i, physical: isNaN(val) ? 0 : val } : i));
  };

  const updateReason = (id: string, val: string) => {
    setItems(items.map(i => i.id === id ? { ...i, reason: val } : i));
  };

  const totalVariances = items.reduce((acc, item) => acc + Math.abs(item.physical - item.system), 0);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex items-center gap-5">
           <Link href="/inventory">
              <button className="size-12 rounded-2xl border border-border bg-card hover:bg-muted flex items-center justify-center transition-all shadow-sm">
                <ChevronLeft className="size-6 text-muted-foreground" />
              </button>
            </Link>
          <div>
            <p className="text-[11px] font-black text-primary uppercase tracking-[0.2em] mb-1.5">Audit & Correction</p>
            <h1 className="text-3xl font-black text-foreground tracking-tight leading-none">Stock Reconciliation</h1>
            <p className="text-sm text-muted-foreground mt-1.5 font-bold tracking-tight">Sync physical counts with digital records.</p>
          </div>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="h-11 px-5 gap-2 rounded-xl border-dashed font-black text-xs uppercase tracking-widest">
              <History className="size-4" /> Reconciliation History
           </Button>
           <Button className="h-11 px-8 gap-2 bg-primary hover:bg-primary/90 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20">
              <RefreshCw className="size-4" /> Sync All
           </Button>
        </div>
      </div>

      {/* Configuration Bar */}
      <div className="grid md:grid-cols-3 gap-4 p-6 rounded-[2rem] border border-border bg-card/50 shadow-sm">
         <CustomSelect
            label="Location for Audit"
            value={warehouse}
            onChange={setWarehouse}
            options={[
              { value: "main", label: "Main Kitchen Stores" },
              { value: "cold", label: "Cold Storage Alpha" },
            ]}
         />
         <div className="space-y-1.5">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Search Items</label>
            <div className="relative">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
               <input placeholder="Filter items..." className="w-full h-10 pl-11 pr-4 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold" />
            </div>
         </div>
         <div className="flex items-center justify-end pt-5">
            <div className="text-right">
               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Total Variances</p>
               <p className={`text-xl font-black tabular-nums ${totalVariances > 0 ? "text-amber-500" : "text-emerald-500"}`}>{totalVariances} Items</p>
            </div>
         </div>
      </div>

      {/* Audit Table */}
      <div className="rounded-[2.5rem] border border-border bg-card overflow-hidden shadow-sm">
        <div className="grid grid-cols-[minmax(0,2fr)_120px_120px_120px_minmax(0,1.5fr)] px-8 py-5 border-b border-border bg-muted/30">
          {["SKU & ITEM NAME", "SYSTEM QTY", "PHYSICAL QTY", "VARIANCE", "ADJUSTMENT REASON"].map(h => (
            <span key={h} className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/60">{h}</span>
          ))}
        </div>

        <div className="divide-y divide-border">
          {items.map(item => {
            const diff = item.physical - item.system;
            return (
              <div key={item.id} className="grid grid-cols-[minmax(0,2fr)_120px_120px_120px_minmax(0,1.5fr)] items-center px-8 py-6 hover:bg-primary/5 transition-colors group">
                {/* Item */}
                <div className="flex items-center gap-4 pr-6 min-w-0">
                  <div className="size-10 rounded-2xl bg-muted text-foreground flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <Box className="size-5 shrink-0" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-black text-foreground truncate">{item.name}</p>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{item.id}</p>
                  </div>
                </div>
                {/* System */}
                <div className="text-center">
                   <p className="text-xs font-black text-muted-foreground/60 tabular-nums">{item.system}</p>
                </div>
                {/* Physical Input */}
                <div className="px-2">
                   <input
                      type="number"
                      value={item.physical}
                      onChange={e => updatePhysical(item.id, parseInt(e.target.value))}
                      className="w-full h-11 text-center font-black text-sm rounded-xl border border-border bg-card focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                   />
                </div>
                {/* Variance */}
                <div className="flex justify-center">
                   <span className={`text-[11px] font-black px-3 py-1.5 rounded-lg flex items-center gap-2 tabular-nums uppercase tracking-wider
                      ${diff === 0 ? "bg-muted text-muted-foreground" : diff > 0 ? "bg-blue-500/10 text-blue-600" : "bg-rose-500/10 text-rose-500"}`}>
                      {diff === 0 ? <Check className="size-3.5" /> : diff > 0 ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
                      {diff > 0 ? `+${diff}` : diff}
                   </span>
                </div>
                {/* Reason */}
                <div className="pl-6">
                   <CustomSelect
                      id={`reason-${item.id}`}
                      label=""
                      value={item.reason}
                      onChange={(v: string) => updateReason(item.id, v)}
                      placeholder="Select Reason..."
                      options={[
                        { value: "damage", label: "Physical Damage" },
                        { value: "theft",  label: "Lost / Shrinkage" },
                        { value: "input",  label: "Data Entry Error" },
                        { value: "found",  label: "Found Surplus" },
                      ]}
                   />
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-8 border-t border-border bg-muted/10 flex items-center justify-between">
           <div className="flex items-start gap-4 max-w-lg">
              <AlertCircle className="size-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-muted-foreground font-bold uppercase leading-relaxed tracking-tight">
                 Adjustments will be logged as <strong className="text-foreground underline decoration-amber-500/50">Stock Adjustments</strong> in ERPNext and will immediately update the financial value of the warehouse.
              </p>
           </div>
           <Button disabled={totalVariances === 0} className="h-14 px-12 gap-3 bg-primary hover:bg-primary/90 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 transition-all">
              <FileCheck className="size-5" /> Commit Audit
           </Button>
        </div>
      </div>
    </div>
  );
}
