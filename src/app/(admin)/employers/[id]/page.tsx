"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  MapPin,
  Mail,
  Phone,
  Globe,
  Edit2,
  Download,
  FileText,
  CircleDollarSign,
  Users,
  Building2,
  TrendingUp,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Calendar,
  Banknote,
  ReceiptText,
  Activity,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ── types ─────────────────────────────────────────────────────────────────────

const invoices = [
  { id: "INV-2026-041", date: "May 1, 2026",   due: "May 15, 2026",  amount: "KES 1,248,000", status: "Paid", meals: 4992 },
  { id: "INV-2026-038", date: "Apr 15, 2026",  due: "Apr 29, 2026",  amount: "KES 1,190,500", status: "Paid", meals: 4762 },
  { id: "INV-2026-035", date: "Apr 1, 2026",   due: "Apr 15, 2026",  amount: "KES 1,310,000", status: "Paid", meals: 5240 },
  { id: "INV-2026-031", date: "Mar 15, 2026",  due: "Mar 29, 2026",  amount: "KES 980,000",   status: "Paid", meals: 3920 },
  { id: "INV-2026-028", date: "Mar 1, 2026",   due: "Mar 15, 2026",  amount: "KES 1,050,000", status: "Paid", meals: 4200 },
];

const invoiceStatusStyle: Record<string, string> = {
  Paid:     "bg-emerald-500/10 text-emerald-600",
  Unpaid:   "bg-rose-500/10 text-rose-500",
  Overdue:  "bg-rose-500/10 text-rose-500",
  Draft:    "bg-muted text-muted-foreground",
};

const branches = [
  { name: "Nairobi HQ",    headcount: 450, meals: 1840, utilisation: 92 },
  { name: "Mombasa Plant", headcount: 210, meals: 820,  utilisation: 78 },
  { name: "Kisumu Depot",  headcount: 82,  meals: 310,  utilisation: 65 },
  { name: "Eldoret Hub",   headcount: 100, meals: 390,  utilisation: 74 },
];

// ── page ──────────────────────────────────────────────────────────────────────

