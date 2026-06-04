"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft, ChevronDown, ChevronRight, Calendar, Check, Save,
  Truck, MapPin, Mail, Phone, Globe, Package, ShieldCheck,
  AlertTriangle, Pencil, Users, Star, RefreshCw, ExternalLink, Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ── CustomSelect ────────────────────────────────────────────────────────────────
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
  const sel = options.find(o => o.value === value);
  return (
    <div className="space-y-1.5" ref={ref}>
      <label className="text-[11px] font-semibold text-muted-foreground block">{label}</label>
      <div className="relative">
        <button id={id} type="button" onClick={() => setOpen(o => !o)}
          className={`w-full h-9 px-3.5 rounded-xl border bg-card text-sm text-left flex items-center gap-2.5 transition-all ${open ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-muted-foreground/40"}`}>
          {sel?.color && <span className={`size-2 rounded-full shrink-0 ${sel.color}`} />}
          <span className={`flex-1 font-medium ${sel ? "text-foreground" : "text-muted-foreground"}`}>{sel?.label ?? "Select…"}</span>
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
function CalendarPicker({ id, label, defaultDate }: { id: string; label: string; defaultDate?: Date }) {
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
  const days = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
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
              <button onClick={() => setSelected(null)} className="text-[10px] font-semibold text-muted-foreground hover:text-foreground px-2 py-1 rounded-lg hover:bg-muted">Clear</button>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/50 rounded-lg px-2 py-1">
                <Calendar className="size-3" />{selected ? selected.toLocaleDateString("en-KE",{day:"numeric",month:"short",year:"numeric"}) : "No date"}
              </div>
              <button onClick={() => { setSelected(today); setOpen(false); }} className="text-[10px] font-bold text-primary hover:text-primary/80 px-2 py-1 rounded-lg hover:bg-primary/5">Today</button>
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

// ── Section card ───────────────────────────────────────────────────────────────
function SectionCard({ title, icon: Icon, accent="text-primary", children }: {
  title: string; icon: any; accent?: string; children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border bg-muted/30">
        <div className={`size-7 rounded-lg bg-muted flex items-center justify-center ${accent}`}><Icon className="size-3.5" /></div>
        <p className="text-[11px] font-bold text-foreground">{title}</p>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function EditSupplierPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(true);

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500" onChange={() => setDirty(true)}>

      {/* Back + header */}
      <div>
        <Link href={`/suppliers/${id}`}>
          <button className="flex items-center gap-1.5 text-[11px] font-bold text-primary hover:text-primary/80 transition-colors mb-4 uppercase tracking-[0.15em]">
            <ChevronLeft className="size-3.5" /> Back to {id}
          </button>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black text-base shrink-0 ring-1 ring-emerald-500/20">FP</div>
            <div>
              <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-[0.2em] mb-0.5">Edit supplier</p>
              <h1 className="text-xl font-black text-foreground tracking-tight leading-none">Fresh Produce Ltd</h1>
              <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1.5">
                <RefreshCw className="size-3 text-amber-500" /> ERPNext Supplier Doctype · <span className="font-semibold text-foreground">{id}</span>
              </p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link href={`/suppliers/${id}`}><Button size="sm" variant="outline" className="h-8 text-xs">Discard</Button></Link>
            <Button size="sm" onClick={() => { setSaved(true); setDirty(false); }}
              className="h-8 text-xs gap-1.5 bg-primary hover:bg-primary/90 shadow-md shadow-primary/20">
              <Save className="size-3.5" />{saved && !dirty ? "Saved ✓" : "Save changes"}
            </Button>
          </div>
        </div>
      </div>

      {/* ERPNext warning */}
      <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl border border-amber-500/25 bg-amber-500/5">
        <AlertTriangle className="size-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Changes to <strong className="text-foreground">Payment Terms</strong> and <strong className="text-foreground">Portal Access</strong> sync to ERPNext on save. Portal credential changes will trigger an email to the supplier.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">

        {/* Company profile */}
        <SectionCard title="Company profile" icon={Truck} accent="text-emerald-600">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Field label="Supplier name" id="e-name" defaultValue="Fresh Produce Ltd" icon={Truck} />
            </div>
            <Field label="KRA PIN / Tax ID" id="e-pin" defaultValue="P051000001A" />
            <CustomSelect label="Product category" id="e-cat" defaultValue="veg" options={[
              { value: "veg",       label: "Vegetables & Fruits",  color: "bg-emerald-500" },
              { value: "meat",      label: "Butchery & Meats",     color: "bg-rose-500" },
              { value: "grains",    label: "Grains & Dry Goods",   color: "bg-amber-500" },
              { value: "dairy",     label: "Dairy & Eggs",         color: "bg-blue-500" },
              { value: "beverages", label: "Beverages",            color: "bg-violet-500" },
              { value: "packaging", label: "Packaging" },
            ]} />
            <Field label="Primary email"     id="e-email" type="email" defaultValue="info@freshproduce.co.ke" icon={Mail} />
            <Field label="Phone"             id="e-phone" defaultValue="+254 712 345 678" icon={Phone} />
            <Field label="Website"           id="e-web"   type="url" defaultValue="https://freshproduce.co.ke" icon={Globe} />
            <Field label="Physical location" id="e-loc"   defaultValue="Wakulima Market, Nairobi" icon={MapPin} />
          </div>
        </SectionCard>

        {/* Contract & payment */}
        <SectionCard title="Contract & payment terms" icon={Package} accent="text-blue-500">
          <div className="grid sm:grid-cols-2 gap-4">
            <CustomSelect label="Payment method" id="e-pay" defaultValue="eft" options={[
              { value: "eft",    label: "EFT — bank transfer",  color: "bg-emerald-500", sub: "Recommended" },
              { value: "cheque", label: "Cheque",               color: "bg-blue-500" },
              { value: "mpesa",  label: "M-Pesa",               color: "bg-emerald-600" },
              { value: "cash",   label: "Cash on delivery" },
            ]} />
            <CustomSelect label="Payment cycle" id="e-cycle" defaultValue="weekly" options={[
              { value: "daily",    label: "Daily" },
              { value: "weekly",   label: "Weekly",   color: "bg-primary", sub: "Standard" },
              { value: "biweekly", label: "Bi-weekly" },
              { value: "monthly",  label: "Monthly" },
            ]} />
            <Field label="Credit period (days)" id="e-credit" type="number" defaultValue="7" />
            <Field label="Min. order (KES)"     id="e-minord" type="number" defaultValue="5000" />
            <CustomSelect label="Quality standard" id="e-quality" defaultValue="kebs" options={[
              { value: "kebs",  label: "KEBS certified",   color: "bg-emerald-500", sub: "Kenya Bureau of Standards" },
              { value: "haccp", label: "HACCP compliant",  color: "bg-blue-500" },
              { value: "iso",   label: "ISO 22000",         color: "bg-violet-500" },
              { value: "none",  label: "None / self-declared" },
            ]} />
            <Field label="Delivery window" id="e-window" defaultValue="5:00 AM – 8:00 AM daily" icon={Clock} />
            <CalendarPicker label="Contract start date" id="e-start" defaultDate={new Date(2024, 0, 15)} />
            <CalendarPicker label="Contract end date"   id="e-end"   defaultDate={new Date(2026, 11, 31)} />
          </div>
        </SectionCard>

        {/* Portal access */}
        <SectionCard title="Supplier portal access" icon={ExternalLink} accent="text-violet-500">
          <div className="space-y-4">
            <CustomSelect label="Portal status" id="e-portal" defaultValue="active" options={[
              { value: "active",   label: "Active — portal enabled",   color: "bg-emerald-500", sub: "Supplier can log in" },
              { value: "disabled", label: "Disabled",                  color: "bg-muted-foreground", sub: "Access suspended" },
            ]} />
            <CustomSelect label="Permission level" id="e-perm" defaultValue="full" options={[
              { value: "standard", label: "Standard",  sub: "View POs, submit invoices" },
              { value: "full",     label: "Full",      sub: "+ Upload delivery notes, view payments" },
              { value: "readonly", label: "Read-only", sub: "View only, no submissions" },
            ]} />
            <Field label="Portal login email" id="e-portal-email" defaultValue="info@freshproduce.co.ke" type="email" icon={Mail} />
            <div className="flex items-start gap-3 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
              <div className="size-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                <ExternalLink className="size-3.5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-foreground">Portal active since Jan 15, 2024</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Last login: Today, 8:14 AM · 42 sessions this month</p>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Compliance */}
        <SectionCard title="Account status & compliance" icon={ShieldCheck} accent="text-emerald-600">
          <div className="space-y-4">
            <CustomSelect label="Supplier status" id="e-status" defaultValue="verified" options={[
              { value: "verified",  label: "Verified",       color: "bg-emerald-500", sub: "KYC passed" },
              { value: "warning",   label: "Warning",        color: "bg-amber-500",   sub: "Quality issue flagged" },
              { value: "suspended", label: "Suspended",      color: "bg-rose-500",    sub: "Contract breach" },
              { value: "pending",   label: "Pending review", color: "bg-muted-foreground", sub: "Awaiting documents" },
            ]} />
            <div className="space-y-2.5">
              <p className="text-[11px] font-bold text-foreground">Performance indicators</p>
              {[
                { label: "Quality score",  value: 98, color: "bg-emerald-500" },
                { label: "On-time rate",   value: 99, color: "bg-primary" },
              ].map(p => (
                <div key={p.label} className="flex items-center gap-3">
                  <p className="text-[11px] text-muted-foreground w-24 shrink-0">{p.label}</p>
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full rounded-full ${p.color}`} style={{width:`${p.value}%`}} />
                  </div>
                  <span className="text-[11px] font-bold text-foreground w-8 text-right">{p.value}%</span>
                </div>
              ))}
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
              <ShieldCheck className="size-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-bold text-foreground">KYC verified · KEBS certified</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Verified Jan 2024. Next audit: Jan 2027.</p>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Save bar */}
      <div className="flex items-center justify-between p-4 rounded-2xl border border-border bg-card">
        <div className="flex items-center gap-2">
          <div className={`size-2 rounded-full ${dirty ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`} />
          <p className="text-[11px] text-muted-foreground">
            {dirty ? <><span className="text-foreground font-semibold">Unsaved changes</span> · ERPNext sync pending</> : "All changes saved · ERPNext synced"}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/suppliers/${id}`}><Button size="sm" variant="outline" className="h-8 text-xs">Discard</Button></Link>
          <Button size="sm" onClick={() => { setSaved(true); setDirty(false); }}
            className="h-8 text-xs gap-1.5 bg-primary hover:bg-primary/90 shadow-md shadow-primary/20">
            <Save className="size-3.5" />{saved && !dirty ? "Saved ✓" : "Save all changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
