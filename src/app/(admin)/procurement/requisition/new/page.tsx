"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft, ChevronDown, Check, Save,
  ClipboardList, Package, User,
  FileText, Plus, Trash2,
  AlertCircle, Sparkles, Building, Box, Shield,
  Activity, DollarSign, Calendar
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
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const today = new Date();

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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
          <span className={`font-medium ${value ? "text-foreground" : "text-muted-foreground"}`}>{value || "Pick a date"}</span>
        </button>
        {open && (
           <div className="absolute z-50 top-full mt-1.5 w-64 rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 origin-top p-3 text-center">
              <input type="date" value={value} onChange={e => { onChange(e.target.value); setOpen(false); }} className="w-full text-sm p-2 outline-none" />
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
  { n: 1, label: "Request Info", icon: ClipboardList, desc: "Basic intent & dept" },
  { n: 2, label: "Item List",    icon: Package,       desc: "SKUs & quantities" },
  { n: 3, label: "Review",       icon: Shield,        desc: "Approval & submission" },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function NewRequisitionPage() {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [dept, setDept] = useState("");
  const [date, setDate] = useState("");
  const [items, setItems] = useState([{ id: Date.now(), sku: "", qty: 1 }]);

  const addItem = () => setItems([...items, { id: Date.now(), sku: "", qty: 1 }]);
  const removeItem = (id: number) => setItems(items.filter(i => i.id !== id));
  const updateItem = (id: number, field: string, val: any) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: val } : i));
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">

      {/* Back Link */}
      <Link href="/procurement">
        <button className="flex items-center gap-1.5 text-[11px] font-bold text-primary hover:text-primary/80 transition-colors mb-5 uppercase tracking-[0.15em]">
          <ChevronLeft className="size-3.5" /> Back to procurement
        </button>
      </Link>

      <div className="grid lg:grid-cols-[260px_1fr] gap-6 items-start">

        {/* Left Sidebar */}
        <div className="flex flex-col gap-3">
          <div className="relative rounded-2xl border border-border bg-card p-6 overflow-hidden">
            <div className="absolute -top-8 -right-8 size-28 bg-primary/10 blur-2xl rounded-full" />
            <div className="relative z-10">
              <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <ClipboardList className="size-5" />
              </div>
              <p className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] mb-1">Purchase Request</p>
              <h1 className="text-xl font-black text-foreground tracking-tight leading-tight mb-2">New requisition</h1>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Initiate a procurement request for kitchen supplies or equipment.
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
              <p className="text-[11px] font-bold text-primary">Procurement tip</p>
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
               {step === 1 && "Categorize your request correctly to ensure it reaches the right department for approval."}
               {step === 2 && "Adding specific SKU codes helps the procurement team find the exact match from our suppliers."}
            </p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                {step === 1 && <FileText className="size-4" />}
                {step === 2 && <Package className="size-4" />}
                {step === 3 && <Shield className="size-4" />}
              </div>
              <div>
                <p className="text-sm font-black text-foreground leading-none">
                  {step === 1 && "Request details"}
                  {step === 2 && "Procurement list"}
                  {step === 3 && "Submission summary"}
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

            {/* Step 1: Details */}
            {step === 1 && (
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                   <Field id="title" label="Requisition Title" placeholder="e.g. Monthly Restock - Dry Goods" value={title} onChange={setTitle} required icon={FileText} />
                </div>
                <CustomSelect id="dept" label="Requesting Department" value={dept} onChange={setDept} required options={[
                  { value: "it",    label: "IT Department" },
                  { value: "kitchen", label: "Main Kitchen" },
                  { value: "hr",    label: "Human Resources" },
                ]} />
                <CalendarPicker id="date" label="Required By Date" value={date} onChange={setDate} required />
              </div>
            )}

            {/* Step 2: Items */}
            {step === 2 && (
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Item details</p>
                    <Button onClick={addItem} variant="ghost" size="sm" className="h-7 text-[10px] font-bold text-primary gap-1.5 hover:bg-primary/5">
                       <Plus className="size-3" /> Add item
                    </Button>
                 </div>
                 <div className="space-y-3">
                    {items.map((item, idx) => (
                       <div key={item.id} className="grid grid-cols-[1fr_100px_40px] gap-3 items-end p-3 rounded-xl bg-muted/30 border border-border/50 animate-in slide-in-from-right-2 duration-200">
                          <div className="space-y-1.5">
                             <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Item Description / SKU</label>
                             <CustomSelect id={`sku-${item.id}`} label="" value={item.sku} onChange={(v) => updateItem(item.id, 'sku', v)} placeholder="Select SKU..." options={[
                                { value: "rice", label: "Rice (Basmati) 50kg" },
                                { value: "beef", label: "Beef Cuts (Prime)" },
                             ]} />
                          </div>
                          <div className="space-y-1.5 text-center">
                             <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Qty</label>
                             <input type="number" value={item.qty} onChange={e => updateItem(item.id, 'qty', e.target.value)} className="w-full h-8 text-center rounded-lg border border-border bg-card text-[12px] outline-none" />
                          </div>
                          <button onClick={() => removeItem(item.id)} className="h-8 flex items-center justify-center text-muted-foreground hover:text-rose-500 transition-colors">
                             <Trash2 className="size-3.5" />
                          </button>
                       </div>
                    ))}
                 </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="space-y-5">
                 <div className="p-5 rounded-2xl border border-border bg-muted/20">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-3 tracking-widest">Requisition Summary</p>
                    <div className="space-y-2">
                       <div className="flex justify-between">
                          <span className="text-xs text-muted-foreground font-medium">Title:</span>
                          <span className="text-xs text-foreground font-bold">{title}</span>
                       </div>
                       <div className="flex justify-between">
                          <span className="text-xs text-muted-foreground font-medium">Total Items:</span>
                          <span className="text-xs text-foreground font-bold">{items.length} Units</span>
                       </div>
                    </div>
                 </div>
                 <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-3">
                  <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Activity className="size-4" />
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-foreground mb-0.5">Approval Workflow</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                       This request will be routed to your <strong className="text-foreground">HOD</strong> for initial approval before moving to the Procurement Team.
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
                  <Save className="size-3.5" /> Submit request
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
