"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search, Package, Plus, Download, SlidersHorizontal,
  ChevronRight, AlertTriangle, TrendingDown, ShoppingCart,
  ArrowUpRight, Clock, Box, ShieldCheck, History, Filter,
  FileText, ClipboardList, BadgeCheck, Truck, DollarSign,
  User, Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";

const procurementStats = [
  { label: "Active Requisitions", value: "12",      icon: ClipboardList, accent: "text-primary" },
  { label: "Pending Quotations",  value: "8",       icon: FileText,      accent: "text-amber-500" },
  { label: "Approved LPOs",      value: "5",       icon: BadgeCheck,    accent: "text-emerald-500" },
  { label: "Monthly Spend",      value: "1.2M",    icon: DollarSign,    accent: "text-blue-500" },
];

const activeTasks = [
  { id: "PR-2026-042", type: "Requisition", title: "Monthly Dry Goods Restock", status: "Pending Approval", date: "Today, 10:00 AM", priority: "High" },
  { id: "RFQ-2026-015", type: "Quotation",   title: "Fresh Produce Vendor Survey", status: "In Progress",     date: "Yesterday",      priority: "Normal" },
  { id: "PO-2026-088", type: "Purchase Order", title: "Industrial Kitchen Equipment", status: "Awaiting Delivery", date: "May 12, 2026",    priority: "High" },
];

export default function ProcurementDashboard() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] mb-1">Supply Chain Management</p>
          <h1 className="text-2xl font-black text-foreground tracking-tight leading-none">Procurement Control</h1>
          <p className="text-sm text-muted-foreground mt-1.5 font-medium">Requisitions, supplier quotations, and purchase order lifecycles.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/procurement/requisition/new">
            <Button size="sm" className="h-8 gap-1.5 text-xs bg-primary hover:bg-primary/90 shadow-md shadow-primary/20">
              <Plus className="size-3.5" /> Create requisition
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {procurementStats.map((s) => (
          <div key={s.label} className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-card hover:border-primary/20 transition-colors cursor-default">
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

      <div className="grid lg:grid-cols-3 gap-6">
         
         {/* Left: Active Pipeline */}
         <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
               <div className="px-5 py-4 border-b border-border bg-muted/40 flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-widest text-foreground">Recent Activity</h3>
                  <div className="flex gap-1">
                     {["all", "requisition", "quotation", "po"].map(t => (
                        <button 
                           key={t} onClick={() => setActiveTab(t)}
                           className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all ${activeTab === t ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"}`}
                        >
                           {t}
                        </button>
                     ))}
                  </div>
               </div>
               <div className="divide-y divide-border">
                  {activeTasks.filter(t => activeTab === "all" || t.type.toLowerCase().includes(activeTab)).map(task => (
                     <div key={task.id} className="flex items-center gap-4 px-5 py-4 hover:bg-muted/10 transition-colors group">
                        <div className={`size-9 rounded-xl flex items-center justify-center shrink-0
                           ${task.type === "Requisition" ? "bg-amber-500/10 text-amber-600" : task.type === "Quotation" ? "bg-blue-500/10 text-blue-600" : "bg-emerald-500/10 text-emerald-600"}`}>
                           {task.type === "Requisition" ? <ClipboardList className="size-4" /> : task.type === "Quotation" ? <FileText className="size-4" /> : <Truck className="size-4" />}
                        </div>
                        <div className="min-w-0 flex-1">
                           <div className="flex items-center gap-2 mb-0.5">
                              <p className="text-[12px] font-bold text-foreground group-hover:text-primary transition-colors">{task.title}</p>
                              <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest ${task.priority === 'High' ? 'bg-rose-500/10 text-rose-500' : 'bg-muted text-muted-foreground'}`}>{task.priority}</span>
                           </div>
                           <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">{task.id} · {task.date}</p>
                        </div>
                        <div className="text-right pr-4">
                           <p className="text-[10px] font-black text-foreground uppercase tracking-widest">{task.status}</p>
                        </div>
                        <Link href={`/procurement/${task.type.toLowerCase()}/${task.id}`}>
                           <button className="size-7 flex items-center justify-center rounded-lg hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors">
                              <ChevronRight className="size-3.5" />
                           </button>
                        </Link>
                     </div>
                  ))}
               </div>
               <div className="px-5 py-3 border-t border-border bg-muted/20 text-center">
                  <button className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:underline">View full procurement log</button>
               </div>
            </div>

            {/* Quick Actions Card */}
            <div className="grid sm:grid-cols-3 gap-4">
               {[
                 { label: "Supplier Portal", icon: User, href: "/suppliers", sub: "Manage vendors" },
                 { label: "Price List", icon: Tag, href: "/inventory", sub: "Market rates" },
                 { label: "Audit Logs", icon: History, href: "/procurement/history", sub: "Approval trail" },
               ].map(a => (
                 <Link href={a.href} key={a.label} className="p-4 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all group">
                    <div className="size-8 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors mb-3">
                       <a.icon className="size-4" />
                    </div>
                    <p className="text-[11px] font-black text-foreground uppercase tracking-tight">{a.label}</p>
                    <p className="text-[9px] text-muted-foreground mt-0.5">{a.sub}</p>
                 </Link>
               ))}
            </div>
         </div>

         {/* Right: Suppliers & Metrics */}
         <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-5">
               <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Top Suppliers</h3>
               <div className="space-y-4">
                  {[
                    { name: "Golden Grain Mills", spend: "KES 420k", rating: 4.8 },
                    { name: "Fresh Produce Ltd", spend: "KES 180k", rating: 4.5 },
                    { name: "Crown Kitchens", spend: "KES 95k", rating: 5.0 },
                  ].map(s => (
                    <div key={s.name} className="flex items-center justify-between">
                       <div>
                          <p className="text-[11px] font-bold text-foreground">{s.name}</p>
                          <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-tight">Spend: {s.spend}</p>
                       </div>
                       <div className="flex items-center gap-1">
                          <span className="text-[10px] font-black text-emerald-600">{s.rating}</span>
                          <ShieldCheck className="size-3 text-emerald-500" />
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="rounded-2xl border border-primary/15 bg-primary/5 p-5 relative overflow-hidden">
               <div className="absolute top-0 right-0 size-24 bg-primary/10 blur-2xl rounded-full -mr-12 -mt-12" />
               <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="size-4 text-primary" />
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest">Procurement Alert</p>
               </div>
               <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">
                  There are <strong className="text-foreground">3 requisitions</strong> awaiting your final approval before they can be converted to LPOs.
               </p>
               <Button size="sm" className="w-full mt-4 h-7 text-[9px] font-black uppercase tracking-widest bg-primary hover:bg-primary/90">Review Requisitions</Button>
            </div>
         </div>

      </div>
    </div>
  );
}
