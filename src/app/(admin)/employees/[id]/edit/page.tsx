"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft, ChevronDown, ChevronRight, Calendar, Check, Save,
  User, Mail, Phone, Building2, ShieldCheck,
  AlertTriangle, Fingerprint, Briefcase,
  History, Wallet, Settings,
  type LucideIcon
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
              <button onClick={() => setSelected(null)} className="text-[10px] font-semibold text-muted-foreground hover:text-foreground px-2 py-1 rounded-lg hover:bg-muted transition-colors">Clear</button>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/50 rounded-lg px-2 py-1">
                <Calendar className="size-3" />{selected ? selected.toLocaleDateString("en-KE",{day:"numeric",month:"short",year:"numeric"}) : "No date"}
              </div>
              <button onClick={() => { setSelected(today); setOpen(false); }} className="text-[10px] font-bold text-primary hover:text-primary/80 px-2 py-1 rounded-lg hover:bg-primary/5 transition-colors">Today</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Field ──────────────────────────────────────────────────────────────────────
function Field({ label, id, type="text", defaultValue, placeholder, icon: Icon, disabled }: {
  label: string; id: string; type?: string; defaultValue?: string; placeholder?: string; icon?: LucideIcon; disabled?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-[11px] font-semibold text-muted-foreground block">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />}
        <input id={id} type={type} defaultValue={defaultValue} placeholder={placeholder} disabled={disabled}
          className={`w-full h-9 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${Icon ? "pl-9 pr-4" : "px-4"} ${disabled ? "opacity-60 cursor-not-allowed bg-muted/30" : ""}`} />
      </div>
    </div>
  );
}

