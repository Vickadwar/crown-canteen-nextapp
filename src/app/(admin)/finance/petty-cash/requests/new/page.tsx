"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft, ChevronDown, Check, Save,
  Wallet, FileText, Building2, User,
  DollarSign, Sparkles, Tag, ShieldCheck,
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
  { n: 1, label: "Request Identity", icon: FileText,    desc: "Purpose & location" },
  { n: 2, label: "Financials",      icon: DollarSign,  desc: "Amount & category" },
  { n: 3, label: "ERP Mapping",     icon: Building2,   desc: "Cost center & accounts" },
  { n: 4, label: "Approval Path",   icon: ShieldCheck, desc: "Review & workflow" },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function NewPettyCashRequestPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <Link href="/finance">
        <button className="flex items-center gap-1.5 text-[11px] font-bold text-primary hover:text-primary/80 transition-colors mb-5 uppercase tracking-[0.15em]">
          <ChevronLeft className="size-3.5" /> Back to command center
        </button>
      </Link>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6 items-start">

        {/* Left panel */}
        <div className="flex flex-col gap-3">
          <div className="relative rounded-2xl border border-border bg-card p-6 overflow-hidden">
            <div className="absolute -top-8 -right-8 size-28 bg-primary/10 blur-2xl rounded-full" />
            <div className="relative z-10">
              <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 ring-1 ring-primary/20 shadow-sm">
                <Wallet className="size-5" />
              </div>
              <p className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] mb-1">Treasury Request</p>
              <h1 className="text-xl font-black text-foreground tracking-tight leading-tight mb-2">Petty cash request</h1>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Create a new voucher request for operational expenditure. This will trigger the multi-level approval flow.
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
              <p className="text-[11px] font-bold text-primary">ERPNext Workflow</p>
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              {step === 1 && "Requests are tracked per location for localized P&L reporting."}
              {step === 2 && "Detailed line items help in automated tax calculation and vendor tracking."}
              {step === 3 && "Correct cost center mapping ensures zero discrepancies during monthly reconciliation."}
              {step === 4 && "Approvals follow the organizational hierarchy defined in your ERP."}
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
                  <Field label="Request Title / Purpose" id="pc-title" placeholder="e.g. Purchase of Fresh Spices" required icon={FileText} />
                </div>
                <CustomSelect label="Location / Branch" id="pc-branch" required options={[
                  { value: "nbo", label: "Nairobi HQ",     color: "bg-primary" },
                  { value: "msa", label: "Mombasa Plant",  color: "bg-blue-500" },
                  { value: "ksm", label: "Kisumu Depot",   color: "bg-emerald-500" },
                ]} />
                <CustomSelect label="Priority Level" id="pc-prio" defaultValue="normal" options={[
                  { value: "low",    label: "Low Priority" },
                  { value: "normal", label: "Normal Operations", color: "bg-blue-500" },
                  { value: "urgent", label: "Urgent / Emergency", color: "bg-rose-500" },
                ]} />
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1.5">Detailed Justification</label>
                  <textarea placeholder="Explain why this cash is needed..."
                    className="w-full h-24 p-3.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none" />
                </div>
              </div>
            )}

            {/* Step 2 — Financials */}
            {step === 2 && (
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Total Amount (KES)" id="pc-amt" type="number" placeholder="0.00" required icon={DollarSign} />
                <CustomSelect label="Expense Category" id="pc-cat" required options={[
                  { value: "kit", label: "Kitchen Ingredients" },
                  { value: "mnt", label: "Maintenance & Repairs" },
                  { value: "uti", label: "Utilities (Gas/Water)" },
                  { value: "log", label: "Local Logistics" },
                ]} />
                <div className="sm:col-span-2 p-4 rounded-xl border border-border bg-muted/20">
                  <p className="text-[11px] font-bold text-foreground mb-2 flex items-center gap-2"><Tag className="size-3.5 text-primary" /> Multi-line breakdown (Optional)</p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    For multiple items, you can attach a detailed receipt or quote in the next step or list them here for ERPNext line-item mapping.
                  </p>
                </div>
                <Field label="Anticipated Vendor" id="pc-vendor" placeholder="e.g. Local Market" />
                <CustomSelect label="Tax Included?" id="pc-tax" defaultValue="no" options={[
                  { value: "no",  label: "No / Inclusive" },
                  { value: "yes", label: "Yes (16% VAT)" },
                ]} />
              </div>
            )}

            {/* Step 3 — ERP Mapping */}
            {step === 3 && (
              <div className="grid sm:grid-cols-2 gap-4">
                <CustomSelect label="Cost Center" id="pc-cc" required options={[
                  { value: "cc-nbo", label: "CC-NBO-KITCHEN", sub: "Nairobi Operations" },
                  { value: "cc-msa", label: "CC-MSA-KITCHEN", sub: "Mombasa Operations" },
                  { value: "cc-adm", label: "CC-ADMIN-GEN",    sub: "General Admin" },
                ]} />
                <CustomSelect label="Expense Account (COA)" id="pc-coa" required options={[
                  { value: "5001", label: "5001 - Kitchen Supplies" },
                  { value: "5005", label: "5005 - Fuel & Gas" },
                  { value: "5010", label: "5010 - Repairs & Maint" },
                ]} />
                <Field label="Project Code" id="pc-proj" placeholder="e.g. PROJ-2026-Q2" icon={Building2} />
                <Field label="Reference Document #" id="pc-ref" placeholder="e.g. Quote #123" icon={Tag} />
              </div>
            )}

            {/* Step 4 — Approval Path */}
            {step === 4 && (
              <div className="space-y-5">
                 <div className="rounded-xl border border-border bg-muted/20 p-5">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Generated Approval Path</p>
                    <div className="space-y-4">
                       {[
                         { step: "Level 1", role: "Department Head", user: "Chef Samuel Mandela", icon: User },
                         { step: "Level 2", role: "Finance Manager", user: "Treasury Ops (Auto)",   icon: ShieldCheck },
                       ].map((p, i) => (
                         <div key={p.step} className="flex items-center gap-4 relative">
                            <div className={`size-8 rounded-full flex items-center justify-center shrink-0 z-10 ${i === 0 ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                               <p className="text-[10px] font-bold">{i+1}</p>
                            </div>
                            {i < 1 && <div className="absolute left-4 top-8 w-px h-4 bg-border" />}
                            <div>
                               <p className="text-[11px] font-black text-foreground">{p.step}: {p.role}</p>
                               <p className="text-[10px] text-muted-foreground">{p.user}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 flex items-start gap-3">
                  <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <ShieldCheck className="size-4" />
                  </div>
                  <div>
                    <p className="text-[12px] font-black text-foreground mb-1">Ready for disbursement request</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Submitting will notify the first-level approver. Once fully approved, cash will be issued from the branch float and logged to ERPNext.
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
              <Button size="sm" variant="outline" className="h-8 px-4 text-[11px]">Save as draft</Button>
              {step < 4 ? (
                <Button size="sm" onClick={() => setStep(step+1)}
                  className="h-8 px-5 text-[11px] bg-primary hover:bg-primary/90 shadow-md shadow-primary/25 transition-all">
                  Continue →
                </Button>
              ) : (
                <Button size="sm" className="h-8 px-5 text-[11px] bg-primary hover:bg-primary/90 shadow-md shadow-primary/25 transition-all flex items-center gap-1.5">
                  <Save className="size-3.5" /> Submit Request
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
