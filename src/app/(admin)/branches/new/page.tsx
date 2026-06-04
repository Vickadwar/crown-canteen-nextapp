"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft, ChevronDown, Check, Save,
  Building2, MapPin, Globe, Users, Utensils,
  ShieldCheck, Clock, Sparkles, Tag, Info,
  type LucideIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";

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

// ── Field ──────────────────────────────────────────────────────────────────────
function Field({ label, id, type="text", placeholder, required, icon: Icon }: {
  label: string; id: string; type?: string; placeholder?: string; required?: boolean; icon?: LucideIcon;
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
  { n: 1, label: "Hub identity",  icon: Building2,    desc: "Name & regional classification" },
  { n: 2, label: "Location specs", icon: MapPin,       desc: "Address & contacts" },
  { n: 3, label: "Operations",    icon: Utensils,     desc: "Capacity & staffing" },
  { n: 4, label: "Infrastructure", icon: ShieldCheck,  desc: "Security & assets" },
  { n: 5, label: "Review",        icon: Sparkles,     desc: "Confirm & activate" },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function NewBranchPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <Link href="/branches">
        <button className="flex items-center gap-1.5 text-[11px] font-bold text-primary hover:text-primary/80 transition-colors mb-5 uppercase tracking-[0.15em]">
          <ChevronLeft className="size-3.5" /> Back to network
        </button>
      </Link>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6 items-start">

        {/* Left panel */}
        <div className="flex flex-col gap-3">
          <div className="relative rounded-2xl border border-border bg-card p-6 overflow-hidden">
            <div className="absolute -top-8 -right-8 size-28 bg-primary/10 blur-2xl rounded-full" />
            <div className="relative z-10">
              <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 ring-1 ring-primary/20 shadow-sm">
                <Building2 className="size-5" />
              </div>
              <p className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] mb-1">Network Expansion</p>
              <h1 className="text-xl font-black text-foreground tracking-tight leading-tight mb-2">New regional hub</h1>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Onboard a new operational branch. This will register the location in the ERP network for logistics and staffing.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            {steps.map((s, i) => {
              const done = step > s.n; const active = step === s.n;
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
              <p className="text-[11px] font-bold text-primary">ERP Network Insight</p>
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              {step === 1 && "Proper regional classification ensures correct tax mapping and logistics routing."}
              {step === 2 && "Contact details are used for automated supplier deliveries and emergency alerts."}
              {step === 3 && "Capacity thresholds trigger automated shift planning and procurement reorders."}
              {step === 4 && "Infrastructure verification is required before full service activation."}
              {step === 5 && "Review all hub settings before activating the regional operational record."}
            </p>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-border bg-card p-6">
            {/* Step header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                {React.createElement(steps[step-1].icon, { className: "size-4" })}
              </div>
              <div>
                <p className="text-sm font-black text-foreground leading-none">{steps[step-1].label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Step {step} of {steps.length}</p>
              </div>
              <div className="ml-auto flex gap-1">
                {steps.map(s => (
                  <div key={s.n} className={`h-1 rounded-full transition-all duration-300 ${s.n <= step ? "bg-primary" : "bg-muted"} ${s.n === step ? "w-8" : "w-3"}`} />
                ))}
              </div>
            </div>
            <div className="h-px bg-border mb-5" />

            {/* Step 1 — Identity */}
            {step === 1 && (
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Field label="Branch name" id="b-name" placeholder="e.g. Nakuru Logistics Hub" required icon={Building2} />
                </div>
                <Field label="Branch ID / Code" id="b-id" placeholder="e.g. BR-NAK" required icon={Tag} />
                <CustomSelect label="Region" id="b-reg" required options={[
                  { value: "nbo",   label: "Nairobi Metropolitan", color: "bg-primary" },
                  { value: "coast", label: "Coastal Region",       color: "bg-blue-500" },
                  { value: "west",  label: "Western Kenya",         color: "bg-emerald-500" },
                  { value: "rift",  label: "Rift Valley",           color: "bg-amber-500" },
                ]} />
                <CustomSelect label="Hub classification" id="b-class" required options={[
                  { value: "primary",   label: "Primary Production Hub", sub: "Logistics focus" },
                  { value: "satellite", label: "Satellite Service Point", sub: "Staff focus" },
                  { value: "depot",     label: "Distribution Depot" },
                ]} />
                <CustomSelect label="Initial status" id="b-status" defaultValue="draft" options={[
                  { value: "draft",    label: "Draft — Not operational", color: "bg-muted-foreground" },
                  { value: "pending",  label: "Pending Verification",    color: "bg-amber-500" },
                  { value: "active",   label: "Active — Immediate setup", color: "bg-emerald-500" },
                ]} />
              </div>
            )}

            {/* Step 2 — Location */}
            {step === 2 && (
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Field label="Physical Address" id="b-addr" placeholder="e.g. Plot 12, Nakuru-Eldoret Hwy" required icon={MapPin} />
                </div>
                <Field label="Primary Phone" id="b-phone" placeholder="+254..." required icon={Globe} />
                <Field label="Contact Email" id="b-email" type="email" placeholder="branch@crownpaints.co.ke" />
                <Field label="Service Start" id="b-start" placeholder="06:00 AM" icon={Clock} />
                <Field label="Service End"   id="b-end"   placeholder="08:00 PM" icon={Clock} />
                <div className="sm:col-span-2 p-4 rounded-xl border border-border bg-muted/20">
                  <p className="text-[11px] font-bold text-foreground mb-2 flex items-center gap-2"><Info className="size-3.5 text-primary" /> Geospatial Mapping</p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    Once created, you can pin the exact location on the integrated Google Map via the branch settings to enable proximity-based logistics tracking.
                  </p>
                </div>
              </div>
            )}

            {/* Step 3 — Operations */}
            {step === 3 && (
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Max Daily Capacity" id="b-cap" type="number" placeholder="e.g. 500" required icon={Utensils} />
                <Field label="Target Staff Count" id="b-staff" type="number" placeholder="e.g. 10" icon={Users} />
                <Field label="Monthly Budget Limit" id="b-budget" type="number" placeholder="e.g. 250000" />
                <CustomSelect label="Meal service model" id="b-model" defaultValue="buffet" options={[
                  { value: "buffet", label: "Self-Service Buffet" },
                  { value: "plated", label: "Plated Service" },
                  { value: "hybrid", label: "Hybrid" },
                ]} />
                <div className="sm:col-span-2 p-4 rounded-xl border border-border bg-primary/5">
                  <p className="text-[11px] font-bold text-primary mb-2">Automated Procurement Info</p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    Setting capacity and staffing targets allows the ERP to automatically calculate initial stock reorder levels for new hub setup.
                  </p>
                </div>
              </div>
            )}

            {/* Step 4 — Infrastructure */}
            {step === 4 && (
              <div className="grid sm:grid-cols-2 gap-4">
                <CustomSelect label="Initial security level" id="b-sec" defaultValue="med" options={[
                  { value: "high", label: "Level 3 — Biometric", color: "bg-emerald-500" },
                  { value: "med",  label: "Level 2 — RFID",      color: "bg-blue-500" },
                  { value: "low",  label: "Level 1 — Basic" },
                ]} />
                <CustomSelect label="Backup Power" id="b-power" options={[
                  { value: "gen",  label: "Generator Backup" },
                  { value: "ups",  label: "Solar + UPS" },
                  { value: "none", label: "Mains Only" },
                ]} />
                <div className="sm:col-span-2 space-y-3">
                  <p className="text-[11px] font-bold text-foreground">Facility Checklist</p>
                  {[
                    "Biometric scanner installed",
                    "POS terminals connected to network",
                    "Cold storage temperature sensors active",
                    "Emergency exit & safety signage verified"
                  ].map(c => (
                    <div key={c} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/30 transition-colors cursor-pointer">
                      <div className="size-4 rounded-md border border-border bg-card flex items-center justify-center group-hover:border-primary">
                        {/* checkbox would go here */}
                      </div>
                      <span className="text-[11px] text-muted-foreground">{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5 — Review */}
            {step === 5 && (
              <div className="space-y-5">
                <div className="grid sm:grid-cols-3 gap-3">
                  {["Hub identity","Location specs","Operations"].map(item => (
                    <div key={item} className="flex items-center gap-2 p-3 rounded-xl border border-border bg-muted/20">
                      <div className="size-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                        <Check className="size-3.5" />
                      </div>
                      <p className="text-[11px] font-semibold text-foreground">{item}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 flex items-start gap-3">
                  <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <ShieldCheck className="size-4" />
                  </div>
                  <div>
                    <p className="text-[12px] font-black text-foreground mb-1">Hub Activation Ready</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Submitting will create a new <strong className="text-foreground">Branch Master Record</strong>. 
                      You can immediately assign staff and begin procurement cycles for this location.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Nav */}
          <div className="flex items-center justify-between">
            <Button size="sm" variant="outline" onClick={() => setStep(Math.max(1, step-1))} disabled={step === 1}
              className="h-8 px-4 text-[11px]">
              ← Previous
            </Button>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="h-8 px-4 text-[11px]">Save draft</Button>
              {step < 5 ? (
                <Button size="sm" onClick={() => setStep(step+1)}
                  className="h-8 px-5 text-[11px] bg-primary hover:bg-primary/90 shadow-md shadow-primary/25 transition-all">
                  Continue →
                </Button>
              ) : (
                <Button size="sm" className="h-8 px-5 text-[11px] bg-primary hover:bg-primary/90 shadow-md shadow-primary/25 transition-all flex items-center gap-1.5">
                  <Save className="size-3.5" /> Register Hub
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
