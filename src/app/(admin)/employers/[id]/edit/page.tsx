"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft, ChevronDown, ChevronRight, Calendar,
  Check, Save, Building2, Mail, Phone, Globe,
  MapPin, Users, ShieldCheck, AlertTriangle, Pencil,
  CircleDollarSign, Clock, RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ── Custom Select ──────────────────────────────────────────────────────────────
function CustomSelect({ id, label, options, defaultValue }: {
  id: string; label: string; defaultValue?: string;
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
  const sel = options.find((o) => o.value === value);
  return (
    <div className="space-y-1.5" ref={ref}>
      <label className="text-[11px] font-semibold text-muted-foreground block">{label}</label>
      <div className="relative">
        <button id={id} type="button" onClick={() => setOpen(o => !o)}
          className={`w-full h-9 px-3.5 rounded-xl border bg-card text-sm text-left flex items-center gap-2.5 transition-all ${open ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-muted-foreground/40"}`}>
          {sel?.color && <span className={`size-2 rounded-full shrink-0 ${sel.color}`} />}
          <span className={`font-medium flex-1 ${sel ? "text-foreground" : "text-muted-foreground"}`}>{sel?.label ?? "Select\u2026"}</span>
          <ChevronDown className={`size-3.5 text-muted-foreground transition-transform duration-200 shrink-0 ${open ? "rotate-180" : ""}`} />
        </button>
        {open && (
          <div className="absolute z-[200] top-full mt-1.5 w-full rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 origin-top">
            {options.map((o) => (
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

// ── Calendar Picker ────────────────────────────────────────────────────────────
function CalendarPicker({ id, label, defaultDate }: { id: string; label: string; defaultDate?: Date }) {
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
  const days = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const fullMonths = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const displayVal = selected ? selected.toLocaleDateString("en-KE", { day:"numeric", month:"short", year:"numeric" }) : "";
  const prev = () => month === 0 ? (setMonth(11), setYear(y => y-1)) : setMonth(m => m-1);
  const next = () => month === 11 ? (setMonth(0), setYear(y => y+1)) : setMonth(m => m+1);
  return (
    <div className="space-y-1.5" ref={ref}>
      <label className="text-[11px] font-semibold text-muted-foreground block">{label}</label>
      <div className="relative">
        <button id={id} type="button" onClick={() => setOpen(o => !o)}
          className={`w-full h-9 px-3.5 rounded-xl border bg-card text-sm text-left flex items-center gap-2 transition-all ${open ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-muted-foreground/40"}`}>
          <Calendar className="size-3.5 text-muted-foreground shrink-0" />
          {displayVal
            ? <span className="font-medium text-foreground flex-1">{displayVal}</span>
            : <span className="text-muted-foreground flex-1">Pick a date</span>}
          <ChevronDown className={`size-3.5 text-muted-foreground transition-transform duration-200 shrink-0 ${open ? "rotate-180" : ""}`} />
        </button>
        {open && (
          <div className="absolute z-[200] top-full mt-1.5 w-72 rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 origin-top p-4">
            {/* Month nav */}
            <div className="flex items-center justify-between mb-4">
              <button onClick={prev} className="size-8 flex items-center justify-center rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                <ChevronLeft className="size-4" />
              </button>
              <div className="text-center">
                <p className="text-[13px] font-black text-foreground">{fullMonths[month]}</p>
                <p className="text-[10px] text-muted-foreground">{year}</p>
              </div>
              <button onClick={next} className="size-8 flex items-center justify-center rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                <ChevronRight className="size-4" />
              </button>
            </div>
            {/* Day headers */}
            <div className="grid grid-cols-7 mb-1.5">
              {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
                <div key={d} className="text-[9px] font-bold text-muted-foreground text-center py-1">{d}</div>
              ))}
            </div>
            {/* Dates */}
            <div className="grid grid-cols-7 gap-0.5">
              {Array.from({length: firstDay}).map((_,i) => <div key={`e${i}`} />)}
              {Array.from({length: days}).map((_,i) => {
                const d = i+1;
                const date = new Date(year, month, d);
                const isSel = selected?.toDateString() === date.toDateString();
                const isToday = today.toDateString() === date.toDateString();
                return (
                  <button key={d} onClick={() => { setSelected(date); setOpen(false); }}
                    className={`size-9 rounded-xl text-[11px] font-semibold flex items-center justify-center transition-all
                      ${isSel   ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-110" :
                        isToday ? "bg-primary/10 text-primary font-black ring-1 ring-primary/30" :
                                  "text-foreground hover:bg-muted"}`}>
                    {d}
                  </button>
                );
              })}
            </div>
            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
              <button onClick={() => setSelected(null)} className="text-[10px] font-semibold text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-muted">
                Clear
              </button>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/50 rounded-lg px-2 py-1">
                <Calendar className="size-3" />
                {selected ? selected.toLocaleDateString("en-KE",{day:"numeric",month:"short",year:"numeric"}) : "No date selected"}
              </div>
              <button onClick={() => { setSelected(today); setOpen(false); }} className="text-[10px] font-bold text-primary hover:text-primary/80 transition-colors px-2 py-1 rounded-lg hover:bg-primary/5">
                Today
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Field ──────────────────────────────────────────────────────────────────────
function Field({ label, id, type="text", defaultValue, placeholder, icon: Icon }: {
  label: string; id: string; type?: string; defaultValue?: string; placeholder?: string; icon?: any;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-[11px] font-semibold text-muted-foreground block">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />}
        <input id={id} type={type} defaultValue={defaultValue} placeholder={placeholder}
          className={`w-full h-9 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${Icon ? "pl-9 pr-4" : "px-4"}`} />
      </div>
    </div>
  );
}

// ── Card section ───────────────────────────────────────────────────────────────
function SectionCard({ title, icon: Icon, accent = "text-primary", children }: {
  title: string; icon: any; accent?: string; children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card">
      <div className={`flex items-center gap-2.5 px-5 py-4 border-b border-border bg-muted/30`}>
        <div className={`size-7 rounded-lg bg-muted flex items-center justify-center ${accent}`}>
          <Icon className="size-3.5" />
        </div>
        <p className="text-[11px] font-bold text-foreground">{title}</p>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function EditEmployerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(true);

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500">

      {/* Back + header */}
      <div>
        <Link href={`/employers/${id}`}>
          <button className="flex items-center gap-1.5 text-[11px] font-bold text-primary hover:text-primary/80 transition-colors mb-4 uppercase tracking-[0.15em]">
            <ChevronLeft className="size-3.5" /> Back to {id}
          </button>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-2xl bg-secondary text-secondary-foreground flex items-center justify-center font-black text-base shrink-0">CP</div>
            <div>
              <p className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] mb-0.5">Edit account</p>
              <h1 className="text-xl font-black text-foreground tracking-tight leading-none">Crown Paints Kenya PLC</h1>
              <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1.5">
                <RefreshCw className="size-3 text-amber-500" />
                ERPNext Customer Doctype · <span className="font-semibold text-foreground">{id}</span>
              </p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link href={`/employers/${id}`}>
              <Button size="sm" variant="outline" className="h-8 text-xs">Discard</Button>
            </Link>
            <Button size="sm" onClick={() => { setSaved(true); setDirty(false); }}
              className="h-8 text-xs gap-1.5 bg-primary hover:bg-primary/90 shadow-md shadow-primary/20">
              <Save className="size-3.5" />
              {saved && !dirty ? "Saved ✓" : "Save changes"}
            </Button>
          </div>
        </div>
      </div>

      {/* ERPNext sync warning */}
      <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl border border-amber-500/25 bg-amber-500/5">
        <AlertTriangle className="size-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Changes to <strong className="text-foreground">Payment Terms</strong> and <strong className="text-foreground">Credit Limit</strong> sync to ERPNext on save and may affect pending invoices. A change log entry will be created automatically.
        </p>
      </div>

      {/* Main 2-col grid */}
      <div className="grid lg:grid-cols-2 gap-5" onChange={() => setDirty(true)}>

        {/* Company profile */}
        <SectionCard title="Company profile" icon={Building2}>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Field label="Company name" id="e-company" defaultValue="Crown Paints Kenya PLC" icon={Building2} />
            </div>
            <Field label="KRA PIN / Tax ID"   id="e-pin"     defaultValue="P051234567X" />
            <CustomSelect label="Industry sector" id="e-sector" defaultValue="manufacturing" options={[
              { value: "manufacturing", label: "Manufacturing",           sub: "Industrial & production" },
              { value: "consulting",    label: "Consulting & Services",   sub: "Professional services" },
              { value: "technology",    label: "Technology",              sub: "Software & IT" },
              { value: "logistics",     label: "Logistics & Transport",   sub: "Supply chain" },
              { value: "healthcare",    label: "Healthcare",              sub: "Medical & wellness" },
              { value: "education",     label: "Education",               sub: "Schools & training" },
            ]} />
            <Field label="Primary email"    id="e-email"   type="email" defaultValue="accounts@crownpaints.co.ke"  icon={Mail}  />
            <Field label="Phone number"     id="e-phone"   defaultValue="+254 722 100 200"    icon={Phone} />
            <Field label="Website"          id="e-website" type="url" defaultValue="https://crownpaints.co.ke" icon={Globe} />
            <Field label="Physical address" id="e-address" defaultValue="Industrial Area, Nairobi" icon={MapPin} />
          </div>
        </SectionCard>

        {/* Billing & terms */}
        <SectionCard title="Billing & payment terms (ERPNext)" icon={CircleDollarSign} accent="text-accent">
          <div className="grid sm:grid-cols-2 gap-4">
            <CustomSelect label="Payment schedule" id="e-schedule" defaultValue="biweekly" options={[
              { value: "weekly",    label: "Weekly",              color: "bg-emerald-500", sub: "Every 7 days" },
              { value: "biweekly", label: "Bi-weekly (Net 14)",  color: "bg-primary",     sub: "Every 14 days" },
              { value: "monthly",  label: "Monthly (Net 30)",    color: "bg-blue-500",    sub: "End of month" },
              { value: "upfront",  label: "Upfront (prepaid)",   color: "bg-amber-500",   sub: "Pay before service" },
            ]} />
            <CustomSelect label="Billing mode" id="e-billing" defaultValue="postpaid" options={[
              { value: "postpaid", label: "Post-paid — invoice",       sub: "Billed after meals served" },
              { value: "prepaid",  label: "Pre-paid — credit wallet",  sub: "Load credits in advance" },
            ]} />
            <Field label="Credit limit (KES)"  id="e-credit" type="number" defaultValue="2000000" />
            <Field label="Grace period (days)" id="e-grace"  type="number" defaultValue="5" />
            <CustomSelect label="Subsidy model" id="e-subsidy" defaultValue="full" options={[
              { value: "full",    label: "100% subsidised",             color: "bg-emerald-500", sub: "Employer covers all" },
              { value: "partial", label: "Partial split",               color: "bg-amber-500",   sub: "Shared co-payment" },
              { value: "none",    label: "No subsidy",                                            sub: "Employee self-pay" },
            ]} />
            <CustomSelect label="Currency" id="e-currency" defaultValue="KES" options={[
              { value: "KES", label: "KES — Kenyan Shilling" },
              { value: "USD", label: "USD — US Dollar" },
            ]} />
            <CalendarPicker label="Contract start date"   id="e-start"   defaultDate={new Date(2024,0,15)} />
            <CalendarPicker label="Contract renewal date" id="e-renewal" defaultDate={new Date(2027,0,1)} />
          </div>
        </SectionCard>

        {/* Branch configuration */}
        <SectionCard title="Branch configuration" icon={MapPin} accent="text-blue-500">
          <div className="space-y-2.5">
            {[
              { name: "Nairobi HQ",    count: 450, meals: 1840, util: 92 },
              { name: "Mombasa Plant", count: 210, meals: 820,  util: 78 },
              { name: "Kisumu Depot",  count: 82,  meals: 310,  util: 65 },
              { name: "Eldoret Hub",   count: 100, meals: 390,  util: 74 },
            ].map((b) => (
              <div key={b.name} className="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-muted/20 hover:border-primary/25 transition-colors group">
                <div className="size-9 rounded-xl bg-muted text-blue-500 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all shrink-0">
                  <MapPin className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[12px] font-bold text-foreground">{b.name}</p>
                    <span className="text-[10px] font-bold text-muted-foreground">{b.util}% util.</span>
                  </div>
                  <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
                    <div className={`h-full rounded-full ${b.util >= 90 ? "bg-amber-500" : "bg-primary/60"}`} style={{width:`${b.util}%`}} />
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Users className="size-2.5" />{b.count} staff</span>
                    <span className="text-[10px] text-muted-foreground">{b.meals.toLocaleString()} meals/mo</span>
                  </div>
                </div>
                <button className="flex items-center gap-1 text-[10px] font-bold text-primary hover:text-primary/80 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-primary/5 shrink-0">
                  <Pencil className="size-3" /> Edit
                </button>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Status & compliance */}
        <SectionCard title="Account status & compliance" icon={ShieldCheck} accent="text-emerald-600">
          <div className="space-y-4">
            <CustomSelect label="Account status" id="e-status" defaultValue="active" options={[
              { value: "active",    label: "Active",         color: "bg-emerald-500", sub: "Full canteen access enabled" },
              { value: "suspended", label: "Suspended",      color: "bg-rose-500",    sub: "Access blocked — billing issue" },
              { value: "pending",   label: "Pending review", color: "bg-amber-500",   sub: "Awaiting KYB or contract sign" },
            ]} />
            <CustomSelect label="Account tier" id="e-tier" defaultValue="enterprise" options={[
              { value: "enterprise", label: "Enterprise", sub: "Priority support · dedicated AM" },
              { value: "growth",     label: "Growth",     sub: "Standard support" },
              { value: "starter",    label: "Starter",    sub: "Self-serve" },
            ]} />
            <div className="flex items-start gap-3 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
              <div className="size-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="size-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-foreground">KYB verified</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Know-Your-Business check passed Jan 15, 2024.</p>
                <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                  <Clock className="size-2.5" /> Next review: Jan 15, 2027
                </p>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Sticky save bar */}
      <div className="flex items-center justify-between p-4 rounded-2xl border border-border bg-card">
        <div className="flex items-center gap-2">
          <div className={`size-2 rounded-full ${dirty ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`} />
          <p className="text-[11px] text-muted-foreground">
            {dirty ? <><span className="text-foreground font-semibold">Unsaved changes</span> · ERPNext sync pending</> : "All changes saved · ERPNext synced"}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/employers/${id}`}>
            <Button size="sm" variant="outline" className="h-8 text-xs">Discard</Button>
          </Link>
          <Button size="sm" onClick={() => { setSaved(true); setDirty(false); }}
            className="h-8 text-xs gap-1.5 bg-primary hover:bg-primary/90 shadow-md shadow-primary/20">
            <Save className="size-3.5" />
            {saved && !dirty ? "Saved ✓" : "Save all changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
