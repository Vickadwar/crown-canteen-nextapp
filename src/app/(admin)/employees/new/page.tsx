"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  User,
  Mail,
  Phone,
  Building2,
  Tag,
  Save,
  Check,
  Calendar,
  Utensils,
  Shield,
  UserPlus,
  Sparkles,
} from "lucide-react";

// ── Custom Select ─────────────────────────────────────────────────────────────

function CustomSelect({
  id, label, options, required, placeholder,
}: {
  id: string; label: string; options: { value: string; label: string; color?: string }[];
  required?: boolean; placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
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
          id={id}
          type="button"
          onClick={() => setOpen((o) => !o)}
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
                key={o.value}
                type="button"
                onClick={() => { setValue(o.value); setOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-left hover:bg-muted transition-colors ${value === o.value ? "bg-primary/5 text-primary font-semibold" : "text-foreground"}`}
              >
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

// ── Mini Calendar ─────────────────────────────────────────────────────────────

function CalendarPicker({ label, id, required }: { label: string; id: string; required?: boolean }) {
  const today = new Date();
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selected, setSelected] = useState<Date | null>(null);
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

  const displayVal = selected
    ? selected.toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })
    : "";

  return (
    <div className="space-y-1.5" ref={ref}>
      <label htmlFor={id} className="text-[11px] font-semibold text-muted-foreground block">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <div className="relative">
        <button
          id={id}
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={`w-full h-9 px-3.5 pr-9 rounded-xl border bg-card text-sm text-left flex items-center gap-2 transition-all ${open ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-muted-foreground/40"}`}
        >
          <Calendar className="size-3.5 text-muted-foreground shrink-0" />
          {displayVal ? (
            <span className="font-medium text-foreground">{displayVal}</span>
          ) : (
            <span className="text-muted-foreground">Pick a date</span>
          )}
        </button>

        {open && (
          <div className="absolute z-50 top-full mt-1.5 w-64 rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 origin-top p-3">
            {/* Month nav */}
            <div className="flex items-center justify-between mb-3">
              <button onClick={prevMonth} className="size-7 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                <ChevronLeft className="size-4" />
              </button>
              <span className="text-[12px] font-bold text-foreground">{monthNames[month]} {year}</span>
              <button onClick={nextMonth} className="size-7 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                <ChevronRight className="size-4" />
              </button>
            </div>

            {/* Day labels */}
            <div className="grid grid-cols-7 mb-1">
              {dayNames.map((d) => (
                <div key={d} className="text-[9px] font-bold text-muted-foreground text-center py-1">{d}</div>
              ))}
            </div>

            {/* Date cells */}
            <div className="grid grid-cols-7 gap-0.5">
              {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const thisDate = new Date(year, month, day);
                const isSelected = selected?.toDateString() === thisDate.toDateString();
                const isToday = today.toDateString() === thisDate.toDateString();
                return (
                  <button
                    key={day}
                    onClick={() => { setSelected(thisDate); setOpen(false); }}
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

// ── Text Input ────────────────────────────────────────────────────────────────

function Field({
  label, id, type = "text", placeholder, required, icon: Icon,
}: {
  label: string; id: string; type?: string; placeholder?: string; required?: boolean; icon?: any;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-[11px] font-semibold text-muted-foreground block">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          className={`w-full h-9 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${Icon ? "pl-9 pr-4" : "px-4"}`}
        />
      </div>
    </div>
  );
}

// ── Step config ───────────────────────────────────────────────────────────────

const steps = [
  { n: 1, label: "Personal",    icon: User,      desc: "Identity & contact details" },
  { n: 2, label: "Institution", icon: Building2, desc: "Employer & access settings" },
  { n: 3, label: "Meal plan",   icon: Utensils,  desc: "Entitlement & subsidy setup" },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function NewCustomerPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">

      {/* ── Back ───────────────────────────────────────────────── */}
      <Link href="/employees">
        <button className="flex items-center gap-1.5 text-[11px] font-bold text-primary hover:text-primary/80 transition-colors mb-5 uppercase tracking-[0.15em]">
          <ChevronLeft className="size-3.5" /> Back to customers
        </button>
      </Link>

      <div className="grid lg:grid-cols-[260px_1fr] gap-6 items-start">

        {/* ── Left panel: step nav ─────────────────────────────── */}
        <div className="flex flex-col gap-3">
          {/* Hero card */}
          <div className="relative rounded-2xl border border-border bg-card p-6 overflow-hidden">
            <div className="absolute -top-8 -right-8 size-28 bg-primary/10 blur-2xl rounded-full" />
            <div className="relative z-10">
              <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <UserPlus className="size-5" />
              </div>
              <p className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] mb-1">Registration</p>
              <h1 className="text-xl font-black text-foreground tracking-tight leading-tight mb-2">Add new canteen customer</h1>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Complete all 3 steps to register a customer for canteen access and automated meal tracking.
              </p>
            </div>
          </div>

          {/* Steps */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            {steps.map((s, i) => {
              const done = step > s.n;
              const active = step === s.n;
              return (
                <button
                  key={s.n}
                  onClick={() => setStep(s.n)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all ${i < steps.length - 1 ? "border-b border-border" : ""} ${active ? "bg-primary/5" : "hover:bg-muted/50"}`}
                >
                  <div className={`size-8 rounded-xl flex items-center justify-center shrink-0 transition-all font-bold text-[11px]
                    ${done ? "bg-emerald-500 text-white" : active ? "bg-primary text-primary-foreground shadow-md shadow-primary/25" : "bg-muted text-muted-foreground"}`}
                  >
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

          {/* Tips card */}
          <div className="rounded-2xl border border-primary/15 bg-primary/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="size-3.5 text-primary" />
              <p className="text-[11px] font-bold text-primary">Quick tip</p>
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              {step === 1 && "Use the staff ID exactly as it appears on the employee's payslip or ID card for accurate meal tracking."}
              {step === 2 && "Linking to the correct institution ensures subsidy calculations are applied from the right billing account."}
              {step === 3 && "100% subsidised customers can access any meal without co-payment. Partial subsidy configs are billed monthly."}
            </p>
          </div>
        </div>

        {/* ── Right panel: form ────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-border bg-card p-6">

            {/* Step header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                {step === 1 && <User className="size-4" />}
                {step === 2 && <Building2 className="size-4" />}
                {step === 3 && <Utensils className="size-4" />}
              </div>
              <div>
                <p className="text-sm font-black text-foreground leading-none">
                  {step === 1 && "Personal details"}
                  {step === 2 && "Institution & access"}
                  {step === 3 && "Meal plan & subsidy"}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Step {step} of {steps.length}
                </p>
              </div>
              {/* mini progress */}
              <div className="ml-auto flex gap-1">
                {steps.map((s) => (
                  <div key={s.n} className={`h-1 rounded-full transition-all duration-300 ${s.n <= step ? "bg-primary" : "bg-muted"} ${s.n === step ? "w-8" : "w-3"}`} />
                ))}
              </div>
            </div>

            <div className="h-px bg-border mb-5" />

            {/* Step 1 */}
            {step === 1 && (
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="First name"       id="first-name" placeholder="e.g. Samuel"            required icon={User}  />
                <Field label="Last name"        id="last-name"  placeholder="e.g. Mandela"            required             />
                <Field label="Email address"    id="email"      type="email" placeholder="work@company.co.ke" required icon={Mail}  />
                <Field label="Phone number"     id="phone"      type="tel"   placeholder="+254 7XX XXX XXX"   icon={Phone} />
                <CustomSelect label="Customer type" id="type" required options={[
                  { value: "employee",   label: "Employee",   color: "bg-primary" },
                  { value: "contractor", label: "Contractor", color: "bg-violet-500" },
                  { value: "intern",     label: "Intern",     color: "bg-amber-500" },
                  { value: "visitor",    label: "Visitor",    color: "bg-rose-500" },
                ]} />
                <Field label="ID / Staff number" id="staff-id" placeholder="e.g. EMP001" required icon={Tag} />
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="grid sm:grid-cols-2 gap-4">
                <CustomSelect label="Institution" id="institution" required options={[
                  { value: "crown", label: "Crown Paints Kenya PLC" },
                  { value: "forza", label: "Forza Consultants" },
                  { value: "oduk",  label: "ODUK TECH LIMITED" },
                  { value: "ext",   label: "External / Visitor" },
                ]} />
                <Field label="Department"       id="dept"    placeholder="e.g. IT/Admin"          icon={Building2} />
                <Field label="Job title"        id="title"   placeholder="e.g. Systems Architect"              />
                <CustomSelect label="Primary branch" id="branch" required options={[
                  { value: "nrb",  label: "Nairobi HQ" },
                  { value: "msa",  label: "Mombasa Plant" },
                  { value: "ksm",  label: "Kisumu Depot" },
                  { value: "eld",  label: "Eldoret Hub" },
                ]} />
                <CustomSelect label="Status" id="status" required options={[
                  { value: "active",   label: "Active",   color: "bg-emerald-500" },
                  { value: "inactive", label: "Inactive", color: "bg-muted-foreground" },
                ]} />
                <CalendarPicker label="Start date" id="start" required />
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <CustomSelect label="Meal plan" id="meal-plan" required options={[
                    { value: "normal",  label: "Normal lunch only",         color: "bg-primary/60" },
                    { value: "special", label: "Special lunch only",        color: "bg-accent/60" },
                    { value: "both",    label: "Both (normal + special)",   color: "bg-violet-500/60" },
                    { value: "none",    label: "No meal entitlement" },
                  ]} />
                  <CustomSelect label="Subsidy type" id="subsidy" required options={[
                    { value: "full",    label: "100% subsidised",    color: "bg-emerald-500" },
                    { value: "partial", label: "Partial (fixed KES)", color: "bg-amber-500" },
                    { value: "pct",     label: "Partial (%)",         color: "bg-blue-500" },
                    { value: "none",    label: "No subsidy" },
                  ]} />
                  <Field label="Daily meal limit" id="meal-limit" type="number" placeholder="e.g. 2 per day" />
                  <CustomSelect label="Biometric enrolment" id="biometric" options={[
                    { value: "first",     label: "Prompt on first login" },
                    { value: "enrolled",  label: "Already enrolled" },
                    { value: "skip",      label: "Skip (visitor / temp)" },
                  ]} />
                </div>

                {/* Confirmation nudge */}
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex items-start gap-3">
                  <div className="size-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                    <Shield className="size-4" />
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-foreground mb-0.5">Ready to register</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      The customer will receive an onboarding email with their canteen QR code and biometric enrolment instructions within minutes.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="h-8 px-4 rounded-xl border border-border bg-card text-[11px] font-semibold text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:pointer-events-none transition-all"
            >
              ← Previous
            </button>
            <div className="flex gap-2">
              <button className="h-8 px-4 rounded-xl border border-border bg-card text-[11px] font-semibold text-muted-foreground hover:bg-muted transition-all">
                Save draft
              </button>
              {step < 3 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  className="h-8 px-5 rounded-xl bg-primary text-primary-foreground text-[11px] font-bold hover:bg-primary/90 shadow-md shadow-primary/25 transition-all"
                >
                  Continue →
                </button>
              ) : (
                <button className="h-8 px-5 rounded-xl bg-primary text-primary-foreground text-[11px] font-bold hover:bg-primary/90 shadow-md shadow-primary/25 transition-all flex items-center gap-1.5">
                  <Save className="size-3.5" /> Register customer
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
