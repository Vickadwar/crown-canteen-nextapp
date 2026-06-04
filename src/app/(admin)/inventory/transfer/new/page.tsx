"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft, ChevronDown, Check, Save,
  Package, ArrowLeftRight, MapPin, User,
  FileText, Plus, X, Trash2, ArrowRight,
  AlertCircle, Sparkles, Building, Box
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ── Shared UI Components ──────────────────────────────────────────────────────

function CustomSelect({ id, label, options, value, onChange, placeholder, required }: any) {
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
      <label className="text-[11px] font-black text-muted-foreground uppercase tracking-wider">{label} {required && "*"}</label>
      <div className="relative">
        <button type="button" onClick={() => setOpen(!open)}
          className={`w-full h-11 px-4 rounded-xl border bg-card text-sm text-left flex items-center gap-2.5 transition-all ${open ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-muted-foreground/40"}`}>
          {sel?.color && <span className={`size-2 rounded-full shrink-0 ${sel.color}`} />}
          <span className={`flex-1 font-bold ${sel ? "text-foreground" : "text-muted-foreground"}`}>{sel?.label ?? placeholder ?? "Select…"}</span>
          <ChevronDown className={`size-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        {open && (
          <div className="absolute z-[200] top-full mt-2 w-full rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 origin-top">
            {options.map((o: any) => (
              <button key={o.value} type="button" onClick={() => { onChange(o.value); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/60 transition-colors border-b border-border/50 last:border-0 ${value === o.value ? "bg-primary/5" : ""}`}>
                {o.color && <span className={`size-2 rounded-full shrink-0 ${o.color}`} />}
                <div className="flex-1 min-w-0">
                  <p className={`text-[12px] font-black ${value === o.value ? "text-primary" : "text-foreground"}`}>{o.label}</p>
                  {o.sub && <p className="text-[10px] text-muted-foreground font-medium">{o.sub}</p>}
                </div>
                {value === o.value && <Check className="size-4 text-primary shrink-0" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function StockTransferPage() {
  const [sourceLoc, setSourceLoc] = useState("");
  const [targetLoc, setTargetLoc] = useState("");
  const [reference, setReference] = useState("");
  const [items, setItems] = useState([{ id: Date.now(), sku: "", qty: 1, currentStock: 50 }]);

  const addItem = () => setItems([...items, { id: Date.now(), sku: "", qty: 1, currentStock: 50 }]);
  const removeItem = (id: number) => setItems(items.filter(i => i.id !== id));
  const updateItem = (id: number, field: string, val: any) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: val } : i));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <Link href="/inventory">
            <button className="size-12 rounded-2xl border border-border bg-card hover:bg-muted flex items-center justify-center transition-all shadow-sm">
              <ChevronLeft className="size-6 text-muted-foreground" />
            </button>
          </Link>
          <div>
            <p className="text-[11px] font-black text-primary uppercase tracking-[0.25em] mb-1.5">Intra-Warehouse Transfer</p>
            <h1 className="text-3xl font-black text-foreground tracking-tight leading-none">Move Stock</h1>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
        <div className="space-y-6">
          
          {/* Location Selection */}
          <div className="rounded-[2.5rem] border border-border bg-card p-10 space-y-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 size-40 bg-primary/5 blur-[100px] rounded-full" />
            
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
                  <ArrowLeftRight className="size-6" />
                </div>
                <div>
                  <p className="text-base font-black text-foreground tracking-tight">Route Definition</p>
                  <p className="text-xs text-muted-foreground font-bold tracking-tight mt-0.5">Move items from source to destination</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-center relative z-10">
              <CustomSelect
                label="Source Warehouse"
                value={sourceLoc}
                onChange={setSourceLoc}
                placeholder="From..."
                options={[
                  { value: "main", label: "Main Kitchen Stores", color: "bg-emerald-500" },
                  { value: "cold", label: "Cold Room Alpha", color: "bg-blue-500" },
                ]}
              />
              <div className="pt-6 hidden md:block">
                <ArrowRight className="size-6 text-muted-foreground/30" />
              </div>
              <CustomSelect
                label="Target Location"
                value={targetLoc}
                onChange={setTargetLoc}
                placeholder="To..."
                options={[
                  { value: "p1", label: "Serving Point 1", sub: "Main Canteen" },
                  { value: "p2", label: "Serving Point 2", sub: "Executive Wing" },
                  { value: "buffer", label: "Buffer Zone", color: "bg-amber-500" },
                ]}
              />
            </div>

            <div className="space-y-1.5 relative z-10">
              <label className="text-[11px] font-black text-muted-foreground uppercase tracking-wider">Transfer Reason / Remarks</label>
              <div className="relative">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  value={reference}
                  onChange={e => setReference(e.target.value)}
                  placeholder="e.g. Daily prep replenishment"
                  className="w-full h-12 pl-11 pr-4 rounded-2xl border border-border bg-card text-sm text-foreground font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="rounded-[2.5rem] border border-border bg-card p-10 space-y-8 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-violet-500/10 text-violet-600 flex items-center justify-center shadow-inner">
                  <Box className="size-6" />
                </div>
                <div>
                  <p className="text-base font-black text-foreground tracking-tight">Transfer List</p>
                  <p className="text-xs text-muted-foreground font-bold tracking-tight mt-0.5">Select items and verify availability</p>
                </div>
              </div>
              <Button onClick={addItem} variant="outline" className="h-10 gap-2 border-dashed rounded-xl px-5 font-black text-[10px] uppercase tracking-widest">
                <Plus className="size-4" /> Add Item
              </Button>
            </div>

            <div className="space-y-6 relative z-10">
              {items.map((item, idx) => (
                <div key={item.id} className="grid md:grid-cols-[2.5fr_120px_120px_50px] gap-6 items-end animate-in slide-in-from-left-4 duration-300">
                  <div className="space-y-1.5">
                    {idx === 0 && <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Stock Item</label>}
                    <CustomSelect
                      id={`sku-${item.id}`}
                      label=""
                      value={item.sku}
                      onChange={(v: string) => updateItem(item.id, "sku", v)}
                      placeholder="Search Inventory Catalog…"
                      options={[
                        { value: "rice", label: "Rice (Basmati) 50kg" },
                        { value: "beef", label: "Beef Cuts (Prime)" },
                        { value: "oil",  label: "Cooking Oil 20L" },
                      ]}
                    />
                  </div>
                  <div className="space-y-1.5">
                    {idx === 0 && <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">In Stock</label>}
                    <div className="w-full h-12 flex items-center justify-center rounded-2xl bg-muted/50 border border-border text-[11px] font-black text-muted-foreground uppercase">
                      {item.currentStock} Units
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {idx === 0 && <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Move Qty</label>}
                    <input type="number" value={item.qty} onChange={e => updateItem(item.id, "qty", parseFloat(e.target.value))}
                      className={`w-full h-12 px-4 rounded-2xl border border-border bg-card text-sm text-center font-black shadow-sm ${item.qty > item.currentStock ? "border-rose-500 ring-2 ring-rose-500/20" : ""}`} />
                  </div>
                  <button onClick={() => removeItem(item.id)} className="h-12 flex items-center justify-center text-muted-foreground hover:text-rose-500 transition-all">
                    <Trash2 className="size-5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-10 border-t border-border flex justify-end">
              <Button disabled={items.length === 0} className="h-14 px-12 gap-3 bg-primary hover:bg-primary/90 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 transition-all">
                <Check className="size-5" /> Execute Transfer
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6 sticky top-24">
          <div className="rounded-[2rem] border border-border bg-card p-8 space-y-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 size-24 bg-violet-500/5 blur-3xl rounded-full -mr-12 -mt-12" />
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Transfer Guard</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                 <div className="size-8 rounded-xl bg-violet-500/10 text-violet-600 flex items-center justify-center shrink-0">
                    <Sparkles className="size-4" />
                 </div>
                 <p className="text-[10px] leading-relaxed text-muted-foreground font-bold uppercase">
                    Transfers are <strong className="text-foreground">instant</strong>. Items will be deducted from {sourceLoc || "Source"} and added to {targetLoc || "Target"} upon clicking execute.
                 </p>
              </div>
              <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                 <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <AlertCircle className="size-3.5" /> Validation Notice
                 </p>
                 <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
                    You cannot transfer more than the current available stock. Use reconciliation for inventory adjustments.
                 </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-card p-6 space-y-4 shadow-sm text-center">
             <div className="size-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-2">
                <Box className="size-6 text-muted-foreground/50" />
             </div>
             <p className="text-[11px] font-black text-foreground uppercase tracking-widest">Digital Waybill</p>
             <p className="text-[10px] text-muted-foreground">A digital transfer receipt will be generated for the receiving staff to sign.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
