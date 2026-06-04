"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft, Wallet, Plus, Download, ArrowDownRight,
  ArrowUpRight, Clock, CheckCircle2, History,
  MoreHorizontal, FileText, ShieldCheck,
  Calendar, User, Info, DollarSign,
  Activity, PieChart, SlidersHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";

const transactions = [
  { id: "PC-9021", desc: "Fresh Herbs & Spices", amount: "2,500", type: "Expense", user: "Chef Maina", date: "Today, 10:15 AM", status: "Paid" },
  { id: "PC-9018", desc: "Emergency Gas Refill", amount: "6,800", type: "Expense", user: "Sarah W.", date: "Yesterday, 04:30 PM", status: "Approved" },
  { id: "PC-9015", desc: "Weekly Float Top-up", amount: "50,000", type: "Top-up", user: "Treasury", date: "May 12, 09:00 AM", status: "Paid" },
  { id: "PC-9012", desc: "Cleaning Detergents", amount: "1,200", type: "Expense", user: "Grace O.", date: "May 11, 02:20 PM", status: "Paid" },
];

export default function BranchFloatDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [tab, setTab] = useState<"ledger" | "topups" | "stats">("ledger");

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">

      {/* Back + header */}
      <div>
        <Link href="/finance">
          <button className="flex items-center gap-1.5 text-[11px] font-bold text-primary hover:text-primary/80 transition-colors mb-4 uppercase tracking-[0.15em]">
            <ChevronLeft className="size-3.5" /> Back to command center
          </button>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 ring-1 ring-primary/20 shadow-sm">
              <Wallet className="size-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-black text-foreground tracking-tight leading-none">Nairobi HQ Float</h1>
                <span className="bg-emerald-500/10 text-emerald-600 text-[10px] font-bold px-2.5 py-1 rounded-lg">Healthy</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1.5 flex items-center gap-2 flex-wrap">
                <span className="font-bold text-primary uppercase tracking-widest">{id}</span>
                <span className="text-border">·</span>
                Cost Center: <span className="font-semibold text-foreground">CC-NBO-KITCHEN</span>
                <span className="text-border">·</span>
                Managed by Samuel M.
              </p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5">
               <History className="size-3.5" /> Reconciliation
            </Button>
            <Button size="sm" className="h-8 text-xs gap-1.5 bg-primary hover:bg-primary/90 shadow-md shadow-primary/20">
              <Plus className="size-3.5" /> Load Float
            </Button>
          </div>
        </div>
      </div>

      {/* Stat strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Available Cash",  value: "KES 42,400", sub: "84.8% of limit", icon: Wallet,      accent: "text-primary",    glow: "border-primary/15" },
          { label: "Monthly Allowance",value: "KES 50,000", sub: "Resets in 18 days", icon: DollarSign,  accent: "text-blue-500",   glow: "border-blue-500/15" },
          { label: "Total Spent (Mo)", value: "KES 7,600",  sub: "12 transactions",   icon: ArrowDownRight, accent: "text-rose-500",   glow: "border-rose-500/15" },
          { label: "Pending Claims",   value: "2",          sub: "KES 4,500 total",   icon: Clock,       accent: "text-amber-500",  glow: "border-amber-500/15" },
        ].map(s => (
          <div key={s.label} className={`relative p-5 rounded-2xl border bg-card overflow-hidden group hover:-translate-y-0.5 transition-all ${s.glow}`}>
            <div className={`absolute -top-4 -right-4 size-16 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity ${s.accent.replace("text-","bg-")}`} />
            <div className="relative z-10 flex items-start justify-between">
              <div className={`size-8 rounded-xl bg-muted flex items-center justify-center ${s.accent}`}><s.icon className="size-4" /></div>
            </div>
            <div className="relative z-10 mt-3">
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{s.label}</p>
              <p className={`text-2xl font-black leading-tight mt-0.5 ${s.accent}`}>{s.value}</p>
              <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1"><Activity className="size-3" />{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-5">

        {/* Left sidebar */}
        <div className="flex flex-col gap-4">

          {/* Float Parameters */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.18em] mb-4">Float Configuration</p>
            <div className="space-y-3.5">
              {[
                { icon: ShieldCheck, label: "Safety Threshold", value: "KES 10,000" },
                { icon: Activity,    label: "Refill Trigger",   value: "Automatic at 20%" },
                { icon: User,        label: "Primary Approver", value: "Chef Samuel" },
                { icon: Info,        label: "ERP Cost Center",  value: "KITCH-NBO-01" },
                { icon: Calendar,    label: "Last Top-up",      value: "May 12, 2026" },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="size-7 rounded-lg bg-muted flex items-center justify-center text-primary shrink-0">
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

          {/* ERPNext Sync Status */}
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.18em]">ERPNext Integration</p>
              <CheckCircle2 className="size-3.5 text-emerald-500" />
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">
              Journal Entries (JV) are automatically posted to ERPNext upon disbursement. Reconciliation with Bank Statement is current.
            </p>
            <button className="w-full flex items-center justify-center gap-2 h-8 rounded-xl bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700 transition-colors shadow-sm">
              <FileText className="size-3.5" /> View Journal Entries
            </button>
          </div>

          {/* Budget Health */}
          <div className="rounded-2xl border border-border bg-card p-5">
             <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.18em] mb-4">Spend distribution</p>
             <div className="space-y-4">
                {[
                  { label: "Fresh Ingredients", pct: 65, color: "bg-emerald-500" },
                  { label: "Utilities & Gas",   pct: 20, color: "bg-blue-500" },
                  { label: "Maintenance",       pct: 10, color: "bg-amber-500" },
                  { label: "Others",            pct: 5,  color: "bg-muted-foreground" },
                ].map(cat => (
                  <div key={cat.label} className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="text-muted-foreground">{cat.label}</span>
                      <span className="text-foreground">{cat.pct}%</span>
                    </div>
                    <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
                      <div className={`h-full rounded-full ${cat.color}`} style={{width: `${cat.pct}%`}} />
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Right: tabbed panel */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* Tabs */}
          <div className="flex items-center gap-0.5 p-1 rounded-xl bg-muted/40 border border-border w-fit">
            {([
              { k: "ledger",  label: "Float Ledger" },
              { k: "topups",  label: "Top-up History" },
              { k: "stats",   label: "Spend Analytics" },
            ] as const).map(t => (
              <button key={t.k} onClick={() => setTab(t.k)}
                className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all ${tab === t.k ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Ledger Tab */}
          {tab === "ledger" && (
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h2 className="text-sm font-black text-foreground">Recent transactions</h2>
                <div className="flex gap-2">
                   <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1 px-2"><Download className="size-3" /> Export CSV</Button>
                   <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1 px-2"><SlidersHorizontal className="size-3" /> Filter</Button>
                </div>
              </div>
              <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_100px_40px] px-5 py-3 border-b border-border bg-muted/40">
                {["Description & ID","Authorized By","Date","Amount",""].map(h => (
                  <span key={h} className="text-[11px] font-semibold text-muted-foreground">{h}</span>
                ))}
              </div>
              <div className="divide-y divide-border">
                {transactions.map(tx => (
                  <div key={tx.id}
                    className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_100px_40px] items-center px-5 py-4 hover:bg-muted/20 transition-colors group">
                    <div className="min-w-0 pr-4">
                      <p className="text-[12px] font-bold text-foreground group-hover:text-primary transition-colors truncate">{tx.desc}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{tx.id}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="size-6 rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center font-black text-[9px] shrink-0">{tx.user[0]}</div>
                      <span className="text-[11px] font-medium text-foreground">{tx.user}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="size-3.5" />
                      <span className="text-[11px] font-medium">{tx.date}</span>
                    </div>
                    <p className={`text-[12px] font-black text-right pr-4 ${tx.type === "Top-up" ? "text-emerald-600" : "text-rose-500"}`}>
                      {tx.type === "Top-up" ? "+" : "-"} {tx.amount}
                    </p>
                    <div className="flex justify-end">
                      <button className="size-7 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground transition-colors">
                        <MoreHorizontal className="size-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-5 py-3 border-t border-border bg-muted/20 flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">Showing 4 of 142 transactions</span>
                <button className="text-[11px] font-bold text-primary hover:underline">View full ledger →</button>
              </div>
            </div>
          )}

          {/* Top-ups Tab (Mock) */}
          {tab === "topups" && (
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
               <div className="px-5 py-12 flex flex-col items-center justify-center text-center">
                  <div className="size-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-4">
                    <ArrowUpRight className="size-6" />
                  </div>
                  <h3 className="text-sm font-black text-foreground">Float refill history</h3>
                  <p className="text-[11px] text-muted-foreground mt-1 max-w-[280px]">
                    Track all fund allocations from main treasury to this location.
                  </p>
               </div>
            </div>
          )}

          {/* Stats Tab (Mock) */}
          {tab === "stats" && (
            <div className="rounded-2xl border border-border bg-card p-6">
               <div className="flex items-center justify-between mb-6">
                 <h3 className="text-sm font-black text-foreground">Monthly Spend Velocity</h3>
                 <PieChart className="size-4 text-muted-foreground" />
               </div>
               <div className="h-40 flex items-end gap-2.5 mb-6">
                {[45, 65, 30, 85, 50, 40, 75, 55, 90, 60].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer relative">
                    <div className="w-full bg-rose-500/20 rounded-t-xl relative z-10 transition-all group-hover:bg-rose-500/30" style={{height: `${h}%`}}>
                       <div className="absolute inset-x-0 bottom-0 bg-rose-500 rounded-t-xl h-[80%] group-hover:h-full transition-all" />
                    </div>
                    <span className="text-[9px] font-bold text-muted-foreground mt-2 uppercase tracking-tighter">W{i+1}</span>
                  </div>
                ))}
              </div>
              <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5">
                 <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                    &ldquo;Weekly spend velocity is stable at KES 14,200/week. Current float is projected to last another 3 weeks based on trend.&rdquo;
                 </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

