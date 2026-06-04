"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft, ChevronDown, ChevronRight, Check, Save,
  Utensils, Sparkles, ChefHat, Flame, AlertTriangle,
  CalendarDays, Calendar, Plus, X, RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ── CustomSelect ───────────────────────────────────────────────────────────────

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

// ── CalendarPicker ─────────────────────────────────────────────────────────────

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
  const fullMonths = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const displayVal = selected ? selected.toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" }) : "";
  const prev = () => month === 0 ? (setMonth(11), setYear(y => y - 1)) : setMonth(m => m - 1);
  const next = () => month === 11 ? (setMonth(0), setYear(y => y + 1)) : setMonth(m => m + 1);
  return (
    <div className="space-y-1.5" ref={ref}>
      <label className="text-[11px] font-semibold text-muted-foreground block">{label}</label>
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

// ── Field ──────────────────────────────────────────────────────────────────────

function Field({ label, id, type = "text", defaultValue, placeholder, icon: Icon }: {
  label: string; id: string; type?: string; defaultValue?: string; placeholder?: string; icon?: React.ElementType;
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

// ── TagInput ───────────────────────────────────────────────────────────────────

function TagInput({ label, defaultTags, accent = "bg-muted text-foreground border-border" }: {
  label: string; defaultTags: string[]; accent?: string;
}) {
  const [tags, setTags] = useState(defaultTags);
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
            <button type="button" onClick={() => setTags(t => t.filter(x => x !== tag))}
              className="ml-0.5 hover:text-rose-500 transition-colors"><X className="size-3" /></button>
          </span>
        ))}
        <input value={draft} onChange={e => setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); } }}
          placeholder="Add ingredient…"
          className="flex-1 min-w-[100px] h-6 text-[11px] bg-transparent text-foreground placeholder:text-muted-foreground outline-none" />
      </div>
      <p className="text-[10px] text-muted-foreground ml-1">Press Enter or comma to add · click × to remove</p>
    </div>
  );
}

// ── SectionCard ────────────────────────────────────────────────────────────────

