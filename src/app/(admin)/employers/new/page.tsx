"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft, ChevronDown, ChevronRight, Check, Calendar,
  Building2, MapPin, Mail, Phone, Globe, Banknote,
  ShieldCheck, FileText, Plus, Save, Sparkles, Users,
} from "lucide-react";

// ── Shared components (same pattern as employees/new) ─────────────────────────

function CustomSelect({ id, label, options, required, placeholder }: {
  id: string; label: string; required?: boolean; placeholder?: string;
  options: { value: string; label: string; color?: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const sel = options.find((o) => o.value === value);
  return (
    <div className="space-y-1.5" ref={ref}>
      <label htmlFor={id} className="text-[11px] font-semibold text-muted-foreground block">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <div className="relative">
        <button id={id} type="button" onClick={() => setOpen(o => !o)}
          className={`w-full h-9 px-3.5 pr-9 rounded-xl border bg-card text-sm text-left flex items-center transition-all ${open ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-muted-foreground/40"}`}>
          {sel ? <span className="flex items-center gap-2">{sel.color && <span className={`size-2 rounded-full ${sel.color}`} />}<span className="font-medium text-foreground">{sel.label}</span></span>
               : <span className="text-muted-foreground">{placeholder ?? `Select ${label.toLowerCase()}`}</span>}
        </button>
        <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
        {open && (
          <div className="absolute z-50 top-full mt-1.5 w-full rounded-xl border border-border bg-card shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 origin-top">
            {options.map((o) => (
              <button key={o.value} type="button" onClick={() => { setValue(o.value); setOpen(false); }}
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

function Field({ label, id, type = "text", placeholder, required, icon: Icon }: {
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

function Textarea({ label, id, placeholder, required }: { label: string; id: string; placeholder?: string; required?: boolean }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-[11px] font-semibold text-muted-foreground block">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <textarea id={id} placeholder={placeholder} rows={3}
        className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none" />
    </div>
  );
}

function CalendarPicker({ label, id, required, defaultDate }: { label: string; id: string; required?: boolean; defaultDate?: Date }) {
  const today = new Date();
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(defaultDate?.getMonth() ?? today.getMonth());
  const [year, setYear] = useState(defaultDate?.getFullYear() ?? today.getFullYear());
  const [selected, setSelected] = useState<Date | null>(defaultDate ?? null);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay   = new Date(year, month, 1).getDay();
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const dayNames   = ["Su","Mo","Tu","We","Th","Fr","Sa"];
  const prevMonth  = () => { if (month === 0) { setMonth(11); setYear(y => y-1); } else setMonth(m => m-1); };
  const nextMonth  = () => { if (month === 11) { setMonth(0); setYear(y => y+1); } else setMonth(m => m+1); };
  const displayVal = selected ? selected.toLocaleDateString("en-KE",{day:"numeric",month:"short",year:"numeric"}) : "";
  return (
    <div className="space-y-1.5" ref={ref}>
      <label htmlFor={id} className="text-[11px] font-semibold text-muted-foreground block">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <div className="relative">
        <button id={id} type="button" onClick={() => setOpen(o => !o)}
          className={`w-full h-9 px-3.5 pr-9 rounded-xl border bg-card text-sm text-left flex items-center gap-2 transition-all ${open ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-muted-foreground/40"}`}>
          <Calendar className="size-3.5 text-muted-foreground shrink-0" />
          {displayVal ? <span className="font-medium text-foreground">{displayVal}</span> : <span className="text-muted-foreground">Pick a date</span>}
        </button>
        <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
        {open && (
          <div className="absolute z-50 top-full mt-1.5 w-64 rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 origin-top p-3">
            <div className="flex items-center justify-between mb-3">
              <button onClick={prevMonth} className="size-7 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"><ChevronLeft className="size-4" /></button>
              <span className="text-[12px] font-bold text-foreground">{monthNames[month]} {year}</span>
              <button onClick={nextMonth} className="size-7 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"><ChevronRight className="size-4" /></button>
            </div>
            <div className="grid grid-cols-7 mb-1">
              {dayNames.map((d) => <div key={d} className="text-[9px] font-bold text-muted-foreground text-center py-1">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-0.5">
              {Array.from({length: firstDay}).map((_,i) => <div key={`e-${i}`} />)}
              {Array.from({length: daysInMonth}).map((_,i) => {
                const day = i+1;
                const thisDate = new Date(year, month, day);
                const isSel   = selected?.toDateString() === thisDate.toDateString();
                const isToday = today.toDateString() === thisDate.toDateString();
                return (
                  <button key={day} onClick={() => { setSelected(thisDate); setOpen(false); }}
                    className={`size-8 rounded-lg text-[11px] font-semibold flex items-center justify-center transition-all
                      ${isSel   ? "bg-primary text-primary-foreground shadow-md" :
                        isToday ? "bg-primary/10 text-primary font-bold" :
                                  "text-foreground hover:bg-muted"}`}>
                    {day}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 pt-3 border-t border-border flex justify-between">
              <button onClick={() => setSelected(null)} className="text-[10px] text-muted-foreground hover:text-foreground font-semibold">Clear</button>
              <button onClick={() => { setSelected(today); setOpen(false); }} className="text-[10px] text-primary font-bold">Today</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Steps ─────────────────────────────────────────────────────────────────────

const steps = [
  { n: 1, label: "Company profile",  icon: Building2, desc: "Identity, sector & contact" },
  { n: 2, label: "Billing & terms",  icon: Banknote,  desc: "Payment schedule & credit" },
  { n: 3, label: "Branches",         icon: MapPin,    desc: "Register canteen locations" },
  { n: 4, label: "Review & submit",  icon: ShieldCheck, desc: "Confirm and create account" },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function NewEmployerPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <Link href="/employers">
        <button className="flex items-center gap-1.5 text-[11px] font-bold text-primary hover:text-primary/80 transition-colors mb-5 uppercase tracking-[0.15em]">
          <ChevronLeft className="size-3.5" /> Back to employers
        </button>
      </Link>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6 items-start">

        {/* ── Left panel ─────────────────────────────────── */}
        <div className="flex flex-col gap-3">
          <div className="relative rounded-2xl border border-border bg-card p-6 overflow-hidden">
            <div className="absolute -top-8 -right-8 size-28 bg-primary/10 blur-2xl rounded-full" />
            <div className="relative z-10">
              <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Building2 className="size-5" />
              </div>
              <p className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] mb-1">Onboarding</p>
              <h1 className="text-xl font-black text-foreground tracking-tight leading-tight mb-2">Add new employer</h1>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Set up a corporate canteen account linked to Frappe ERPNext as a Customer Doctype with full billing integration.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            {steps.map((s, i) => {
              const done = step > s.n;
              const active = step === s.n;
              return (
                <button key={s.n} onClick={() => setStep(s.n)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all ${i < steps.length - 1 ? "border-b border-border" : ""} ${active ? "bg-primary/5" : "hover:bg-muted/50"}`}>
                  <div className={`size-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-[11px] transition-all
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
              <p className="text-[11px] font-bold text-primary">ERPNext sync</p>
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              {step === 1 && "The company name and tax PIN will be used to create the ERPNext Customer Doctype automatically."}
              {step === 2 && "Payment terms will map directly to ERPNext's Payment Terms Template for automated invoice scheduling."}
              {step === 3 && "Each branch maps to a Cost Centre in ERPNext for granular P&L reporting per location."}
              {step === 4 && "On submission, a Customer record, Payment Terms, and Credit Limit will be created in ERPNext."}
            </p>
          </div>
        </div>

        {/* ── Right panel ────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-border bg-card p-6">

            {/* Step header with mini progress */}
            <div className="flex items-center gap-3 mb-5">
              <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                {React.createElement(steps[step - 1].icon, { className: "size-4" })}
              </div>
              <div>
                <p className="text-sm font-black text-foreground leading-none">{steps[step - 1].label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Step {step} of {steps.length}</p>
              </div>
              <div className="ml-auto flex gap-1">
                {steps.map((s) => (
                  <div key={s.n} className={`h-1 rounded-full transition-all duration-300 ${s.n <= step ? "bg-primary" : "bg-muted"} ${s.n === step ? "w-8" : "w-3"}`} />
                ))}
              </div>
            </div>
            <div className="h-px bg-border mb-5" />

            {/* Step 1 — Company profile */}
            {step === 1 && (
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Field label="Company / institution name" id="company" placeholder="e.g. Crown Paints Kenya PLC" required icon={Building2} />
                </div>
                <Field label="KRA PIN / Tax ID"     id="pin"     placeholder="P051XXXXXXXX"              required />
                <CustomSelect label="Industry sector" id="sector" required options={[
                  { value: "manufacturing", label: "Manufacturing" },
                  { value: "consulting",    label: "Consulting & Services" },
                  { value: "technology",    label: "Technology" },
                  { value: "logistics",     label: "Logistics & Transport" },
                  { value: "healthcare",    label: "Healthcare" },
                  { value: "education",     label: "Education" },
                  { value: "other",         label: "Other" },
                ]} />
                <Field label="Primary email"  id="email"   type="email" placeholder="accounts@company.co.ke" required icon={Mail}  />
                <Field label="Phone number"   id="phone"   type="tel"   placeholder="+254 7XX XXX XXX"        icon={Phone} />
                <Field label="Website"        id="website" type="url"   placeholder="https://company.co.ke"   icon={Globe} />
                <Field label="Physical address" id="address" placeholder="e.g. Industrial Area, Nairobi"     icon={MapPin} />
                <div className="sm:col-span-2">
                  <Textarea label="Company description" id="desc" placeholder="Brief overview of the organisation and their canteen requirements…" />
                </div>
              </div>
            )}

            {/* Step 2 — Billing & terms */}
            {step === 2 && (
              <div className="grid sm:grid-cols-2 gap-4">
                <CustomSelect label="Payment schedule" id="schedule" required options={[
                  { value: "weekly",    label: "Weekly",          color: "bg-emerald-500" },
                  { value: "biweekly", label: "Bi-weekly (Net 14)", color: "bg-primary" },
                  { value: "monthly",  label: "Monthly (Net 30)", color: "bg-blue-500" },
                  { value: "upfront",  label: "Upfront (prepaid)", color: "bg-amber-500" },
                ]} />
                <CustomSelect label="Billing mode" id="billing" required options={[
                  { value: "postpaid",  label: "Post-paid — invoice" },
                  { value: "prepaid",   label: "Pre-paid — credit wallet" },
                ]} />
                <Field label="Credit limit (KES)"     id="credit"  type="number" placeholder="e.g. 2000000" />
                <Field label="Grace period (days)"    id="grace"   type="number" placeholder="e.g. 5"       />
                <CustomSelect label="Subsidy model" id="subsidy" required options={[
                  { value: "full",    label: "100% subsidised (employer pays all)",  color: "bg-emerald-500" },
                  { value: "partial", label: "Partial — employer + employee split",  color: "bg-amber-500" },
                  { value: "none",    label: "No subsidy — employee self-pay" },
                ]} />
                <CustomSelect label="Currency" id="currency" options={[
                  { value: "KES", label: "KES — Kenyan Shilling" },
                  { value: "USD", label: "USD — US Dollar" },
                ]} />
                <CalendarPicker label="Contract start date"    id="contract-start" />
                <CalendarPicker label="Contract end / renewal" id="contract-end" defaultDate={new Date(2027,0,1)} />
              </div>
            )}

            {/* Step 3 — Branches */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4 p-4 rounded-xl border border-border bg-muted/20">
                  <p className="sm:col-span-2 text-[11px] font-bold text-foreground">Branch 1</p>
                  <Field label="Branch name"     id="b1-name"    placeholder="e.g. Nairobi HQ"         required icon={Building2} />
                  <Field label="Location"        id="b1-location" placeholder="e.g. Industrial Area"            icon={MapPin}    />
                  <Field label="Expected headcount" id="b1-head" type="number" placeholder="e.g. 450"           icon={Users}     />
                  <CustomSelect label="Canteen type" id="b1-type" options={[
                    { value: "full",    label: "Full canteen (in-house)" },
                    { value: "shared",  label: "Shared facility" },
                    { value: "kiosk",   label: "Kiosk / counter only" },
                  ]} />
                </div>
                <button className="w-full flex items-center justify-center gap-2 h-10 rounded-xl border border-dashed border-primary/40 text-[11px] font-bold text-primary hover:bg-primary/5 transition-colors">
                  <Plus className="size-3.5" /> Add another branch
                </button>
              </div>
            )}

            {/* Step 4 — Review */}
            {step === 4 && (
              <div className="space-y-5">
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    { label: "Company profile",  done: true },
                    { label: "Billing & terms",  done: true },
                    { label: "Branches",         done: true },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2 p-3 rounded-xl border border-border bg-muted/20">
                      <div className={`size-6 rounded-full flex items-center justify-center ${item.done ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"}`}>
                        <Check className="size-3.5" />
                      </div>
                      <p className="text-[11px] font-semibold text-foreground">{item.label}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 flex items-start gap-3">
                  <div className="size-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                    <ShieldCheck className="size-4" />
                  </div>
                  <div>
                    <p className="text-[12px] font-black text-foreground mb-1">Ready to create employer account</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Submitting will create a <strong className="text-foreground">Customer Doctype</strong> in ERPNext with the configured Payment Terms Template, Credit Limit, and Cost Centres for each branch.
                      Contacts will receive onboarding instructions via email.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Nav */}
          <div className="flex items-center justify-between">
            <button onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}
              className="h-8 px-4 rounded-xl border border-border bg-card text-[11px] font-semibold text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:pointer-events-none transition-all">
              ← Previous
            </button>
            <div className="flex gap-2">
              <button className="h-8 px-4 rounded-xl border border-border bg-card text-[11px] font-semibold text-muted-foreground hover:bg-muted transition-all">Save draft</button>
              {step < 4 ? (
                <button onClick={() => setStep(step + 1)}
                  className="h-8 px-5 rounded-xl bg-primary text-primary-foreground text-[11px] font-bold hover:bg-primary/90 shadow-md shadow-primary/25 transition-all">
                  Continue →
                </button>
              ) : (
                <button className="h-8 px-5 rounded-xl bg-primary text-primary-foreground text-[11px] font-bold hover:bg-primary/90 shadow-md shadow-primary/25 transition-all flex items-center gap-1.5">
                  <Save className="size-3.5" /> Create employer
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
