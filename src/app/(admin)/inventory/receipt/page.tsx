"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft, ChevronDown, Check, Save,
  Package, Calendar, Truck, User,
  FileText, Plus, X, Trash2, ArrowRight,
  AlertCircle, Sparkles, Building
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

function CalendarPicker({ label, value, onChange, required }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-black text-muted-foreground uppercase tracking-wider">{label} {required && "*"}</label>
      <div className="relative">
        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input type="date" value={value} onChange={e => onChange(e.target.value)}
          className="w-full h-11 pl-11 pr-4 rounded-xl border border-border bg-card text-sm text-foreground font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function StockReceiptPage() {
  const [step, setStep] = useState(1);
  const [vendor, setVendor] = useState("");
  const [warehouse, setWarehouse] = useState("main");
  const [receiptDate, setReceiptDate] = useState(new Date().toISOString().split('T')[0]);
  const [reference, setReference] = useState("");
  const [items, setItems] = useState([{ id: Date.now(), sku: "", qty: 1, unit: "kg", rate: 0 }]);

  const addItem = () => setItems([...items, { id: Date.now(), sku: "", qty: 1, unit: "kg", rate: 0 }]);
  const removeItem = (id: number) => setItems(items.filter(i => i.id !== id));
  const updateItem = (id: number, field: string, val: any) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: val } : i));
  };

  const totalAmount = items.reduce((sum, item) => sum + (item.qty * item.rate), 0);

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
            <p className="text-[11px] font-black text-primary uppercase tracking-[0.25em] mb-1.5">Warehouse Log</p>
            <h1 className="text-3xl font-black text-foreground tracking-tight leading-none">Stock Receipt (GRN)</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <div className="h-10 px-5 rounded-2xl bg-muted/50 flex items-center justify-center border border-border">
              <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Progress: Step {step} of 2</span>
           </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
        <div className="space-y-6">
          
          {step === 1 && (
            <div className="rounded-[2.5rem] border border-border bg-card p-10 space-y-10 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 size-40 bg-primary/5 blur-[100px] rounded-full" />
              
              <div className="flex items-center gap-4 relative z-10">
                <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
                  <Truck className="size-6" />
                </div>
                <div>
                  <p className="text-base font-black text-foreground tracking-tight">Source & Destination</p>
                  <p className="text-xs text-muted-foreground font-bold tracking-tight mt-0.5">Define vendor origin and target storage</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 relative z-10">
                <CustomSelect
                  label="Vendor / Source"
                  value={vendor}
                  onChange={setVendor}
                  placeholder="Select approved vendor…"
                  options={[
                    { value: "fresh", label: "Fresh Produce Ltd", sub: "Priority · Net 30" },
                    { value: "crown", label: "Crown Kitchens", sub: "Internal Transfer" },
                    { value: "golden", label: "Golden Grain Mills", sub: "Bulk Supplies" },
                  ]}
                />
                <CustomSelect
                  label="Target Warehouse"
                  value={warehouse}
                  onChange={setWarehouse}
                  options={[
                    { value: "main", label: "Main Kitchen Stores", color: "bg-emerald-500" },
                    { value: "cold", label: "Cold Room Alpha", color: "bg-blue-500" },
                  ]}
                />
                <CalendarPicker
                  label="Receipt Date"
                  value={receiptDate}
                  onChange={setReceiptDate}
                />
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-muted-foreground uppercase tracking-wider">Reference (LPO / Invoice)</label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input
                      value={reference}
                      onChange={e => setReference(e.target.value)}
                      placeholder="e.g. LPO-2026-X4"
                      className="w-full h-11 pl-11 pr-4 rounded-xl border border-border bg-card text-sm text-foreground font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-inner"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 flex justify-end">
                <Button onClick={() => setStep(2)} className="h-14 px-10 gap-3 bg-primary hover:bg-primary/90 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 transition-all">
                  Continue to Items <ArrowRight className="size-5" />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="rounded-[2.5rem] border border-border bg-card p-10 space-y-10 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 size-40 bg-emerald-500/5 blur-[100px] rounded-full" />
              
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shadow-inner">
                    <Package className="size-6" />
                  </div>
                  <div>
                    <p className="text-base font-black text-foreground tracking-tight">Line Item Entry</p>
                    <p className="text-xs text-muted-foreground font-bold tracking-tight mt-0.5">Specify quantity and item valuation</p>
                  </div>
                </div>
                <Button onClick={addItem} variant="outline" className="h-10 gap-2 border-dashed rounded-xl px-5 font-black text-[10px] uppercase tracking-widest">
                  <Plus className="size-4" /> Add Item
                </Button>
              </div>

              <div className="space-y-6 relative z-10">
                {items.map((item, idx) => (
                  <div key={item.id} className="grid md:grid-cols-[2.5fr_100px_100px_140px_50px] gap-6 items-end group animate-in slide-in-from-right-4 duration-300">
                    <div className="space-y-1.5">
                      {idx === 0 && <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">SKU / Catalog Item</label>}
                      <CustomSelect
                        id={`sku-${item.id}`}
                        label=""
                        value={item.sku}
                        onChange={(v: string) => updateItem(item.id, "sku", v)}
                        placeholder="Search Item Catalog…"
                        options={[
                          { value: "rice", label: "Rice (Basmati) 50kg" },
                          { value: "beef", label: "Beef Cuts (Prime)" },
                          { value: "oil",  label: "Cooking Oil 20L" },
                        ]}
                      />
                    </div>
                    <div className="space-y-1.5">
                      {idx === 0 && <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Qty</label>}
                      <input type="number" value={item.qty} onChange={e => updateItem(item.id, "qty", parseFloat(e.target.value))}
                        className="w-full h-12 px-4 rounded-2xl border border-border bg-card text-sm text-center font-black shadow-sm" />
                    </div>
                    <div className="space-y-1.5">
                      {idx === 0 && <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Unit</label>}
                      <div className="w-full h-12 flex items-center justify-center rounded-2xl bg-muted/50 border border-border text-[11px] font-black text-muted-foreground/70 uppercase">
                        {item.unit}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      {idx === 0 && <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right mr-1">Unit Rate (KES)</label>}
                      <input type="number" value={item.rate} onChange={e => updateItem(item.id, "rate", parseFloat(e.target.value))}
                        className="w-full h-12 px-5 rounded-2xl border border-border bg-card text-sm text-right font-black shadow-sm" />
                    </div>
                    <button onClick={() => removeItem(item.id)} className="h-12 flex items-center justify-center text-muted-foreground hover:text-rose-500 transition-all">
                      <Trash2 className="size-5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-10 border-t border-border relative z-10">
                <Button onClick={() => setStep(1)} variant="ghost" className="h-12 px-8 rounded-xl font-black text-[11px] uppercase tracking-widest">
                  Back to Header
                </Button>
                <Button className="h-14 px-12 gap-3 bg-emerald-600 hover:bg-emerald-700 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-200 transition-all">
                  <Save className="size-5" /> Post Receipt
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Summary Sidebar */}
        <div className="space-y-6 sticky top-24">
          <div className="rounded-[2rem] border border-border bg-card p-8 space-y-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 size-24 bg-primary/5 blur-3xl rounded-full -mr-12 -mt-12" />
            <div className="flex items-center gap-3 relative z-10">
               <FileText className="size-5 text-primary" />
               <h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground">Transaction Log</h3>
            </div>
            
            <div className="space-y-5 relative z-10">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Line Items</span>
                <span className="text-lg font-black text-foreground">{items.length} SKU(s)</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Quantity</span>
                <span className="text-lg font-black text-foreground">{items.reduce((a, b) => a + (b.qty || 0), 0)}</span>
              </div>
              <div className="pt-6 border-t border-border">
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Grand Total Value</p>
                <p className="text-3xl font-black text-foreground tracking-tight tabular-nums">
                  <span className="text-sm font-bold text-muted-foreground mr-2 tracking-normal uppercase">KES</span>
                  {totalAmount.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="p-5 rounded-[1.5rem] bg-blue-500/5 border border-blue-500/10 flex items-start gap-3 relative z-10">
              <AlertCircle className="size-5 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-[10px] leading-relaxed text-muted-foreground font-bold uppercase tracking-tight">
                Posting this transaction will update <strong className="text-foreground underline decoration-blue-500/50">real-time stock levels</strong> and sync financial ledger values.
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-card p-6 space-y-4 shadow-sm">
             <div className="flex items-center gap-3">
                <div className="size-8 rounded-xl bg-violet-500/10 text-violet-600 flex items-center justify-center">
                   <Sparkles className="size-4" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Procurement Note</span>
             </div>
             <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
                Ensure all physical counts match the delivery note before posting. Discrepancies should be logged as <strong className="text-foreground">Damaged</strong> or <strong className="text-foreground">Rejected</strong> in the audit screen.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