// ── Section card ───────────────────────────────────────────────────────────────
function SectionCard({ title, icon: Icon, accent="text-primary", children }: {
  title: string; icon: LucideIcon; accent?: string; children: React.ReactNode;
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
export default function EditEmployeePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500" onChange={() => setDirty(true)}>

      {/* Back + header */}
      <div>
        <Link href={`/employees/${id}`}>
          <button className="flex items-center gap-1.5 text-[11px] font-bold text-primary hover:text-primary/80 transition-colors mb-4 uppercase tracking-[0.15em]">
            <ChevronLeft className="size-3.5" /> Back to {id}
          </button>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-2xl bg-secondary text-secondary-foreground flex items-center justify-center font-black text-base shrink-0 shadow-md">SM</div>
            <div>
              <p className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] mb-0.5">Edit customer profile</p>
              <h1 className="text-xl font-black text-foreground tracking-tight leading-none">Samuel Mandela</h1>
              <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1.5">
                <Fingerprint className="size-3 text-primary" /> Biometric Identity · <span className="font-semibold text-foreground">{id}</span>
              </p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link href={`/employees/${id}`}><Button size="sm" variant="outline" className="h-8 text-xs">Discard</Button></Link>
            <Button size="sm" onClick={() => { setSaved(true); setDirty(false); }}
              className="h-8 text-xs gap-1.5 bg-primary hover:bg-primary/90 shadow-md shadow-primary/20">
              <Save className="size-3.5" />{saved && !dirty ? "Saved ✓" : "Save changes"}
            </Button>
          </div>
        </div>
      </div>

      {/* Warning */}
      <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl border border-amber-500/25 bg-amber-500/5">
        <AlertTriangle className="size-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Updates to <strong className="text-foreground">Institution</strong> or <strong className="text-foreground">Branch</strong> will affect subsidy calculation and reporting. Ensure the HR database is synced before applying these changes.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">

        {/* Personal profile */}
        <SectionCard title="Personal profile" icon={User} accent="text-primary">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Field label="Full name" id="e-name" defaultValue="Samuel Mandela" icon={User} />
            </div>
            <Field label="Employee ID / Payroll #" id="e-id" defaultValue={id} disabled icon={Fingerprint} />
            <Field label="Designation / Title" id="e-title" defaultValue="Senior Systems Architect" icon={Briefcase} />
            <Field label="Primary email"     id="e-email" type="email" defaultValue="s.mandela@crownpaints.co.ke" icon={Mail} />
            <Field label="Phone number"      id="e-phone" defaultValue="+254 712 345 678" icon={Phone} />
            <CustomSelect label="Gender" id="e-gender" defaultValue="male" options={[
              { value: "male",   label: "Male" },
              { value: "female", label: "Female" },
              { value: "other",  label: "Other" },
            ]} />
            <CalendarPicker label="Date of joining" id="e-join" defaultDate={new Date(2024, 0, 12)} />
          </div>
        </SectionCard>

        {/* Employment & Access */}
        <SectionCard title="Employment & access" icon={Building2} accent="text-emerald-600">
          <div className="grid sm:grid-cols-2 gap-4">
            <CustomSelect label="Institution / Employer" id="e-company" defaultValue="crown" options={[
              { value: "crown",    label: "Crown Paints Kenya PLC", color: "bg-emerald-500", sub: "Standard subsidy" },
              { value: "forza",    label: "Forza Consultants",      color: "bg-violet-500",  sub: "Contractor rates" },
              { value: "external", label: "External Visitor",       color: "bg-rose-500",    sub: "Full price" },
            ]} />
            <CustomSelect label="Primary branch" id="e-branch" defaultValue="nbi_hq" options={[
              { value: "nbi_hq",   label: "Nairobi HQ" },
              { value: "mba_pl",   label: "Mombasa Plant" },
              { value: "ksm_dp",   label: "Kisumu Depot" },
              { value: "eld_hb",   label: "Eldoret Hub" },
            ]} />
            <Field label="Department" id="e-dept" defaultValue="IT/Admin" />
            <CustomSelect label="Customer type" id="e-type" defaultValue="employee" options={[
              { value: "employee",   label: "Employee",   color: "bg-primary", sub: "Internal staff" },
              { value: "contractor", label: "Contractor", color: "bg-violet-500" },
              { value: "intern",     label: "Intern",     color: "bg-amber-500" },
              { value: "visitor",    label: "Visitor",    color: "bg-rose-500" },
            ]} />
            <CustomSelect label="Account status" id="e-status" defaultValue="active" options={[
              { value: "active",   label: "Active — Access granted", color: "bg-emerald-500" },
              { value: "inactive", label: "Inactive — Access denied", color: "bg-muted-foreground" },
              { value: "suspended",label: "Suspended — Pending review", color: "bg-amber-500" },
            ]} />
            <Field label="Access card ID" id="e-card" placeholder="Scan or enter card ID" icon={Fingerprint} />
          </div>
        </SectionCard>

        {/* Canteen Settings */}
        <SectionCard title="Canteen & wallet settings" icon={Wallet} accent="text-amber-500">
          <div className="grid sm:grid-cols-2 gap-4">
            <CustomSelect label="Subsidy model" id="e-subsidy" defaultValue="full" options={[
              { value: "full",    label: "Full subsidy (100%)", color: "bg-emerald-500", sub: "Institution pays all" },
              { value: "partial", label: "Partial — KES 250",   color: "bg-blue-500",    sub: "Employee pays top-up" },
              { value: "none",    label: "No subsidy (0%)",     color: "bg-rose-500",    sub: "Full meal price" },
            ]} />
            <CustomSelect label="Daily meal limit" id="e-limit" defaultValue="one" options={[
              { value: "one",    label: "1 Meal / day", sub: "Standard" },
              { value: "two",    label: "2 Meals / day" },
              { value: "unl",    label: "Unlimited",    sub: "Special approval" },
            ]} />
            <Field label="Wallet balance (KES)" id="e-wallet" type="number" defaultValue="1250" icon={Wallet} />
            <CustomSelect label="Loyalty tier" id="e-loyalty" defaultValue="gold" options={[
              { value: "bronze", label: "Bronze", color: "bg-orange-500" },
              { value: "silver", label: "Silver", color: "bg-slate-400" },
              { value: "gold",   label: "Gold",   color: "bg-amber-500" },
            ]} />
          </div>
        </SectionCard>

        {/* Biometric & security */}
        <SectionCard title="Security & biometrics" icon={ShieldCheck} accent="text-blue-600">
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
              <ShieldCheck className="size-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-bold text-foreground">Biometric identity verified</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Template last updated on Jan 12, 2024. Health score: 98%.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="h-8 text-[11px] flex-1 gap-1.5"><History className="size-3" /> Audit logs</Button>
              <Button size="sm" variant="outline" className="h-8 text-[11px] flex-1 gap-1.5"><Settings className="size-3" /> Permissions</Button>
            </div>
            <Button size="sm" variant="destructive" className="h-8 w-full text-[11px] font-bold">Reset biometric credentials</Button>
          </div>
        </SectionCard>
      </div>

      {/* Save bar */}
      <div className="flex items-center justify-between p-4 rounded-2xl border border-border bg-card">
        <div className="flex items-center gap-2">
          <div className={`size-2 rounded-full ${dirty ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`} />
          <p className="text-[11px] text-muted-foreground">
            {dirty ? <><span className="text-foreground font-semibold">Unsaved changes</span> · Local edit active</> : "All changes saved · System synced"}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/employees/${id}`}><Button size="sm" variant="outline" className="h-8 text-xs">Discard</Button></Link>
          <Button size="sm" onClick={() => { setSaved(true); setDirty(false); }}
            className="h-8 text-xs gap-1.5 bg-primary hover:bg-primary/90 shadow-md shadow-primary/20">
            <Save className="size-3.5" />{saved && !dirty ? "Saved ✓" : "Save all changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
