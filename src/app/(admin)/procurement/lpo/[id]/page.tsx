"use client";

import React from "react";
import Link from "next/link";
import {
  ChevronLeft, Printer, Download, Mail,
  Truck, Building, User, Calendar,
  FileText, Package, DollarSign, ShieldCheck,
  BadgeCheck, Clock, CheckCircle2, ShoppingCart
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LPODetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/procurement/lpo">
            <button className="size-10 rounded-2xl border border-border bg-card hover:bg-muted flex items-center justify-center transition-all shadow-sm">
              <ChevronLeft className="size-5 text-muted-foreground" />
            </button>
          </Link>
          <div>
            <p className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] mb-1">Local Purchase Order</p>
            <h1 className="text-2xl font-black text-foreground tracking-tight leading-none">Order: {params.id}</h1>
            <p className="text-sm text-muted-foreground mt-1.5 font-bold tracking-tight">Status: Awaiting Delivery</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-8 gap-1.5 text-xs">
            <Printer className="size-3.5" /> Print
          </Button>
          <Button variant="outline" className="h-8 gap-1.5 text-xs">
            <Mail className="size-3.5" /> Email Vendor
          </Button>
          <Button className="h-8 gap-1.5 text-xs bg-primary hover:bg-primary/90 shadow-md">
            <Download className="size-3.5" /> Download PDF
          </Button>
        </div>
      </div>

      {/* LPO Document View */}
      <div className="grid lg:grid-cols-3 gap-6">
         
         <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
               {/* Document Header */}
               <div className="p-8 border-b border-border bg-muted/20 grid grid-cols-2 gap-8">
                  <div>
                     <div className="size-12 rounded-2xl bg-primary flex items-center justify-center text-white mb-4">
                        <ShoppingCart className="size-6" />
                     </div>
                     <h2 className="text-xl font-black text-foreground tracking-tighter">Crown Paints Kenya PLC</h2>
                     <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        Lunga Lunga Road, Industrial Area<br />
                        Nairobi, Kenya<br />
                        Tel: +254 700 000 000
                     </p>
                  </div>
                  <div className="text-right">
                     <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">Purchase Order</p>
                     <p className="text-2xl font-black text-foreground tabular-nums">{params.id}</p>
                     <div className="mt-4 space-y-1">
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Order Date: May 12, 2026</p>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Due Date: May 15, 2026</p>
                     </div>
                  </div>
               </div>

               {/* Entities */}
               <div className="p-8 grid grid-cols-2 gap-12">
                  <div>
                     <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">Vendor / Supplier</p>
                     <div className="p-4 rounded-2xl border border-border bg-muted/5">
                        <p className="text-sm font-black text-foreground">Golden Grain Mills</p>
                        <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">
                           Thika Highway, Exit 14<br />
                           Nairobi, Kenya<br />
                           Contact: sales@goldengrain.com
                        </p>
                     </div>
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">Ship To / Deliver To</p>
                     <div className="p-4 rounded-2xl border border-border bg-muted/5">
                        <p className="text-sm font-black text-foreground">Crown Canteen - Main Kitchen</p>
                        <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">
                           Head Office, Block B<br />
                           Nairobi HQ<br />
                           Contact: Canteen Manager
                        </p>
                     </div>
                  </div>
               </div>

               {/* Line Items */}
               <div className="px-8 pb-8">
                  <div className="rounded-2xl border border-border overflow-hidden">
                     <div className="grid grid-cols-[1fr_100px_120px_120px] px-5 py-3 bg-muted/40 border-b border-border">
                        {["Item Description", "Qty", "Unit Price", "Total"].map(h => (
                           <span key={h} className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{h}</span>
                        ))}
                     </div>
                     <div className="divide-y divide-border">
                        {[
                          { name: "Rice (Basmati) 50kg", qty: 10, unit: "Bags", price: "6,200", total: "62,000" },
                          { name: "Wheat Flour 50kg",    qty: 20, unit: "Bags", price: "4,150", total: "83,000" },
                        ].map((item, i) => (
                           <div key={i} className="grid grid-cols-[1fr_100px_120px_120px] px-5 py-4 text-[12px] font-bold">
                              <p className="text-foreground">{item.name}</p>
                              <p className="text-muted-foreground">{item.qty} {item.unit}</p>
                              <p className="text-foreground tabular-nums">KES {item.price}</p>
                              <p className="text-foreground tabular-nums">KES {item.total}</p>
                           </div>
                        ))}
                     </div>
                     <div className="bg-muted/20 p-6 flex justify-end">
                        <div className="w-64 space-y-3">
                           <div className="flex justify-between text-xs text-muted-foreground font-bold uppercase tracking-tight">
                              <span>Subtotal</span>
                              <span className="text-foreground tabular-nums">KES 145,000</span>
                           </div>
                           <div className="flex justify-between text-xs text-muted-foreground font-bold uppercase tracking-tight">
                              <span>VAT (16%)</span>
                              <span className="text-foreground tabular-nums">KES 23,200</span>
                           </div>
                           <div className="h-px bg-border my-2" />
                           <div className="flex justify-between text-base font-black text-primary uppercase">
                              <span>Total Amount</span>
                              <span className="tabular-nums font-black">KES 168,200</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Signatures */}
               <div className="p-8 border-t border-border bg-muted/5 grid grid-cols-2 gap-12">
                  <div className="pt-12 border-t border-border/50 text-center">
                     <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Authorized Signature</p>
                     <p className="text-[11px] text-foreground font-bold mt-2">Finance Director</p>
                  </div>
                  <div className="pt-12 border-t border-border/50 text-center">
                     <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Vendor Acceptance</p>
                     <p className="text-[11px] text-foreground font-bold mt-2">Stamp & Date</p>
                  </div>
               </div>
            </div>
         </div>

         {/* Meta Sidebar */}
         <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6">
               <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Order Tracking</h3>
               <div className="space-y-5">
                  <div className="flex items-center gap-3">
                     <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                        <BadgeCheck className="size-4" />
                     </div>
                     <div>
                        <p className="text-[11px] font-black text-foreground">ERP Sync Successful</p>
                        <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-tighter">May 12, 2:45 PM</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="size-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                        <Mail className="size-4" />
                     </div>
                     <div>
                        <p className="text-[11px] font-black text-foreground">Sent to Vendor</p>
                        <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-tighter">May 12, 3:00 PM</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="size-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                        <Clock className="size-4" />
                     </div>
                     <div>
                        <p className="text-[11px] font-black text-foreground">Awaiting Delivery</p>
                        <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-tighter">In Progress</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
               <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck className="size-4 text-primary" />
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest">Compliance Status</p>
               </div>
               <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">
                  This LPO is fully backed by approved budget <strong className="text-foreground">CANT-2026-Q2</strong>. Verification completed by Sarah W.
               </p>
            </div>
         </div>

      </div>
    </div>
  );
}
