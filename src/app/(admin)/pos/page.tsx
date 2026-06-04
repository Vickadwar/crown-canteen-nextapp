"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Search, UserCheck, Utensils, Sparkles, Users, CheckCircle2,
  X, Clock, Plus, Minus, ChevronRight, AlertCircle, ChevronDown, Check,
  ShoppingBag, Building2, User, Trash2,
} from "lucide-react";

// ── CustomSelect ────────────────────────────────────────────────────────────

function CustomSelect({ id, label, value, onChange, placeholder, options, required }: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean;
  options: { value: string; label: string; color?: string; sub?: string }[];
}) {
  const [open, setOpen] = useState(false);
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
        {label}{required && <span className="text-primary"> *</span>}
      </label>
      <div className="relative">
        <button id={id} type="button" onClick={() => setOpen(o => !o)}
          className={`w-full h-9 px-3.5 rounded-xl border bg-card text-sm text-left flex items-center gap-2.5 transition-all ${
            open ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-muted-foreground/40"}`}>
          {sel?.color && <span className={`size-2 rounded-full shrink-0 ${sel.color}`} />}
          <span className={`flex-1 font-medium ${sel ? "text-foreground" : "text-muted-foreground"}`}>
            {sel?.label ?? placeholder ?? "Select…"}
          </span>
          <ChevronDown className={`size-3.5 text-muted-foreground transition-transform shrink-0 ${open ? "rotate-180" : ""}`} />
        </button>
        {open && (
          <div className="absolute z-[200] top-full mt-1.5 w-full rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 origin-top">
            {options.map(o => (
              <button key={o.value} type="button" onClick={() => { onChange(o.value); setOpen(false); }}
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

// ── mock staff data ──────────────────────────────────────────────────────────
const employees = [
  { id: "EMP001", name: "Samuel Mandela",  dept: "ICT",        company: "Crown Paints", branch: "Nairobi HQ",   subsidy: "Full" },
  { id: "EMP002", name: "Jane Kariuki",    dept: "Production", company: "Crown Paints", branch: "Mombasa Plant", subsidy: "Full" },
  { id: "EMP003", name: "Peter Otieno",    dept: "Finance",    company: "Forza Consultants", branch: "Nairobi HQ", subsidy: "Partial" },
  { id: "EMP004", name: "Grace Wambua",    dept: "HR",         company: "Crown Paints", branch: "Nairobi HQ",   subsidy: "Full" },
  { id: "EMP005", name: "David Kamau",     dept: "Logistics",  company: "Logistics Hub", branch: "Eldoret Hub", subsidy: "Full" },
  { id: "EMP006", name: "Amina Hassan",    dept: "Sales",      company: "ODUK Tech",    branch: "Nairobi HQ",   subsidy: "None" },
];

const departments = ["ICT","Finance","HR","Sales","Production","Logistics","Operations","Legal"];

type MealType = "Normal" | "Special";
type VisitorMode = "self" | "company" | "walkin";

interface SessionEntry {
  id: string;
  name: string;
  initials: string;
  subtitle: string;
  mealType: MealType;
  count: number;           // 1 = employee only; >1 = employee + visitors
  visitorBilling?: string; // dept name for company visitors
  visitorNote?: string;
  amount: number;
}

const NORMAL_PRICE = 250;
const SPECIAL_PRICE = 400;

function initials(name: string) { return name.split(" ").map(n => n[0]).join(""); }

// ── Success screen ───────────────────────────────────────────────────────────
function SuccessScreen({ count, onDone }: { count: number; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="min-h-[600px] flex flex-col items-center justify-center animate-in zoom-in duration-500 space-y-4">
      <div className="size-28 rounded-full bg-emerald-500/10 flex items-center justify-center ring-8 ring-emerald-500/20">
        <CheckCircle2 className="size-14 text-emerald-500" />
      </div>
      <h2 className="text-2xl font-black text-foreground">Session logged!</h2>
      <p className="text-muted-foreground text-sm">{count} transaction{count !== 1 ? "s" : ""} recorded successfully</p>
      <p className="text-[11px] text-muted-foreground animate-pulse">Resetting terminal…</p>
    </div>
  );
}

export default function ManualPOS() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<typeof employees[0] | null>(null);
  const [mealType, setMealType] = useState<MealType>("Normal");
  const [visitorMode, setVisitorMode] = useState<VisitorMode | null>(null);
  const [visitorCount, setVisitorCount] = useState(1);
  const [visitorDept, setVisitorDept] = useState("");
  const [visitorNote, setVisitorNote] = useState("");
  const [walkinName, setWalkinName] = useState("");
  const [walkinDept, setWalkinDept] = useState("");
  const [session, setSession] = useState<SessionEntry[]>([]);
  const [success, setSuccess] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);

  const filtered = search.length >= 2
    ? employees.filter(e => e.name.toLowerCase().includes(search.toLowerCase()) || e.id.toLowerCase().includes(search.toLowerCase()))
    : [];

  const price = mealType === "Normal" ? NORMAL_PRICE : SPECIAL_PRICE;

  function addToSession() {
    if (!selected && visitorMode !== "walkin") return;
    const entryId = `${Date.now()}`;

    if (visitorMode === "walkin") {
      if (!walkinName) return;
      setSession(s => [...s, {
        id: entryId, name: walkinName,
        initials: initials(walkinName), subtitle: walkinDept || "Walk-in",
        mealType, count: 1, amount: price,
      }]);
      setWalkinName(""); setWalkinDept(""); setVisitorMode(null);
      return;
    }

    const emp = selected!;
    const isCompany = visitorMode === "company";
    const totalCount = visitorMode ? visitorCount + 1 : 1;

    setSession(s => [...s, {
      id: entryId, name: emp.name,
      initials: initials(emp.name),
      subtitle: `${emp.id} · ${emp.dept}${totalCount > 1 ? ` · +${visitorCount} visitor${visitorCount > 1 ? "s" : ""}` : ""}`,
      mealType, count: totalCount,
      visitorBilling: isCompany ? visitorDept : undefined,
      visitorNote: isCompany ? visitorNote : undefined,
      amount: price * totalCount,
    }]);
    setSelected(null); setSearch(""); setVisitorMode(null);
    setVisitorCount(1); setVisitorDept(""); setVisitorNote("");
  }

  function removeEntry(id: string) { setSession(s => s.filter(e => e.id !== id)); }
  const total = session.reduce((acc, e) => acc + e.amount, 0);

  function confirmSession() { setSuccess(true); }
  function resetAll() { setSession([]); setSuccess(false); }

  if (success) return <SuccessScreen count={session.length} onDone={resetAll} />;

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] mb-1">Canteen operations</p>
          <h1 className="text-2xl font-black text-foreground tracking-tight leading-none">Manual POS Terminal</h1>
          <p className="text-sm text-muted-foreground mt-1">Log staff lunches, visitor meals and walk-in transactions.</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <p className="text-lg font-black text-foreground tabular-nums">{now.toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" })}</p>
          <p className="text-[10px] text-muted-foreground">{now.toLocaleDateString("en-KE", { weekday: "short", day: "numeric", month: "short" })}</p>
          <Link href="/pos/snacks">
            <button className="mt-1 flex items-center gap-1.5 text-[11px] font-bold text-primary hover:text-primary/80 transition-colors">
              <ShoppingBag className="size-3.5" /> Snack sales →
            </button>
          </Link>
        </div>
      </div>

      {/* Stat strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Meals logged", value: session.reduce((a, e) => a + e.count, 0).toString(), accent: "text-primary" },
          { label: "Entries",      value: session.length.toString(),                             accent: "text-emerald-500" },
          { label: "Running total", value: `KES ${total.toLocaleString()}`,                     accent: "text-violet-500" },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-card">
            <div>
              <p className={`text-xl font-black leading-none ${s.accent}`}>{s.value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-5 items-start">

        {/* ── Left: entry builder ── */}
        <div className="space-y-4">

          {/* Staff search or walk-in toggle */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="flex border-b border-border">
              <button onClick={() => setVisitorMode(null)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-[11px] font-bold transition-all ${visitorMode !== "walkin" ? "bg-primary/5 text-primary border-b-2 border-primary" : "text-muted-foreground hover:bg-muted/50"}`}>
                <UserCheck className="size-3.5" /> Staff / Employee
              </button>
              <button onClick={() => { setVisitorMode("walkin"); setSelected(null); setSearch(""); }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-[11px] font-bold transition-all ${visitorMode === "walkin" ? "bg-primary/5 text-primary border-b-2 border-primary" : "text-muted-foreground hover:bg-muted/50"}`}>
                <User className="size-3.5" /> Walk-in / Contractor
              </button>
            </div>

            <div className="p-4 space-y-4">
              {visitorMode !== "walkin" ? (
                <>
                  {/* Employee search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                    <input value={search} onChange={e => { setSearch(e.target.value); setSelected(null); }}
                      placeholder="Search by name or employee ID…"
                      className="w-full h-10 pl-9 pr-4 rounded-xl border border-border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                  </div>

                  {/* Dropdown results */}
                  {filtered.length > 0 && !selected && (
                    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-lg">
                      {filtered.map(emp => (
                        <button key={emp.id} onClick={() => { setSelected(emp); setSearch(""); }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/30 border-b border-border last:border-0 transition-colors group">
                          <div className="size-9 rounded-xl bg-muted flex items-center justify-center font-black text-xs text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all shrink-0">
                            {initials(emp.name)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-bold text-foreground group-hover:text-primary transition-colors">{emp.name}</p>
                            <p className="text-[10px] text-muted-foreground">{emp.id} · {emp.dept} · {emp.branch}</p>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${emp.subsidy === "Full" ? "bg-emerald-500/10 text-emerald-600" : emp.subsidy === "Partial" ? "bg-amber-500/10 text-amber-600" : "bg-muted text-muted-foreground"}`}>
                            {emp.subsidy}
                          </span>
                          <ChevronRight className="size-3.5 text-muted-foreground shrink-0" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Selected employee card */}
                  {selected && (
                    <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-black text-sm shrink-0">
                        {initials(selected.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-black text-foreground">{selected.name}</p>
                        <p className="text-[10px] text-muted-foreground">{selected.id} · {selected.dept} · {selected.company}</p>
                      </div>
                      <button onClick={() => setSelected(null)} className="size-7 flex items-center justify-center rounded-lg hover:bg-rose-500/10 hover:text-rose-500 text-muted-foreground transition-colors">
                        <X className="size-3.5" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                /* Walk-in form */
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-muted-foreground">Visitor name *</label>
                    <input value={walkinName} onChange={e => setWalkinName(e.target.value)} placeholder="e.g. John Smith"
                      className="w-full h-9 px-3.5 rounded-xl border border-border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-muted-foreground">Department / company</label>
                    <input value={walkinDept} onChange={e => setWalkinDept(e.target.value)} placeholder="e.g. Contractor / ICT"
                      className="w-full h-9 px-3.5 rounded-xl border border-border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Meal type */}
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.18em] mb-3">Meal type</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setMealType("Normal")}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${mealType === "Normal" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
                <div className={`size-9 rounded-xl flex items-center justify-center ${mealType === "Normal" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  <Utensils className="size-4" />
                </div>
                <div className="text-left">
                  <p className={`text-[12px] font-black ${mealType === "Normal" ? "text-primary" : "text-foreground"}`}>Normal</p>
                  <p className="text-[10px] text-muted-foreground">KES 250</p>
                </div>
              </button>
              <button onClick={() => setMealType("Special")}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${mealType === "Special" ? "border-accent bg-accent/5" : "border-border hover:border-accent/30"}`}>
                <div className={`size-9 rounded-xl flex items-center justify-center ${mealType === "Special" ? "bg-accent text-white" : "bg-muted text-muted-foreground"}`}>
                  <Sparkles className="size-4" />
                </div>
                <div className="text-left">
                  <p className={`text-[12px] font-black ${mealType === "Special" ? "text-accent" : "text-foreground"}`}>Special</p>
                  <p className="text-[10px] text-muted-foreground">KES 400</p>
                </div>
              </button>
            </div>
          </div>

          {/* Visitor section — only for staff mode */}
          {visitorMode !== "walkin" && selected && (
            <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.18em]">Visitors with {selected.name.split(" ")[0]}</p>
                {visitorMode && (
                  <button onClick={() => { setVisitorMode(null); setVisitorCount(1); }}
                    className="text-[10px] font-bold text-muted-foreground hover:text-rose-500 transition-colors flex items-center gap-1">
                    <X className="size-3" /> Remove
                  </button>
                )}
              </div>

              {!visitorMode ? (
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setVisitorMode("self")}
                    className="flex items-center gap-2 p-3 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all text-left group">
                    <div className="size-7 rounded-lg bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground flex items-center justify-center transition-all">
                      <User className="size-3.5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-foreground">On employee</p>
                      <p className="text-[10px] text-muted-foreground">Billed to staff</p>
                    </div>
                  </button>
                  <button onClick={() => setVisitorMode("company")}
                    className="flex items-center gap-2 p-3 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all text-left group">
                    <div className="size-7 rounded-lg bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground flex items-center justify-center transition-all">
                      <Building2 className="size-3.5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-foreground">Company visitor</p>
                      <p className="text-[10px] text-muted-foreground">Dept-approved note</p>
                    </div>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Visitor count */}
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-semibold text-muted-foreground">Number of visitors</p>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setVisitorCount(c => Math.max(1, c - 1))}
                        className="size-7 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors">
                        <Minus className="size-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-black text-foreground">{visitorCount}</span>
                      <button onClick={() => setVisitorCount(c => Math.min(5, c + 1))}
                        className="size-7 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors">
                        <Plus className="size-3" />
                      </button>
                    </div>
                  </div>

                  {/* Company visitor extra fields */}
                  {visitorMode === "company" && (
                    <div className="space-y-2">
                      <CustomSelect
                        id="visitor-dept"
                        label="Hosting department"
                        value={visitorDept}
                        onChange={setVisitorDept}
                        required
                        placeholder="Select department…"
                        options={departments.map(d => ({ value: d, label: d }))}
                      />
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-muted-foreground">HOD approval note / ref</label>
                        <input value={visitorNote} onChange={e => setVisitorNote(e.target.value)}
                          placeholder="e.g. HOD-2026-ICT-045"
                          className="w-full h-9 px-3.5 rounded-xl border border-border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                      </div>
                      <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                        <AlertCircle className="size-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-muted-foreground">Visitor meals billed to department at EOD. HR reconciles at end of day.</p>
                      </div>
                    </div>
                  )}

                  {visitorMode === "self" && (
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-primary/5 border border-primary/15">
                      <Users className="size-3.5 text-primary shrink-0 mt-0.5" />
                      <p className="text-[10px] text-muted-foreground">{visitorCount} visitor meal{visitorCount > 1 ? "s" : ""} (KES {(price * visitorCount).toLocaleString()}) will be added to {selected.name.split(" ")[0]}'s tab today.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Amount preview + add button */}
          {(selected || (visitorMode === "walkin" && walkinName)) && (
            <div className="flex items-center gap-3">
              <div className="flex-1 p-4 rounded-xl border border-border bg-card">
                <p className="text-[10px] text-muted-foreground">Amount for this entry</p>
                <p className="text-xl font-black text-foreground mt-0.5">
                  KES {(price * (visitorMode && visitorMode !== "walkin" ? visitorCount + 1 : 1)).toLocaleString()}
                </p>
              </div>
              <button onClick={addToSession}
                className="flex-1 h-full min-h-[72px] rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2">
                <Plus className="size-4" /> Add to session
              </button>
            </div>
          )}
        </div>

        {/* ── Right: session queue ── */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden sticky top-20">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/30">
            <p className="text-[11px] font-bold text-foreground">Session queue</p>
            <span className="text-[10px] text-muted-foreground">{session.length} entries</span>
          </div>

          {session.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="size-14 rounded-2xl bg-muted flex items-center justify-center mb-3">
                <Clock className="size-7 text-muted-foreground/40" />
              </div>
              <p className="text-sm font-bold text-muted-foreground">Queue empty</p>
              <p className="text-[11px] text-muted-foreground mt-1">Search and add staff meals to begin</p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-border max-h-[420px] overflow-y-auto">
                {session.map(entry => (
                  <div key={entry.id} className="flex items-start gap-3 px-4 py-3.5 group">
                    <div className={`size-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${entry.mealType === "Normal" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"}`}>
                      {entry.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-bold text-foreground truncate">{entry.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{entry.subtitle}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-lg ${entry.mealType === "Normal" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"}`}>
                          {entry.mealType}
                        </span>
                        {entry.visitorBilling && (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-600">
                            Dept: {entry.visitorBilling}
                          </span>
                        )}
                        {entry.count > 1 && (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-lg bg-muted text-muted-foreground">
                            ×{entry.count}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <p className="text-[12px] font-bold text-foreground">KES {entry.amount.toLocaleString()}</p>
                      <button onClick={() => removeEntry(entry.id)}
                        className="size-6 rounded-lg hover:bg-rose-500/10 hover:text-rose-500 text-muted-foreground flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100">
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total + confirm */}
              <div className="border-t border-border p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-black text-foreground">Session total</span>
                  <span className="text-sm font-black text-primary">KES {total.toLocaleString()}</span>
                </div>
                <button onClick={confirmSession}
                  className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 shadow-md shadow-primary/20 transition-all">
                  Confirm & log session
                </button>
                <button onClick={() => setSession([])}
                  className="w-full h-8 rounded-xl border border-border text-[11px] font-semibold text-muted-foreground hover:bg-muted transition-all">
                  Clear queue
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
