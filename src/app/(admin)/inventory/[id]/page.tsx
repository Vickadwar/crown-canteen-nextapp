"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft, Package, Box, TrendingUp, TrendingDown,
  Clock, ArrowLeftRight, DownloadCloud, AlertTriangle,
  History, Calendar, Filter, Download, ChevronRight,
  ShieldCheck, ArrowUpRight, ShoppingCart, Truck, Edit3, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ItemDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/inventory">
            <button className="size-10 rounded-2xl border border-border bg-card hover:bg-muted flex items-center justify-center transition-all shadow-sm">
              <ChevronLeft className="size-5 text-muted-foreground" />
            </button>
          </Link>
          <div>
            <p className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] mb-1">SKU Profile</p>
            <h1 className="text-2xl font-black text-foreground tracking-tight leading-none">Rice (Basmati) 50kg</h1>
            <p className="text-sm text-muted-foreground mt-1.5 font-bold tracking-tight">System ID: {params.id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-8 gap-1.5 text-xs">
            <Trash2 className="size-3.5 text-rose-500" /> Delete
          </Button>
          <Link href={`/inventory/${params.id}/edit`}>
            <Button className="h-8 gap-1.5 text-xs bg-primary hover:bg-primary/90 shadow-md">
              <Edit3 className="size-3.5" /> Edit details
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="grid lg:grid-cols-3 gap-6">
         
         {/* Definition Card */}
         <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
               <div className="px-6 py-4 border-b border-border bg-muted/40">
                  <h3 className="text-xs font-black uppercase tracking-widest text-foreground">Item Definition</h3>
               </div>
               <div className="p-6 grid grid-cols-2 gap-y-6 gap-x-12">
                  {[
                    { label: "Category", value: "Dry Goods", color: "bg-amber-500" },
                    { label: "Base Unit", value: "Bag (50kg)" },
                    { label: "Valuation", value: "FIFO" },
                    { label: "Safety Stock", value: "5 Units" },
                    { label: "Tax Class", value: "VAT 16%" },
                    { label: "Manufacturer", value: "Golden Grain Mills" },
                  ].map(info => (
                    <div key={info.label}>
                       <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">{info.label}</p>
                       <div className="flex items-center gap-2">
                          {info.color && <div className={`size-2 rounded-full ${info.color}`} />}
                          <p className="text-sm font-bold text-foreground">{info.value}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 flex items-start gap-4">
               <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-inner">
                  <Activity className="size-5" />
               </div>
               <div>
                  <p className="text-sm font-black text-foreground uppercase tracking-tight">Stock Activity Overview</p>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                     This item is currently stored in <strong className="text-foreground">3 locations</strong>. Total consolidated stock is 14 Units.
                  </p>
                  <Link href="/warehouse" className="text-[10px] font-bold text-primary mt-3 inline-flex items-center gap-1 hover:underline">
                     View in Warehouse module <ArrowUpRight className="size-3" />
                  </Link>
               </div>
            </div>
         </div>

         {/* Sidebar Card */}
         <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6">
               <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Procurement Meta</h3>
               <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                     <span className="text-[11px] font-bold text-muted-foreground uppercase">Reorder Point</span>
                     <span className="text-xs font-black text-foreground text-right">5 Bags</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                     <span className="text-[11px] font-bold text-muted-foreground uppercase">Lead Time</span>
                     <span className="text-xs font-black text-foreground text-right">3 Days</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                     <span className="text-[11px] font-bold text-muted-foreground uppercase">Monthly Avg</span>
                     <span className="text-xs font-black text-foreground text-right">12 Bags</span>
                  </div>
               </div>
            </div>

            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 text-center">
               <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <ShieldCheck className="size-5" />
               </div>
               <p className="text-[11px] font-black text-foreground uppercase tracking-widest">Active SKU</p>
               <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
                  Master record synced with ERPNext. Last metadata update on May 10, 2026.
               </p>
            </div>
         </div>

      </div>
    </div>
  );
}

function Activity({ className }: any) { return <Box className={className} />; }
