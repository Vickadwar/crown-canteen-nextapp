"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft, ChevronRight, Edit2, Download, Star,
  Package, Clock, Truck, MapPin, Mail, Phone, Globe,
  ArrowUpRight, CheckCircle2, AlertCircle, TrendingUp,
  ExternalLink, ShieldCheck, RefreshCw, FileText, Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const deliveries = [
  { id: "DEL-2026-088", date: "May 13, 2026", items: "Tomatoes, Onions, Kale", weight: "142 kg", amount: "KES 28,400", status: "Received", quality: 99 },
  { id: "DEL-2026-085", date: "May 12, 2026", items: "Capsicum, Spinach",       weight: "86 kg",  amount: "KES 18,200", status: "Received", quality: 97 },
  { id: "DEL-2026-081", date: "May 11, 2026", items: "Mixed Vegetables",        weight: "198 kg", amount: "KES 38,600", status: "Received", quality: 100 },
  { id: "DEL-2026-077", date: "May 10, 2026", items: "Coriander, Leeks",        weight: "62 kg",  amount: "KES 14,900", status: "Received", quality: 96 },
  { id: "DEL-2026-073", date: "May  9, 2026", items: "Onions, Garlic",          weight: "110 kg", amount: "KES 22,300", status: "Partial",  quality: 88 },
];

const statusStyle: Record<string, string> = {
  Received: "bg-emerald-500/10 text-emerald-600",
  Partial:  "bg-amber-500/10 text-amber-600",
  Rejected: "bg-rose-500/10 text-rose-500",
};