function SectionCard({ title, icon: Icon, accent = "text-primary", children }: {
  title: string; icon: React.ElementType; accent?: string; children: React.ReactNode;
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

// ── Days list ──────────────────────────────────────────────────────────────────

const days = [
  {
    key: "monday",    label: "Monday",    date: "May 11",
    normal: "Ugali, Beef Stew & Cabbage", normalTags: ["Ugali","Beef Stew","Steamed Cabbage","Kachumbari"],
    special: "Grilled Fish & Matoke",      specialTags: ["Tilapia Fillet","Matoke","Coconut Sauce","Lemon"],
    calories: "650", portions: "520",
  },
  {
    key: "tuesday",   label: "Tuesday",   date: "May 12",
    normal: "Rice, Beans & Sukuma Wiki",  normalTags: ["Steamed Rice","Kidney Beans","Sukuma Wiki","Tomato Gravy"],
    special: "Chicken Biryani",            specialTags: ["Basmati Rice","Chicken","Biryani Spice","Raita"],
    calories: "720", portions: "520",
  },
  {
    key: "wednesday", label: "Wednesday", date: "May 13",
    normal: "Githeri with Avocado",        normalTags: ["Maize","Beans","Avocado","Onions"],
    special: "Beef Pilau & Kachumbari",    specialTags: ["Pilau Rice","Beef","Pilau Masala","Kachumbari"],
    calories: "680", portions: "520",
  },
  {
    key: "thursday",  label: "Thursday",  date: "May 14",
    normal: "Chapati & Green Grams",       normalTags: ["Chapati","Green Grams","Coconut Curry","Coriander"],
    special: "Pasta Carbonara",            specialTags: ["Spaghetti","Bacon","Egg Cream Sauce","Parmesan"],
    calories: "750", portions: "520",
  },
  {
    key: "friday",    label: "Friday",    date: "May 15",
    normal: "Rice & Fish Fillet",          normalTags: ["Steamed Rice","Tilapia","Tomato Sauce","Spinach"],
    special: "Nyama Choma & Ugali",        specialTags: ["Goat Ribs","Ugali","Kachumbari","Pepper Sauce"],
    calories: "820", portions: "520",
  },
  {
    key: "saturday",  label: "Saturday",  date: "May 16",
    normal: "Mashed Potatoes & Peas",      normalTags: ["Mashed Potatoes","Green Peas","Butter Sauce","Herbs"],
    special: "Assorted Wraps",             specialTags: ["Wheat Wraps","Chicken","Avocado","Salad"],
    calories: "550", portions: "300",
  },
];

// ── Page ───────────────────────────────────────────────────────────────────────

export default function EditMenuPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(true);
  const [activeDay, setActiveDay] = useState("monday");

  const day = days.find(d => d.key === activeDay) ?? days[0];

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500" onChange={() => setDirty(true)}>

      {/* Back + header */}
      <div>
        <Link href={`/menu/${id}`}>
          <button className="flex items-center gap-1.5 text-[11px] font-bold text-primary hover:text-primary/80 transition-colors mb-4 uppercase tracking-[0.15em]">
            <ChevronLeft className="size-3.5" /> Back to {id}
          </button>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <CalendarDays className="size-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] mb-0.5">Edit meal plan</p>
              <h1 className="text-xl font-black text-foreground tracking-tight leading-none">Week 19 Plan</h1>
              <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1.5">
                <RefreshCw className="size-3 text-amber-500" /> ERPNext Menu Doctype · <span className="font-semibold text-foreground">{id}</span>
              </p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link href={`/menu/${id}`}><Button size="sm" variant="outline" className="h-8 text-xs">Discard</Button></Link>
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
          Changes to published meal plans sync to ERPNext on save. Employees who have already selected meals for today will not be affected.
        </p>
      </div>

      {/* Plan-level settings */}
      <div className="grid lg:grid-cols-2 gap-5">
        <SectionCard title="Plan details" icon={CalendarDays}>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Plan name"    id="e-name"  defaultValue="Week 19 Meal Plan" />
            <Field label="Week number" id="e-week"  defaultValue="19" type="number" />
            <CalendarPicker label="Start date" id="e-start" defaultDate={new Date(2026, 4, 11)} />
            <CalendarPicker label="End date"   id="e-end"   defaultDate={new Date(2026, 4, 16)} />
            <CustomSelect label="Plan status" id="e-status" defaultValue="published" options={[
              { value: "published", label: "Published",  color: "bg-emerald-500", sub: "Visible to employees" },
              { value: "draft",     label: "Draft",      color: "bg-muted-foreground", sub: "Not yet live" },
              { value: "archived",  label: "Archived",   color: "bg-amber-500", sub: "Past plan" },
            ]} />
            <CustomSelect label="Normal meal rate" id="e-rate" defaultValue="250" options={[
              { value: "250", label: "KES 250 (Standard)" },
              { value: "300", label: "KES 300 (Premium)"  },
            ]} />
          </div>
        </SectionCard>

        <SectionCard title="Chef assignments" icon={ChefHat} accent="text-violet-500">
          <div className="space-y-4">
            <CustomSelect label="Primary chef" id="e-chef1" defaultValue="maina" options={[
              { value: "maina",  label: "Chef Maina",  sub: "Mon, Wed, Fri" },
              { value: "sarah",  label: "Chef Sarah",  sub: "Tue, Thu, Sat" },
              { value: "james",  label: "Chef James",  sub: "Relief cover" },
            ]} />
            <CustomSelect label="Secondary chef" id="e-chef2" defaultValue="sarah" options={[
              { value: "maina",  label: "Chef Maina" },
              { value: "sarah",  label: "Chef Sarah" },
              { value: "james",  label: "Chef James" },
            ]} />
            <Field label="Calorie target (avg KCAL)" id="e-cal" type="number" defaultValue="695" icon={Flame} />
            <Field label="Portions per day (normal)" id="e-portions" type="number" defaultValue="520" />
          </div>
        </SectionCard>
      </div>

      {/* Day-by-day editor */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/30">
          <p className="text-[11px] font-bold text-foreground">Daily menu editor</p>
          <p className="text-[10px] text-muted-foreground">Click a day to edit</p>
        </div>

        <div className="grid lg:grid-cols-[220px_1fr]">
          {/* Day list */}
          <div className="border-r border-border divide-y divide-border">
            {days.map((d) => (
              <button key={d.key} onClick={() => setActiveDay(d.key)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all ${activeDay === d.key ? "bg-primary/5" : "hover:bg-muted/30"}`}>
                <div className={`size-8 rounded-xl flex items-center justify-center font-black text-[10px] shrink-0 transition-all ${activeDay === d.key ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-muted-foreground"}`}>
                  {d.date.split(" ")[1]}
                </div>
                <div className="min-w-0">
                  <p className={`text-[12px] font-bold leading-none ${activeDay === d.key ? "text-primary" : "text-foreground"}`}>{d.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{d.date}, 2026</p>
                </div>
                {activeDay === d.key && <div className="ml-auto size-1.5 rounded-full bg-primary shrink-0" />}
              </button>
            ))}
          </div>

          {/* Day form */}
          <div className="p-5 space-y-5">
            <div className="flex items-center gap-3 mb-1">
              <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <CalendarDays className="size-4" />
              </div>
              <div>
                <p className="text-sm font-black text-foreground leading-none">{day.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{day.date}, 2026</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {/* Normal meal */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Utensils className="size-3.5" />
                  </div>
                  <p className="text-[11px] font-bold text-primary uppercase tracking-[0.15em]">Normal meal</p>
                </div>
                <Field label="Meal name" id={`${day.key}-normal`} defaultValue={day.normal} />
                <TagInput label="Ingredients / components" defaultTags={day.normalTags} />
                <Field label="Calorie count (KCAL)" id={`${day.key}-cal`} type="number" defaultValue={day.calories} icon={Flame} />
              </div>

              {/* Special meal */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                    <Sparkles className="size-3.5" />
                  </div>
                  <p className="text-[11px] font-bold text-accent uppercase tracking-[0.15em]">Special option</p>
                </div>
                <Field label="Special title" id={`${day.key}-special`} defaultValue={day.special} />
                <TagInput label="Ingredients / components" defaultTags={day.specialTags} accent="bg-accent/10 text-accent border-accent/20" />
                <Field label="Extra surcharge (KES)" id={`${day.key}-surcharge`} type="number" defaultValue="150" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-border">
              <CustomSelect label="Chef on duty" id={`${day.key}-chef`} defaultValue={day.key === "monday" || day.key === "wednesday" || day.key === "friday" ? "maina" : "sarah"} options={[
                { value: "maina", label: "Chef Maina" },
                { value: "sarah", label: "Chef Sarah" },
                { value: "james", label: "Chef James" },
              ]} />
              <Field label="Output portions" id={`${day.key}-portions`} type="number" defaultValue={day.portions} />
            </div>
          </div>
        </div>
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
          <Link href={`/menu/${id}`}><Button size="sm" variant="outline" className="h-8 text-xs">Discard</Button></Link>
          <Button size="sm" onClick={() => { setSaved(true); setDirty(false); }}
            className="h-8 text-xs gap-1.5 bg-primary hover:bg-primary/90 shadow-md shadow-primary/20">
            <Save className="size-3.5" />{saved && !dirty ? "Saved ✓" : "Save all changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
