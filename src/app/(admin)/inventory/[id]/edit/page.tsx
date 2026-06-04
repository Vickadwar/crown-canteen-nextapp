"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft, ChevronDown, Check, Save,
  Package, Warehouse, ShieldCheck,
  Wallet, Tag, Info, DollarSign, Clock,
  type LucideIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ── CustomSelect ────────────────────────────────────────────────────────────────
function CustomSelect({ id, label, options, defaultValue }: {
  id: string; label: string; defaultValue?: string;
  options: { value: string; label: string; color?: string; sub?: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue ?? "");
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const sel = options.find(o => o.value === value);
  return (
    <div className="space-y-1.5" ref={ref}>
      <label className="text-[11px] font-semibold text-muted-foreground block">{label}</label>
      <div className="relative">
        <button id={id} type="button" onClick={() => setOpen(o => !o)}
          className={`w-full h-9 px-3.5 rounded-xl border bg-card text-sm text-left flex items-center gap-2.5 transition-all ${open ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-muted-foreground/40"}`}>
          {sel?.color && <span className={`size-2 rounded-full shrink-0 ${sel.color}`} />}
          <span className={`flex-1 font-medium ${sel ? "text-foreground" : "text-muted-foreground"}`}>{sel?.label ?? "Select…"}</span>
          <ChevronDown className={`size-3.5 text-muted-foreground transition-transform duration-200 shrink-0 ${open ? "rotate-180" : ""}`} />
        </button>
        {open && (
          <div className="absolute z-[200] top-full mt-1.5 w-full rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 origin-top">
            {options.map(o => (
              <button key={o.value} type="button" onClick={() => { setValue(o.value); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/60 transition-colors border-b border-border/50 last:border-0 ${value === o.value ? "bg-primary/5" : ""}`}>
                {o.color && <span className={`size-2 rounded-full shrink-0 ${o.color}`} />}
                <div className="flex-1 min-w-0">
                  <p className={`text-[12px] font-semibold ${value === o.value ? "text-primary" : "text-foreground"}`}>{o.label}</p>
                  {o.sub && <p className="text-[10px] text-muted-foreground">{o.sub}</p>}
                </div>
                {value === o.value && <Check className="size-3.5 text-primary shrink-0" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Field ──────────────────────────────────────────────────────────────────────
function Field({ label, id, type="text", defaultValue, placeholder, icon: Icon, disabled }: {
  label: string; id: string; type?: string; defaultValue?: string; placeholder?: string; icon?: LucideIcon; disabled?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-[11px] font-semibold text-muted-foreground block">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />}
        <input id={id} type={type} defaultValue={defaultValue} placeholder={placeholder} disabled={disabled}
          className={`w-full h-9 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${Icon ? "pl-9 pr-4" : "px-4"} ${disabled ? "opacity-60 cursor-not-allowed bg-muted/30" : ""}`} />
      </div>
    </div>
  );
}

// ── Section card ───────────────────────────────────────────────────────────────
function SectionCard({ title, icon: Icon, accent="text-primary", children }: {
  title: string; icon: LucideIcon; accent?: string; children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border bg-muted/30">
        <div className={`size-7 rounded-lg bg-muted flex items-center justify-center ${accent}`}><Icon className="size-3.5" /></div>
        <p className="text-[11px] font-bold text-foreground">{title}</p>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function EditInventoryItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500" onChange={() => setDirty(true)}>

      {/* Back + header */}
      <div>
        <Link href={`/inventory/${id}`}>
          <button className="flex items-center gap-1.5 text-[11px] font-bold text-primary hover:text-primary/80 transition-colors mb-4 uppercase tracking-[0.15em]">
            <ChevronLeft className="size-3.5" /> Back to {id}
          </button>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 ring-1 ring-primary/20 shadow-sm">
              <Package className="size-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] mb-0.5">Edit inventory item</p>
              <h1 className="text-xl font-black text-foreground tracking-tight leading-none">Rice (Basmati) 50kg</h1>
              <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1.5">
                <Tag className="size-3 text-muted-foreground" /> SKU Identifier · <span className="font-semibold text-foreground">{id}</span>
              </p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link href={`/inventory/${id}`}><Button size="sm" variant="outline" className="h-8 text-xs">Discard</Button></Link>
            <Button size="sm" onClick={() => { setSaved(true); setDirty(false); }}
              className="h-8 text-xs gap-1.5 bg-primary hover:bg-primary/90 shadow-md shadow-primary/20">
              <Save className="size-3.5" />{saved && !dirty ? "Saved ✓" : "Save changes"}
            </Button>
          </div>
        </div>
      </div>

      {/* Info bar */}
      <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl border border-blue-500/25 bg-blue-500/5">
        <Info className="size-4 text-blue-500 shrink-0 mt-0.5" />
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Modifying <strong className="text-foreground">Base Unit</strong> or <strong className="text-foreground">Tax Rates</strong> will trigger a re-valuation of all existing stock in ERPNext. Changes are audited for financial compliance.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">

        {/* Item profile */}
        <SectionCard title="Item profile" icon={Package} accent="text-primary">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Field label="Item name" id="i-name" defaultValue="Rice (Basmati) 50kg" icon={Package} />
            </div>
            <Field label="SKU / Item ID" id="i-id" defaultValue={id} disabled icon={Tag} />
            <CustomSelect label="Category" id="i-cat" defaultValue="dry" options={[
              { value: "dry",      label: "Dry Goods",   color: "bg-amber-500" },
              { value: "cold",     label: "Cold Storage", color: "bg-blue-500" },
              { value: "fresh",    label: "Fresh Produce",color: "bg-emerald-500" },
              { value: "bev",      label: "Beverages",    color: "bg-violet-500" },
              { value: "pkg",      label: "Packaging" },
            ]} />
            <CustomSelect label="Base unit of measure" id="i-uom" defaultValue="bag" options={[
              { value: "bag",    label: "Bag (50kg)" },
              { value: "kg",     label: "Kilogram (kg)" },
              { value: "can",    label: "Jerrycan (20L)" },
              { value: "box",    label: "Box / Crate" },
              { value: "unit",   label: "Single Unit" },
            ]} />
            <Field label="Sub-category" id="i-subcat" defaultValue="Grains" />
            <Field label="Brand / Manufacturer" id="i-brand" defaultValue="Golden Grain" />
          </div>
        </SectionCard>

        {/* Stock parameters */}
        <SectionCard title="Stock parameters" icon={Warehouse} accent="text-amber-500">
          <div className="grid sm:grid-cols-2 gap-4">
            <CustomSelect label="Storage location" id="i-loc" defaultValue="dry_a" options={[
              { value: "dry_a",    label: "Dry Store A", sub: "Ambient temp" },
              { value: "dry_b",    label: "Dry Store B" },
              { value: "cold_a",   label: "Cold Room 01", sub: "4°C - 8°C" },
              { value: "freezer",  label: "Freezer 01",  sub: "-18°C" },
            ]} />
            <Field label="Rack / Shelf #" id="i-rack" defaultValue="Rack 04" />
            <Field label="Min safety stock" id="i-min" type="number" defaultValue="5" />
            <Field label="Standard reorder qty" id="i-reorder" type="number" defaultValue="10" />
            <Field label="Max stock level" id="i-max" type="number" defaultValue="30" />
            <CustomSelect label="Valuation method" id="i-val" defaultValue="fifo" options={[
              { value: "fifo",    label: "FIFO (First In, First Out)", sub: "Recommended" },
              { value: "lifo",    label: "LIFO (Last In, First Out)" },
              { value: "moving",  label: "Moving Average" },
            ]} />
          </div>
        </SectionCard>

        {/* Financials & Procurement */}
        <SectionCard title="Financials & procurement" icon={DollarSign} accent="text-emerald-600">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Unit valuation (KES)" id="i-price" type="number" defaultValue="6000" icon={Wallet} />
            <CustomSelect label="Tax category" id="i-tax" defaultValue="vat16" options={[
              { value: "vat16",   label: "VAT 16%", sub: "Standard" },
              { value: "zero",    label: "Zero Rated (0%)" },
              { value: "exempt",  label: "Exempt" },
            ]} />
            <CustomSelect label="Default supplier" id="i-sup" defaultValue="gg" options={[
              { value: "gg",      label: "Golden Grain Millers", color: "bg-primary" },
              { value: "fp",      label: "Fresh Produce Ltd" },
              { value: "pm",      label: "Premium Meats" },
            ]} />
            <Field label="Lead time (Days)" id="i-lead" type="number" defaultValue="2" icon={Clock} />
            <div className="sm:col-span-2 flex items-center gap-2 p-3 rounded-xl border border-border bg-muted/20">
              <div className={`size-2 rounded-full bg-emerald-500`} />
              <p className="text-[11px] text-muted-foreground">Supplier price synced from latest PO acknowledgement.</p>
            </div>
          </div>
        </SectionCard>

        {/* Compliance & Safety */}
        <SectionCard title="Compliance & safety" icon={ShieldCheck} accent="text-blue-600">
          <div className="space-y-4">
            <Field label="Shelf life (Months)" id="i-life" type="number" defaultValue="24" />
            <CustomSelect label="Food safety standard" id="i-std" defaultValue="kebs" options={[
              { value: "kebs",    label: "KEBS Certified" },
              { value: "haccp",   label: "HACCP Compliant" },
              { value: "none",    label: "Internal Only" },
            ]} />
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-start gap-3">
              <ShieldCheck className="size-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-bold text-foreground">Health & safety verified</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Item is flagged for monthly inspection due to allergen classification (Grains/Gluten).</p>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Save bar */}
      <div className="flex items-center justify-between p-4 rounded-2xl border border-border bg-card">
        <div className="flex items-center gap-2">
          <div className={`size-2 rounded-full ${dirty ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`} />
          <p className="text-[11px] text-muted-foreground">
            {dirty ? <><span className="text-foreground font-semibold">Unsaved changes</span> · Re-valuation pending</> : "All changes saved · Financials synced"}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/inventory/${id}`}><Button size="sm" variant="outline" className="h-8 text-xs">Discard</Button></Link>
          <Button size="sm" onClick={() => { setSaved(true); setDirty(false); }}
            className="h-8 text-xs gap-1.5 bg-primary hover:bg-primary/90 shadow-md shadow-primary/20">
            <Save className="size-3.5" />{saved && !dirty ? "Saved ✓" : "Save all changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
