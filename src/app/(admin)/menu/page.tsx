"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search, SlidersHorizontal, Plus, Download, ChevronRight,
  Utensils, Sparkles, ChefHat, Clock, CheckCircle2,
  CalendarDays, Flame, Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ── data ──────────────────────────────────────────────────────────────────────

const statusStyle: Record<string, string> = {
  Published:  "bg-emerald-500/10 text-emerald-600",
  Draft:      "bg-muted         text-muted-foreground",
  Archived:   "bg-amber-500/10  text-amber-600",
};

const weekPlans = [
  {
    id: "WK-2026-20", week: "Week 20", period: "May 18 – 23, 2026",
    normal:  "Ugali, Beef Stew & Cabbage · Rice, Beans & Sukuma · Githeri + Avocado…",
    special: "Grilled Fish & Matoke · Chicken Biryani · Beef Pilau…",
    chef: "Chef Maina", calories: "650–820 KCAL avg", meals: 2840,
    status: "Draft", days: 6,
  },
  {
    id: "WK-2026-19", week: "Week 19", period: "May 11 – 16, 2026",
    normal:  "Ugali, Beef Stew & Cabbage · Rice, Beans & Sukuma · Githeri + Avocado…",
    special: "Grilled Fish & Matoke · Chicken Biryani · Nyama Choma…",
    chef: "Chef Maina", calories: "650–820 KCAL avg", meals: 3104,
    status: "Published", days: 6,
  },
  {
    id: "WK-2026-18", week: "Week 18", period: "May 04 – 09, 2026",
    normal:  "Chapati & Green Grams · Rice & Fish Fillet · Mashed Potatoes…",
    special: "Pasta Carbonara · Nyama Choma & Ugali · Assorted Wraps…",
    chef: "Chef Sarah", calories: "550–750 KCAL avg", meals: 3022,
    status: "Published", days: 6,
  },
  {
    id: "WK-2026-17", week: "Week 17", period: "Apr 27 – May 02, 2026",
    normal:  "Ugali & Omena · Rice & Lentils · Matoke & Groundnuts…",
    special: "Pilau & Kachumbari · Grilled Tilapia · Spaghetti Bolognese…",
    chef: "Chef Maina", calories: "620–800 KCAL avg", meals: 2980,
    status: "Archived", days: 6,
  },
  {
    id: "WK-2026-16", week: "Week 16", period: "Apr 20 – 25, 2026",
    normal:  "Githeri & Avocado · Chapati & Beans · Rice & Peas…",
    special: "Beef Biryani · Swahili Fish Curry · Mixed Wraps…",
    chef: "Chef Sarah", calories: "600–780 KCAL avg", meals: 2890,
    status: "Archived", days: 6,
  },
];

const stats = [
  { label: "Plans this month",   value: "4",      icon: CalendarDays },
  { label: "Avg meals / week",   value: "2,959",  icon: Utensils },
  { label: "Active chefs",       value: "2",      icon: ChefHat },
  { label: "Avg calorie target", value: "700",    icon: Flame },
];

// ── component ─────────────────────────────────────────────────────────────────

export default function MenuListPage() {
  const [search, setSearch] = useState("");

  const filtered = weekPlans.filter((p) =>
    p.week.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase()) ||
    p.chef.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] mb-1">Culinary operations</p>
          <h1 className="text-2xl font-black text-foreground tracking-tight leading-none">Meal Planning</h1>
          <p className="text-sm text-muted-foreground mt-1.5">Manage weekly menu cycles, nutritional targets and chef assignments.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs">
            <Download className="size-3.5" /> Export
          </Button>
          <Link href="/menu/new">
            <Button size="sm" className="h-8 gap-1.5 text-xs bg-primary hover:bg-primary/90 shadow-md shadow-primary/20">
              <Plus className="size-3.5" /> New week plan
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Stat strip ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-card">
            <div className="size-8 rounded-xl bg-muted flex items-center justify-center text-primary shrink-0">
              <s.icon className="size-4" />
            </div>
            <div>
              <p className="text-lg font-black text-foreground leading-none">{s.value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Search & filter ───────────────────────────────────── */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by week, plan ID or chef…"
            className="w-full h-9 pl-9 pr-4 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
        <Button size="sm" variant="outline" className="h-9 gap-1.5 text-xs shrink-0">
          <SlidersHorizontal className="size-3.5" /> Filter
        </Button>
      </div>

      {/* ── Table ─────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">

        {/* Header row */}
        <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1.8fr)_minmax(0,1.8fr)_minmax(0,1fr)_110px_80px] px-5 py-3 border-b border-border bg-muted/40">
          {["Week plan", "Normal menu (preview)", "Special option (preview)", "Stats", "Status", ""].map((h) => (
            <span key={h} className="text-[11px] font-semibold text-muted-foreground">{h}</span>
          ))}
        </div>

        {/* Data rows */}
        <div className="divide-y divide-border">
          {filtered.map((plan) => (
            <div
              key={plan.id}
              className="grid grid-cols-[minmax(0,2fr)_minmax(0,1.8fr)_minmax(0,1.8fr)_minmax(0,1fr)_110px_80px] items-center px-5 py-4 hover:bg-muted/20 transition-colors group cursor-pointer"
            >
              {/* Week plan */}
              <div className="flex items-center gap-3 min-w-0 pr-3">
                <div className="size-8 rounded-xl bg-muted ring-1 ring-border text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground group-hover:ring-primary transition-all">
                  <CalendarDays className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-bold text-foreground truncate group-hover:text-primary transition-colors">{plan.week}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{plan.id} · {plan.period}</p>
                </div>
              </div>

              {/* Normal menu preview */}
              <div className="min-w-0 pr-3">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Utensils className="size-3 text-primary shrink-0" />
                  <p className="text-[10px] font-bold text-primary uppercase tracking-[0.12em]">Normal</p>
                </div>
                <p className="text-[11px] text-foreground truncate">{plan.normal}</p>
              </div>

              {/* Special preview */}
              <div className="min-w-0 pr-3">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Sparkles className="size-3 text-accent shrink-0" />
                  <p className="text-[10px] font-bold text-accent uppercase tracking-[0.12em]">Special</p>
                </div>
                <p className="text-[11px] text-foreground truncate">{plan.special}</p>
              </div>

              {/* Stats */}
              <div>
                <p className="text-[12px] font-bold text-foreground">{plan.meals.toLocaleString()} meals</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <ChefHat className="size-3 text-muted-foreground" />
                  <p className="text-[10px] text-muted-foreground truncate">{plan.chef}</p>
                </div>
              </div>

              {/* Status */}
              <div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg leading-none flex items-center gap-1.5 w-fit ${statusStyle[plan.status]}`}>
                  <span className={`size-1.5 rounded-full ${plan.status === "Published" ? "bg-emerald-500" : plan.status === "Draft" ? "bg-muted-foreground" : "bg-amber-500"}`} />
                  {plan.status}
                </span>
              </div>

              {/* Arrow */}
              <div className="flex justify-end">
                <Link href={`/menu/${plan.id}`}>
                  <button className="size-7 flex items-center justify-center rounded-lg hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors">
                    <ChevronRight className="size-3.5" />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border bg-muted/20 flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">
            Showing {filtered.length} of {weekPlans.length} week plans
          </span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="h-7 px-3 text-xs" disabled>Previous</Button>
            <Button size="sm" variant="outline" className="h-7 px-3 text-xs">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
