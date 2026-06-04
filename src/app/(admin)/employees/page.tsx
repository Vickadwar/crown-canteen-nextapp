"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  MoreHorizontal,
  ChevronRight,
  Download,
  MapPin,
  Clock,
  UserPlus,
  Users,
  Building2,
  SlidersHorizontal,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ── data ──────────────────────────────────────────────────────────────────────

const typeStyle: Record<string, string> = {
  Employee:   "bg-primary/10 text-primary",
  Contractor: "bg-violet-500/10 text-violet-500",
  Intern:     "bg-amber-500/10 text-amber-500",
  Visitor:    "bg-rose-500/10 text-rose-500",
};

const customers = [
  { id: "EMP001", name: "Samuel Mandela",  email: "s.mandela@crownpaints.co.ke",  dept: "IT/Admin",    company: "Crown Paints",       branch: "Nairobi HQ",    type: "Employee",   status: "Active",   lastMeal: "12:45 PM" },
  { id: "EMP002", name: "Jane Kariuki",    email: "j.kariuki@crownpaints.co.ke",  dept: "Production",  company: "Crown Paints",       branch: "Mombasa Plant", type: "Employee",   status: "Active",   lastMeal: "12:15 PM" },
  { id: "EMP003", name: "Peter Otieno",    email: "p.otieno@forza.com",           dept: "Consulting",  company: "Forza Consultants",  branch: "Nairobi HQ",    type: "Contractor", status: "Active",   lastMeal: "1:05 PM"  },
  { id: "EMP004", name: "Alice Mwangi",    email: "a.mwangi@crownpaints.co.ke",   dept: "Logistics",   company: "Crown Paints",       branch: "Kisumu Depot",  type: "Employee",   status: "Inactive", lastMeal: "N/A"      },
  { id: "EMP005", name: "David Kimani",    email: "d.kimani@crownpaints.co.ke",   dept: "HR",          company: "Crown Paints",       branch: "Nairobi HQ",    type: "Employee",   status: "Active",   lastMeal: "12:50 PM" },
  { id: "EMP006", name: "Sarah Wanjiku",   email: "s.wanjiku@crownpaints.co.ke",  dept: "Sales",       company: "Crown Paints",       branch: "Eldoret Hub",   type: "Intern",     status: "Active",   lastMeal: "12:30 PM" },
  { id: "EMP007", name: "Michael Omondi",  email: "m.omondi@crownpaints.co.ke",   dept: "Finance",     company: "Crown Paints",       branch: "Nairobi HQ",    type: "Employee",   status: "Active",   lastMeal: "12:55 PM" },
  { id: "VIS001", name: "Grace Njoroge",   email: "g.njoroge@visitor.ke",         dept: "Guest",       company: "External",           branch: "Nairobi HQ",    type: "Visitor",    status: "Active",   lastMeal: "1:10 PM"  },
];

const stats = [
  { label: "Total registered", value: "742",  icon: Users },
  { label: "Active today",     value: "284",  icon: CheckCircle2 },
  { label: "Institutions",     value: "6",    icon: Building2 },
  { label: "Inactive",         value: "58",   icon: XCircle },
];

// ── component ─────────────────────────────────────────────────────────────────

export default function CanteenCustomersPage() {
  const [search, setSearch] = useState("");

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toLowerCase().includes(search.toLowerCase()) ||
    c.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] mb-1">Human capital</p>
          <h1 className="text-2xl font-black text-foreground tracking-tight leading-none">Canteen customers</h1>
          <p className="text-sm text-muted-foreground mt-1.5">Manage institutional access for 700+ registered personnel.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs">
            <Download className="size-3.5" /> Export
          </Button>
          <Link href="/employees/new">
            <Button size="sm" className="h-8 gap-1.5 text-xs bg-primary hover:bg-primary/90 shadow-md shadow-primary/20">
              <UserPlus className="size-3.5" /> Add customer
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Mini stat strip ────────────────────────────────────── */}
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

      {/* ── Search & filter bar ────────────────────────────────── */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, ID or institution…"
            className="w-full h-9 pl-9 pr-4 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
        <Button size="sm" variant="outline" className="h-9 gap-1.5 text-xs shrink-0">
          <SlidersHorizontal className="size-3.5" /> Filter
        </Button>
      </div>

      {/* ── Table ─────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">

        {/* Header */}
        <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1.2fr)_100px_110px] px-5 py-3 border-b border-border bg-muted/40">
          {["Customer", "Institution & dept", "Branch", "Last check-in", "Type", "Status"].map((h) => (
            <span key={h} className="text-[11px] font-semibold text-muted-foreground">{h}</span>
          ))}
        </div>

        {/* Rows */}
        <div className="divide-y divide-border">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="grid grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1.2fr)_100px_110px] items-center px-5 py-3.5 hover:bg-muted/20 transition-colors group cursor-pointer"
            >
              {/* Customer */}
              <div className="flex items-center gap-3 min-w-0 pr-3">
                <div className="size-8 rounded-xl bg-muted ring-1 ring-border text-foreground flex items-center justify-center font-bold text-[10px] shrink-0 group-hover:bg-primary group-hover:text-primary-foreground group-hover:ring-primary transition-all">
                  {c.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-bold text-foreground truncate group-hover:text-primary transition-colors">{c.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{c.id} · {c.email}</p>
                </div>
              </div>

              {/* Institution & dept */}
              <div className="min-w-0 pr-3">
                <p className="text-[12px] font-semibold text-foreground truncate">{c.company}</p>
                <p className="text-[10px] text-muted-foreground truncate">{c.dept}</p>
              </div>

              {/* Branch */}
              <div className="flex items-center gap-1.5 min-w-0">
                <MapPin className="size-3 text-muted-foreground shrink-0" />
                <p className="text-[11px] text-foreground font-medium truncate">{c.branch}</p>
              </div>

              {/* Last check-in */}
              <div className="flex items-center gap-1.5">
                <Clock className="size-3 text-muted-foreground shrink-0" />
                <p className="text-[11px] text-foreground tabular-nums">
                  {c.lastMeal === "N/A" ? <span className="text-muted-foreground">No record</span> : `Today, ${c.lastMeal}`}
                </p>
              </div>

              {/* Type */}
              <div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg leading-none ${typeStyle[c.type]}`}>
                  {c.type}
                </span>
              </div>

              {/* Status + actions */}
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg leading-none ${c.status === "Active" ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"}`}>
                  {c.status}
                </span>
                <Link href={`/employees/${c.id}`} className="ml-auto">
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
            Showing {filtered.length} of 742 customers
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
