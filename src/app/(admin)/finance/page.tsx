"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search, Wallet, Plus, Download,
  ChevronRight, ArrowDownRight, Clock,
  AlertCircle, History, Building2,
  Filter, FileText, ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";

const statusStyle: Record<string, string> = {
  "Pending (L1)": "bg-amber-500/10 text-amber-600",
  "Pending (L2)": "bg-orange-500/10 text-orange-600",
  "Approved":     "bg-blue-500/10 text-blue-600",
  "Paid":         "bg-emerald-500/10 text-emerald-600",
  "Rejected":     "bg-rose-500/10 text-rose-500",
};

const requests = [
  { id: "PC-9021", desc: "Fresh Herbs & Spices", branch: "Nairobi HQ", amount: "2,500", requester: "Chef Maina", status: "Pending (L1)", date: "Today, 10:15 AM" },
  { id: "PC-9018", desc: "Emergency Gas Refill", branch: "Mombasa Plant", amount: "6,800", requester: "Sarah W.", status: "Approved", date: "Yesterday, 04:30 PM" },
  { id: "PC-9015", desc: "Cleaning Detergents", branch: "Nairobi HQ", amount: "1,200", requester: "Grace O.", status: "Paid", date: "May 12, 09:00 AM" },
  { id: "PC-9012", desc: "Broken Crate Replacement", branch: "Eldoret Hub", amount: "4,500", requester: "Kevin M.", status: "Pending (L2)", date: "May 11, 02:20 PM" },
];

const branches = [
  { id: "BR-NBO", name: "Nairobi HQ",     float: "42,400", limit: "50,000", health: 84 },
  { id: "BR-MSA", name: "Mombasa Plant",  float: "28,150", limit: "30,000", health: 93 },
  { id: "BR-KSM", name: "Kisumu Depot",   float: "5,200",  limit: "15,000", health: 34 },
  { id: "BR-ELD", name: "Eldoret Hub",    float: "12,800", limit: "20,000", health: 64 },
];

