"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search, MapPin, Plus, Download, SlidersHorizontal,
  ChevronRight, Users, Utensils, Globe, Building2,
  Activity, ShieldCheck, History
} from "lucide-react";
import { Button } from "@/components/ui/button";

const statusStyle: Record<string, string> = {
  "Active":      "bg-emerald-500/10 text-emerald-600",
  "Maintenance": "bg-amber-500/10 text-amber-600",
  "Inactive":    "bg-rose-500/10 text-rose-500",
};

const branches = [
  { id: "BR-NBO", name: "Nairobi HQ",     location: "Industrial Area", region: "Nairobi", staff: 12, capacity: "1200", status: "Active",      manager: "Samuel M.", since: "Jan 2024" },
  { id: "BR-MSA", name: "Mombasa Plant",  location: "Shimanzi",        region: "Coastal", staff: 8,  capacity: "800",  status: "Active",      manager: "Jane K.",   since: "Feb 2024" },
  { id: "BR-KSM", name: "Kisumu Depot",   location: "Obunga",          region: "Western", staff: 5,  capacity: "400",  status: "Active",      manager: "Peter O.",  since: "Mar 2024" },
  { id: "BR-ELD", name: "Eldoret Hub",    location: "Kipkenyo",        region: "Rift Valley", staff: 4, capacity: "300", status: "Maintenance", manager: "Alice M.",  since: "Apr 2024" },
];

const stats = [
  { label: "Total Branches",    value: "4",       icon: Building2, accent: "text-primary" },
  { label: "Active Locations",  value: "3",       icon: ShieldCheck, accent: "text-emerald-500" },
  { label: "Regional Staff",    value: "29",      icon: Users,     accent: "text-blue-500" },
  { label: "Total Capacity",    value: "2.7k",    icon: Utensils,  accent: "text-amber-500" },
];

