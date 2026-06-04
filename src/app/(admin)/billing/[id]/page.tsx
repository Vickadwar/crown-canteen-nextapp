"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft, Download, Send, Building2, Calendar,
  FileText, CircleDollarSign, TrendingUp, Utensils,
  MapPin, Phone, Mail, ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const lineItems = [
  { branch: "Nairobi HQ",    normal: 2104, special: 312, normalRate: "250", specialRate: "400", subtotal: "651,800" },
  { branch: "Mombasa Plant", normal: 890,  special: 145, normalRate: "250", specialRate: "400", subtotal: "280,500" },
  { branch: "Kisumu Depot",  normal: 510,  special:  78, normalRate: "250", specialRate: "400", subtotal: "158,700" },
  { branch: "Eldoret Hub",   normal: 320,  special:  43, normalRate: "250", specialRate: "400", subtotal: "97,200"  },
  { branch: "Nakuru Office", normal: 156,  special:  28, normalRate: "250", specialRate: "400", subtotal: "50,200"  },
  { branch: "Thika Plant",   normal:  84,  special:  12, normalRate: "250", specialRate: "400", subtotal: "25,800"  },
];

const activity = [
  { event: "Invoice generated",  date: "May 15, 2026 · 08:00 AM", user: "System",          color: "bg-muted-foreground" },
  { event: "Sent to employer",   date: "May 15, 2026 · 08:05 AM", user: "Auto-dispatch",   color: "bg-blue-500" },
  { event: "Viewed by employer", date: "May 16, 2026 · 10:22 AM", user: "CP Finance Team", color: "bg-primary" },
];