export default function FinanceDashboard() {
  const [tab, setTab] = useState<"requests" | "ledger" | "locations">("requests");

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] mb-1">Financial Operations</p>
          <h1 className="text-2xl font-black text-foreground tracking-tight leading-none">Petty Cash Command</h1>
          <p className="text-sm text-muted-foreground mt-1.5">Multi-location float management and approval workflows.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs">
            <Download className="size-3.5" /> Reports
          </Button>
          <Link href="/finance/petty-cash/requests/new">
            <Button size="sm" className="h-8 gap-1.5 text-xs bg-primary hover:bg-primary/90 shadow-md shadow-primary/20">
              <Plus className="size-3.5" /> New cash request
            </Button>
          </Link>
        </div>
      </div>

      {/* Stat strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Global Float",     value: "KES 88,550", icon: Wallet,      accent: "text-primary",    sub: "Across 4 branches" },
          { label: "Pending Approvals", value: "5",          icon: Clock,       accent: "text-orange-500", sub: "3 at L1, 2 at L2" },
          { label: "Today's Spend",     value: "KES 14,200", icon: ArrowDownRight, accent: "text-rose-500",   sub: "+12% vs avg" },
          { label: "Float Health",      value: "92.4%",      icon: ShieldCheck,  accent: "text-emerald-500",sub: "Treasury verified" },
        ].map((s) => (
          <div key={s.label} className="flex flex-col p-4 rounded-2xl border border-border bg-card hover:border-primary/20 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <div className={`size-8 rounded-xl bg-muted flex items-center justify-center ${s.accent} shrink-0`}><s.icon className="size-4" /></div>
              <div className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-lg group-hover:text-primary transition-colors cursor-default">Real-time</div>
            </div>
            <div>
              <p className="text-lg font-black text-foreground leading-none tracking-tight">{s.value}</p>
              <p className="text-[10px] text-muted-foreground mt-1.5 uppercase tracking-wider font-bold">{s.label}</p>
              <p className="text-[9px] text-muted-foreground/60 mt-1">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Control Panel */}
      <div className="space-y-4">
        
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex items-center gap-0.5 p-1 rounded-xl bg-muted/40 border border-border w-fit shrink-0">
            {([
              { k: "requests",  label: "Active Requests" },
              { k: "ledger",    label: "Treasury Ledger" },
              { k: "locations", label: "Float by Location" },
            ] as const).map(t => (
              <button key={t.k} onClick={() => setTab(t.k)}
                className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all ${tab === t.k ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <input placeholder="Search transactions, requesters or vouchers…"
              className="w-full h-9 pl-9 pr-4 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
          </div>

          <Button size="sm" variant="outline" className="h-9 gap-1.5 text-xs shrink-0">
            <Filter className="size-3.5" /> All Branches
          </Button>
        </div>

        {/* Tab Content */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          
          {/* Requests Tab */}
          {tab === "requests" && (
            <>
              <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_120px_60px] px-5 py-3 border-b border-border bg-muted/40">
                {["Description & ID","Location","Requester","Date","Status",""].map(h => (
                  <span key={h} className="text-[11px] font-semibold text-muted-foreground">{h}</span>
                ))}
              </div>
              <div className="divide-y divide-border">
                {requests.map(req => (
                  <div key={req.id}
                    className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_120px_60px] items-center px-5 py-4 hover:bg-muted/20 transition-colors group cursor-pointer">
                    <div className="flex items-center gap-3 pr-4">
                      <div className="size-9 rounded-xl bg-muted text-foreground flex items-center justify-center shrink-0 group-hover:ring-2 group-hover:ring-primary/30 transition-all">
                        <FileText className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[12px] font-bold text-foreground truncate group-hover:text-primary transition-colors">{req.desc}</p>
                        <p className="text-[10px] text-muted-foreground truncate flex items-center gap-1.5">
                          <span className="uppercase tracking-widest font-bold">{req.id}</span>
                          <span className="text-border">·</span>
                          KES {req.amount}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="size-3.5 text-muted-foreground" />
                      <span className="text-[11px] text-foreground font-medium">{req.branch}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="size-6 rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center font-black text-[9px] shrink-0">{req.requester[0]}</div>
                      <span className="text-[11px] font-medium text-foreground">{req.requester}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="size-3.5" />
                      <span className="text-[11px] font-medium">{req.date}</span>
                    </div>
                    <div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg leading-none flex items-center gap-1.5 w-fit ${statusStyle[req.status]}`}>
                        <span className={`size-1.5 rounded-full ${
                          req.status.includes("Pending") ? "bg-amber-500" : 
                          req.status === "Approved" ? "bg-blue-500" : "bg-emerald-500"
                        }`} />
                        {req.status}
                      </span>
                    </div>
                    <div className="flex justify-end">
                      <button className="size-7 flex items-center justify-center rounded-lg hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors">
                        <ChevronRight className="size-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Ledger Tab (Mock) */}
          {tab === "ledger" && (
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <div className="size-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-4">
                <History className="size-6" />
              </div>
              <h3 className="text-sm font-black text-foreground">Treasury Ledger</h3>
              <p className="text-[11px] text-muted-foreground mt-1 max-w-[280px]">
                Historical record of all petty cash disbursements and float top-ups. Syncs directly with ERPNext Journal Entries.
              </p>
              <Button size="sm" variant="outline" className="h-8 mt-5 gap-1.5 text-xs">
                <Download className="size-3.5" /> Export full ledger
              </Button>
            </div>
          )}

          {/* Locations Tab */}
          {tab === "locations" && (
            <>
              <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,1fr)_80px] px-5 py-3 border-b border-border bg-muted/40">
                {["Branch Name","Current Float","Float Health","Monthly Limit",""].map(h => (
                  <span key={h} className="text-[11px] font-semibold text-muted-foreground">{h}</span>
                ))}
              </div>
              <div className="divide-y divide-border">
                {branches.map(br => (
                  <div key={br.id}
                    className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,1fr)_80px] items-center px-5 py-4 hover:bg-muted/20 transition-colors group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-xl bg-muted text-foreground flex items-center justify-center shrink-0 group-hover:ring-2 group-hover:ring-primary/30 transition-all">
                        <MapPin className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div>
                        <p className="text-[12px] font-bold text-foreground group-hover:text-primary transition-colors">{br.name}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{br.id}</p>
                      </div>
                    </div>
                    <p className="text-[13px] font-black text-foreground">KES {br.float}</p>
                    <div className="pr-8">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-[10px] text-muted-foreground">Health: {br.health}%</p>
                      </div>
                      <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-500 ${
                          br.health > 70 ? "bg-emerald-500" : br.health > 30 ? "bg-amber-500" : "bg-rose-500"
                        }`} style={{width: `${br.health}%`}} />
                      </div>
                    </div>
                    <p className="text-[11px] font-semibold text-muted-foreground tracking-tight">KES {br.limit}</p>
                    <div className="flex justify-end">
                      <Link href={`/finance/petty-cash/${br.id}`}>
                        <button className="size-7 flex items-center justify-center rounded-lg hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors">
                          <ChevronRight className="size-3.5" />
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Footer */}
          <div className="px-5 py-3 border-t border-border bg-muted/20 flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">
              {tab === "requests" ? "4 active requests pending action" : 
               tab === "locations" ? "4 regional hubs tracked" : "Showing last 20 transactions"}
            </span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="h-7 px-3 text-xs" disabled>Previous</Button>
              <Button size="sm" variant="outline" className="h-7 px-3 text-xs" disabled>Next</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Finance Insights */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 relative overflow-hidden group">
          <div className="absolute -top-6 -right-6 size-24 bg-amber-500/10 blur-2xl rounded-full transition-all group-hover:scale-150" />
          <div className="flex items-start gap-4 relative z-10">
            <div className="size-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <AlertCircle className="size-5" />
            </div>
            <div>
              <p className="text-sm font-black text-foreground">Critical Float Alert</p>
              <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                <strong className="text-foreground">Kisumu Depot</strong> has fallen below the 20% safety threshold. Immediate treasury top-up required to avoid service interruption.
              </p>
              <button className="mt-3 text-[10px] font-bold text-primary flex items-center gap-1 hover:underline uppercase tracking-wider">
                Load float now →
              </button>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 relative overflow-hidden group">
          <div className="absolute -top-6 -right-6 size-24 bg-emerald-500/10 blur-2xl rounded-full transition-all group-hover:scale-150" />
          <div className="flex items-start gap-4 relative z-10">
            <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <p className="text-sm font-black text-foreground">ERPNext Reconciliation</p>
              <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                All petty cash vouchers from May 12 have been successfully synced with <strong className="text-foreground">ERPNext (Treasury Module)</strong>. 0 discrepancies found.
              </p>
              <button className="mt-3 text-[10px] font-bold text-primary flex items-center gap-1 hover:underline uppercase tracking-wider">
                View sync logs →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Icons ──────────────────────────────────────────────────────────────────────
function MapPin({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  );
}
