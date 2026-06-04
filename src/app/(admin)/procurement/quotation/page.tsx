"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search, Plus, Download, ChevronRight,
  Filter, FileText, ClipboardList, BadgeCheck,
  TrendingDown, TrendingUp, DollarSign, Clock,
  ArrowUpRight, SlidersHorizontal, ShieldCheck, Box
} from "lucide-react";
import { Button } from "@/components/ui/button";

const quotations = [
  { id: "RFQ-2026-015", title: "Fresh Produce Vendor Survey", items: 12, bids: 4, status: "Awaiting Bids", date: "May 14, 2026", deadline: "In 2 days" },
  { id: "RFQ-2026-012", title: "Dry Goods Supply Q2", items: 45, bids: 3, status: "Evaluation",   date: "May 10, 2026", deadline: "Expired" },
  { id: "RFQ-2026-008", title: "Kitchen Consumables", items: 8, bids: 5, status: "Closed",       date: "May 05, 2026", deadline: "Closed" },
];

const stats = [
  { label: "Open RFQs", value: "8", icon: FileText, accent: "text-primary" },
  { label: "Bids Received", value: "24", icon: TrendingUp, accent: "text-emerald-500" },
  { label: "Avg. Savings", value: "12%", icon: TrendingDown, accent: "text-blue-500" },
  { label: "Pending Evaluation", value: "3", icon: Clock, accent: "text-amber-500" },
];

export default function QuotationListPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] mb-1">Price Discovery</p>
          <h1 className="text-2xl font-black text-foreground tracking-tight leading-none">Supplier Quotations</h1>
          <p className="text-sm text-muted-foreground mt-1.5 font-medium">Request for Quotations (RFQ) and vendor bid comparisons.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs">
            <Download className="size-3.5" /> Export
          </Button>
          <Link href="/procurement/quotation/new">
            <Button size="sm" className="h-8 gap-1.5 text-xs bg-primary hover:bg-primary/90 shadow-md shadow-primary/20">
              <Plus className="size-3.5" /> New RFQ
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-card">
            <div className={`size-8 rounded-xl bg-muted flex items-center justify-center ${s.accent} shrink-0`}>
              <s.icon className="size-4" />
            </div>
            <div>
              <p className="text-lg font-black text-foreground leading-none">{s.value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 uppercase font-bold tracking-wider">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Action bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search RFQs by title or ID…"
            className="w-full h-9 pl-9 pr-4 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
        </div>
        <Button size="sm" variant="outline" className="h-9 gap-1.5 text-xs shrink-0 px-3">
          <Filter className="size-3.5" /> Filter
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-[minmax(0,2.5fr)_minmax(0,1fr)_100px_120px_120px_80px] px-5 py-3 border-b border-border bg-muted/40">
          {["RFQ Details", "Status", "Bids", "Posted Date", "Deadline", ""].map(h => (
            <span key={h} className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{h}</span>
          ))}
        </div>
        <div className="divide-y divide-border">
          {quotations.map(q => (
            <div key={q.id} className="grid grid-cols-[minmax(0,2.5fr)_minmax(0,1fr)_100px_120px_120px_80px] items-center px-5 py-4 hover:bg-muted/10 transition-colors group cursor-pointer">
              <div className="flex items-center gap-3 pr-4">
                 <div className="size-9 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                    <FileText className="size-4" />
                 </div>
                 <div>
                    <p className="text-[12px] font-bold text-foreground group-hover:text-primary transition-colors">{q.title}</p>
                    <p className="text-[10px] text-muted-foreground font-bold tracking-tight uppercase">{q.id} · {q.items} Items</p>
                 </div>
              </div>
              <div>
                 <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider
                    ${q.status === 'Closed' ? 'bg-muted text-muted-foreground' : q.status === 'Evaluation' ? 'bg-blue-500/10 text-blue-600' : 'bg-amber-500/10 text-amber-600'}`}>
                    {q.status}
                 </span>
              </div>
              <div className="flex items-center gap-2">
                 <p className="text-xs font-black text-foreground">{q.bids}</p>
                 <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-tight">Quotes</span>
              </div>
              <div>
                 <p className="text-[11px] font-bold text-foreground">{q.date}</p>
              </div>
              <div>
                 <p className={`text-[11px] font-bold ${q.deadline === 'Expired' || q.deadline === 'Closed' ? 'text-rose-500' : 'text-foreground'}`}>{q.deadline}</p>
              </div>
              <div className="flex justify-end">
                 <Link href={`/procurement/quotation/${q.id}`}>
                    <button className="size-7 flex items-center justify-center rounded-lg hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors">
                       <ChevronRight className="size-3.5" />
                    </button>
                 </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
