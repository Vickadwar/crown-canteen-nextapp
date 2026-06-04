"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft, Edit2, Download, Utensils, Sparkles,
  ChefHat, Clock, Flame, CheckCircle2, ArrowUpRight,
  CalendarDays, Star, TrendingUp, MapPin, AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ── mock data for the week plan ───────────────────────────────────────────────

const dayPlans = [
  {
    day: "Monday",    date: "May 11",
    normal:  "Ugali, Beef Stew & Cabbage",  normalTags: ["Ugali","Beef Stew","Steamed Cabbage","Kachumbari"],
    special: "Grilled Fish & Matoke",         specialTags: ["Tilapia Fillet","Matoke","Coconut Sauce","Lemon"],
    calories: 650, portions: 520, chef: "Chef Maina", meals: 498, rating: 4.7,
  },
  {
    day: "Tuesday",   date: "May 12",
    normal:  "Rice, Beans & Sukuma Wiki",    normalTags: ["Steamed Rice","Kidney Beans","Sukuma Wiki","Tomato Gravy"],
    special: "Chicken Biryani",               specialTags: ["Basmati Rice","Chicken","Biryani Spice","Raita"],
    calories: 720, portions: 520, chef: "Chef Sarah", meals: 541, rating: 4.8,
  },
  {
    day: "Wednesday", date: "May 13",
    normal:  "Githeri with Avocado",          normalTags: ["Maize","Beans","Avocado","Onions"],
    special: "Beef Pilau & Kachumbari",        specialTags: ["Pilau Rice","Beef","Pilau Masala","Kachumbari"],
    calories: 680, portions: 520, chef: "Chef Maina", meals: 512, rating: 4.6,
  },
  {
    day: "Thursday",  date: "May 14",
    normal:  "Chapati & Green Grams",         normalTags: ["Chapati","Green Grams","Coconut Curry","Coriander"],
    special: "Pasta Carbonara",               specialTags: ["Spaghetti","Bacon","Egg Cream Sauce","Parmesan"],
    calories: 750, portions: 520, chef: "Chef Sarah", meals: 487, rating: 4.5,
  },
  {
    day: "Friday",    date: "May 15",
    normal:  "Rice & Fish Fillet",            normalTags: ["Steamed Rice","Tilapia","Tomato Sauce","Spinach"],
    special: "Nyama Choma & Ugali",           specialTags: ["Goat Ribs","Ugali","Kachumbari","Pepper Sauce"],
    calories: 820, portions: 520, chef: "Chef Maina", meals: 560, rating: 4.9,
  },
  {
    day: "Saturday",  date: "May 16",
    normal:  "Mashed Potatoes & Peas",        normalTags: ["Mashed Potatoes","Green Peas","Butter Sauce","Herbs"],
    special: "Assorted Wraps",                specialTags: ["Wheat Wraps","Chicken","Avocado","Salad"],
    calories: 550, portions: 300, chef: "Chef Sarah", meals: 306, rating: 4.4,
  },
];

const activity = [
  { event: "Plan published",         date: "May 10, 2026 · 04:30 PM", user: "Chef Maina",     color: "bg-emerald-500" },
  { event: "Nutritional review done",date: "May 09, 2026 · 11:00 AM", user: "Nutrition Team", color: "bg-primary" },
  { event: "Draft submitted",        date: "May 08, 2026 · 09:15 AM", user: "Chef Sarah",     color: "bg-blue-500" },
  { event: "Plan created",           date: "May 07, 2026 · 02:00 PM", user: "System",         color: "bg-muted-foreground" },
];

