"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search, Package, Plus, Download, SlidersHorizontal,
  ChevronRight, AlertTriangle, TrendingDown, ShoppingCart,
  ArrowUpRight, Clock, Box, ShieldCheck, History, Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";

const categoryColor: Record<string, string> = {
  "Dry Goods":    "bg-amber-500/10 text-amber-600",
  "Cold Storage": "bg-blue-500/10 text-blue-600",
  "Fresh":        "bg-emerald-500/10 text-emerald-600",
  "Beverages":    "bg-violet-500/10 text-violet-600",
  "Packaging":    "bg-muted text-muted-foreground",
};

const statusStyle: Record<string, string> = {
  "In Stock":       "bg-emerald-500/10 text-emerald-600",
  "Low Stock":      "bg-amber-500/10 text-amber-600",
  "Critically Low": "bg-rose-500/10 text-rose-500",
  "Out of Stock":   "bg-rose-500/10 text-rose-500",
};

const inventory = [
  { id: "SKU-401", item: "Rice (Basmati) 50kg", category: "Dry Goods", stock: "14", unit: "Bags", min: 5,   status: "In Stock",       value: "KES 84,000",  lastRestock: "May 10, 2026" },
  { id: "SKU-402", item: "Cooking Oil 20L",     category: "Dry Goods", stock: "2",  unit: "Cans", min: 10,  status: "Low Stock",      value: "KES 12,000",  lastRestock: "Apr 28, 2026" },
  { id: "SKU-403", item: "Wheat Flour 50kg",    category: "Dry Goods", stock: "8",  unit: "Bags", min: 5,   status: "In Stock",       value: "KES 32,000",  lastRestock: "May 12, 2026" },
  { id: "SKU-404", item: "Beef Cuts (Prime)",   category: "Cold Storage", stock: "45", unit: "kg",  min: 100, status: "Critically Low", value: "KES 54,000",  lastRestock: "May 11, 2026" },
  { id: "SKU-405", item: "Vegetable Mix",       category: "Fresh",      stock: "250", unit: "kg",  min: 150, status: "In Stock",       value: "KES 12,500",  lastRestock: "Today, 6:00 AM" },
  { id: "SKU-406", item: "Milk (Whole) 500ml", category: "Cold Storage", stock: "120", unit: "Units", min: 50, status: "In Stock",     value: "KES 7,200",   lastRestock: "Today, 5:30 AM" },
  { id: "SKU-407", item: "Sugar (Brown) 50kg", category: "Dry Goods",    stock: "0",   unit: "Bags", min: 3,   status: "Out of Stock",   value: "KES 0",       lastRestock: "Apr 15, 2026" },
];

const stats = [
  { label: "Total SKUs",       value: "142",      icon: Package,  accent: "text-primary" },
  { label: "Low stock items",  value: "8",        icon: AlertTriangle, accent: "text-amber-500" },
  { label: "Out of stock",     value: "2",        icon: TrendingDown,  accent: "text-rose-500" },
  { label: "Inventory Value",  value: "2.4M",     icon: ShoppingCart,  accent: "text-blue-500" },
];

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const filtered = inventory.filter(i =>
    i.item.toLowerCase().includes(search.toLowerCase()) ||
    i.id.toLowerCase().includes(search.toLowerCase()) ||
    i.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] mb-1">Resource Management</p>
          <h1 className="text-2xl font-black text-foreground tracking-tight leading-none">Inventory Catalog</h1>
          <p className="text-sm text-muted-foreground mt-1.5">Manage master stock items, SKU definitions, and unit categories.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs">
            <Download className="size-3.5" /> Export
          </Button>
          <Link href="/inventory/new">
            <Button size="sm" className="h-8 gap-1.5 text-xs bg-primary hover:bg-primary/90 shadow-md shadow-primary/20">
              <Plus className="size-3.5" /> Add new item
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
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

      {/* Search & Action bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by item name, SKU or category…"
            className="w-full h-9 pl-9 pr-4 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
        </div>
        <Button size="sm" variant="outline" className="h-9 gap-1.5 text-xs shrink-0 px-3">
          <Filter className="size-3.5" /> <span className="hidden sm:inline">Filter</span>
        </Button>
        <Link href="/inventory/history">
          <Button size="sm" variant="outline" className="h-9 gap-1.5 text-xs shrink-0 px-3">
            <History className="size-3.5" /> <span className="hidden sm:inline">History</span>
          </Button>
        </Link>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,1fr)_120px_80px] px-5 py-3 border-b border-border bg-muted/40">
          {["Item Name / SKU","Category","Stock Level","Valuation","Status",""].map(h => (
            <span key={h} className="text-[11px] font-semibold text-muted-foreground">{h}</span>
          ))}
        </div>
        {/* Table body */}
        <div className="divide-y divide-border">
          {filtered.map(item => {
            const stockPct = (parseInt(item.stock) / item.min) * 100;
            return (
              <div key={item.id}
                className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,1fr)_120px_80px] items-center px-5 py-4 hover:bg-muted/20 transition-colors group cursor-pointer">
                {/* Item */}
                <div className="flex items-center gap-3 min-w-0 pr-3">
                  <div className="size-9 rounded-xl bg-muted text-foreground flex items-center justify-center shrink-0 group-hover:ring-2 group-hover:ring-primary/30 transition-all">
                    <Box className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] font-bold text-foreground truncate group-hover:text-primary transition-colors">{item.item}</p>
                    <p className="text-[10px] text-muted-foreground truncate uppercase tracking-widest font-bold">{item.id}</p>
                  </div>
                </div>
                {/* Category */}
                <div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg leading-none uppercase tracking-wider ${categoryColor[item.category]}`}>
                    {item.category}
                  </span>
                </div>
                {/* Stock Level */}
                <div className="pr-6">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[11px] font-bold text-foreground">{item.stock} <span className="text-[10px] text-muted-foreground font-normal">{item.unit}</span></p>
                    <p className="text-[10px] text-muted-foreground font-bold tracking-tight">MIN: {item.min}</p>
                  </div>
                  <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${
                      item.status === "In Stock" ? "bg-emerald-500" : 
                      item.status === "Low Stock" ? "bg-amber-500" : "bg-rose-500"
                    }`} style={{width: `${Math.min(100, stockPct)}%`}} />
                  </div>
                </div>
                {/* Value */}
                <div>
                  <p className="text-[13px] font-black text-foreground tabular-nums">{item.value}</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5 flex items-center gap-1 font-medium">
                    <Clock className="size-2.5" /> {item.lastRestock}
                  </p>
                </div>
                {/* Status */}
                <div>
                   <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg leading-none flex items-center gap-1.5 w-fit uppercase tracking-wider ${statusStyle[item.status]}`}>
                    <span className={`size-1.5 rounded-full ${
                      item.status === "In Stock" ? "bg-emerald-500" : 
                      item.status === "Low Stock" ? "bg-amber-500" : "bg-rose-500"
                    }`} />
                    {item.status}
                  </span>
                </div>
                {/* Actions */}
                <div className="flex justify-end">
                  <Link href={`/inventory/${item.id}`}>
                    <button className="size-7 flex items-center justify-center rounded-lg hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors">
                      <ChevronRight className="size-3.5" />
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
