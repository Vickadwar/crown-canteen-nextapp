"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft, ChevronDown, ChevronRight, ChevronUp, Calendar,
  Check, Save, Truck, MapPin, Mail, Phone, Globe, Package,
  ShieldCheck, FileText, Plus, Sparkles, Star, ExternalLink,
} from "lucide-react";

// ── CustomSelect ───────────────────────────────────────────────────────────────
function CustomSelect({ id, label, options, required, placeholder, defaultValue }: {
  id: string; label: string; required?: boolean; placeholder?: string; defaultValue?: string;
  options: { value: string; label: string; color?: string; sub?: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue ?? "");
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const sel = options.find(o => o.value === value);
  return (
    <div className="space-y-1.5" ref={ref}>
      <label htmlFor={id} className="text-[11px] font-semibold text-muted-foreground block">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <div className="relative">
        <button id={id} type="button" onClick={() => setOpen(o => !o)}
          className={`w-full h-9 px-3.5 rounded-xl border bg-card text-sm text-left flex items-center gap-2.5 transition-all ${open ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-muted-foreground/40"}`}>
          {sel?.color && <span className={`size-2 rounded-full shrink-0 ${sel.color}`} />}
          <span className={`flex-1 font-medium ${sel ? "text-foreground" : "text-muted-foreground"}`}>{sel?.label ?? placeholder ?? `Select ${label.toLowerCase()}`}</span>
          <ChevronDown className={`size-3.5 text-muted-foreground transition-transform duration-200 shrink-0 ${open ? "rotate-180" : ""}`} />
        </button>
        {open && (
          <div className="absolute z-[200] top-full mt-1.5 w-full rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 origin-top">
            {options.map(o => (
              <button key={o.value} type="button" onClick={() => { setValue(o.value); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/60 transition-colors border-b border-border/50 last:border-0 ${value === o.value ? "bg-primary/5" : ""}`}>
                {o.color && <span className={`size-2 rounded-full shrink-0 ${o.color}`} />}
                <div className="flex-1 min-w-0">
                  <p className={`text-[12px] font-semibold ${value === o.value ? "text-primary" : "text-foreground"}`}>{o.label}</p>
                  {o.sub && <p className="text-[10px] text-muted-foreground">{o.sub}</p>}
                </div>
                {value === o.value && <Check className="size-3.5 text-primary shrink-0" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── CalendarPicker ─────────────────────────────────────────────────────────────
function CalendarPicker({ id, label, required, defaultDate }: { id: string; label: string; required?: boolean; defaultDate?: Date }) {
  const today = new Date();
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(defaultDate?.getMonth() ?? today.getMonth());
  const [year, setYear]   = useState(defaultDate?.getFullYear() ?? today.getFullYear());
  const [selected, setSelected] = useState<Date | null>(defaultDate ?? null);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const days     = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const fullMonths = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const displayVal = selected ? selected.toLocaleDateString("en-KE", { day:"numeric", month:"short", year:"numeric" }) : "";
  const prev = () => month === 0 ? (setMonth(11), setYear(y => y-1)) : setMonth(m => m-1);
  const next = () => month === 11 ? (setMonth(0), setYear(y => y+1)) : setMonth(m => m+1);
  return (
    <div className="space-y-1.5" ref={ref}>
      <label htmlFor={id} className="text-[11px] font-semibold text-muted-foreground block">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <div className="relative">
        <button id={id} type="button" onClick={() => setOpen(o => !o)}
          className={`w-full h-9 px-3.5 rounded-xl border bg-card text-sm text-left flex items-center gap-2 transition-all ${open ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-muted-foreground/40"}`}>
          <Calendar className="size-3.5 text-muted-foreground shrink-0" />
          {displayVal ? <span className="font-medium text-foreground flex-1">{displayVal}</span> : <span className="text-muted-foreground flex-1">Pick a date</span>}
          <ChevronDown className={`size-3.5 text-muted-foreground transition-transform duration-200 shrink-0 ${open ? "rotate-180" : ""}`} />
        </button>
        {open && (
          <div className="absolute z-[200] top-full mt-1.5 w-72 rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 origin-top p-4">
            <div className="flex items-center justify-between mb-4">
              <button onClick={prev} className="size-8 flex items-center justify-center rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"><ChevronLeft className="size-4" /></button>
              <div className="text-center">
                <p className="text-[13px] font-black text-foreground">{fullMonths[month]}</p>
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
                    className={`size-9 rounded-xl text-[11px] font-semibold flex items-center justify-center transition-all
                      ${isSel ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-110" : isToday ? "bg-primary/10 text-primary font-black ring-1 ring-primary/30" : "text-foreground hover:bg-muted"}`}>
                    {d}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
              <button onClick={() => setSelected(null)} className="text-[10px] font-semibold text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-muted">Clear</button>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/50 rounded-lg px-2 py-1">
                <Calendar className="size-3" />{selected ? selected.toLocaleDateString("en-KE",{day:"numeric",month:"short",year:"numeric"}) : "No date"}
              </div>
              <button onClick={() => { setSelected(today); setOpen(false); }} className="text-[10px] font-bold text-primary hover:text-primary/80 transition-colors px-2 py-1 rounded-lg hover:bg-primary/5">Today</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Field ──────────────────────────────────────────────────────────────────────
function Field({ label, id, type="text", placeholder, required, icon: Icon }: {
  label: string; id: string; type?: string; placeholder?: string; required?: boolean; icon?: any;
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

// ── Steps ──────────────────────────────────────────────────────────────────────
const steps = [
  { n: 1, label: "Company profile", icon: Truck,        desc: "Identity, category & contact" },
  { n: 2, label: "Contract & terms",icon: FileText,     desc: "Payment & delivery terms" },
  { n: 3, label: "Portal access",   icon: ExternalLink, desc: "Supplier portal setup" },
  { n: 4, label: "Review & submit", icon: ShieldCheck,  desc: "Confirm and onboard" },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function NewSupplierPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <Link href="/suppliers">
        <button className="flex items-center gap-1.5 text-[11px] font-bold text-primary hover:text-primary/80 transition-colors mb-5 uppercase tracking-[0.15em]">
          <ChevronLeft className="size-3.5" /> Back to suppliers
        </button>
      </Link>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6 items-start">

        {/* Left panel */}
        <div className="flex flex-col gap-3">
          <div className="relative rounded-2xl border border-border bg-card p-6 overflow-hidden">
            <div className="absolute -top-8 -right-8 size-28 bg-emerald-500/10 blur-2xl rounded-full" />
            <div className="relative z-10">
              <div className="size-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4">
                <Truck className="size-5" />
              </div>
              <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-[0.2em] mb-1">Onboarding</p>
              <h1 className="text-xl font-black text-foreground tracking-tight leading-tight mb-2">Add new supplier</h1>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Register a supply chain partner and optionally grant them access to the CrownCanteen supplier portal.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            {steps.map((s, i) => {
              const done = step > s.n; const active = step === s.n;
              return (
                <button key={s.n} onClick={() => setStep(s.n)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all ${i < steps.length - 1 ? "border-b border-border" : ""} ${active ? "bg-emerald-500/5" : "hover:bg-muted/50"}`}>
                  <div className={`size-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-[11px] transition-all
                    ${done ? "bg-emerald-500 text-white" : active ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/25" : "bg-muted text-muted-foreground"}`}>
                    {done ? <Check className="size-4" /> : <s.icon className="size-4" />}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-[12px] font-bold leading-none mb-0.5 ${active ? "text-emerald-600" : done ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</p>
                    <p className="text-[10px] text-muted-foreground leading-none">{s.desc}</p>
                  </div>
                  {active && <div className="ml-auto size-1.5 rounded-full bg-emerald-500" />}
                </button>
              );
            })}
          </div>

          <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="size-3.5 text-emerald-600" />
              <p className="text-[11px] font-bold text-emerald-600">Frappe ERPNext</p>
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              {step === 1 && "Supplier name and KRA PIN create a Supplier Doctype in ERPNext automatically."}
              {step === 2 && "Payment terms map to ERPNext's Payment Terms Template for automated PO scheduling."}
              {step === 3 && "Portal access generates a secure login — the supplier can view POs, submit invoices, and track payments."}
              {step === 4 && "On submit: Supplier Doctype, Payment Terms, and optional portal credentials are created."}
            </p>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-border bg-card p-6">
            {/* Step header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="size-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                {React.createElement(steps[step-1].icon, { className: "size-4" })}
              </div>
              <div>
                <p className="text-sm font-black text-foreground leading-none">{steps[step-1].label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Step {step} of {steps.length}</p>
              </div>
              <div className="ml-auto flex gap-1">
                {steps.map(s => (
                  <div key={s.n} className={`h-1 rounded-full transition-all duration-300 ${s.n <= step ? "bg-emerald-500" : "bg-muted"} ${s.n === step ? "w-8" : "w-3"}`} />
                ))}
              </div>
            </div>
            <div className="h-px bg-border mb-5" />

            {/* Step 1 — Company profile */}
            {step === 1 && (
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Field label="Supplier / company name" id="s-name" placeholder="e.g. Fresh Produce Ltd" required icon={Truck} />
                </div>
                <Field label="KRA PIN / Tax ID" id="s-pin" placeholder="P051XXXXXXXX" required />
                <CustomSelect label="Product category" id="s-cat" required options={[
                  { value: "veg",       label: "Vegetables & Fruits",  color: "bg-emerald-500" },
                  { value: "meat",      label: "Butchery & Meats",     color: "bg-rose-500" },
                  { value: "grains",    label: "Grains & Dry Goods",   color: "bg-amber-500" },
                  { value: "dairy",     label: "Dairy & Eggs",         color: "bg-blue-500" },
                  { value: "beverages", label: "Beverages",            color: "bg-violet-500" },
                  { value: "packaging", label: "Packaging",            color: "bg-muted-foreground" },
                  { value: "other",     label: "Other" },
                ]} />
                <Field label="Primary email"    id="s-email"   type="email" placeholder="info@supplier.co.ke" required icon={Mail}  />
                <Field label="Phone number"     id="s-phone"   type="tel"   placeholder="+254 7XX XXX XXX"     icon={Phone} />
                <Field label="Website"          id="s-web"     type="url"   placeholder="https://supplier.co.ke" icon={Globe} />
                <Field label="Physical location" id="s-loc"    placeholder="e.g. Wakulima Market, Nairobi"    icon={MapPin} />
                <div className="sm:col-span-2">
                  <Field label="Delivery window" id="s-window" placeholder="e.g. 5:00 AM – 8:00 AM daily" required />
                </div>
              </div>
            )}

            {/* Step 2 — Contract & terms */}
            {step === 2 && (
              <div className="grid sm:grid-cols-2 gap-4">
                <CustomSelect label="Payment method" id="s-paymethod" required options={[
                  { value: "eft",    label: "EFT — bank transfer",   color: "bg-emerald-500", sub: "Recommended" },
                  { value: "cheque", label: "Cheque",                color: "bg-blue-500" },
                  { value: "mpesa",  label: "M-Pesa",                color: "bg-emerald-600" },
                  { value: "cash",   label: "Cash on delivery" },
                ]} />
                <CustomSelect label="Payment cycle" id="s-cycle" required options={[
                  { value: "daily",    label: "Daily" },
                  { value: "weekly",   label: "Weekly",  color: "bg-primary", sub: "Standard" },
                  { value: "biweekly", label: "Bi-weekly" },
                  { value: "monthly",  label: "Monthly" },
                ]} />
                <Field label="Credit period (days)"   id="s-credit" type="number" placeholder="e.g. 7" />
                <Field label="Min. order value (KES)" id="s-minord" type="number" placeholder="e.g. 5000" />
                <CustomSelect label="Quality standard" id="s-quality" options={[
                  { value: "kebs",    label: "KEBS certified",    color: "bg-emerald-500", sub: "Kenya Bureau of Standards" },
                  { value: "haccp",   label: "HACCP compliant",   color: "bg-blue-500" },
                  { value: "iso",     label: "ISO 22000",          color: "bg-violet-500" },
                  { value: "none",    label: "None / self-declared" },
                ]} />
                <CustomSelect label="Currency" id="s-currency" defaultValue="KES" options={[
                  { value: "KES", label: "KES — Kenyan Shilling" },
                  { value: "USD", label: "USD — US Dollar" },
                ]} />
                <CalendarPicker label="Contract start date" id="s-start" required />
                <CalendarPicker label="Contract end date"   id="s-end"   defaultDate={new Date(2026, 11, 31)} />
              </div>
            )}

            {/* Step 3 — Portal access */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <CustomSelect label="Portal access" id="s-portal" defaultValue="yes" options={[
                    { value: "yes", label: "Grant portal access",    color: "bg-emerald-500", sub: "Supplier can log in and manage" },
                    { value: "no",  label: "No portal access",                                sub: "Admin-only management" },
                  ]} />
                  <CustomSelect label="Permission level" id="s-perm" defaultValue="standard" options={[
                    { value: "standard", label: "Standard",  sub: "View POs, submit invoices" },
                    { value: "full",     label: "Full",      sub: "+ Upload delivery notes, view payments" },
                    { value: "readonly", label: "Read-only", sub: "View only, no submissions" },
                  ]} />
                </div>
                <Field label="Portal login email" id="s-portal-email" type="email" placeholder="portal@supplier.co.ke" icon={Mail} />
                <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2.5">
                  <p className="text-[11px] font-bold text-foreground">What the supplier can do via the portal</p>
                  {[
                    { label: "View purchase orders",        yes: true },
                    { label: "Submit invoices",             yes: true },
                    { label: "Upload delivery notes",       yes: true },
                    { label: "Track payment status",        yes: true },
                    { label: "View quality audit reports",  yes: false },
                  ].map(p => (
                    <div key={p.label} className="flex items-center gap-2">
                      <div className={`size-5 rounded-full flex items-center justify-center shrink-0 ${p.yes ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"}`}>
                        <Check className="size-3" />
                      </div>
                      <p className={`text-[11px] ${p.yes ? "text-foreground font-medium" : "text-muted-foreground line-through"}`}>{p.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4 — Review */}
            {step === 4 && (
              <div className="space-y-5">
                <div className="grid sm:grid-cols-3 gap-3">
                  {["Company profile","Contract & terms","Portal access"].map(item => (
                    <div key={item} className="flex items-center gap-2 p-3 rounded-xl border border-border bg-muted/20">
                      <div className="size-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                        <Check className="size-3.5" />
                      </div>
                      <p className="text-[11px] font-semibold text-foreground">{item}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 flex items-start gap-3">
                  <div className="size-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                    <ShieldCheck className="size-4" />
                  </div>
                  <div>
                    <p className="text-[12px] font-black text-foreground mb-1">Ready to create supplier account</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Submitting will create a <strong className="text-foreground">Supplier Doctype</strong> in ERPNext with your configured payment terms.
                      If portal access was enabled, login credentials will be sent to the supplier email automatically.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Nav */}
          <div className="flex items-center justify-between">
            <button onClick={() => setStep(Math.max(1, step-1))} disabled={step === 1}
              className="h-8 px-4 rounded-xl border border-border bg-card text-[11px] font-semibold text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:pointer-events-none transition-all">
              ← Previous
            </button>
            <div className="flex gap-2">
              <button className="h-8 px-4 rounded-xl border border-border bg-card text-[11px] font-semibold text-muted-foreground hover:bg-muted transition-all">Save draft</button>
              {step < 4 ? (
                <button onClick={() => setStep(step+1)}
                  className="h-8 px-5 rounded-xl bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700 shadow-md shadow-emerald-500/25 transition-all">
                  Continue →
                </button>
              ) : (
                <button className="h-8 px-5 rounded-xl bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700 shadow-md shadow-emerald-500/25 transition-all flex items-center gap-1.5">
                  <Save className="size-3.5" /> Create supplier
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
