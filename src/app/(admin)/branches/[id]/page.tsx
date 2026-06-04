"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft, Edit2, Users, Utensils, Globe, Building2,
  TrendingUp, Activity, ShieldCheck, Phone, Mail,
  CheckCircle2, FileText, ArrowUpRight, Box,
  Clock, Map as MapIcon, ChevronRight, Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";

const staff = [
  { id: "EMP-001", name: "John Doe", role: "Head Chef", status: "On Duty", type: "Full-time" },
  { id: "EMP-008", name: "Sarah W.", role: "Kitchen Assistant", status: "On Duty", type: "Full-time" },
  { id: "EMP-012", name: "Kevin M.", role: "Server", status: "Break", type: "Part-time" },
  { id: "EMP-015", name: "Grace O.", role: "Cleaner", status: "Off Duty", type: "Contractor" },
];

export default function BranchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [tab, setTab] = useState<"staff" | "inventory" | "performance">("staff");

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">

      {/* Back + header */}
      <div>
        <Link href="/branches">
          <button className="flex items-center gap-1.5 text-[11px] font-bold text-primary hover:text-primary/80 transition-colors mb-4 uppercase tracking-[0.15em]">
            <ChevronLeft className="size-3.5" /> Back to branches
          </button>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 ring-1 ring-primary/20 shadow-sm">
              <Building2 className="size-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-black text-foreground tracking-tight leading-none">Nairobi HQ</h1>
                <span className="bg-emerald-500/10 text-emerald-600 text-[10px] font-bold px-2.5 py-1 rounded-lg">Active</span>
                <span className="bg-blue-500/10 text-blue-600 text-[10px] font-bold px-2.5 py-1 rounded-lg">Primary Hub</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1.5 flex items-center gap-2 flex-wrap">
                <span className="font-bold text-primary uppercase tracking-widest">{id}</span>
                <span className="text-border">·</span>
                Industrial Area, Enterprise Rd
                <span className="text-border">·</span>
                Region: Nairobi
              </p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link href={`/branches/${id}/edit`}>
              <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5"><Edit2 className="size-3.5" /> Edit hub settings</Button>
            </Link>
            <Button size="sm" className="h-8 text-xs gap-1.5 bg-primary hover:bg-primary/90 shadow-md shadow-primary/20">
              <Activity className="size-3.5" /> Operations dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Stat strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Daily capacity",   value: "1,200",   sub: "Meals per day", icon: Utensils,  accent: "text-primary",    glow: "border-primary/15" },
          { label: "Active staff",    value: "12",      sub: "8 on duty now", icon: Users,     accent: "text-blue-500",   glow: "border-blue-500/15" },
          { label: "Compliance",      value: "98.4%",   sub: "Safety audit passed", icon: ShieldCheck, accent: "text-emerald-600",glow: "border-emerald-500/15" },
          { label: "Month growth",    value: "+12.5%",  sub: "vs previous month", icon: TrendingUp,  accent: "text-violet-500", glow: "border-violet-500/15" },
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

          {/* Location Details */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.18em] mb-4">Location specs</p>
            <div className="space-y-3.5">
              {[
                { icon: MapIcon,   label: "Address",      value: "Plot 12, Enterprise Rd" },
                { icon: Globe,     label: "City / Region", value: "Nairobi, Embakasi" },
                { icon: Clock,     label: "Service Hours", value: "06:00 AM - 08:00 PM" },
                { icon: ShieldCheck,label: "Security Level",value: "High (Biometric)" },
                { icon: Phone,     label: "Primary Phone", value: "+254 20 123 4567" },
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

          {/* Management Info */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.18em] mb-4">Hub Management</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 mb-4">
                <div className="size-10 rounded-xl bg-secondary text-secondary-foreground flex items-center justify-center font-black text-xs">SM</div>
                <div className="min-w-0">
                  <p className="text-[12px] font-bold text-foreground truncate">Samuel Mandela</p>
                  <p className="text-[10px] text-muted-foreground">General Manager · HQ</p>
                </div>
                <button className="ml-auto size-7 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground transition-colors">
                  <Mail className="size-3.5" />
                </button>
              </div>
              <div className="h-px bg-border my-3" />
              {[
                { label: "Assigned Staff", value: "12 members" },
                { label: "Budget Limit",   value: "KES 450k / mo" },
                { label: "Last Audit",     value: "May 02, 2026" },
              ].map(t => (
                <div key={t.label} className="flex items-center justify-between">
                  <p className="text-[11px] text-muted-foreground">{t.label}</p>
                  <p className="text-[11px] font-semibold text-foreground">{t.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Operational Health */}
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.18em]">Operational Health</p>
              <CheckCircle2 className="size-3.5 text-emerald-500" />
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">
              All critical kitchen equipment is operational. Water and power backup systems have been tested and verified.
            </p>
            <button className="w-full flex items-center justify-center gap-2 h-8 rounded-xl bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700 transition-colors shadow-sm">
              <FileText className="size-3.5" /> Download weekly report
            </button>
          </div>
        </div>

        {/* Right: tabbed panel */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* Tabs */}
          <div className="flex items-center gap-0.5 p-1 rounded-xl bg-muted/40 border border-border w-fit">
            {([
              { k: "staff",       label: "Assigned Staff" },
              { k: "inventory",   label: "Asset inventory" },
              { k: "performance", label: "Performance" },
            ] as const).map(t => (
              <button key={t.k} onClick={() => setTab(t.k)}
                className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all ${tab === t.k ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Staff Tab */}
          {tab === "staff" && (
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h2 className="text-sm font-black text-foreground">Active staff members</h2>
                <button className="text-[11px] font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
                  Manage roster <Users className="size-3" />
                </button>
              </div>
              <div className="grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_100px_100px_40px] px-5 py-3 border-b border-border bg-muted/40">
                {["Name & ID","Role","Type","Status",""].map(h => (
                  <span key={h} className="text-[11px] font-semibold text-muted-foreground">{h}</span>
                ))}
              </div>
              <div className="divide-y divide-border">
                {staff.map(s => (
                  <div key={s.id}
                    className="grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_100px_100px_40px] items-center px-5 py-4 hover:bg-muted/20 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-muted flex items-center justify-center font-black text-[10px] text-secondary">{s.name[0]}</div>
                      <div>
                        <p className="text-[12px] font-bold text-foreground group-hover:text-primary transition-colors">{s.name}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.id}</p>
                      </div>
                    </div>
                    <p className="text-[11px] text-foreground font-medium">{s.role}</p>
                    <p className="text-[11px] text-muted-foreground">{s.type}</p>
                    <div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1.5 w-fit ${
                        s.status === "On Duty" ? "bg-emerald-500/10 text-emerald-600" : 
                        s.status === "Break" ? "bg-amber-500/10 text-amber-600" : "bg-muted text-muted-foreground"
                      }`}>
                        <span className={`size-1.5 rounded-full ${s.status === "On Duty" ? "bg-emerald-500" : s.status === "Break" ? "bg-amber-500" : "bg-muted-foreground"}`} />
                        {s.status}
                      </span>
                    </div>
                    <div className="flex justify-end">
                      <button className="size-7 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground transition-colors">
                        <ChevronRight className="size-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-5 py-3 border-t border-border bg-muted/20 flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">Showing 4 of 12 assigned staff</span>
                <button className="text-[11px] font-bold text-primary hover:underline">View full directory →</button>
              </div>
            </div>
          )}

          {/* Inventory Tab (Mock) */}
          {tab === "inventory" && (
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
               <div className="px-5 py-12 flex flex-col items-center justify-center text-center">
                  <div className="size-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-4">
                    <Box className="size-6" />
                  </div>
                  <h3 className="text-sm font-black text-foreground">Asset & equipment inventory</h3>
                  <p className="text-[11px] text-muted-foreground mt-1 max-w-[280px]">
                    Track kitchen equipment, POS terminals, and branch assets registered at this location.
                  </p>
                  <Button size="sm" className="h-8 mt-5 gap-1.5 text-xs bg-primary hover:bg-primary/90 shadow-md shadow-primary/20">
                    <Plus className="size-3.5" /> Register asset
                  </Button>
               </div>
            </div>
          )}

          {/* Performance Tab (Mock) */}
          {tab === "performance" && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-black text-foreground">Hub throughput trends</h3>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-semibold">
                  <span className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-primary" /> Meals served</span>
                  <span className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-muted" /> Capacity</span>
                </div>
              </div>
              <div className="h-40 flex items-end gap-2.5 mb-6">
                {[75, 85, 60, 95, 80, 70, 90].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer relative">
                    <div className="w-full bg-muted rounded-t-xl h-full absolute bottom-0 -z-0 opacity-20" />
                    <div className="w-full bg-primary/20 rounded-t-xl relative z-10 transition-all group-hover:bg-primary/30" style={{height: `${h}%`}}>
                       <div className="absolute inset-x-0 bottom-0 bg-primary rounded-t-xl h-[80%] group-hover:h-full transition-all" />
                       <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] font-black px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                         {(h*12).toFixed(0)}
                       </div>
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2">Day {i+1}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-border bg-muted/20">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Peak Time</p>
                  <p className="text-sm font-black text-foreground flex items-center gap-2">
                    <Clock className="size-3.5 text-primary" /> 12:45 PM - 1:30 PM
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-muted/20">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Avg Service Time</p>
                  <p className="text-sm font-black text-foreground flex items-center gap-2">
                    <TrendingUp className="size-3.5 text-emerald-500" /> 2.4 Mins / Meal
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Regional alert */}
          <div className="relative rounded-2xl border border-border bg-card p-5 overflow-hidden group">
            <div className="absolute -top-6 -right-6 size-24 bg-primary/10 blur-2xl rounded-full transition-all group-hover:scale-150" />
            <div className="relative z-10 flex items-start gap-3">
              <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Globe className="size-4" />
              </div>
              <div>
                <p className="text-[12px] font-black text-foreground mb-1">Regional Network Update</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  This hub acts as the <strong className="text-foreground">Logistics Primary</strong> for the Nairobi region. All inter-branch transfers are routed through this location.
                </p>
                <button className="mt-3 text-[10px] font-bold text-primary flex items-center gap-1 hover:underline uppercase tracking-wider">
                  View routing map <ArrowUpRight className="size-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