export default function EmployerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [activeTab, setActiveTab] = useState<"invoices" | "branches" | "contacts">("invoices");

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">

      {/* ── Back + header ──────────────────────────────────── */}
      <div>
        <Link href="/employers">
          <button className="flex items-center gap-1.5 text-[11px] font-bold text-primary hover:text-primary/80 transition-colors mb-4 uppercase tracking-[0.15em]">
            <ChevronLeft className="size-3.5" /> Back to employers
          </button>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="size-14 rounded-2xl bg-secondary text-secondary-foreground flex items-center justify-center font-black text-xl shrink-0 shadow-lg">
              CP
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-black text-foreground tracking-tight leading-none">Crown Paints Kenya PLC</h1>
                <span className="bg-emerald-500/10 text-emerald-600 text-[10px] font-bold px-2.5 py-1 rounded-lg">Active</span>
                <span className="bg-violet-500/10 text-violet-600 text-[10px] font-bold px-2.5 py-1 rounded-lg">Enterprise</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1.5 flex items-center gap-2 flex-wrap">
                <span className="font-bold text-primary">{id}</span>
                <span className="text-border">·</span>
                <MapPin className="size-3 inline" /> Industrial Area, Nairobi
                <span className="text-border">·</span>
                Manufacturing
              </p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link href={`/employers/${id}/edit`}>
              <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5">
                <Edit2 className="size-3.5" /> Edit
              </Button>
            </Link>
            <Button size="sm" className="h-8 text-xs gap-1.5 bg-primary hover:bg-primary/90">
              <FileText className="size-3.5" /> New invoice
            </Button>
          </div>
        </div>
      </div>

      {/* ── Stat strip ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total headcount",  value: "842",       sub: "+12 this month",      icon: Users,           accent: "text-primary",    glow: "border-primary/15" },
          { label: "Monthly billing",  value: "KES 1.2M",  sub: "Next: May 15, 2026",  icon: CircleDollarSign,accent: "text-accent",     glow: "border-accent/15" },
          { label: "Active branches",  value: "7 hubs",    sub: "Fully integrated",    icon: Building2,       accent: "text-blue-500",   glow: "border-blue-500/15" },
          { label: "Utilisation rate", value: "94.2%",     sub: "Elite tier",          icon: Activity,        accent: "text-violet-500", glow: "border-violet-500/15" },
        ].map((s) => (
          <div key={s.label} className={`relative p-5 rounded-2xl border bg-card overflow-hidden group hover:-translate-y-0.5 transition-all ${s.glow}`}>
            <div className={`absolute -top-4 -right-4 size-16 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity ${s.accent.replace("text-", "bg-")}`} />
            <div className="flex items-start justify-between relative z-10">
              <div className={`size-8 rounded-xl bg-muted flex items-center justify-center ${s.accent}`}>
                <s.icon className="size-4" />
              </div>
            </div>
            <div className="relative z-10 mt-3">
              <p className="text-[10px] text-muted-foreground font-semibold">{s.label}</p>
              <p className={`text-2xl font-black leading-tight mt-0.5 ${s.accent}`}>{s.value}</p>
              <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                <TrendingUp className="size-3" /> {s.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main grid ──────────────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-5">

        {/* ── Left sidebar ── */}
        <div className="flex flex-col gap-4">

          {/* Payment terms */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.18em] mb-4">Payment terms (ERPNext)</p>
            <div className="space-y-4">
              {[
                { icon: Banknote,     label: "Payment schedule", value: "Bi-weekly (Net 14)" },
                { icon: ReceiptText,  label: "Billing mode",     value: "Post-paid — invoice" },
                { icon: CircleDollarSign, label: "Currency",     value: "KES (Kenyan Shilling)" },
                { icon: ShieldCheck,  label: "Credit limit",     value: "KES 2,000,000" },
                { icon: Clock,        label: "Grace period",     value: "5 working days" },
                { icon: Calendar,     label: "Contract renewal", value: "Jan 1, 2027" },
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

          {/* Contacts */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.18em] mb-4">Key contacts</p>
            <div className="space-y-3">
              {[
                { name: "Jane Muthoni",    role: "Finance Manager",  email: "j.muthoni@crownpaints.co.ke", phone: "+254 722 100 200" },
                { name: "Robert Ochieng",  role: "HR Director",      email: "r.ochieng@crownpaints.co.ke", phone: "+254 733 200 300" },
              ].map((c) => (
                <div key={c.name} className="flex items-start gap-3 p-3 rounded-xl bg-muted/40 border border-border">
                  <div className="size-8 rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-[10px] shrink-0">
                    {c.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] font-bold text-foreground">{c.name}</p>
                    <p className="text-[10px] text-muted-foreground">{c.role}</p>
                    <div className="flex flex-col gap-0.5 mt-1.5">
                      <a href={`mailto:${c.email}`} className="text-[10px] text-primary hover:underline flex items-center gap-1">
                        <Mail className="size-2.5" /> {c.email}
                      </a>
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Phone className="size-2.5" /> {c.phone}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.18em] mb-3">Legal documents</p>
            <div className="space-y-2">
              {[
                { name: "SLA Agreement",       type: "PDF", size: "2.4 MB", icon: FileText },
                { name: "Utilisation Audit Q1", type: "XLS", size: "4.1 MB", icon: Activity },
              ].map((d) => (
                <button key={d.name} className="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/30 hover:bg-muted/30 transition-all group text-left">
                  <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <d.icon className="size-3.5" />
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

        {/* ── Right: tabbed panel ── */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* Tab switcher */}
          <div className="flex items-center gap-0.5 p-1 rounded-xl bg-muted/40 border border-border w-fit">
            {([
              { k: "invoices",  label: "Invoice history" },
              { k: "branches",  label: "Branch breakdown" },
            ] as const).map((t) => (
              <button
                key={t.k}
                onClick={() => setActiveTab(t.k)}
                className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all ${activeTab === t.k ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Invoices tab */}
          {activeTab === "invoices" && (
            <div className="rounded-2xl border border-border bg-card overflow-hidden flex flex-col">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h2 className="text-sm font-black text-foreground">Invoice history</h2>
                <button className="text-[11px] font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
                  Download all <ArrowUpRight className="size-3" />
                </button>
              </div>

              {/* Invoice table header */}
              <div className="grid grid-cols-[minmax(0,1fr)_100px_minmax(0,1fr)_minmax(0,1fr)_80px_36px] px-5 py-3 border-b border-border bg-muted/40">
                {["Invoice", "Date", "Amount", "Due date", "Status", ""].map((h) => (
                  <span key={h} className="text-[11px] font-semibold text-muted-foreground">{h}</span>
                ))}
              </div>

              <div className="divide-y divide-border">
                {invoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="grid grid-cols-[minmax(0,1fr)_100px_minmax(0,1fr)_minmax(0,1fr)_80px_36px] items-center px-5 py-4 hover:bg-muted/20 transition-colors group cursor-pointer"
                  >
                    <div>
                      <p className="text-[12px] font-bold text-foreground group-hover:text-primary transition-colors">{inv.id}</p>
                      <p className="text-[10px] text-muted-foreground">{inv.meals.toLocaleString()} meals</p>
                    </div>
                    <span className="text-[11px] text-muted-foreground">{inv.date}</span>
                    <span className="text-[13px] font-bold text-foreground">{inv.amount}</span>
                    <span className="text-[11px] text-muted-foreground">{inv.due}</span>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg leading-none w-fit ${invoiceStatusStyle[inv.status]}`}>
                      {inv.status}
                    </span>
                    <button className="size-7 flex items-center justify-center rounded-lg hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors">
                      <ChevronRight className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Invoice footer pagination */}
              <div className="px-5 py-3 border-t border-border bg-muted/20 flex items-center justify-between shrink-0">
                <span className="text-[11px] text-muted-foreground">Page <span className="font-bold text-foreground">1</span> of 8 · 38 invoices</span>
                <div className="flex items-center gap-1">
                  <button disabled className="h-7 px-3 rounded-lg border border-border bg-card text-[11px] font-semibold text-muted-foreground disabled:opacity-40">← Prev</button>
                  {[1,2,3].map((p) => (
                    <button key={p} className={`size-7 rounded-lg text-[11px] font-bold transition-colors ${p === 1 ? "bg-primary text-primary-foreground" : "border border-border bg-card text-muted-foreground hover:bg-muted"}`}>{p}</button>
                  ))}
                  <span className="text-[11px] text-muted-foreground px-1">…</span>
                  <button className="size-7 rounded-lg border border-border bg-card text-[11px] font-bold text-muted-foreground hover:bg-muted">8</button>
                  <button className="h-7 px-3 rounded-lg border border-border bg-card text-[11px] font-semibold text-muted-foreground hover:bg-muted">Next →</button>
                </div>
              </div>
            </div>
          )}

          {/* Branches tab */}
          {activeTab === "branches" && (
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h2 className="text-sm font-black text-foreground">Branch breakdown</h2>
                <span className="text-[10px] text-muted-foreground">4 active locations</span>
              </div>
              <div className="divide-y divide-border">
                {branches.map((b) => (
                  <div key={b.name} className="flex items-center gap-4 px-5 py-4 hover:bg-muted/20 transition-colors group cursor-pointer">
                    <div className="size-9 rounded-xl bg-muted text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all shrink-0">
                      <MapPin className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-[12px] font-bold text-foreground group-hover:text-primary transition-colors">{b.name}</p>
                        <span className="text-[11px] font-bold text-foreground tabular-nums">{b.utilisation}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${b.utilisation >= 90 ? "bg-amber-500" : "bg-primary/60"}`}
                          style={{ width: `${b.utilisation}%` }}
                        />
                      </div>
                      <div className="flex items-center gap-4 mt-1.5">
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Users className="size-2.5" /> {b.headcount} staff</span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1"><ReceiptText className="size-2.5" /> {b.meals.toLocaleString()} meals/month</span>
                      </div>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Insight card */}
          <div className="relative rounded-2xl border border-border bg-card p-5 overflow-hidden">
            <div className="absolute -top-6 -right-6 size-24 bg-primary/10 blur-2xl rounded-full" />
            <div className="relative z-10 flex items-start gap-3">
              <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <TrendingUp className="size-4" />
              </div>
              <div>
                <p className="text-[12px] font-black text-foreground">Billing intelligence</p>
                <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                  Crown Paints is your highest-value customer with an average on-time payment rate of <strong className="text-foreground">98.6%</strong> over 12 months.
                  Special meal uptake has grown <strong className="text-foreground">22%</strong> since January — consider a dedicated menu tier for their workforce.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
