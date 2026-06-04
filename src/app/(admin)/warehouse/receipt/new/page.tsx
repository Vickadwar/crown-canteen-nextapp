"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft, ChevronDown, Check, Save,
  Package, Calendar, Truck, User,
  FileText, Plus, X, Trash2, ArrowRight,
  AlertCircle, Sparkles, Building, ChevronRight,
  Shield, ShoppingBag, DownloadCloud, Activity
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
      <label htmlFor={id} className="text-[11px] font-semibold text-muted-foreground block">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <div className="relative">
        <button
          id={id} type="button" onClick={() => setOpen((o) => !o)}
          className={`w-full h-9 px-3.5 pr-9 rounded-xl border bg-card text-sm text-left flex items-center transition-all ${open ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-muted-foreground/40"}`}
        >
          {selected ? (
            <span className="flex items-center gap-2">
              {selected.color && <span className={`size-2 rounded-full ${selected.color}`} />}
              <span className="font-medium text-foreground">{selected.label}</span>
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder ?? `Select ${label.toLowerCase()}`}</span>
          )}
        </button>
        <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />

        {open && (
          <div className="absolute z-50 top-full mt-1.5 w-full rounded-xl border border-border bg-card shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 origin-top">
            {options.map((o) => (
              <button
                key={o.value} type="button" onClick={() => { onChange(o.value); setOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-left hover:bg-muted transition-colors ${value === o.value ? "bg-primary/5 text-primary font-semibold" : "text-foreground"}`}
              >
                {o.color && <span className={`size-2 rounded-full shrink-0 ${o.color}`} />}
                <div className="min-w-0">
                   <p className="leading-none">{o.label}</p>
                   {o.sub && <p className="text-[10px] text-muted-foreground mt-1">{o.sub}</p>}
                </div>
                {value === o.value && <Check className="ml-auto size-3.5 text-primary" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Calendar Picker (Strict Pattern) ──────────────────────────────────────────

function CalendarPicker({ label, id, required, value, onChange }: { label: string; id: string; required?: boolean; value: string; onChange: (v: string) => void }) {
  const today = new Date();
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  return (
    <div className="space-y-1.5" ref={ref}>
      <label htmlFor={id} className="text-[11px] font-semibold text-muted-foreground block">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <div className="relative">
        <button
          id={id} type="button" onClick={() => setOpen((o) => !o)}
          className={`w-full h-9 px-3.5 pr-9 rounded-xl border bg-card text-sm text-left flex items-center gap-2 transition-all ${open ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-muted-foreground/40"}`}
        >
          <Calendar className="size-3.5 text-muted-foreground shrink-0" />
          {value ? (
            <span className="font-medium text-foreground">{value}</span>
          ) : (
            <span className="text-muted-foreground">Pick a date</span>
          )}
        </button>

        {open && (
          <div className="absolute z-50 top-full mt-1.5 w-64 rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 origin-top p-3">
            <div className="flex items-center justify-between mb-3">
              <button onClick={prevMonth} className="size-7 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                <ChevronLeft className="size-4" />
              </button>
              <span className="text-[12px] font-bold text-foreground">{monthNames[month]} {year}</span>
              <button onClick={nextMonth} className="size-7 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                <ChevronRight className="size-4" />
              </button>
            </div>
            <div className="grid grid-cols-7 mb-1">
              {dayNames.map((d) => (
                <div key={d} className="text-[9px] font-bold text-muted-foreground text-center py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-0.5">
              {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const isSelected = value === dStr;
                const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
                return (
                  <button
                    key={day}
                    onClick={() => { onChange(dStr); setOpen(false); }}
                    className={`size-8 rounded-lg text-[11px] font-semibold flex items-center justify-center transition-all
                      ${isSelected ? "bg-primary text-primary-foreground shadow-md" :
                        isToday ? "bg-primary/10 text-primary font-bold" :
                        "text-foreground hover:bg-muted"}`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Text Input ────────────────────────────────────────────────────────────────

function Field({
  label, id, type = "text", placeholder, required, icon: Icon, value, onChange
}: {
  label: string; id: string; type?: string; placeholder?: string; required?: boolean; icon?: any; value?: string; onChange?: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-[11px] font-semibold text-muted-foreground block">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />}
        <input
          id={id} type={type} placeholder={placeholder} value={value} onChange={e => onChange?.(e.target.value)}
          className={`w-full h-9 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${Icon ? "pl-9 pr-4" : "px-4"}`}
        />
      </div>
    </div>
  );
}

// ── Step config ───────────────────────────────────────────────────────────────

const steps = [
  { n: 1, label: "Logistics",    icon: Truck,      desc: "Vendor & source details" },
  { n: 2, label: "Line Items",   icon: Package,    desc: "SKUs & quantities" },
  { n: 3, label: "Confirmation", icon: Shield,     desc: "Final audit & ledger" },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function NewStockReceiptPage() {
  const [step, setStep] = useState(1);
  const [vendor, setVendor] = useState("");
  const [warehouse, setWarehouse] = useState("main");
  const [date, setDate] = useState("");
  const [refNo, setRefNo] = useState("");
  const [items, setItems] = useState([{ id: Date.now(), sku: "", qty: 1, rate: 0 }]);

  const addItem = () => setItems([...items, { id: Date.now(), sku: "", qty: 1, rate: 0 }]);
  const removeItem = (id: number) => setItems(items.filter(i => i.id !== id));
  const updateItem = (id: number, field: string, val: any) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: val } : i));
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">

      {/* Back Link */}
      <Link href="/warehouse">
        <button className="flex items-center gap-1.5 text-[11px] font-bold text-primary hover:text-primary/80 transition-colors mb-5 uppercase tracking-[0.15em]">
          <ChevronLeft className="size-3.5" /> Back to warehouse
        </button>
      </Link>

      <div className="grid lg:grid-cols-[260px_1fr] gap-6 items-start">

        {/* Left Sidebar: Steps */}
        <div className="flex flex-col gap-3">
          <div className="relative rounded-2xl border border-border bg-card p-6 overflow-hidden">
            <div className="absolute -top-8 -right-8 size-28 bg-primary/10 blur-2xl rounded-full" />
            <div className="relative z-10">
              <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <DownloadCloud className="size-5" />
              </div>
              <p className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] mb-1">Inbound Logistics</p>
              <h1 className="text-xl font-black text-foreground tracking-tight leading-tight mb-2">New stock receipt</h1>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Log a Good Receipt Note (GRN) to update warehouse stock and financial records.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            {steps.map((s, i) => {
              const done = step > s.n; const active = step === s.n;
              return (
                <button key={s.n} onClick={() => setStep(s.n)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all ${i < steps.length - 1 ? "border-b border-border" : ""} ${active ? "bg-primary/5" : "hover:bg-muted/50"}`}>
                  <div className={`size-8 rounded-xl flex items-center justify-center shrink-0 transition-all font-bold text-[11px]
                    ${done ? "bg-emerald-500 text-white" : active ? "bg-primary text-primary-foreground shadow-md shadow-primary/25" : "bg-muted text-muted-foreground"}`}>
                    {done ? <Check className="size-4" /> : <s.icon className="size-4" />}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-[12px] font-bold leading-none mb-0.5 ${active ? "text-primary" : done ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</p>
                    <p className="text-[10px] text-muted-foreground leading-none">{s.desc}</p>
                  </div>
                  {active && <div className="ml-auto size-1.5 rounded-full bg-primary" />}
                </button>
              );
            })}
          </div>

          <div className="rounded-2xl border border-primary/15 bg-primary/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="size-3.5 text-primary" />
              <p className="text-[11px] font-bold text-primary">Logistics tip</p>
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              {step === 1 && "Ensure the LPO number matches the physical delivery note to prevent payment delays."}
              {step === 2 && "Double check unit weights. 1 Bag of Rice is 50kg in the system."}
              {step === 3 && "Once posted, stock levels are updated instantly across all branch outlets."}
            </p>
          </div>
        </div>

        {/* Right Panel: Form */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                {step === 1 && <Truck className="size-4" />}
                {step === 2 && <Package className="size-4" />}
                {step === 3 && <Shield className="size-4" />}
              </div>
              <div>
                <p className="text-sm font-black text-foreground leading-none">
                  {step === 1 && "Source & details"}
                  {step === 2 && "Capture stock items"}
                  {step === 3 && "Post to ledger"}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Step {step} of {steps.length}</p>
              </div>
              <div className="ml-auto flex gap-1">
                {steps.map((s) => (
                  <div key={s.n} className={`h-1 rounded-full transition-all duration-300 ${s.n <= step ? "bg-primary" : "bg-muted"} ${s.n === step ? "w-8" : "w-3"}`} />
                ))}
              </div>
            </div>

            <div className="h-px bg-border mb-5" />

            {/* Step 1: Logistics */}
            {step === 1 && (
              <div className="grid sm:grid-cols-2 gap-4">
                <CustomSelect id="vendor" label="Vendor / Source" value={vendor} onChange={setVendor} required options={[
                  { value: "fresh", label: "Fresh Produce Ltd", sub: "Priority Supplier" },
                  { value: "crown", label: "Crown Kitchens", sub: "Internal Transfer" },
                  { value: "golden", label: "Golden Grain Mills" },
                ]} />
                <CustomSelect id="warehouse" label="Target Warehouse" value={warehouse} onChange={setWarehouse} required options={[
                  { value: "main", label: "Main Kitchen Stores", color: "bg-emerald-500" },
                  { value: "cold", label: "Cold Room Alpha", color: "bg-blue-500" },
                ]} />
                <CalendarPicker id="date" label="Receipt date" value={date} onChange={setDate} required />
                <Field id="ref" label="LPO / Invoice reference" placeholder="e.g. LPO-2026-X9" value={refNo} onChange={setRefNo} required icon={FileText} />
              </div>
            )}

            {/* Step 2: Line Items */}
            {step === 2 && (
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Receipt items</p>
                    <Button onClick={addItem} variant="ghost" size="sm" className="h-7 text-[10px] font-bold text-primary gap-1.5 hover:bg-primary/5">
                       <Plus className="size-3" /> Add item
                    </Button>
                 </div>
                 <div className="space-y-3">
                    {items.map((item, idx) => (
                       <div key={item.id} className="grid grid-cols-[1fr_80px_100px_40px] gap-3 items-end p-3 rounded-xl bg-muted/30 border border-border/50 animate-in slide-in-from-right-2 duration-200">
                          <div className="space-y-1.5">
                             <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">SKU / Item</label>
                             <select value={item.sku} onChange={e => updateItem(item.id, 'sku', e.target.value)} className="w-full h-8 px-2 rounded-lg border border-border bg-card text-[12px] outline-none">
                                <option value="">Select SKU...</option>
                                <option value="rice">Rice (Basmati) 50kg</option>
                                <option value="beef">Beef Cuts (Prime)</option>
                                <option value="oil">Cooking Oil 20L</option>
                             </select>
                          </div>
                          <div className="space-y-1.5 text-center">
                             <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Qty</label>
                             <input type="number" value={item.qty} onChange={e => updateItem(item.id, 'qty', e.target.value)} className="w-full h-8 text-center rounded-lg border border-border bg-card text-[12px] outline-none" />
                          </div>
                          <div className="space-y-1.5 text-right">
                             <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Rate (KES)</label>
                             <input type="number" value={item.rate} onChange={e => updateItem(item.id, 'rate', e.target.value)} className="w-full h-8 text-right px-2 rounded-lg border border-border bg-card text-[12px] outline-none" />
                          </div>
                          <button onClick={() => removeItem(item.id)} className="h-8 flex items-center justify-center text-muted-foreground hover:text-rose-500 transition-colors">
                             <Trash2 className="size-3.5" />
                          </button>
                       </div>
                    ))}
                 </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
              <div className="space-y-5">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-border bg-muted/20">
                       <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Total Items</p>
                       <p className="text-xl font-black text-foreground">{items.length} SKUs</p>
                    </div>
                    <div className="p-4 rounded-xl border border-border bg-muted/20">
                       <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Receipt Value</p>
                       <p className="text-xl font-black text-primary">KES {items.reduce((a,b) => a + (parseFloat(b.qty as any)||0)*(parseFloat(b.rate as any)||0), 0).toLocaleString()}</p>
                    </div>
                 </div>
                 <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex items-start gap-3">
                  <div className="size-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                    <Shield className="size-4" />
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-foreground mb-0.5">Ready to post</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Posting will generate a <strong className="text-foreground uppercase">Stock Ledger</strong> entry. This action cannot be undone once committed to the ERP core.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1} className="h-8 px-4 rounded-xl border border-border bg-card text-[11px] font-semibold text-muted-foreground hover:bg-muted disabled:opacity-40 transition-all">← Previous</button>
            <div className="flex gap-2">
              <button className="h-8 px-4 rounded-xl border border-border bg-card text-[11px] font-semibold text-muted-foreground hover:bg-muted transition-all">Save draft</button>
              {step < 3 ? (
                <button onClick={() => setStep(step + 1)} className="h-8 px-5 rounded-xl bg-primary text-primary-foreground text-[11px] font-bold hover:bg-primary/90 shadow-md transition-all">Continue →</button>
              ) : (
                <button className="h-8 px-5 rounded-xl bg-primary text-primary-foreground text-[11px] font-bold hover:bg-primary/90 shadow-md transition-all flex items-center gap-1.5">
                  <Save className="size-3.5" /> Post receipt
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
