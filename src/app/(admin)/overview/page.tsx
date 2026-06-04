"use client";

import React from "react";
import {
  Users,
  Utensils,
  TrendingUp,
  Clock,
  CircleDollarSign,
  ArrowUpRight,
  ArrowDownRight,
  BarChart2,
  Zap,
  Activity,
  RefreshCw,
  Download,
  MapPin,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ── Mini sparkbar ─────────────────────────────────────────────────────────────

function Sparkbar({ accent }: { accent: string }) {
  const heights = [35, 55, 40, 70, 50, 80, 100];
  return (
    <div className="flex items-end gap-[3px] h-7">
      {heights.map((h, i) => (
        <div
          key={i}
          className={`w-1.5 rounded-sm ${accent} transition-all duration-500`}
          style={{ height: `${h}%`, opacity: i === heights.length - 1 ? 1 : 0.25 + i * 0.1 }}
        />
      ))}
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({
  title, value, sub, change, positive, icon: Icon, accent, glow,
}: {
  title: string; value: string; sub?: string; change: string;
  positive: boolean; icon: any; accent: string; glow: string;
}) {
  return (
    <div className={`relative flex flex-col gap-4 p-5 rounded-2xl border bg-card overflow-hidden group transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl ${glow}`}>
      <div className={`absolute -top-6 -right-6 size-20 rounded-full blur-2xl opacity-30 group-hover:opacity-60 transition-opacity ${accent.replace("text-", "bg-")}`} />
      <div className="flex items-start justify-between relative z-10">
        <div className={`size-9 rounded-xl flex items-center justify-center bg-muted ${accent}`}>
          <Icon className="size-4" />
        </div>
        <span className={`flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full ${positive ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}`}>
          {positive ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
          {change}
        </span>
      </div>
      <div className="relative z-10">
        <p className="text-[11px] font-semibold text-muted-foreground tracking-wide leading-none mb-1">{title}</p>
        <p className="text-2xl font-black text-foreground tracking-tight leading-none">{value}</p>
        {sub && <p className="text-[11px] text-muted-foreground mt-1">{sub}</p>}
      </div>
      <Sparkbar accent={accent.replace("text-", "bg-")} />
    </div>
  );
}

// ── Branch meal split card ────────────────────────────────────────────────────

function BranchMealRow({
  name, normal, special, status,
}: {
  name: string; normal: number; special: number; status: "ok" | "busy" | "critical";
}) {
  const total = normal + special;
  const normalPct = Math.round((normal / total) * 100);
  const specialPct = 100 - normalPct;
  const dotColor = { ok: "bg-emerald-500", busy: "bg-amber-500", critical: "bg-rose-500" }[status];

  return (
    <div className="py-3 space-y-1.5">
      {/* top row: name + dot + counts */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className={`size-1.5 rounded-full shrink-0 ${dotColor}`} />
          <span className="text-[12px] font-semibold text-foreground">{name}</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-semibold">
          <span className="flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-primary/60 shrink-0" />
            <span className="text-muted-foreground">Normal</span>
            <span className="text-foreground font-black ml-0.5 tabular-nums">{normal}</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-accent/60 shrink-0" />
            <span className="text-muted-foreground">Special</span>
            <span className="text-foreground font-black ml-0.5 tabular-nums">{special}</span>
          </span>
        </div>
      </div>
      {/* segmented bar */}
      <div className="flex h-1.5 w-full rounded-full overflow-hidden gap-px">
        <div
          className="bg-primary/60 rounded-l-full transition-all duration-700"
          style={{ width: `${normalPct}%` }}
        />
        <div
          className="bg-accent/70 rounded-r-full transition-all duration-700"
          style={{ width: `${specialPct}%` }}
        />
      </div>
      {/* pct labels */}
      <div className="flex justify-between text-[9px] text-muted-foreground">
        <span>{normalPct}% normal</span>
        <span>{specialPct}% special</span>
      </div>
    </div>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────

const checkins = [
  { name: "John Doe",     id: "EMP001", time: "12:45 PM", meal: "Normal",  branch: "Nairobi HQ",    company: "Crown Paints",      dept: "IT/Admin",    type: "Employee" },
  { name: "Mary Smith",   id: "EMP041", time: "12:42 PM", meal: "Special", branch: "Nairobi HQ",    company: "Forza Consultants", dept: "Consulting",  type: "Contractor" },
  { name: "James Waweru", id: "VIS-03", time: "12:38 PM", meal: "Normal",  branch: "Mombasa Plant", company: "Crown Paints",      dept: "Production",  type: "Visitor" },
  { name: "Sarah Chen",   id: "EMP082", time: "12:35 PM", meal: "Normal",  branch: "Nairobi HQ",    company: "Crown Paints",      dept: "Finance",     type: "Employee" },
  { name: "David Muli",   id: "EMP115", time: "12:30 PM", meal: "Special", branch: "Kisumu Depot",  company: "ODUK TECH",         dept: "Engineering", type: "Employee" },
  { name: "Alice Mwangi", id: "INT007", time: "12:28 PM", meal: "Normal",  branch: "Nairobi HQ",    company: "Crown Paints",      dept: "HR",          type: "Intern" },
  { name: "Peter Kamau",  id: "VIS-11", time: "12:25 PM", meal: "Normal",  branch: "Eldoret Hub",   company: "Forza Consultants", dept: "Sales",       type: "Visitor" },
];

const typeStyle: Record<string, string> = {
  Employee:   "bg-primary/10 text-primary",
  Contractor: "bg-violet-500/10 text-violet-500",
  Intern:     "bg-amber-500/10 text-amber-500",
  Visitor:    "bg-rose-500/10 text-rose-500",
};

const branchMeals = [
  { name: "Nairobi HQ",    normal: 612, special: 230, status: "busy"     as const },
  { name: "Mombasa Plant", normal: 198, special: 122, status: "ok"       as const },
  { name: "Kisumu Depot",  normal: 88,  special: 36,  status: "ok"       as const },
  { name: "Eldoret Hub",   normal: 140, special: 48,  status: "ok"       as const },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function OverviewPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">

      {/* ── Page header ──────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] mb-1">Command centre</p>
          <h1 className="text-2xl font-black text-foreground tracking-tight leading-none">Dashboard overview</h1>
          <p className="text-sm text-muted-foreground mt-1.5">Real-time canteen operational intelligence.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs">
            <Download className="size-3.5" /> Export
          </Button>
          <Button size="sm" className="h-8 gap-1.5 text-xs bg-primary hover:bg-primary/90 shadow-md shadow-primary/20">
            <RefreshCw className="size-3.5" /> Refresh
          </Button>
        </div>
      </div>

      {/* ── Stat cards ───────────────────────────────────────────── */}
      <div className="space-y-3">
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Today at a glance</p>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard title="Total meals today" value="1,284"    change="14.2%" positive icon={Utensils}         accent="text-primary"   glow="border-primary/15 hover:border-primary/30"   sub="Across all branches" />
          <StatCard title="Active personnel"  value="3,102"    change="1.8%"  positive icon={Users}            accent="text-blue-500"  glow="border-blue-500/15 hover:border-blue-500/30" sub="Incl. 48 visitors" />
          <StatCard title="Daily revenue"     value="KES 842k" change="9.4%"  positive icon={CircleDollarSign} accent="text-accent"    glow="border-accent/15 hover:border-accent/30"     sub="Net of subsidies" />
          <StatCard title="Avg. service time" value="42 sec"   change="12%"   positive={false} icon={Clock}    accent="text-amber-500" glow="border-amber-500/15 hover:border-amber-500/30" sub="Target: 60 sec" />
        </div>
      </div>

      {/* ── Main grid ────────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-6 items-start">

        {/* ── Live check-in table (2 cols) — stretches full height ── */}
        <div className="lg:col-span-2 flex flex-col gap-3 h-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="size-4 text-primary" />
              <h2 className="text-sm font-black text-foreground">Live check-ins</h2>
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex rounded-full size-2 bg-primary" />
              </span>
            </div>
            <button className="text-[11px] font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
              View full log <ArrowUpRight className="size-3" />
            </button>
          </div>

          {/* Table — creative modern design, fills full height */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden flex flex-col flex-1">

            {/* Header — sentence case, clean */}
            <div className="grid grid-cols-[minmax(0,2.2fr)_80px_90px_minmax(0,1.4fr)_minmax(0,1.6fr)_110px] px-5 py-3 border-b border-border bg-muted/40">
              {["Employee", "Time", "Meal", "Branch", "Company", "Canteen type"].map((h) => (
                <span key={h} className="text-[11px] font-semibold text-muted-foreground">{h}</span>
              ))}
            </div>

            {/* Rows — evenly distributed, all cells vertically centered */}
            <div className="flex flex-col flex-1 divide-y divide-border">
              {checkins.map((c, i) => (
                <div
                  key={i}
                  className="flex-1 min-h-[52px] grid grid-cols-[minmax(0,2.2fr)_80px_90px_minmax(0,1.4fr)_minmax(0,1.6fr)_110px] items-center px-5 hover:bg-muted/20 transition-colors group cursor-pointer"
                >
                  {/* Employee */}
                  <div className="flex items-center gap-3 min-w-0 py-2 pr-3">
                    <div className={`size-8 rounded-xl flex items-center justify-center font-bold text-[11px] shrink-0 transition-colors ring-1 ${i % 2 === 0 ? "bg-primary/10 text-primary ring-primary/20 group-hover:bg-primary group-hover:text-primary-foreground group-hover:ring-primary" : "bg-muted text-foreground ring-border group-hover:bg-primary group-hover:text-primary-foreground group-hover:ring-primary"}`}>
                      {c.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors leading-tight">{c.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate leading-tight mt-0.5">{c.id} · {c.dept}</p>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="flex flex-col justify-center">
                    <p className="text-[12px] font-semibold text-foreground tabular-nums">{c.time}</p>
                    <p className="text-[10px] text-muted-foreground/60">Today</p>
                  </div>

                  {/* Meal — pill only, same height as canteen type */}
                  <div className="flex items-center">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg leading-none ${c.meal === "Special" ? "bg-accent/15 text-accent" : "bg-primary/10 text-primary"}`}>
                      {c.meal}
                    </span>
                  </div>

                  {/* Branch */}
                  <div className="flex items-center gap-1.5 min-w-0">
                    <MapPin className="size-3 text-muted-foreground shrink-0" />
                    <p className="text-[11px] font-medium text-foreground truncate">{c.branch}</p>
                  </div>

                  {/* Company */}
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Building2 className="size-3 text-muted-foreground shrink-0" />
                    <p className="text-[11px] font-medium text-foreground truncate">{c.company}</p>
                  </div>

                  {/* Canteen type — pill only, same size as meal */}
                  <div className="flex items-center">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg leading-none ${typeStyle[c.type] ?? "bg-muted text-muted-foreground"}`}>
                      {c.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-border bg-muted/20 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-muted-foreground">Showing 7 of 284 entries today</span>
              <button className="text-[11px] font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
                Load more <ArrowUpRight className="size-3" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Right column ── */}
        <div className="flex flex-col gap-4">

          {/* Branch meal split */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-black text-foreground">Branch meal split</h3>
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            </div>
            {/* Legend */}
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <span className="size-2.5 rounded-sm bg-primary/60" /> Normal lunch
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <span className="size-2.5 rounded-sm bg-accent/70" /> Special lunch
              </div>
            </div>
            <div className="divide-y divide-border">
              {branchMeals.map((b) => (
                <BranchMealRow key={b.name} {...b} />
              ))}
            </div>
          </div>

          {/* Separator */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Insights</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Strategic insight */}
          <div className="relative rounded-2xl border border-border bg-card p-5 overflow-hidden">
            <div className="absolute -top-8 -right-8 size-28 bg-primary/10 blur-2xl rounded-full" />
            <div className="relative z-10">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <TrendingUp className="size-4" />
                </div>
                <div>
                  <p className="text-[12px] font-black text-foreground leading-none">Strategic insight</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">AI-generated · today</p>
                </div>
                <span className="ml-auto text-xl font-black text-primary">A+</span>
              </div>
              <p className="text-[12px] text-muted-foreground leading-relaxed mb-4">
                Employee engagement is up <strong className="text-foreground">15%</strong> this month. Recommend
                increasing "Special Meal" variety on Wednesdays to sustain peak utilisation.
              </p>
              <button className="w-full h-9 rounded-xl border border-border bg-muted/30 hover:bg-primary hover:border-primary hover:text-primary-foreground text-xs font-bold text-muted-foreground transition-all duration-200">
                Explore analytics →
              </button>
            </div>
          </div>

          {/* Quick metrics */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Zap,       label: "System uptime", value: "99.98%" },
              { icon: BarChart2, label: "Satisfaction",  value: "94.2%"  },
            ].map((m) => (
              <div key={m.label} className="rounded-2xl border border-border bg-card p-4 flex flex-col gap-2">
                <m.icon className="size-4 text-primary" />
                <p className="text-lg font-black text-foreground leading-none">{m.value}</p>
                <p className="text-[10px] text-muted-foreground">{m.label}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
