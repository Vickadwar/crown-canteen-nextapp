"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  Clock,
  Utensils,
  ShieldCheck,
  Fingerprint,
  Edit2,
  TrendingUp,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const typeStyle: Record<string, string> = {
  Employee:   "bg-primary/10 text-primary",
  Contractor: "bg-violet-500/10 text-violet-500",
  Intern:     "bg-amber-500/10 text-amber-500",
  Visitor:    "bg-rose-500/10 text-rose-500",
};

const mealHistory = [
  { date: "May 13, 2026", time: "12:45 PM", meal: "Normal",  branch: "Nairobi HQ", cost: "KES 250", subsidy: "100%",    verified: true },
  { date: "May 12, 2026", time: "1:05 PM",  meal: "Special", branch: "Nairobi HQ", cost: "KES 400", subsidy: "KES 250", verified: true },
  { date: "May 11, 2026", time: "12:30 PM", meal: "Normal",  branch: "Nairobi HQ", cost: "KES 250", subsidy: "100%",    verified: true },
  { date: "May 10, 2026", time: "12:55 PM", meal: "Normal",  branch: "Nairobi HQ", cost: "KES 250", subsidy: "100%",    verified: false },
  { date: "May 09, 2026", time: "12:20 PM", meal: "Special", branch: "Mombasa",    cost: "KES 400", subsidy: "KES 250", verified: true },
];

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [activeTab, setActiveTab] = useState<"history" | "profile">("history");

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">

      {/* ── Back + header ─────────────────────────────────────── */}
      <div>
        <Link href="/employees">
          <button className="flex items-center gap-1.5 text-[11px] font-bold text-primary hover:text-primary/80 transition-colors mb-4 uppercase tracking-[0.15em]">
            <ChevronLeft className="size-3.5" /> Back to customers
          </button>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="size-14 rounded-2xl bg-secondary text-secondary-foreground flex items-center justify-center font-black text-xl shrink-0 shadow-lg">
              SM
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-black text-foreground tracking-tight leading-none">Samuel Mandela</h1>
                <span className="bg-emerald-500/10 text-emerald-600 text-[10px] font-bold px-2.5 py-1 rounded-lg">Active</span>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${typeStyle["Employee"]}`}>Employee</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1.5 flex items-center gap-2">
                <span className="font-bold text-primary">{id || "EMP001"}</span>
                <span className="text-border">·</span>
                Senior Systems Architect
                <span className="text-border">·</span>
                Crown Paints Kenya PLC
              </p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5">
              Re-scan biometric
            </Button>
            <Button size="sm" className="h-8 text-xs gap-1.5 bg-primary hover:bg-primary/90">
              <Edit2 className="size-3.5" /> Edit profile
            </Button>
          </div>
        </div>
      </div>

      {/* ── Stat strip ───────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Meals this month", value: "24",      sub: "+3 vs last month",  accent: "text-primary",   glow: "border-primary/20" },
          { label: "Total subsidy",    value: "KES 8.4k",sub: "Fully subsidised",  accent: "text-accent",    glow: "border-accent/20" },
          { label: "Loyalty points",   value: "1,250",   sub: "Top 12% this week", accent: "text-violet-500",glow: "border-violet-500/20" },
        ].map((s) => (
          <div key={s.label} className={`p-5 rounded-2xl border bg-card relative overflow-hidden group hover:-translate-y-0.5 transition-all ${s.glow}`}>
            <div className={`absolute -top-4 -right-4 size-16 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity ${s.accent.replace("text-", "bg-")}`} />
            <p className="text-[10px] text-muted-foreground font-semibold mb-1">{s.label}</p>
            <p className={`text-2xl font-black leading-none ${s.accent}`}>{s.value}</p>
            <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1">
              <TrendingUp className="size-3" /> {s.sub}
            </p>
          </div>
        ))}
      </div>

      {/* ── Main grid ─────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-5">

        {/* ── Left: Profile info ── */}
        <div className="flex flex-col gap-4">

          {/* Contact & details */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.18em] mb-4">Contact & details</p>
            <div className="space-y-4">
              {[
                { icon: Mail,      label: "Email",          value: "s.mandela@crownpaints.co.ke" },
                { icon: Phone,     label: "Mobile",         value: "+254 712 345 678" },
                { icon: Building2, label: "Institution",    value: "Crown Paints Kenya PLC" },
                { icon: MapPin,    label: "Primary branch", value: "Nairobi HQ" },
                { icon: Calendar,  label: "Joined",         value: "Jan 12, 2024" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="size-8 rounded-xl bg-muted flex items-center justify-center text-primary shrink-0">
                    <item.icon className="size-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-muted-foreground">{item.label}</p>
                    <p className="text-[12px] font-semibold text-foreground truncate">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Biometric / security */}
          <div className="rounded-2xl border border-border bg-secondary text-secondary-foreground p-5 relative overflow-hidden">
            <div className="absolute -top-6 -right-6 size-24 bg-primary/20 blur-2xl rounded-full" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <Fingerprint className="size-6 text-primary" />
                <ShieldCheck className="size-4 text-primary" />
              </div>
              <p className="text-sm font-black leading-none mb-1">Security status</p>
              <p className="text-[11px] text-secondary-foreground/50 mb-4 leading-relaxed">Biometric verified · Last sync 2 hours ago</p>
              <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-primary rounded-full w-full" />
              </div>
            </div>
          </div>

          {/* Meal preferences */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.18em] mb-4">Meal preferences</p>
            <div className="space-y-2">
              {[
                { label: "Normal lunch", pct: 72 },
                { label: "Special lunch", pct: 28 },
              ].map((p) => (
                <div key={p.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[11px] font-medium text-foreground">{p.label}</span>
                    <span className="text-[11px] font-bold text-foreground">{p.pct}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full ${p.label.includes("Normal") ? "bg-primary/60" : "bg-accent/60"}`}
                      style={{ width: `${p.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: Meal history ── */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-foreground">Meal history</h2>
            <button className="text-[11px] font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
              Download log <ArrowUpRight className="size-3" />
            </button>
          </div>

          <div className="rounded-2xl border border-border bg-card overflow-hidden flex flex-col">
            {/* Table header */}
            <div className="grid grid-cols-[minmax(0,1.4fr)_90px_minmax(0,1fr)_100px_90px] px-5 py-3 border-b border-border bg-muted/40">
              {["Date & time", "Meal", "Branch", "Subsidy", "Status"].map((h) => (
                <span key={h} className="text-[11px] font-semibold text-muted-foreground">{h}</span>
              ))}
            </div>

            <div className="divide-y divide-border">
              {mealHistory.map((m, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[minmax(0,1.4fr)_90px_minmax(0,1fr)_100px_90px] items-center px-5 py-4 hover:bg-muted/20 transition-colors cursor-pointer group"
                >
                  {/* Date & time */}
                  <div>
                    <p className="text-[12px] font-semibold text-foreground">{m.date}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                      <Clock className="size-2.5" /> {m.time}
                    </p>
                  </div>

                  {/* Meal */}
                  <div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg leading-none ${m.meal === "Special" ? "bg-accent/15 text-accent" : "bg-primary/10 text-primary"}`}>
                      {m.meal}
                    </span>
                  </div>

                  {/* Branch */}
                  <div className="flex items-center gap-1.5">
                    <MapPin className="size-3 text-muted-foreground shrink-0" />
                    <span className="text-[11px] text-foreground font-medium truncate">{m.branch}</span>
                  </div>

                  {/* Subsidy */}
                  <div>
                    <p className="text-[12px] font-bold text-foreground">{m.subsidy}</p>
                    <p className="text-[10px] text-muted-foreground">applied</p>
                  </div>

                  {/* Verified */}
                  <div className="flex items-center gap-1.5">
                    {m.verified
                      ? <CheckCircle2 className="size-4 text-primary" />
                      : <AlertCircle className="size-4 text-amber-500" />}
                    <span className={`text-[10px] font-bold ${m.verified ? "text-primary" : "text-amber-500"}`}>
                      {m.verified ? "Verified" : "Pending"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-5 py-3 border-t border-border bg-muted/20 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-muted-foreground">Page <span className="font-bold text-foreground">1</span> of 14 · 68 records</span>
              <div className="flex items-center gap-1">
                <button disabled className="h-7 px-3 rounded-lg border border-border bg-card text-[11px] font-semibold text-muted-foreground disabled:opacity-40 hover:bg-muted transition-colors">← Prev</button>
                {[1,2,3].map((p) => (
                  <button key={p} className={`size-7 rounded-lg text-[11px] font-bold transition-colors ${p === 1 ? "bg-primary text-primary-foreground" : "border border-border bg-card text-muted-foreground hover:bg-muted"}`}>{p}</button>
                ))}
                <span className="text-[11px] text-muted-foreground px-1">…</span>
                <button className="size-7 rounded-lg border border-border bg-card text-[11px] font-bold text-muted-foreground hover:bg-muted transition-colors">14</button>
                <button className="h-7 px-3 rounded-lg border border-border bg-card text-[11px] font-semibold text-muted-foreground hover:bg-muted transition-colors">Next →</button>
              </div>
            </div>
          </div>

          {/* Insight nudge */}
          <div className="relative rounded-2xl border border-border bg-card p-5 overflow-hidden">
            <div className="absolute -top-6 -right-6 size-24 bg-primary/10 blur-2xl rounded-full" />
            <div className="relative z-10 flex items-start gap-3">
              <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Utensils className="size-4" />
              </div>
              <div>
                <p className="text-[12px] font-black text-foreground">Consumption insight</p>
                <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                  Samuel prefers Normal lunch on weekdays and Special lunch on Fridays. Subsidy fully utilised for the current month.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