export default function MenuDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [activeTab, setActiveTab] = useState<"breakdown" | "activity">("breakdown");
  const [selectedDay, setSelectedDay] = useState("Monday");

  const selected = dayPlans.find((d) => d.day === selectedDay) ?? dayPlans[0];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">

      {/* ── Back + header ─────────────────────────────────────── */}
      <div>
        <Link href="/menu">
          <button className="flex items-center gap-1.5 text-[11px] font-bold text-primary hover:text-primary/80 transition-colors mb-4 uppercase tracking-[0.15em]">
            <ChevronLeft className="size-3.5" /> Back to meal planning
          </button>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-lg">
              <CalendarDays className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-black text-foreground tracking-tight leading-none">Week 19 Plan</h1>
                <span className="bg-emerald-500/10 text-emerald-600 text-[10px] font-bold px-2.5 py-1 rounded-lg">Published</span>
                <span className="bg-primary/10 text-primary text-[10px] font-bold px-2.5 py-1 rounded-lg">6 days</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1.5 flex items-center gap-2">
                <span className="font-bold text-primary">{id}</span>
                <span className="text-border">·</span>
                May 11 – 16, 2026
                <span className="text-border">·</span>
                Chefs: Maina & Sarah
              </p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5">
              <Download className="size-3.5" /> Export PDF
            </Button>
            <Link href={`/menu/${id}/edit`}>
              <Button size="sm" className="h-8 text-xs gap-1.5 bg-primary hover:bg-primary/90">
                <Edit2 className="size-3.5" /> Edit plan
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stat strip ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total meals served",  value: "2,904",       sub: "+6% vs Week 18",      accent: "text-primary",     glow: "border-primary/20",     icon: Utensils },
          { label: "Avg calorie target",  value: "695 KCAL",    sub: "Within target range", accent: "text-emerald-500", glow: "border-emerald-500/20", icon: Flame },
          { label: "Avg weekly rating",   value: "4.65 ★",      sub: "Based on 2,904 votes",accent: "text-amber-500",   glow: "border-amber-500/20",   icon: Star },
          { label: "Best-selling day",    value: "Friday",      sub: "560 meals — Nyama Choma", accent: "text-violet-500", glow: "border-violet-500/20", icon: TrendingUp },
        ].map((s) => (
          <div key={s.label} className={`relative p-5 rounded-2xl border bg-card overflow-hidden group hover:-translate-y-0.5 transition-all ${s.glow}`}>
            <div className={`absolute -top-4 -right-4 size-16 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity ${s.accent.replace("text-","bg-")}`} />
            <div className={`size-8 rounded-xl bg-muted flex items-center justify-center ${s.accent} mb-3`}>
              <s.icon className="size-4" />
            </div>
            <p className="text-[10px] text-muted-foreground font-semibold">{s.label}</p>
            <p className={`text-xl font-black leading-tight mt-0.5 ${s.accent}`}>{s.value}</p>
            <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp className="size-3" />{s.sub}
            </p>
          </div>
        ))}
      </div>

      {/* ── Main grid ─────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-5">

        {/* ── Left: day selector ── */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="px-5 py-4 border-b border-border bg-muted/30">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.18em]">Day plans</p>
            </div>
            <div className="divide-y divide-border">
              {dayPlans.map((d) => (
                <button
                  key={d.day}
                  onClick={() => setSelectedDay(d.day)}
                  className={`w-full flex items-center justify-between px-5 py-3.5 text-left transition-all group ${selectedDay === d.day ? "bg-primary/5" : "hover:bg-muted/30"}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`size-8 rounded-xl flex items-center justify-center font-black text-[10px] shrink-0 transition-all ${selectedDay === d.day ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-muted-foreground"}`}>
                      {d.date.split(" ")[1]}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-[12px] font-bold leading-none ${selectedDay === d.day ? "text-primary" : "text-foreground"}`}>{d.day}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{d.meals} meals · {d.chef}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Star className="size-3 text-amber-400 fill-amber-400" />
                    <span className="text-[10px] font-bold text-muted-foreground">{d.rating}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Nutrition summary */}
          <div className="rounded-2xl border border-border bg-secondary text-secondary-foreground p-5 relative overflow-hidden">
            <div className="absolute -top-6 -right-6 size-24 bg-primary/20 blur-2xl rounded-full" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <Flame className="size-6 text-primary" />
                <span className="text-[10px] font-bold text-primary bg-primary/20 px-2 py-0.5 rounded-lg">Week avg</span>
              </div>
              <p className="text-sm font-black leading-none mb-1">Nutritional overview</p>
              <p className="text-[11px] text-secondary-foreground/50 mb-4">Across 6 days · all branches</p>
              <div className="space-y-2">
                {[
                  { label: "Avg calories",    value: "695 KCAL" },
                  { label: "Normal meals",    value: "2,628 (90%)" },
                  { label: "Special meals",   value: "276 (10%)" },
                  { label: "Total portions",  value: "3,120 planned" },
                ].map((r) => (
                  <div key={r.label} className="flex justify-between text-[11px]">
                    <span className="text-secondary-foreground/60">{r.label}</span>
                    <span className="font-bold">{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: detail panel ── */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* Tab bar */}
          <div className="flex items-center justify-between">
            <div className="flex gap-1 bg-muted/50 p-1 rounded-xl">
              {(["breakdown", "activity"] as const).map((t) => (
                <button key={t} onClick={() => setActiveTab(t)}
                  className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all ${activeTab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                  {t === "breakdown" ? `${selectedDay}'s menu` : "Activity log"}
                </button>
              ))}
            </div>
            <Link href={`/menu/${id}/edit`}>
              <button className="text-[11px] font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
                Edit plan <ArrowUpRight className="size-3" />
              </button>
            </Link>
          </div>

          {activeTab === "breakdown" && (
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              {/* Day header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <CalendarDays className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-foreground">{selected.day}</p>
                    <p className="text-[10px] text-muted-foreground">May {selected.date.split(" ")[1]}, 2026 · {selected.portions} portions planned</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
                    <Flame className="size-3" /> {selected.calories} KCAL
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ChefHat className="size-4 text-muted-foreground" />
                    <span className="text-[11px] font-semibold text-foreground">{selected.chef}</span>
                  </div>
                </div>
              </div>

              {/* Normal meal */}
              <div className="p-5 border-b border-border">
                <div className="flex items-center gap-2 mb-3">
                  <div className="size-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Utensils className="size-3.5" />
                  </div>
                  <p className="text-[11px] font-bold text-primary uppercase tracking-[0.15em]">Normal subsidy meal</p>
                </div>
                <p className="text-base font-black text-foreground mb-3">{selected.normal}</p>
                <div className="flex flex-wrap gap-2">
                  {selected.normalTags.map((tag) => (
                    <span key={tag} className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-muted text-foreground border border-border">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Special meal */}
              <div className="p-5 border-b border-border">
                <div className="flex items-center gap-2 mb-3">
                  <div className="size-6 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                    <Sparkles className="size-3.5" />
                  </div>
                  <p className="text-[11px] font-bold text-accent uppercase tracking-[0.15em]">Special option</p>
                </div>
                <p className="text-base font-black text-foreground mb-3">{selected.special}</p>
                <div className="flex flex-wrap gap-2">
                  {selected.specialTags.map((tag) => (
                    <span key={tag} className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-accent/10 text-accent border border-accent/20">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Metrics footer */}
              <div className="grid grid-cols-3 divide-x divide-border">
                {[
                  { label: "Meals served",   value: selected.meals.toString() },
                  { label: "Diner rating",   value: `${selected.rating} ★` },
                  { label: "Calorie target", value: `${selected.calories} KCAL` },
                ].map((m) => (
                  <div key={m.label} className="p-4 text-center">
                    <p className="text-[10px] text-muted-foreground mb-1">{m.label}</p>
                    <p className="text-sm font-black text-foreground">{m.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "activity" && (
            <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
              {activity.map((ev, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`size-2 rounded-full mt-1.5 shrink-0 ${ev.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-foreground">{ev.event}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{ev.date} · {ev.user}</p>
                  </div>
                </div>
              ))}
              <div className="h-px bg-border" />
              <p className="text-[11px] text-muted-foreground text-center">No further activity recorded</p>
            </div>
          )}

          {/* ERPNext insight nudge */}
          <div className="relative rounded-2xl border border-border bg-card p-5 overflow-hidden">
            <div className="absolute -top-6 -right-6 size-24 bg-primary/10 blur-2xl rounded-full" />
            <div className="relative z-10 flex items-start gap-3">
              <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Utensils className="size-4" />
              </div>
              <div>
                <p className="text-[12px] font-black text-foreground">ERPNext meal log sync</p>
                <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                  Week 19 meal records are linked to ERPNext Attendance and Payroll. Normal meal subsidies are automatically posted as employer payables at billing cycle close.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
