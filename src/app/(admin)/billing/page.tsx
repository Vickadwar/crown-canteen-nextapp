"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  Download,
  ChevronRight,
  Plus,
  CircleDollarSign,
  FileText,
  Clock,
  AlertTriangle,
  Building2,
  Calendar,
  CheckCircle2,
  XCircle,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ── data ──────────────────────────────────────────────────────────────────────

const statusStyle: Record<string, string> = {
  Paid:    "bg-emerald-500/10 text-emerald-600",
  Pending: "bg-amber-500/10  text-amber-600",
  Overdue: "bg-rose-500/10   text-rose-500",
  Draft:   "bg-muted         text-muted-foreground",
};

const cycleStyle: Record<string, string> = {
  "Bi-Weekly": "bg-primary/10   text-primary",
  "Monthly":   "bg-violet-500/10 text-violet-500",
  "Weekly":    "bg-blue-500/10  text-blue-600",
};

const invoices = [
  {
    id: "INV-2026-001", employer: "Crown Paints Kenya PLC",  short: "CP",
    cycle: "Bi-Weekly", period: "May 01 – 15, 2026",   issueDate: "May 15, 2026",
    dueDate: "May 22, 2026", amount: "1,240,500",       meals: 4502,
    status: "Pending",  dept: "Corporate — 6 branches",
  },
  {
    id: "INV-2026-002", employer: "Crown Paints Kenya PLC",  short: "CP",
    cycle: "Bi-Weekly", period: "Apr 16 – 30, 2026",   issueDate: "Apr 30, 2026",
    dueDate: "May 07, 2026", amount: "1,185,000",       meals: 4215,
    status: "Paid",     dept: "Corporate — 6 branches",
  },
  {
    id: "INV-2026-003", employer: "Forza Consultants",       short: "FC",
    cycle: "Monthly",   period: "April 2026",           issueDate: "Apr 30, 2026",
    dueDate: "May 14, 2026", amount: "420,000",         meals: 1240,
    status: "Pending",  dept: "Nairobi HQ only",
  },
  {
    id: "INV-2026-004", employer: "Logistics Hub Ltd",       short: "LH",
    cycle: "Monthly",   period: "April 2026",           issueDate: "May 05, 2026",
    dueDate: "May 12, 2026", amount: "15,400",          meals: 42,
    status: "Overdue",  dept: "Mombasa Depot",
  },
  {
    id: "INV-2026-005", employer: "ODUK Tech Limited",       short: "OT",
    cycle: "Weekly",    period: "Week 19, 2026",        issueDate: "May 12, 2026",
    dueDate: "May 19, 2026", amount: "62,800",          meals: 188,
    status: "Paid",     dept: "Nairobi HQ only",
  },
  {
    id: "INV-2026-006", employer: "NovaBuild Contractors",   short: "NB",
    cycle: "Monthly",   period: "April 2026",           issueDate: "May 01, 2026",
    dueDate: "May 15, 2026", amount: "94,200",          meals: 314,
    status: "Draft",    dept: "Site teams — 3 sites",
  },
];

const stats = [
  { label: "Total invoiced (May)", value: "KES 5.6M", icon: CircleDollarSign },
  { label: "Pending settlement",   value: "3",        icon: Clock },
  { label: "Overdue accounts",     value: "1",        icon: AlertTriangle },
  { label: "Paid this month",      value: "2",        icon: CheckCircle2 },
];

// ── component ─────────────────────────────────────────────────────────────────

export default function BillingPage() {
  const [search, setSearch] = useState("");

  const filtered = invoices.filter((inv) =>
    inv.employer.toLowerCase().includes(search.toLowerCase()) ||
    inv.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] mb-1">Financial ledger</p>
          <h1 className="text-2xl font-black text-foreground tracking-tight leading-none">Billing &amp; Invoices</h1>
          <p className="text-sm text-muted-foreground mt-1.5">Manage employer billing cycles, invoice status and payment records.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs">
            <Download className="size-3.5" /> Export
          </Button>
          <Link href="/billing/new">
            <Button size="sm" className="h-8 gap-1.5 text-xs bg-primary hover:bg-primary/90 shadow-md shadow-primary/20">
              <Plus className="size-3.5" /> Create invoice
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
            placeholder="Search by employer or invoice ID…"
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
        <div className="grid grid-cols-[minmax(0,2.2fr)_minmax(0,1.2fr)_minmax(0,1.4fr)_minmax(0,1fr)_110px_80px] px-5 py-3 border-b border-border bg-muted/40">
          {["Invoice / Employer", "Billing cycle", "Period & due date", "Amount", "Status", ""].map((h) => (
            <span key={h} className="text-[11px] font-semibold text-muted-foreground">{h}</span>
          ))}
        </div>

        {/* Data rows */}
        <div className="divide-y divide-border">
          {filtered.map((inv) => (
            <div
              key={inv.id}
              className="grid grid-cols-[minmax(0,2.2fr)_minmax(0,1.2fr)_minmax(0,1.4fr)_minmax(0,1fr)_110px_80px] items-center px-5 py-3.5 hover:bg-muted/20 transition-colors group cursor-pointer"
            >
              {/* Invoice + employer */}
              <div className="flex items-center gap-3 min-w-0 pr-3">
                <div className="size-8 rounded-xl bg-muted ring-1 ring-border text-foreground flex items-center justify-center font-black text-[10px] shrink-0 group-hover:bg-primary group-hover:text-primary-foreground group-hover:ring-primary transition-all">
                  {inv.short}
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-bold text-foreground truncate group-hover:text-primary transition-colors">{inv.employer}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{inv.id} · {inv.dept}</p>
                </div>
              </div>

              {/* Billing cycle */}
              <div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg leading-none ${cycleStyle[inv.cycle] ?? "bg-muted text-muted-foreground"}`}>
                  {inv.cycle}
                </span>
              </div>

              {/* Period & due date */}
              <div className="min-w-0 pr-2">
                <p className="text-[12px] font-semibold text-foreground truncate flex items-center gap-1">
                  <Calendar className="size-3 text-muted-foreground shrink-0" /> {inv.period}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Due {inv.dueDate}</p>
              </div>

              {/* Amount */}
              <div>
                <p className="text-[13px] font-bold text-foreground">KES {inv.amount}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                  <FileText className="size-2.5" /> {inv.meals.toLocaleString()} meals
                </p>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg leading-none flex items-center gap-1.5 w-fit ${statusStyle[inv.status]}`}>
                  <span className={`size-1.5 rounded-full ${
                    inv.status === "Paid"    ? "bg-emerald-500" :
                    inv.status === "Pending" ? "bg-amber-500"   :
                    inv.status === "Overdue" ? "bg-rose-500"    : "bg-muted-foreground"
                  }`} />
                  {inv.status}
                </span>
              </div>

              {/* Arrow */}
              <div className="flex justify-end">
                <Link href={`/billing/${inv.id}`}>
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
            Showing {filtered.length} of {invoices.length} invoices
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
