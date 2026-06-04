"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft, FileCheck, RefreshCw, Search,
  Box, TrendingUp, TrendingDown, Check,
  AlertCircle, History, Filter, ChevronRight, ChevronDown,
  ShieldCheck, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ── Custom Select (Strict Pattern) ─────────────────────────────────────────────

function CustomSelect({
  id, label, options, required, placeholder, value, onChange
}: {
  id: string; label: string; options: { value: string; label: string; color?: string; sub?: string }[];
  required?: boolean; placeholder?: string; value: string; onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div className="space-y-1.5" ref={ref}>
      {label && (
        <label htmlFor={id} className="text-[11px] font-semibold text-muted-foreground block">
          {label} {required && <span className="text-primary">*</span>}
        </label>
      )}
      <div className="relative">
        <button
          id={id} type="button" onClick={() => setOpen((o) => !o)}
          className={`w-full h-8 px-3 pr-8 rounded-lg border bg-card text-[11px] font-bold text-left flex items-center transition-all ${open ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-muted-foreground/40"}`}
        >
          {selected ? (
            <span className="flex items-center gap-2">
              {selected.color && <span className={`size-1.5 rounded-full ${selected.color}`} />}
              <span className="text-foreground">{selected.label}</span>
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder ?? `Select...`}</span>
          )}
        </button>
        <ChevronDown className={`absolute right-2 top-1/2 -translate-y-1/2 size-3 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />

        {open && (
          <div className="absolute z-50 bottom-full mb-1.5 w-full rounded-xl border border-border bg-card shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 origin-bottom">
            {options.map((o) => (
              <button
                key={o.value} type="button" onClick={() => { onChange(o.value); setOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-[11px] font-bold text-left hover:bg-muted transition-colors ${value === o.value ? "bg-primary/5 text-primary" : "text-foreground"}`}
              >
                {o.color && <span className={`size-1.5 rounded-full shrink-0 ${o.color}`} />}
                {o.label}
                {value === o.value && <Check className="ml-auto size-3 text-primary" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const auditItems = [
  { id: "SKU-401", name: "Rice (Basmati) 50kg", system: 14, physical: 14, category: "Dry Goods", reason: "" },
  { id: "SKU-402", name: "Cooking Oil 20L",     system: 2,  physical: 2,  category: "Dry Goods", reason: "" },
  { id: "SKU-403", name: "Wheat Flour 50kg",    system: 8,  physical: 8,  category: "Dry Goods", reason: "" },
];

export default function WarehouseReconcilePage() {
  const [items, setItems] = useState(auditItems);
  
  const updatePhysical = (id: string, val: number) => {
    setItems(items.map(i => i.id === id ? { ...i, physical: isNaN(val) ? 0 : val } : i));
  };

  const updateReason = (id: string, val: string) => {
    setItems(items.map(i => i.id === id ? { ...i, reason: val } : i));
  };

  const variances = items.filter(i => i.physical !== i.system).length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] mb-1">Audit & Compliance</p>
          <h1 className="text-2xl font-black text-foreground tracking-tight leading-none">Stock Reconciliation</h1>
          <p className="text-sm text-muted-foreground mt-1.5 font-medium">Verify physical inventory counts against digital ledger values.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs">
            <History className="size-3.5" /> History
          </Button>
          <Button size="sm" className="h-8 gap-1.5 text-xs bg-primary hover:bg-primary/90 shadow-md shadow-primary/20">
            <RefreshCw className="size-3.5" /> Post adjustments
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
         {[
           { label: "Items to Audit", value: items.length.toString(), icon: Box, accent: "text-primary" },
           { label: "Variances Found", value: variances.toString(), icon: AlertCircle, accent: variances > 0 ? "text-amber-500" : "text-emerald-500" },
           { label: "Audit Accuracy", value: "98.4%", icon: ShieldCheck, accent: "text-blue-500" },
           { label: "Last Audit", value: "2d ago", icon: Clock, accent: "text-muted-foreground" },
         ].map(s => (
           <div key={s.label} className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-card">
              <div className={`size-8 rounded-xl bg-muted flex items-center justify-center ${s.accent}`}>
                 <s.icon className="size-4" />
              </div>
              <div>
                 <p className="text-lg font-black text-foreground leading-none">{s.value}</p>
                 <p className="text-[10px] text-muted-foreground mt-0.5 uppercase font-bold tracking-wider">{s.label}</p>
              </div>
           </div>
         ))}
      </div>

      {/* Audit Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-[minmax(0,2fr)_120px_120px_120px_minmax(0,1fr)] px-5 py-3 border-b border-border bg-muted/40">
          {["SKU & Item Details", "System Qty", "Physical Qty", "Variance", "Reason Code"].map(h => (
            <span key={h} className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{h}</span>
          ))}
        </div>
        <div className="divide-y divide-border">
          {items.map(item => {
            const diff = item.physical - item.system;
            return (
              <div key={item.id} className="grid grid-cols-[minmax(0,2fr)_120px_120px_120px_minmax(0,1fr)] items-center px-5 py-4 hover:bg-muted/10 transition-colors group">
                <div className="flex items-center gap-3 pr-4 min-w-0">
                   <div className="size-9 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                      <Box className="size-4" />
                   </div>
                   <div className="min-w-0">
                      <p className="text-[12px] font-bold text-foreground truncate">{item.name}</p>
                      <p className="text-[10px] text-muted-foreground font-bold tracking-tight uppercase">{item.id}</p>
                   </div>
                </div>
                <div className="text-center">
                   <p className="text-xs font-bold text-muted-foreground tabular-nums">{item.system}</p>
                </div>
                <div className="px-3">
                   <input 
                      type="number" 
                      value={item.physical} 
                      onChange={e => updatePhysical(item.id, parseInt(e.target.value))}
                      className="w-full h-8 text-center text-xs font-bold rounded-lg border border-border bg-card focus:ring-1 focus:ring-primary outline-none transition-all" 
                   />
                </div>
                <div className="flex justify-center">
                   <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1.5 tabular-nums
                      ${diff === 0 ? "bg-muted text-muted-foreground" : diff > 0 ? "bg-blue-500/10 text-blue-600" : "bg-rose-500/10 text-rose-500"}`}>
                      {diff === 0 ? <Check className="size-3" /> : diff > 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                      {diff > 0 ? `+${diff}` : diff}
                   </span>
                </div>
                <div className="pl-4">
                   <CustomSelect
                      id={`reason-${item.id}`}
                      label=""
                      value={item.reason}
                      onChange={(v) => updateReason(item.id, v)}
                      placeholder="Select reason..."
                      options={[
                        { value: "damage", label: "Physical Damage" },
                        { value: "theft",  label: "Shrinkage / Theft" },
                        { value: "entry",  label: "Entry Error" },
                        { value: "expiry", label: "Expiry" },
                      ]}
                   />
                </div>
              </div>
            );
          })}
        </div>
        <div className="p-4 border-t border-border bg-muted/10 flex items-center gap-3">
           <AlertCircle className="size-4 text-amber-500 shrink-0" />
           <p className="text-[10px] text-muted-foreground font-bold uppercase leading-relaxed tracking-tight">
              Adjustment logs are synced with the <strong className="text-foreground">Finance Module</strong> for P&L reporting. Ensure all damaged items are verified by an HOD.
           </p>
        </div>
      </div>
    </div>
  );
}