export default function SupplierDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [tab, setTab] = useState<"deliveries" | "catalogue" | "portal">("deliveries");

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">

      {/* Back + header */}
      <div>
        <Link href="/suppliers">
          <button className="flex items-center gap-1.5 text-[11px] font-bold text-primary hover:text-primary/80 transition-colors mb-4 uppercase tracking-[0.15em]">
            <ChevronLeft className="size-3.5" /> Back to suppliers
          </button>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="size-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black text-xl shrink-0 ring-1 ring-emerald-500/20">FP</div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-black text-foreground tracking-tight leading-none">Fresh Produce Ltd</h1>
                <span className="bg-emerald-500/10 text-emerald-600 text-[10px] font-bold px-2.5 py-1 rounded-lg">Verified</span>
                <span className="bg-emerald-500/10 text-emerald-600 text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <ExternalLink className="size-3" /> Portal active
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1.5 flex items-center gap-2 flex-wrap">
                <span className="font-bold text-primary">{id}</span>
                <span className="text-border">·</span>
                <MapPin className="size-3 inline" /> Nairobi
                <span className="text-border">·</span>
                Vegetables & Fruits
              </p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link href={`/suppliers/${id}/edit`}>
              <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5"><Edit2 className="size-3.5" /> Edit</Button>
            </Link>
            <Button size="sm" className="h-8 text-xs gap-1.5 bg-primary hover:bg-primary/90">
              <Package className="size-3.5" /> New order
            </Button>
          </div>
        </div>
      </div>

      {/* Stat strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Monthly spend",    value: "KES 480k", sub: "+12% vs last month", icon: Package,   accent: "text-primary",    glow: "border-primary/15" },
          { label: "Quality score",    value: "98%",      sub: "Top 5% of suppliers", icon: Star,      accent: "text-emerald-600",glow: "border-emerald-500/15" },
          { label: "On-time rate",     value: "99%",      sub: "28 deliveries",       icon: Clock,     accent: "text-blue-500",   glow: "border-blue-500/15" },
          { label: "Active products",  value: "34 SKUs",  sub: "2 seasonal adds",     icon: Truck,     accent: "text-violet-500", glow: "border-violet-500/15" },
        ].map(s => (
          <div key={s.label} className={`relative p-5 rounded-2xl border bg-card overflow-hidden group hover:-translate-y-0.5 transition-all ${s.glow}`}>
            <div className={`absolute -top-4 -right-4 size-16 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity ${s.accent.replace("text-","bg-")}`} />
            <div className="relative z-10 flex items-start justify-between">
              <div className={`size-8 rounded-xl bg-muted flex items-center justify-center ${s.accent}`}><s.icon className="size-4" /></div>
            </div>
            <div className="relative z-10 mt-3">
              <p className="text-[10px] text-muted-foreground font-semibold">{s.label}</p>
              <p className={`text-2xl font-black leading-tight mt-0.5 ${s.accent}`}>{s.value}</p>
              <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1"><TrendingUp className="size-3" />{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-5">

        {/* Left sidebar */}
        <div className="flex flex-col gap-4">

          {/* Contact */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.18em] mb-4">Contact & details</p>
            <div className="space-y-3.5">
              {[
                { icon: Mail,  label: "Primary email",    value: "info@freshproduce.co.ke" },
                { icon: Phone, label: "Phone",            value: "+254 712 345 678" },
                { icon: Globe, label: "Website",          value: "freshproduce.co.ke" },
                { icon: MapPin,label: "Address",          value: "Wakulima Market, Nairobi" },
                { icon: Clock, label: "Delivery window",  value: "5:00 AM – 8:00 AM daily" },
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

          {/* Payment terms */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.18em] mb-4">Payment terms</p>
            <div className="space-y-3">
              {[
                { label: "Payment method",  value: "EFT — bank transfer" },
                { label: "Payment cycle",   value: "Weekly (every Friday)" },
                { label: "Currency",        value: "KES" },
                { label: "Credit period",   value: "7 days" },
                { label: "Contract end",    value: "Dec 31, 2026" },
              ].map(t => (
                <div key={t.label} className="flex items-center justify-between">
                  <p className="text-[11px] text-muted-foreground">{t.label}</p>
                  <p className="text-[11px] font-semibold text-foreground">{t.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Supplier portal */}
          <div className="relative rounded-2xl border border-primary/20 bg-primary/5 p-5 overflow-hidden">
            <div className="absolute -top-4 -right-4 size-20 bg-primary/20 blur-2xl rounded-full" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-bold text-primary uppercase tracking-[0.18em]">Supplier portal</p>
                <span className="bg-emerald-500/10 text-emerald-600 text-[9px] font-bold px-2 py-0.5 rounded-lg">Active</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">
                Fresh Produce Ltd has access to the supplier portal. They can view purchase orders, submit invoices, and track payments.
              </p>
              <button className="w-full flex items-center justify-center gap-2 h-8 rounded-xl bg-primary text-primary-foreground text-[11px] font-bold hover:bg-primary/90 transition-colors">
                <ExternalLink className="size-3.5" /> Open portal view
              </button>
            </div>
          </div>

          {/* Documents */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.18em] mb-3">Documents</p>
            <div className="space-y-2">
              {[
                { name: "Supply Agreement", type: "PDF", size: "1.8 MB" },
                { name: "Q1 Quality Audit", type: "PDF", size: "2.2 MB" },
              ].map(d => (
                <button key={d.name} className="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/30 hover:bg-muted/30 transition-all group text-left">
                  <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <FileText className="size-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-foreground group-hover:text-primary transition-colors truncate">{d.name}</p>
                    <p className="text-[10px] text-muted-foreground">{d.type} · {d.size}</p>
                  </div>
                  <Download className="size-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: tabbed panel */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* Tabs */}
          <div className="flex items-center gap-0.5 p-1 rounded-xl bg-muted/40 border border-border w-fit">
            {([
              { k: "deliveries", label: "Delivery history" },
              { k: "catalogue",  label: "Product catalogue" },
              { k: "portal",     label: "Portal activity" },
            ] as const).map(t => (
              <button key={t.k} onClick={() => setTab(t.k)}
                className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all ${tab === t.k ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Deliveries tab */}
          {tab === "deliveries" && (
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h2 className="text-sm font-black text-foreground">Delivery history</h2>
                <button className="text-[11px] font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
                  Download all <ArrowUpRight className="size-3" />
                </button>
              </div>
              <div className="grid grid-cols-[minmax(0,1fr)_90px_minmax(0,1.2fr)_minmax(0,1fr)_80px_60px] px-5 py-3 border-b border-border bg-muted/40">
                {["Delivery","Date","Items","Amount","Status","QA"].map(h => (
                  <span key={h} className="text-[11px] font-semibold text-muted-foreground">{h}</span>
                ))}
              </div>
              <div className="divide-y divide-border">
                {deliveries.map(d => (
                  <div key={d.id}
                    className="grid grid-cols-[minmax(0,1fr)_90px_minmax(0,1.2fr)_minmax(0,1fr)_80px_60px] items-center px-5 py-4 hover:bg-muted/20 transition-colors group cursor-pointer">
                    <div>
                      <p className="text-[12px] font-bold text-foreground group-hover:text-primary transition-colors">{d.id}</p>
                      <p className="text-[10px] text-muted-foreground">{d.weight}</p>
                    </div>
                    <span className="text-[11px] text-muted-foreground">{d.date}</span>
                    <p className="text-[11px] text-foreground truncate pr-2">{d.items}</p>
                    <span className="text-[13px] font-bold text-foreground">{d.amount}</span>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg leading-none w-fit ${statusStyle[d.status]}`}>{d.status}</span>
                    <div className="flex items-center gap-1">
                      {d.quality >= 95 ? <CheckCircle2 className="size-3.5 text-emerald-500" /> : <AlertCircle className="size-3.5 text-amber-500" />}
                      <span className="text-[10px] font-bold text-muted-foreground">{d.quality}%</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-5 py-3 border-t border-border bg-muted/20 flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">Page <span className="font-bold text-foreground">1</span> of 6 · 28 deliveries</span>
                <div className="flex items-center gap-1">
                  <button disabled className="h-7 px-3 rounded-lg border border-border bg-card text-[11px] font-semibold text-muted-foreground disabled:opacity-40">← Prev</button>
                  {[1,2,3].map(p => (
                    <button key={p} className={`size-7 rounded-lg text-[11px] font-bold transition-colors ${p === 1 ? "bg-primary text-primary-foreground" : "border border-border bg-card text-muted-foreground hover:bg-muted"}`}>{p}</button>
                  ))}
                  <span className="text-[11px] text-muted-foreground px-1">…</span>
                  <button className="size-7 rounded-lg border border-border bg-card text-[11px] font-bold text-muted-foreground hover:bg-muted">6</button>
                  <button className="h-7 px-3 rounded-lg border border-border bg-card text-[11px] font-semibold text-muted-foreground hover:bg-muted">Next →</button>
                </div>
              </div>
            </div>
          )}

          {/* Catalogue tab */}
          {tab === "catalogue" && (
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h2 className="text-sm font-black text-foreground">Product catalogue</h2>
                <span className="text-[10px] text-muted-foreground">34 active SKUs</span>
              </div>
              <div className="divide-y divide-border">
                {[
                  { name: "Tomatoes (Crate 10kg)",  unit: "KES 850/crate",  weekly: "8 crates", seasonal: false },
                  { name: "Red Onions (Bag 25kg)",  unit: "KES 1,200/bag",  weekly: "4 bags",   seasonal: false },
                  { name: "Kale / Sukuma Wiki",      unit: "KES 30/bunch",   weekly: "60 bunches", seasonal: false },
                  { name: "Capsicum (Mixed)",        unit: "KES 180/kg",    weekly: "12 kg",    seasonal: true },
                  { name: "Baby Spinach (250g)",     unit: "KES 65/pack",   weekly: "40 packs", seasonal: true },
                ].map(p => (
                  <div key={p.name} className="flex items-center gap-4 px-5 py-4 hover:bg-muted/20 transition-colors group">
                    <div className="size-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                      <Package className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-[12px] font-bold text-foreground">{p.name}</p>
                        {p.seasonal && <span className="bg-amber-500/10 text-amber-600 text-[9px] font-bold px-2 py-0.5 rounded-lg">Seasonal</span>}
                      </div>
                      <p className="text-[10px] text-muted-foreground">Avg. weekly: {p.weekly}</p>
                    </div>
                    <p className="text-[12px] font-bold text-foreground shrink-0">{p.unit}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Portal activity tab */}
          {tab === "portal" && (
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h2 className="text-sm font-black text-foreground">Portal activity log</h2>
                <span className="text-[10px] text-muted-foreground">Last 30 days</span>
              </div>
              <div className="divide-y divide-border">
                {[
                  { action: "Invoice submitted",       detail: "INV-FP-2026-041 · KES 28,400",  time: "Today, 8:14 AM",      icon: FileText,  c: "text-primary" },
                  { action: "PO acknowledged",          detail: "PO-2026-088 confirmed",          time: "Today, 7:02 AM",      icon: CheckCircle2,c: "text-emerald-600" },
                  { action: "Delivery note uploaded",   detail: "DEL-2026-088 · 142 kg",         time: "Today, 6:55 AM",      icon: Truck,     c: "text-blue-500" },
                  { action: "Quality report viewed",    detail: "Q1 2026 Audit PDF",             time: "Yesterday, 3:30 PM",  icon: Activity,  c: "text-violet-500" },
                  { action: "Payment confirmed",        detail: "KES 480k — May invoice",        time: "May 10, 2:00 PM",     icon: ShieldCheck,c: "text-emerald-600" },
                ].map((a, i) => (
                  <div key={i} className="flex items-start gap-3 px-5 py-4 hover:bg-muted/20 transition-colors">
                    <div className={`size-8 rounded-xl bg-muted flex items-center justify-center shrink-0 ${a.c}`}>
                      <a.icon className="size-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-foreground">{a.action}</p>
                      <p className="text-[10px] text-muted-foreground">{a.detail}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0">{a.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Performance insight */}
          <div className="relative rounded-2xl border border-border bg-card p-5 overflow-hidden">
            <div className="absolute -top-6 -right-6 size-24 bg-emerald-500/10 blur-2xl rounded-full" />
            <div className="relative z-10 flex items-start gap-3">
              <div className="size-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                <TrendingUp className="size-4" />
              </div>
              <div>
                <p className="text-[12px] font-black text-foreground">Supplier intelligence</p>
                <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                  Fresh Produce Ltd maintains a <strong className="text-foreground">98% quality score</strong> — the highest in the vegetable category.
                  Seasonal capsicum availability ends June 30. Recommend sourcing buffer stock or qualifying an alternate supplier.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