export default function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [activeTab, setActiveTab] = useState<"breakdown" | "activity">("breakdown");

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">

      {/* Back + header */}
      <div>
        <Link href="/billing">
          <button className="flex items-center gap-1.5 text-[11px] font-bold text-primary hover:text-primary/80 transition-colors mb-4 uppercase tracking-[0.15em]">
            <ChevronLeft className="size-3.5" /> Back to billing
          </button>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="size-14 rounded-2xl bg-secondary text-secondary-foreground flex items-center justify-center font-black text-xl shrink-0 shadow-lg">CP</div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-black text-foreground tracking-tight leading-none">Crown Paints Kenya PLC</h1>
                <span className="bg-amber-500/10 text-amber-600 text-[10px] font-bold px-2.5 py-1 rounded-lg">Pending</span>
                <span className="bg-primary/10 text-primary text-[10px] font-bold px-2.5 py-1 rounded-lg">Bi-Weekly</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1.5 flex items-center gap-2">
                <span className="font-bold text-primary">{id}</span>
                <span className="text-border">·</span>
                May 01 – 15, 2026
                <span className="text-border">·</span>
                Due May 22, 2026
              </p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5">
              <Download className="size-3.5" /> Download PDF
            </Button>
            <Button size="sm" className="h-8 text-xs gap-1.5 bg-primary hover:bg-primary/90">
              <Send className="size-3.5" /> Send reminder
            </Button>
          </div>
        </div>
      </div>

      {/* Stat strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Invoice total",      value: "KES 1,240,500", sub: "+4.7% vs prev cycle",  accent: "text-primary",      glow: "border-primary/20" },
          { label: "Total meals billed", value: "4,502",          sub: "Across 6 branches",    accent: "text-accent",       glow: "border-accent/20" },
          { label: "Days overdue",       value: "0",              sub: "Due May 22, 2026",      accent: "text-emerald-500",  glow: "border-emerald-500/20" },
        ].map((s) => (
          <div key={s.label} className={`p-5 rounded-2xl border bg-card relative overflow-hidden group hover:-translate-y-0.5 transition-all ${s.glow}`}>
            <div className={`absolute -top-4 -right-4 size-16 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity ${s.accent.replace("text-","bg-")}`} />
            <p className="text-[10px] text-muted-foreground font-semibold mb-1">{s.label}</p>
            <p className={`text-2xl font-black leading-none ${s.accent}`}>{s.value}</p>
            <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1">
              <TrendingUp className="size-3" /> {s.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-5">

        {/* Left info cards */}
        <div className="flex flex-col gap-4">

          {/* Employer contact */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.18em] mb-4">Employer details</p>
            <div className="space-y-4">
              {[
                { icon: Building2, label: "Company",        value: "Crown Paints Kenya PLC" },
                { icon: Mail,      label: "Billing email",  value: "finance@crownpaints.co.ke" },
                { icon: Phone,     label: "Contact",        value: "+254 720 123 456" },
                { icon: MapPin,    label: "Registered city", value: "Nairobi, Kenya" },
                { icon: Calendar,  label: "Contract start", value: "Jan 01, 2024" },
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

          {/* Invoice summary card */}
          <div className="rounded-2xl border border-border bg-secondary text-secondary-foreground p-5 relative overflow-hidden">
            <div className="absolute -top-6 -right-6 size-24 bg-primary/20 blur-2xl rounded-full" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <FileText className="size-6 text-primary" />
                <CircleDollarSign className="size-4 text-primary" />
              </div>
              <p className="text-sm font-black leading-none mb-1">Invoice summary</p>
              <p className="text-[11px] text-secondary-foreground/50 mb-4 leading-relaxed">ERPNext Sales Invoice · Auto-generated</p>
              <div className="space-y-2">
                {[
                  { label: "Normal meals",   value: "4,064 × KES 250" },
                  { label: "Special meals",  value: "438 × KES 400"   },
                  { label: "Gross total",    value: "KES 1,241,200"   },
                  { label: "Credit applied", value: "– KES 700"       },
                ].map((r) => (
                  <div key={r.label} className="flex justify-between text-[11px]">
                    <span className="text-secondary-foreground/60">{r.label}</span>
                    <span className="font-bold">{r.value}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-white/10 flex justify-between text-[12px]">
                  <span className="font-bold">Net payable</span>
                  <span className="font-black text-primary">KES 1,240,500</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment compliance bars */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.18em] mb-4">Account standing</p>
            <div className="space-y-2">
              {[
                { label: "On-time payment rate", pct: 80 },
                { label: "Credit history score",  pct: 95 },
              ].map((p) => (
                <div key={p.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[11px] font-medium text-foreground">{p.label}</span>
                    <span className="text-[11px] font-bold text-foreground">{p.pct}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div className={`h-full rounded-full ${p.pct >= 90 ? "bg-emerald-500" : "bg-primary/60"}`} style={{ width: `${p.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: breakdown / activity */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* Tab bar */}
          <div className="flex items-center justify-between">
            <div className="flex gap-1 bg-muted/50 p-1 rounded-xl">
              {(["breakdown", "activity"] as const).map((t) => (
                <button key={t} onClick={() => setActiveTab(t)}
                  className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all ${activeTab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                  {t === "breakdown" ? "Branch breakdown" : "Activity log"}
                </button>
              ))}
            </div>
            <button className="text-[11px] font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
              Export <ArrowUpRight className="size-3" />
            </button>
          </div>

          {activeTab === "breakdown" && (
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="grid grid-cols-[minmax(0,1.6fr)_70px_70px_minmax(0,1fr)_100px] px-5 py-3 border-b border-border bg-muted/40">
                {["Branch","Normal","Special","Rates","Subtotal"].map((h) => (
                  <span key={h} className="text-[11px] font-semibold text-muted-foreground">{h}</span>
                ))}
              </div>
              <div className="divide-y divide-border">
                {lineItems.map((row) => (
                  <div key={row.branch} className="grid grid-cols-[minmax(0,1.6fr)_70px_70px_minmax(0,1fr)_100px] items-center px-5 py-4 hover:bg-muted/20 transition-colors group cursor-pointer">
                    <div className="flex items-center gap-2 min-w-0">
                      <MapPin className="size-3 text-muted-foreground shrink-0" />
                      <p className="text-[12px] font-semibold text-foreground truncate group-hover:text-primary transition-colors">{row.branch}</p>
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-foreground">{row.normal.toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground">meals</p>
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-foreground">{row.special}</p>
                      <p className="text-[10px] text-muted-foreground">meals</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground">Normal: KES {row.normalRate}</p>
                      <p className="text-[11px] text-muted-foreground">Special: KES {row.specialRate}</p>
                    </div>
                    <p className="text-[13px] font-bold text-foreground">KES {row.subtotal}</p>
                  </div>
                ))}
              </div>
              <div className="px-5 py-3 border-t border-border bg-muted/20 flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">6 branches · {lineItems.reduce((a,r)=>a+r.normal+r.special,0).toLocaleString()} meals</span>
                <span className="text-[12px] font-black text-foreground">KES 1,264,200 gross</span>
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

          {/* ERPNext nudge */}
          <div className="relative rounded-2xl border border-border bg-card p-5 overflow-hidden">
            <div className="absolute -top-6 -right-6 size-24 bg-primary/10 blur-2xl rounded-full" />
            <div className="relative z-10 flex items-start gap-3">
              <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Utensils className="size-4" />
              </div>
              <div>
                <p className="text-[12px] font-black text-foreground">ERPNext sync status</p>
                <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                  Linked to ERPNext Sales Invoice <span className="font-bold text-primary">SI-2026-00034</span>. Payment receipt will auto-reconcile once confirmed by the employer&apos;s accounts team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