export default function BranchesPage() {
  const [search, setSearch] = useState("");
  const filtered = branches.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.id.toLowerCase().includes(search.toLowerCase()) ||
    b.location.toLowerCase().includes(search.toLowerCase()) ||
    b.region.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] mb-1">Operational Network</p>
          <h1 className="text-2xl font-black text-foreground tracking-tight leading-none">Branches</h1>
          <p className="text-sm text-muted-foreground mt-1.5">Regional operational hubs and location settings.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs">
            <Download className="size-3.5" /> Export
          </Button>
          <Link href="/branches/new">
            <Button size="sm" className="h-8 gap-1.5 text-xs bg-primary hover:bg-primary/90 shadow-md shadow-primary/20">
              <Plus className="size-3.5" /> Add branch hub
            </Button>
          </Link>
        </div>
      </div>

      {/* Stat strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-card hover:border-primary/20 transition-colors cursor-default">
            <div className={`size-8 rounded-xl bg-muted flex items-center justify-center ${s.accent} shrink-0`}>
              <s.icon className="size-4" />
            </div>
            <div>
              <p className="text-lg font-black text-foreground leading-none">{s.value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Action bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by branch name, ID or region…"
            className="w-full h-9 pl-9 pr-4 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
        </div>
        <Button size="sm" variant="outline" className="h-9 gap-1.5 text-xs shrink-0">
          <SlidersHorizontal className="size-3.5" /> Filter
        </Button>
        <Button size="sm" variant="outline" className="h-9 gap-1.5 text-xs shrink-0 px-3">
          <History className="size-3.5" /> <span className="hidden sm:inline">Audit log</span>
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_100px_80px] px-5 py-3 border-b border-border bg-muted/40">
          {["Branch Name","Location & Region","Manager","Staff","Capacity","Status",""].map(h => (
            <span key={h} className="text-[11px] font-semibold text-muted-foreground">{h}</span>
          ))}
        </div>
        {/* Table body */}
        <div className="divide-y divide-border">
          {filtered.map(br => (
            <div key={br.id}
              className="grid grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_100px_80px] items-center px-5 py-4 hover:bg-muted/20 transition-colors group cursor-pointer">
              {/* Branch */}
              <div className="flex items-center gap-3 min-w-0 pr-3">
                <div className="size-9 rounded-xl bg-muted text-foreground flex items-center justify-center shrink-0 group-hover:ring-2 group-hover:ring-primary/30 transition-all">
                  <MapPin className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-bold text-foreground truncate group-hover:text-primary transition-colors">{br.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate uppercase tracking-widest">{br.id}</p>
                </div>
              </div>
              {/* Location */}
              <div>
                <p className="text-[12px] font-semibold text-foreground truncate">{br.location}</p>
                <p className="text-[10px] text-muted-foreground truncate flex items-center gap-1">
                  <Globe className="size-2.5" /> {br.region}
                </p>
              </div>
              {/* Manager */}
              <div className="flex items-center gap-2">
                <div className="size-6 rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center font-black text-[9px] shrink-0">{br.manager[0]}</div>
                <span className="text-[11px] font-medium text-foreground truncate">{br.manager}</span>
              </div>
              {/* Staff */}
              <div className="flex items-center gap-2">
                <Users className="size-3.5 text-muted-foreground" />
                <span className="text-[11px] font-bold text-foreground">{br.staff}</span>
              </div>
              {/* Capacity */}
              <div className="flex items-center gap-2">
                <Utensils className="size-3.5 text-muted-foreground" />
                <span className="text-[11px] font-bold text-foreground">{br.capacity}<span className="text-[9px] text-muted-foreground font-normal ml-0.5">/day</span></span>
              </div>
              {/* Status */}
              <div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg leading-none flex items-center gap-1.5 w-fit ${statusStyle[br.status]}`}>
                  <span className={`size-1.5 rounded-full ${
                    br.status === "Active" ? "bg-emerald-500" : 
                    br.status === "Maintenance" ? "bg-amber-500" : "bg-rose-500"
                  }`} />
                  {br.status}
                </span>
              </div>
              {/* Actions */}
              <div className="flex justify-end">
                <Link href={`/branches/${br.id}`}>
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
          <span className="text-[11px] text-muted-foreground">Showing {filtered.length} of 4 hubs</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="h-7 px-3 text-xs" disabled>Previous</Button>
            <Button size="sm" variant="outline" className="h-7 px-3 text-xs" disabled>Next</Button>
          </div>
        </div>
      </div>

      {/* Network Insights */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 relative overflow-hidden group">
          <div className="absolute -top-6 -right-6 size-24 bg-primary/10 blur-2xl rounded-full transition-all group-hover:scale-150" />
          <div className="flex items-start gap-4 relative z-10">
            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Activity className="size-5" />
            </div>
            <div>
              <p className="text-sm font-black text-foreground">Operational Efficiency</p>
              <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                Network-wide capacity utilization is at <strong className="text-foreground">84.2%</strong>. Nairobi HQ is approaching peak load; consider scaling service windows.
              </p>
              <button className="mt-3 text-[10px] font-bold text-primary flex items-center gap-1 hover:underline uppercase tracking-wider">
                Network analytics →
              </button>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 relative overflow-hidden group">
          <div className="absolute -top-6 -right-6 size-24 bg-amber-500/10 blur-2xl rounded-full transition-all group-hover:scale-150" />
          <div className="flex items-start gap-4 relative z-10">
            <div className="size-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <History className="size-5" />
            </div>
            <div>
              <p className="text-sm font-black text-foreground">Upcoming Maintenance</p>
              <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                <strong className="text-foreground">Eldoret Hub</strong> is scheduled for kitchen equipment audit on <strong className="text-foreground">May 15</strong>. Temporary service reduction expected.
              </p>
              <button className="mt-3 text-[10px] font-bold text-primary flex items-center gap-1 hover:underline uppercase tracking-wider">
                Maintenance schedule →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
