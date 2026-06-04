"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft, ChevronDown, Check, Save, Sparkles,
  Utensils, ChefHat, Flame, CalendarDays, ClipboardList,
  X,
} from "lucide-react";

// ── CustomSelect ───────────────────────────────────────────────────────────────

function CustomSelect({ id, label, options, required, placeholder }: {
  id: string; label: string; required?: boolean; placeholder?: string;
  options: { value: string; label: string; color?: string; sub?: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const sel = options.find(o => o.value === value);
  return (
    <div className="space-y-1.5" ref={ref}>
      <label className="text-[11px] font-semibold text-muted-foreground block">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <div className="relative">
        <button id={id} type="button" onClick={() => setOpen(o => !o)}
          className={`w-full h-9 px-3.5 rounded-xl border bg-card text-sm text-left flex items-center gap-2.5 transition-all ${open ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-muted-foreground/40"}`}>
          {sel?.color && <span className={`size-2 rounded-full shrink-0 ${sel.color}`} />}
          <span className={`flex-1 font-medium ${sel ? "text-foreground" : "text-muted-foreground"}`}>{sel?.label ?? placeholder ?? "Select…"}</span>
          <ChevronDown className={`size-3.5 text-muted-foreground transition-transform shrink-0 ${open ? "rotate-180" : ""}`} />
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

// ── TagInput ───────────────────────────────────────────────────────────────────

function TagInput({ label, placeholder, accent = "bg-muted text-foreground border-border" }: {
  label: string; placeholder?: string; accent?: string;
}) {
  const [tags, setTags] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const add = () => {
    if (draft.trim() && !tags.includes(draft.trim())) {
      setTags(t => [...t, draft.trim()]);
      setDraft("");
    }
  };
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-semibold text-muted-foreground block">{label}</label>
      <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-border bg-card min-h-[42px]">
        {tags.map(tag => (
          <span key={tag} className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg border ${accent}`}>
            {tag}
            <button type="button" onClick={() => setTags(t => t.filter(x => x !== tag))} className="ml-0.5 hover:text-rose-500 transition-colors"><X className="size-3" /></button>
          </span>
        ))}
        <input value={draft} onChange={e => setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); } }}
          placeholder={placeholder ?? "Type and press Enter…"}
          className="flex-1 min-w-[100px] h-6 text-[11px] bg-transparent text-foreground placeholder:text-muted-foreground outline-none" />
      </div>
      <p className="text-[10px] text-muted-foreground ml-1">Press Enter or comma to add · click × to remove</p>
    </div>
  );
}

// ── Steps ─────────────────────────────────────────────────────────────────────

const steps = [
  { n: 1, label: "Plan details",  icon: CalendarDays,  desc: "Week, period & settings"   },
  { n: 2, label: "Chef & targets",icon: ChefHat,       desc: "Assignments & nutrition"   },
  { n: 3, label: "Daily menus",   icon: ClipboardList, desc: "Normal & special per day"  },
  { n: 4, label: "Review",        icon: Sparkles,      desc: "Preview & publish"         },
];

const newDays = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

// ── Page ───────────────────────────────────────────────────────────────────────

export default function NewMenuPage() {
  const [step, setStep] = useState(1);
  const [activeDay, setActiveDay] = useState("Monday");

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">

      {/* Back */}
      <Link href="/menu">
        <button className="flex items-center gap-1.5 text-[11px] font-bold text-primary hover:text-primary/80 transition-colors mb-5 uppercase tracking-[0.15em]">
          <ChevronLeft className="size-3.5" /> Back to meal planning
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
                <CalendarDays className="size-5" />
              </div>
              <p className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] mb-1">New meal plan</p>
              <h1 className="text-xl font-black text-foreground tracking-tight leading-tight mb-2">Create week plan</h1>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Complete 4 steps to set up a weekly menu, assign chefs, and publish to all branches via ERPNext.
              </p>
            </div>
          </div>

          {/* Steps */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            {steps.map((s, i) => {
              const done = step > s.n;
              const active = step === s.n;
              return (
                <button key={s.n} onClick={() => setStep(s.n)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all ${i < steps.length - 1 ? "border-b border-border" : ""} ${active ? "bg-primary/5" : "hover:bg-muted/50"}`}>
                  <div className={`size-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${done ? "bg-emerald-500 text-white" : active ? "bg-primary text-primary-foreground shadow-md shadow-primary/25" : "bg-muted text-muted-foreground"}`}>
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
              {step === 1 && "Enter the week number matching the ERPNext payroll week to ensure meal costs are correctly allocated to the right period."}
              {step === 2 && "Chef assignments are optional per day — the primary chef covers all unassigned days by default."}
              {step === 3 && "You can add ingredient tags for each day. These appear on the employee-facing menu board and ERPNext Item list."}
              {step === 4 && "Publishing the plan makes it immediately visible to all employees on the self-service meal portal."}
            </p>
          </div>
        </div>

        {/* Right: form */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-border bg-card p-6">

            {/* Step header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                {step === 1 && <CalendarDays className="size-4" />}
                {step === 2 && <ChefHat className="size-4" />}
                {step === 3 && <ClipboardList className="size-4" />}
                {step === 4 && <Sparkles className="size-4" />}
              </div>
              <div>
                <p className="text-sm font-black text-foreground leading-none">
                  {step === 1 && "Plan details"}
                  {step === 2 && "Chef & nutritional targets"}
                  {step === 3 && "Daily menu setup"}
                  {step === 4 && "Review & publish"}
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

            {/* Step 1: Plan details */}
            {step === 1 && (
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Field label="Plan name" id="n-name" placeholder="e.g. Week 20 Meal Plan" required />
                </div>
                <Field label="Week number" id="n-week" type="number" placeholder="e.g. 20" required />
                <CustomSelect label="Plan status" id="n-status" required options={[
                  { value: "draft",     label: "Draft",     color: "bg-muted-foreground", sub: "Save as draft first" },
                  { value: "published", label: "Published", color: "bg-emerald-500",     sub: "Publish immediately" },
                ]} />
                <Field label="Start date" id="n-start" type="date" required />
                <Field label="End date"   id="n-end"   type="date" required />
                <CustomSelect label="Normal meal rate" id="n-rate" required options={[
                  { value: "250", label: "KES 250 (Standard)" },
                  { value: "300", label: "KES 300 (Premium)"  },
                ]} />
                <CustomSelect label="Special meal surcharge" id="n-surcharge" options={[
                  { value: "150", label: "KES 150 extra" },
                  { value: "200", label: "KES 200 extra" },
                  { value: "0",   label: "No surcharge"  },
                ]} />
              </div>
            )}

            {/* Step 2: Chef & nutrition */}
            {step === 2 && (
              <div className="grid sm:grid-cols-2 gap-4">
                <CustomSelect label="Primary chef" id="n-chef1" required options={[
                  { value: "maina", label: "Chef Maina", sub: "Speciality: Kenyan cuisine" },
                  { value: "sarah", label: "Chef Sarah", sub: "Speciality: Continental"    },
                  { value: "james", label: "Chef James", sub: "Relief cover"               },
                ]} />
                <CustomSelect label="Secondary chef" id="n-chef2" options={[
                  { value: "maina", label: "Chef Maina" },
                  { value: "sarah", label: "Chef Sarah" },
                  { value: "james", label: "Chef James" },
                  { value: "none",  label: "None"       },
                ]} />
                <Field label="Target calories — normal (KCAL)" id="n-cal-normal" type="number" placeholder="e.g. 650" icon={Flame} />
                <Field label="Target calories — special (KCAL)" id="n-cal-special" type="number" placeholder="e.g. 800" icon={Flame} />
                <Field label="Normal portions per day" id="n-portions-n" type="number" placeholder="e.g. 520" />
                <Field label="Special portions per day" id="n-portions-s" type="number" placeholder="e.g. 80" />
                <div className="sm:col-span-2">
                  <CustomSelect label="Dietary note" id="n-diet" options={[
                    { value: "standard",  label: "Standard — no allergen flags"          },
                    { value: "halal",     label: "Halal certified ingredients"           },
                    { value: "vegetarian",label: "Vegetarian option available each day"  },
                  ]} />
                </div>
              </div>
            )}

            {/* Step 3: Daily menus */}
            {step === 3 && (
              <div className="space-y-4">
                {/* Day tabs */}
                <div className="flex gap-1 flex-wrap">
                  {newDays.map(d => (
                    <button key={d} onClick={() => setActiveDay(d)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${activeDay === d ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                      {d.slice(0,3)}
                    </button>
                  ))}
                </div>

                <div className="h-px bg-border" />

                <div className="grid md:grid-cols-2 gap-5">
                  {/* Normal */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="size-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <Utensils className="size-3.5" />
                      </div>
                      <p className="text-[11px] font-bold text-primary uppercase tracking-[0.15em]">Normal meal</p>
                    </div>
                    <Field label="Meal name" id={`new-${activeDay}-normal`} placeholder="e.g. Ugali, Beef Stew & Cabbage" required />
                    <TagInput label="Ingredients / components" placeholder="Add ingredient, press Enter…" />
                    <Field label="Calorie count (KCAL)" id={`new-${activeDay}-cal`} type="number" placeholder="e.g. 650" icon={Flame} />
                  </div>

                  {/* Special */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="size-6 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                        <Sparkles className="size-3.5" />
                      </div>
                      <p className="text-[11px] font-bold text-accent uppercase tracking-[0.15em]">Special option</p>
                    </div>
                    <Field label="Special title" id={`new-${activeDay}-special`} placeholder="e.g. Grilled Fish & Matoke" required />
                    <TagInput label="Ingredients / components" placeholder="Add ingredient, press Enter…" accent="bg-accent/10 text-accent border-accent/20" />
                    <Field label="Extra surcharge (KES)" id={`new-${activeDay}-surcharge`} type="number" placeholder="e.g. 150" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-border">
                  <CustomSelect label="Chef on duty" id={`new-${activeDay}-chef`} options={[
                    { value: "maina", label: "Chef Maina" },
                    { value: "sarah", label: "Chef Sarah" },
                    { value: "james", label: "Chef James" },
                  ]} />
                  <Field label="Output portions" id={`new-${activeDay}-portions`} type="number" placeholder="e.g. 520" />
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <div className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { label: "Plan name",       value: "Week 20 Meal Plan" },
                    { label: "Period",           value: "May 18 – 23, 2026" },
                    { label: "Status",           value: "Draft (pending publish)" },
                    { label: "Primary chef",     value: "Chef Maina" },
                    { label: "Secondary chef",   value: "Chef Sarah" },
                    { label: "Calorie target",   value: "650–800 KCAL" },
                    { label: "Normal rate",      value: "KES 250" },
                    { label: "Special surcharge",value: "KES 150 extra" },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                      <span className="text-[11px] text-muted-foreground">{row.label}</span>
                      <span className="text-[12px] font-bold text-foreground">{row.value}</span>
                    </div>
                  ))}
                </div>

                {/* Publish notice */}
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex items-start gap-3">
                  <div className="size-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                    <CalendarDays className="size-4" />
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-foreground mb-0.5">Ready to publish</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Publishing will create the meal plan in ERPNext and make it immediately visible to employees on all branches&apos; self-service meal portal.
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
                  <Save className="size-3.5" /> Publish plan
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
