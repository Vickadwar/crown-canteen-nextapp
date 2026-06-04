"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft, ChevronDown, ChevronRight,
  Building2, Calendar, FileText, Check,
  CircleDollarSign, Save, Sparkles,
} from "lucide-react";

// ── CustomSelect ──────────────────────────────────────────────────────────────

function CustomSelect({
  id, label, options, required, placeholder,
}: {
  id: string; label: string; required?: boolean; placeholder?: string;
  options: { value: string; label: string; color?: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function h(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div className="space-y-1.5" ref={ref}>
      <label htmlFor={id} className="text-[11px] font-semibold text-muted-foreground block">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <div className="relative">
        <button id={id} type="button" onClick={() => setOpen((o) => !o)}
          className={`w-full h-9 px-3.5 pr-9 rounded-xl border bg-card text-sm text-left flex items-center transition-all ${open ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-muted-foreground/40"}`}>
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
              <button key={o.value} type="button"
                onClick={() => { setValue(o.value); setOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-left hover:bg-muted transition-colors ${value === o.value ? "bg-primary/5 text-primary font-semibold" : "text-foreground"}`}>
                {o.color && <span className={`size-2 rounded-full shrink-0 ${o.color}`} />}
                {o.label}
                {value === o.value && <Check className="ml-auto size-3.5 text-primary" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Field ─────────────────────────────────────────────────────────────────────

function Field({ label, id, type = "text", placeholder, required, icon: Icon }: {
  label: string; id: string; type?: string; placeholder?: string;
  required?: boolean; icon?: React.ElementType;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-[11px] font-semibold text-muted-foreground block">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />}
        <input id={id} type={type} placeholder={placeholder}
          className={`w-full h-9 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${Icon ? "pl-9 pr-4" : "px-4"}`} />
      </div>
    </div>
  );
}

// ── CalendarPicker ────────────────────────────────────────────────────────────

function CalendarPicker({ id, label, required }: { id: string; label: string; required?: boolean }) {
  const today = new Date();
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selected, setSelected] = useState<Date | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const days = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const displayVal = selected ? selected.toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" }) : "";
  const prev = () => month === 0 ? (setMonth(11), setYear(y => y - 1)) : setMonth(m => m - 1);
  const next = () => month === 11 ? (setMonth(0), setYear(y => y + 1)) : setMonth(m => m + 1);
  return (
    <div className="space-y-1.5" ref={ref}>
      <label className="text-[11px] font-semibold text-muted-foreground block">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <div className="relative">
        <button id={id} type="button" onClick={() => setOpen(o => !o)}
          className={`w-full h-9 px-3.5 rounded-xl border bg-card text-sm text-left flex items-center gap-2 transition-all ${open ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-muted-foreground/40"}`}>
          <Calendar className="size-3.5 text-muted-foreground shrink-0" />
          {displayVal ? <span className="font-medium text-foreground flex-1">{displayVal}</span> : <span className="text-muted-foreground flex-1">Pick a date</span>}
          <ChevronDown className={`size-3.5 text-muted-foreground transition-transform shrink-0 ${open ? "rotate-180" : ""}`} />
        </button>
        {open && (
          <div className="absolute z-[200] top-full mt-1.5 w-72 rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 origin-top p-4">
            <div className="flex items-center justify-between mb-4">
              <button onClick={prev} className="size-8 flex items-center justify-center rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"><ChevronLeft className="size-4" /></button>
              <div className="text-center">
                <p className="text-[13px] font-black text-foreground">{months[month]}</p>
                <p className="text-[10px] text-muted-foreground">{year}</p>
              </div>
              <button onClick={next} className="size-8 flex items-center justify-center rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"><ChevronRight className="size-4" /></button>
            </div>
            <div className="grid grid-cols-7 mb-1.5">
              {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => <div key={d} className="text-[9px] font-bold text-muted-foreground text-center py-1">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-0.5">
              {Array.from({length: firstDay}).map((_,i) => <div key={`e${i}`} />)}
              {Array.from({length: days}).map((_,i) => {
                const d = i+1, date = new Date(year, month, d);
                const isSel = selected?.toDateString() === date.toDateString();
                const isToday = today.toDateString() === date.toDateString();
                return (
                  <button key={d} onClick={() => { setSelected(date); setOpen(false); }}
                    className={`size-9 rounded-xl text-[11px] font-semibold flex items-center justify-center transition-all ${isSel ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-110" : isToday ? "bg-primary/10 text-primary font-black ring-1 ring-primary/30" : "text-foreground hover:bg-muted"}`}>
                    {d}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
              <button onClick={() => setSelected(null)} className="text-[10px] font-semibold text-muted-foreground hover:text-foreground px-2 py-1 rounded-lg hover:bg-muted">Clear</button>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/50 rounded-lg px-2 py-1">
                <Calendar className="size-3" />{selected ? selected.toLocaleDateString("en-KE", {day:"numeric",month:"short",year:"numeric"}) : "No date"}
              </div>
              <button onClick={() => { setSelected(today); setOpen(false); }} className="text-[10px] font-bold text-primary hover:text-primary/80 px-2 py-1 rounded-lg hover:bg-primary/5">Today</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Steps config ──────────────────────────────────────────────────────────────

const steps = [
  { n: 1, label: "Employer",    icon: Building2,       desc: "Select billing account" },
  { n: 2, label: "Period",      icon: Calendar,        desc: "Cycle & date range" },
  { n: 3, label: "Line items",  icon: FileText,        desc: "Branch meal breakdown" },
  { n: 4, label: "Finalise",    icon: CircleDollarSign, desc: "Review & dispatch" },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function NewInvoicePage() {
  const [step, setStep] = useState(1);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">

      {/* Back */}
      <Link href="/billing">
        <button className="flex items-center gap-1.5 text-[11px] font-bold text-primary hover:text-primary/80 transition-colors mb-5 uppercase tracking-[0.15em]">
          <ChevronLeft className="size-3.5" /> Back to billing
        </button>
      </Link>

      <div className="grid lg:grid-cols-[260px_1fr] gap-6 items-start">

        {/* Left: step nav */}
        <div className="flex flex-col gap-3">

          {/* Hero card */}
          <div className="relative rounded-2xl border border-border bg-card p-6 overflow-hidden">
            <div className="absolute -top-8 -right-8 size-28 bg-primary/10 blur-2xl rounded-full" />
            <div className="relative z-10">
              <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <FileText className="size-5" />
              </div>
              <p className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] mb-1">New invoice</p>
              <h1 className="text-xl font-black text-foreground tracking-tight leading-tight mb-2">Create billing invoice</h1>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Complete 4 steps to generate an employer invoice and dispatch it via ERPNext.
              </p>
            </div>
          </div>

          {/* Step list */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            {steps.map((s, i) => {
              const done = step > s.n;
              const active = step === s.n;
              return (
                <button key={s.n} onClick={() => setStep(s.n)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all ${i < steps.length - 1 ? "border-b border-border" : ""} ${active ? "bg-primary/5" : "hover:bg-muted/50"}`}>
                  <div className={`size-8 rounded-xl flex items-center justify-center shrink-0 transition-all font-bold text-[11px] ${done ? "bg-emerald-500 text-white" : active ? "bg-primary text-primary-foreground shadow-md shadow-primary/25" : "bg-muted text-muted-foreground"}`}>
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

          {/* Tip */}
          <div className="rounded-2xl border border-primary/15 bg-primary/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="size-3.5 text-primary" />
              <p className="text-[11px] font-bold text-primary">Quick tip</p>
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              {step === 1 && "Select the correct employer account — this determines which ERPNext customer the Sales Invoice is issued against."}
              {step === 2 && "Billing cycles sync automatically with meal logs. Ensure the cycle period matches the ERPNext payroll period."}
              {step === 3 && "Line items are pre-populated from meal records. Adjust only if a branch reconciliation was performed manually."}
              {step === 4 && "Dispatching will create a Sales Invoice in ERPNext and email the PDF to the employer's registered billing address."}
            </p>
          </div>
        </div>

        {/* Right: form */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-border bg-card p-6">

            {/* Step header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                {step === 1 && <Building2 className="size-4" />}
                {step === 2 && <Calendar className="size-4" />}
                {step === 3 && <FileText className="size-4" />}
                {step === 4 && <CircleDollarSign className="size-4" />}
              </div>
              <div>
                <p className="text-sm font-black text-foreground leading-none">
                  {step === 1 && "Select employer account"}
                  {step === 2 && "Billing period & cycle"}
                  {step === 3 && "Branch meal line items"}
                  {step === 4 && "Review & finalise"}
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

            {/* Step 1: Employer */}
            {step === 1 && (
              <div className="grid sm:grid-cols-2 gap-4">
                <CustomSelect label="Employer / Institution" id="employer" required options={[
                  { value: "crown", label: "Crown Paints Kenya PLC" },
                  { value: "forza", label: "Forza Consultants" },
                  { value: "logistics", label: "Logistics Hub Ltd" },
                  { value: "oduk", label: "ODUK Tech Limited" },
                  { value: "nova", label: "NovaBuild Contractors" },
                ]} />
                <Field label="Contact person" id="contact" placeholder="e.g. Jane Doe" icon={Building2} />
                <Field label="Billing email" id="billing-email" type="email" placeholder="finance@company.co.ke" required />
                <Field label="Purchase order no." id="po-number" placeholder="e.g. PO-2026-045 (optional)" />
                <CustomSelect label="Subsidy model" id="subsidy" required options={[
                  { value: "full",    label: "100% employer subsidy",   color: "bg-emerald-500" },
                  { value: "partial", label: "Partial subsidy (fixed)",  color: "bg-amber-500" },
                  { value: "pct",     label: "Partial subsidy (%)",      color: "bg-blue-500" },
                  { value: "none",    label: "Employee pays full price" },
                ]} />
                <CustomSelect label="VAT treatment" id="vat" required options={[
                  { value: "vat16",   label: "VAT inclusive 16%" },
                  { value: "exempt",  label: "VAT exempt" },
                  { value: "zero",    label: "Zero-rated" },
                ]} />
              </div>
            )}

            {/* Step 2: Period */}
            {step === 2 && (
              <div className="grid sm:grid-cols-2 gap-4">
                <CustomSelect label="Billing cycle" id="cycle" required options={[
                  { value: "weekly",     label: "Weekly",     color: "bg-blue-500" },
                  { value: "biweekly",   label: "Bi-Weekly",  color: "bg-primary" },
                  { value: "monthly",    label: "Monthly",    color: "bg-violet-500" },
                ]} />
                <CalendarPicker label="Invoice date" id="inv-date" required />
                <CalendarPicker label="Period start" id="period-start" required />
                <CalendarPicker label="Period end"   id="period-end"   required />
                <CalendarPicker label="Payment due date" id="due-date" required />
                <CustomSelect label="Currency" id="currency" options={[
                  { value: "kes", label: "KES — Kenyan Shilling" },
                  { value: "usd", label: "USD — US Dollar" },
                ]} />
              </div>
            )}

            {/* Step 3: Line items */}
            {step === 3 && (
              <div className="space-y-4">
                <p className="text-[11px] text-muted-foreground">Meal counts are pulled from the attendance log. Adjust if needed before finalising.</p>
                <div className="rounded-xl border border-border overflow-hidden">
                  <div className="grid grid-cols-[minmax(0,1.4fr)_90px_90px_120px] px-4 py-2.5 bg-muted/40 border-b border-border">
                    {["Branch", "Normal meals", "Special meals", "Subtotal (KES)"].map(h => (
                      <span key={h} className="text-[11px] font-semibold text-muted-foreground">{h}</span>
                    ))}
                  </div>
                  {["Nairobi HQ","Mombasa Plant","Kisumu Depot","Eldoret Hub","Nakuru Office"].map((branch) => (
                    <div key={branch} className="grid grid-cols-[minmax(0,1.4fr)_90px_90px_120px] items-center px-4 py-3 border-b border-border last:border-0">
                      <span className="text-[12px] font-semibold text-foreground">{branch}</span>
                      <input type="number" defaultValue={Math.floor(Math.random()*500+100)}
                        className="h-8 w-20 rounded-lg border border-border bg-card px-2 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                      <input type="number" defaultValue={Math.floor(Math.random()*80+10)}
                        className="h-8 w-20 rounded-lg border border-border bg-card px-2 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                      <span className="text-[12px] font-bold text-foreground">–</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 space-y-1.5">
                    <label className="text-[11px] font-semibold text-muted-foreground">Normal meal rate (KES)</label>
                    <input type="number" defaultValue={250}
                      className="w-full h-9 px-4 rounded-xl border border-border bg-card text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label className="text-[11px] font-semibold text-muted-foreground">Special meal rate (KES)</label>
                    <input type="number" defaultValue={400}
                      className="w-full h-9 px-4 rounded-xl border border-border bg-card text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <div className="space-y-5">
                {/* Summary */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { label: "Employer",      value: "Crown Paints Kenya PLC" },
                    { label: "Cycle",         value: "Bi-Weekly"               },
                    { label: "Period",        value: "May 01 – 15, 2026"       },
                    { label: "Due date",      value: "May 22, 2026"            },
                    { label: "Total meals",   value: "4,502"                   },
                    { label: "Gross amount",  value: "KES 1,241,200"           },
                    { label: "Credit",        value: "– KES 700"               },
                    { label: "Net payable",   value: "KES 1,240,500"           },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                      <span className="text-[11px] text-muted-foreground">{row.label}</span>
                      <span className="text-[12px] font-bold text-foreground">{row.value}</span>
                    </div>
                  ))}
                </div>

                {/* Dispatch notice */}
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex items-start gap-3">
                  <div className="size-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                    <CircleDollarSign className="size-4" />
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-foreground mb-0.5">Ready to dispatch</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Clicking &quot;Create invoice&quot; will generate an ERPNext Sales Invoice and email a PDF to the employer&apos;s registered billing address automatically.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}
              className="h-8 px-4 rounded-xl border border-border bg-card text-[11px] font-semibold text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:pointer-events-none transition-all">
              ← Previous
            </button>
            <div className="flex gap-2">
              <button className="h-8 px-4 rounded-xl border border-border bg-card text-[11px] font-semibold text-muted-foreground hover:bg-muted transition-all">
                Save draft
              </button>
              {step < 4 ? (
                <button onClick={() => setStep(step + 1)}
                  className="h-8 px-5 rounded-xl bg-primary text-primary-foreground text-[11px] font-bold hover:bg-primary/90 shadow-md shadow-primary/25 transition-all">
                  Continue →
                </button>
              ) : (
                <button className="h-8 px-5 rounded-xl bg-primary text-primary-foreground text-[11px] font-bold hover:bg-primary/90 shadow-md shadow-primary/25 transition-all flex items-center gap-1.5">
                  <Save className="size-3.5" /> Create invoice
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
