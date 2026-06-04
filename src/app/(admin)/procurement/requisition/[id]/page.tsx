"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft, ClipboardList, User, Building,
  Clock, CheckCircle2, XCircle, AlertCircle,
  FileText, Package, DollarSign, History,
  ShieldCheck, ArrowUpRight, MessageSquare, BadgeCheck,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RequisitionDetailPage({ params }: { params: { id: string } }) {
  const [status, setStatus] = useState("Pending HOD Approval");

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/procurement">
            <button className="size-10 rounded-2xl border border-border bg-card hover:bg-muted flex items-center justify-center transition-all shadow-sm">
              <ChevronLeft className="size-5 text-muted-foreground" />
            </button>
          </Link>
          <div>
            <p className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] mb-1">Purchase Requisition</p>
            <h1 className="text-2xl font-black text-foreground tracking-tight leading-none">Monthly Dry Goods Restock</h1>
            <p className="text-sm text-muted-foreground mt-1.5 font-bold tracking-tight">Reference: {params.id}</p>
          </div>
        </div>
        <div className="flex gap-2">
           {status.includes("Pending") && (
              <>
                 <Button variant="outline" className="h-8 gap-1.5 text-xs text-rose-500 border-rose-500/20 hover:bg-rose-500/10">
                    <XCircle className="size-3.5" /> Reject
                 </Button>
                 <Button onClick={() => setStatus("Approved")} className="h-8 gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 shadow-md">
                    <CheckCircle2 className="size-3.5" /> Approve Request
                 </Button>
              </>
           )}
           {status === "Approved" && (
              <Button className="h-8 gap-1.5 text-xs bg-primary hover:bg-primary/90 shadow-md">
                 <FileText className="size-3.5" /> Create RFQ
              </Button>
           )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
         
         {/* Main Content */}
         <div className="lg:col-span-2 space-y-6">
            
            {/* Request Summary */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
               <div className="px-6 py-4 border-b border-border bg-muted/40 flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-widest text-foreground">Request Details</h3>
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider ${status === 'Approved' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                     {status}
                  </span>
               </div>
               <div className="p-6 grid grid-cols-2 gap-y-6 gap-x-12">
                  {[
                    { label: "Requesting Dept", value: "Main Kitchen", icon: Building },
                    { label: "Requested By", value: "Chef John Doe", icon: User },
                    { label: "Required Date", value: "May 20, 2026", icon: Clock },
                    { label: "Estimated Value", value: "KES 145,000", icon: DollarSign },
                  ].map(info => (
                    <div key={info.label}>
                       <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">{info.label}</p>
                       <div className="flex items-center gap-2 text-foreground">
                          <info.icon className="size-3.5 text-muted-foreground" />
                          <p className="text-sm font-bold">{info.value}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Item Table */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
               <div className="px-6 py-4 border-b border-border bg-muted/20">
                  <h3 className="text-xs font-black uppercase tracking-widest text-foreground">Requested Items</h3>
               </div>
               <div className="grid grid-cols-[minmax(0,2fr)_100px_120px] px-6 py-3 border-b border-border bg-muted/10">
                  {["SKU & Description", "Quantity", "Est. Price"].map(h => (
                    <span key={h} className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{h}</span>
                  ))}
               </div>
               <div className="divide-y divide-border">
                  {[
                    { sku: "SKU-401", name: "Rice (Basmati) 50kg", qty: 10, unit: "Bags", price: "KES 62,000" },
                    { sku: "SKU-403", name: "Wheat Flour 50kg", qty: 20, unit: "Bags", price: "KES 83,000" },
                  ].map(item => (
                    <div key={item.sku} className="grid grid-cols-[minmax(0,2fr)_100px_120px] items-center px-6 py-4">
                       <div className="flex items-center gap-3">
                          <div className="size-8 rounded-lg bg-muted flex items-center justify-center">
                             <Package className="size-4 text-muted-foreground" />
                          </div>
                          <div>
                             <p className="text-xs font-bold text-foreground">{item.name}</p>
                             <p className="text-[9px] text-muted-foreground uppercase font-black">{item.sku}</p>
                          </div>
                       </div>
                       <div>
                          <p className="text-xs font-bold text-foreground">{item.qty} <span className="text-[10px] font-medium text-muted-foreground">{item.unit}</span></p>
                       </div>
                       <div>
                          <p className="text-xs font-black text-foreground tabular-nums">{item.price}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Sidebar: Timeline & Approval Flow */}
         <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6">
               <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Approval Trail</h3>
               <div className="space-y-6 relative">
                  <div className="absolute left-4 top-2 bottom-2 w-px bg-border border-dashed" />
                  {[
                    { user: "Chef John Doe", action: "Submitted Request", time: "May 14, 10:00 AM", status: "completed" },
                    { user: "Sarah W. (HOD Kitchen)", action: "Initial Verification", time: "May 14, 2:30 PM", status: "completed" },
                    { user: "James K. (Finance)", action: "Final Budget Approval", time: "Pending", status: "pending" },
                  ].map((log, i) => (
                    <div key={i} className="relative flex gap-4 pl-1">
                       <div className={`size-8 rounded-full border-4 border-card flex items-center justify-center shrink-0 z-10 
                          ${log.status === 'completed' ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'}`}>
                          {log.status === 'completed' ? <CheckCircle2 className="size-3.5" /> : <Clock className="size-3.5" />}
                       </div>
                       <div>
                          <p className="text-[11px] font-black text-foreground leading-none mb-1">{log.action}</p>
                          <p className="text-[10px] text-muted-foreground font-bold leading-none">{log.user}</p>
                          <p className="text-[9px] text-muted-foreground mt-1.5 uppercase font-black tracking-tighter">{log.time}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
               <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="size-4 text-primary" />
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest">Auditor's Note</p>
               </div>
               <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">
                  "Quantities match the Q2 consumption forecast. Budget is within the monthly kitchen allocation."
               </p>
            </div>
         </div>

      </div>
    </div>
  );
}
