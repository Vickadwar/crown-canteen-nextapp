"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Building2,
  Plus,
  CircleDollarSign,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  Download,
  SlidersHorizontal,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ── data ──────────────────────────────────────────────────────────────────────

const statusStyle: Record<string, string> = {
  Active:    "bg-emerald-500/10 text-emerald-600",
  Suspended: "bg-rose-500/10 text-rose-500",
  Pending:   "bg-amber-500/10 text-amber-500",
};

const statusDot: Record<string, string> = {
  Active:    "bg-emerald-500",
  Suspended: "bg-rose-500",
  Pending:   "bg-amber-500",
};

const employers = [
  {
    id: "CUST-CP-01", name: "Crown Paints Kenya PLC", short: "CP",
    sector: "Manufacturing",     contact: "accounts@crownpaints.co.ke",
    headcount: 842, branches: 7, terms: "Bi-weekly",  monthlyVolume: "KES 1.2M",
    outstanding: "KES 0",        nextInvoice: "May 15, 2026",
    status: "Active",  tier: "Enterprise",
  },
  {
    id: "CUST-FC-02", name: "Forza Consultants", short: "FC",
    sector: "Consulting",        contact: "finance@forza.co.ke",
    headcount: 124, branches: 1, terms: "Monthly",    monthlyVolume: "KES 420k",
    outstanding: "KES 42k",      nextInvoice: "May 31, 2026",
    status: "Active",  tier: "Growth",
  },
  {
    id: "CUST-OT-03", name: "ODUK TECH LIMITED", short: "OT",
    sector: "Technology",        contact: "billing@oduktech.co.ke",
    headcount: 56, branches: 1,  terms: "Monthly",    monthlyVolume: "KES 180k",
    outstanding: "KES 0",        nextInvoice: "May 31, 2026",
    status: "Active",  tier: "Starter",
  },
  {
    id: "CUST-LH-04", name: "Logistics Hub Ltd", short: "LH",
    sector: "Logistics",         contact: "ops@logisticshub.co.ke",
    headcount: 42, branches: 2,  terms: "Upfront",    monthlyVolume: "KES 92k",
    outstanding: "KES 92k",      nextInvoice: "Overdue",
    status: "Suspended", tier: "Starter",
  },
];

const tierStyle: Record<string, string> = {
  Enterprise: "bg-violet-500/10 text-violet-600",
  Growth:     "bg-blue-500/10 text-blue-600",
  Starter:    "bg-muted text-muted-foreground",
};

const stats = [
  { label: "Total institutions", value: "4",       icon: Building2 },
  { label: "Total headcount",    value: "1,064",   icon: Users },
  { label: "Monthly billing",    value: "KES 1.9M",icon: CircleDollarSign },
  { label: "Overdue",           value: "1",        icon: AlertTriangle },
];

// ── page ──────────────────────────────────────────────────────────────────────

export default function EmployersPage() {
  const [search, setSearch] = useState("");

  const filtered = employers.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">

      {/* ── Header ───────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] mb-1">Strategic partners</p>
          <h1 className="text-2xl font-black text-foreground tracking-tight leading-none">Employer accounts</h1>
          <p className="text-sm text-muted-foreground mt-1.5">Manage corporate customers, billing terms and canteen agreements.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs">
            <Download className="size-3.5" /> Export
          </Button>
          <Link href="/employers/new">
            <Button size="sm" className="h-8 gap-1.5 text-xs bg-primary hover:bg-primary/90 shadow-md shadow-primary/20">
              <Plus className="size-3.5" /> Add employer
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Stat strip ───────────────────────────────────────── */}
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

      {/* ── Search ───────────────────────────────────────────── */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or customer ID…"
            className="w-full h-9 pl-9 pr-4 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
        <Button size="sm" variant="outline" className="h-9 gap-1.5 text-xs shrink-0">
          <SlidersHorizontal className="size-3.5" /> Filter
        </Button>
      </div>

      {/* ── Table ────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">

        {/* Header */}
        <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_100px_minmax(0,1fr)_minmax(0,1fr)_90px_80px] px-5 py-3 border-b border-border bg-muted/40">
          {["Employer", "Sector & contact", "Headcount", "Billing terms", "Monthly volume", "Status", ""].map((h) => (
            <span key={h} className="text-[11px] font-semibold text-muted-foreground">{h}</span>
          ))}
        </div>

        <div className="divide-y divide-border">
          {filtered.map((e) => (
            <div
              key={e.id}
              className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_100px_minmax(0,1fr)_minmax(0,1fr)_90px_80px] items-center px-5 py-3.5 hover:bg-muted/20 transition-colors group cursor-pointer"
            >
              {/* Employer */}
              <div className="flex items-center gap-3 min-w-0 pr-3">
                <div className="size-9 rounded-xl bg-secondary text-secondary-foreground flex items-center justify-center font-black text-[11px] shrink-0 group-hover:ring-2 group-hover:ring-primary/30 transition-all">
                  {e.short}
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-bold text-foreground truncate group-hover:text-primary transition-colors">{e.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{e.id} · <span className={`font-semibold ${tierStyle[e.tier]?.split(" ")[1]}`}>{e.tier}</span></p>
                </div>
              </div>

              {/* Sector */}
              <div className="min-w-0 pr-2">
                <p className="text-[12px] font-semibold text-foreground truncate">{e.sector}</p>
                <p className="text-[10px] text-muted-foreground truncate">{e.contact}</p>
              </div>

              {/* Headcount */}
              <div>
                <p className="text-[13px] font-bold text-foreground tabular-nums">{e.headcount.toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground">{e.branches} branch{e.branches > 1 ? "es" : ""}</p>
              </div>

              {/* Billing terms */}
              <div className="flex items-center gap-1.5">
                <Clock className="size-3 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-[12px] font-semibold text-foreground">{e.terms}</p>
                  <p className="text-[10px] text-muted-foreground">Next: {e.nextInvoice}</p>
                </div>
              </div>

              {/* Volume */}
              <div>
                <p className="text-[13px] font-bold text-foreground">{e.monthlyVolume}</p>
                <p className={`text-[10px] font-semibold ${e.outstanding === "KES 0" ? "text-emerald-600" : "text-rose-500"}`}>
                  {e.outstanding === "KES 0" ? "No outstanding" : `Outstanding: ${e.outstanding}`}
                </p>
              </div>

              {/* Status */}
              <div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg leading-none flex items-center gap-1.5 w-fit ${statusStyle[e.status]}`}>
                  <span className={`size-1.5 rounded-full ${statusDot[e.status]}`} />
                  {e.status}
                </span>
              </div>

              {/* Action */}
              <div className="flex justify-end">
                <Link href={`/employers/${e.id}`}>
                  <button className="size-7 flex items-center justify-center rounded-lg hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors">
                    <ChevronRight className="size-3.5" />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="px-5 py-3 border-t border-border bg-muted/20 flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">Showing {filtered.length} of {employers.length} employers</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="h-7 px-3 text-xs" disabled>Previous</Button>
            <Button size="sm" variant="outline" className="h-7 px-3 text-xs">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
