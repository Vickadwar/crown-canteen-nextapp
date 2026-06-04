"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft, ShoppingBag, CheckCircle2, AlertCircle,
  Plus, Minus, Trash2, RefreshCw, TrendingUp, User,
  MapPin, Package, ArrowRight, Check,
} from "lucide-react";

// ── data ──────────────────────────────────────────────────────────────────────

const snackItems = [
  { id: "chapati",  name: "Chapati",  price: 20,  icon: "🫓" },
  { id: "mandazi",  name: "Mandazi",  price: 15,  icon: "🍩" },
  { id: "samosa",   name: "Samosa",   price: 25,  icon: "🥟" },
  { id: "bread",    name: "Bread",    price: 30,  icon: "🍞" },
  { id: "sausage",  name: "Sausage",  price: 35,  icon: "🌭" },
  { id: "juice",    name: "Juice",    price: 50,  icon: "🧃" },
];

const reps = [
  { id: "REP001", name: "Mary Njeri",  route: "Block A – C" },
  { id: "REP002", name: "James Ouma",  route: "Block D – F" },
  { id: "REP003", name: "Fatuma Said", route: "Block G – H" },
];

// ── helpers ───────────────────────────────────────────────────────────────────

type CartItem = { id: string; name: string; price: number; icon: string; issued: number; sold: number };

function initCartFromItems(): CartItem[] {
  return snackItems.map(i => ({ ...i, issued: 0, sold: 0 }));
}

function VariancePill({ diff }: { diff: number }) {
  if (diff === 0) return <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center gap-1"><Check className="size-3" /> Balanced</span>;
  if (diff > 0) return <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-600 flex items-center gap-1"><TrendingUp className="size-3" /> Over KES {diff}</span>;
  return <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-rose-500/10 text-rose-500 flex items-center gap-1"><AlertCircle className="size-3" /> Short KES {Math.abs(diff)}</span>;
}

// ── Roaming reconciliation tab ────────────────────────────────────────────────

function RoamingTab() {
  const [repId, setRepId] = useState("");
  const [cart, setCart] = useState<CartItem[]>(initCartFromItems());
  const [cashCollected, setCashCollected] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const rep = reps.find(r => r.id === repId);
  const totalIssued = cart.reduce((a, c) => a + c.issued, 0);
  const totalSold = cart.reduce((a, c) => a + c.sold, 0);
  const totalRemaining = cart.reduce((a, c) => a + (c.issued - c.sold), 0);
  const expectedCash = cart.reduce((a, c) => a + c.sold * c.price, 0);
  const cashNum = parseFloat(cashCollected) || 0;
  const variance = cashNum - expectedCash;

  function update(id: string, field: "issued" | "sold", delta: number) {
    setCart(prev => prev.map(c => {
      if (c.id !== id) return c;
      const next = Math.max(0, c[field] + delta);
      if (field === "sold" && next > c.issued) return c;
      return { ...c, [field]: next };
    }));
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 animate-in zoom-in duration-500">
        <div className="size-20 rounded-full bg-emerald-500/10 flex items-center justify-center ring-4 ring-emerald-500/20">
          <CheckCircle2 className="size-10 text-emerald-500" />
        </div>
        <p className="text-lg font-black text-foreground">Reconciliation submitted!</p>
        <p className="text-sm text-muted-foreground">{rep?.name} · {new Date().toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" })}</p>
        <button onClick={() => { setSubmitted(false); setCart(initCartFromItems()); setCashCollected(""); setRepId(""); }}
          className="mt-2 h-9 px-5 rounded-xl border border-border text-sm font-bold hover:bg-muted transition-all">
          New reconciliation
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* Rep selector */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.18em] mb-3">Sales representative</p>
        <div className="grid sm:grid-cols-3 gap-2">
          {reps.map(r => (
            <button key={r.id} onClick={() => setRepId(r.id)}
              className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${repId === r.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
              <div className={`size-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition-all ${repId === r.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {r.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="min-w-0">
                <p className={`text-[12px] font-bold truncate ${repId === r.id ? "text-primary" : "text-foreground"}`}>{r.name}</p>
                <p className="text-[10px] text-muted-foreground flex items-center gap-1"><MapPin className="size-3" />{r.route}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Items reconciliation table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/30">
          <p className="text-[11px] font-bold text-foreground">Item reconciliation</p>
          <p className="text-[10px] text-muted-foreground">{totalIssued} issued · {totalSold} sold · {totalRemaining} remaining</p>
        </div>

        {/* Header */}
        <div className="grid grid-cols-[minmax(0,1fr)_110px_110px_110px_90px] px-5 py-3 bg-muted/20 border-b border-border">
          {["Item", "Issued qty", "Sold qty", "Remaining", "Subtotal"].map(h => (
            <span key={h} className="text-[11px] font-semibold text-muted-foreground">{h}</span>
          ))}
        </div>

        <div className="divide-y divide-border">
          {cart.map(item => {
            const remaining = item.issued - item.sold;
            const subtotal = item.sold * item.price;
            return (
              <div key={item.id} className="grid grid-cols-[minmax(0,1fr)_110px_110px_110px_90px] items-center px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="text-[12px] font-bold text-foreground">{item.name}</p>
                    <p className="text-[10px] text-muted-foreground">KES {item.price}/pc</p>
                  </div>
                </div>
                {/* Issued */}
                <div className="flex items-center gap-1">
                  <button onClick={() => update(item.id, "issued", -1)} className="size-6 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"><Minus className="size-3" /></button>
                  <span className="w-8 text-center text-sm font-bold text-foreground">{item.issued}</span>
                  <button onClick={() => update(item.id, "issued", 1)} className="size-6 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"><Plus className="size-3" /></button>
                </div>
                {/* Sold */}
                <div className="flex items-center gap-1">
                  <button onClick={() => update(item.id, "sold", -1)} className="size-6 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"><Minus className="size-3" /></button>
                  <span className="w-8 text-center text-sm font-bold text-foreground">{item.sold}</span>
                  <button onClick={() => update(item.id, "sold", 1)} className="size-6 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"><Plus className="size-3" /></button>
                </div>
                {/* Remaining */}
                <span className={`text-[12px] font-bold ${remaining < 0 ? "text-rose-500" : remaining === 0 ? "text-emerald-500" : "text-foreground"}`}>{remaining}</span>
                {/* Subtotal */}
                <span className="text-[12px] font-bold text-foreground">KES {subtotal}</span>
              </div>
            );
          })}
        </div>

        {/* Cash reconciliation */}
        <div className="border-t border-border bg-muted/20 p-5 grid sm:grid-cols-3 gap-5 items-end">
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-muted-foreground">Cash collected (KES)</label>
            <input type="number" value={cashCollected} onChange={e => setCashCollected(e.target.value)}
              placeholder="Enter amount handed in…"
              className="w-full h-9 px-3.5 rounded-xl border border-border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
          </div>
          <div className="space-y-1.5">
            <p className="text-[11px] font-semibold text-muted-foreground">Expected cash</p>
            <div className="h-9 flex items-center px-3.5 rounded-xl border border-border bg-muted text-sm font-bold text-foreground">
              KES {expectedCash.toLocaleString()}
            </div>
          </div>
          <div className="space-y-1.5">
            <p className="text-[11px] font-semibold text-muted-foreground">Variance</p>
            <div className="h-9 flex items-center">
              <VariancePill diff={variance} />
            </div>
          </div>
        </div>
      </div>

      {/* Summary + submit */}
      <div className="flex items-center gap-4">
        <div className="flex-1 grid grid-cols-3 gap-3">
          {[
            { label: "Total issued", value: totalIssued.toString() },
            { label: "Total sold",   value: totalSold.toString() },
            { label: "Revenue",      value: `KES ${expectedCash.toLocaleString()}` },
          ].map(s => (
            <div key={s.label} className="p-3 rounded-xl border border-border bg-card text-center">
              <p className="text-base font-black text-foreground">{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
        <button
          disabled={!repId || totalIssued === 0}
          onClick={() => setSubmitted(true)}
          className="h-12 px-6 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 shadow-md shadow-primary/20 transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center gap-2 shrink-0">
          Submit <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
}

// ── Window / Counter sales tab ────────────────────────────────────────────────

function WindowTab() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cashIn, setCashIn] = useState("");
  const [success, setSuccess] = useState(false);

  const total = snackItems.reduce((a, item) => a + (cart[item.id] ?? 0) * item.price, 0);
  const cashNum = parseFloat(cashIn) || 0;
  const change = cashNum - total;

  function addItem(id: string) { setCart(c => ({ ...c, [id]: (c[id] ?? 0) + 1 })); }
  function removeItem(id: string) { setCart(c => { const n = { ...c }; if (n[id] > 1) n[id]--; else delete n[id]; return n; }); }
  function clearCart() { setCart({}); setCashIn(""); }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4 animate-in zoom-in duration-500">
        <div className="size-20 rounded-full bg-emerald-500/10 flex items-center justify-center ring-4 ring-emerald-500/20">
          <CheckCircle2 className="size-10 text-emerald-500" />
        </div>
        <p className="text-lg font-black text-foreground">Sale recorded!</p>
        <p className="text-2xl font-black text-primary">KES {total.toLocaleString()}</p>
        <button onClick={() => { setSuccess(false); clearCart(); }}
          className="h-9 px-5 rounded-xl border border-border text-sm font-bold hover:bg-muted transition-all">
          Next customer
        </button>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-[1fr_300px] gap-5">
      {/* Items grid */}
      <div className="space-y-4">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.18em]">Tap to add items</p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {snackItems.map(item => {
            const qty = cart[item.id] ?? 0;
            return (
              <button key={item.id} onClick={() => addItem(item.id)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${qty > 0 ? "border-primary bg-primary/5 shadow-md shadow-primary/10" : "border-border hover:border-primary/30 hover:bg-muted/30"}`}>
                <span className="text-3xl">{item.icon}</span>
                <p className="text-[11px] font-bold text-foreground">{item.name}</p>
                <p className="text-[10px] text-muted-foreground">KES {item.price}</p>
                {qty > 0 && (
                  <span className="size-6 rounded-full bg-primary text-primary-foreground text-[11px] font-black flex items-center justify-center">
                    {qty}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Cart list */}
        {Object.keys(cart).length > 0 && (
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
              <p className="text-[11px] font-bold text-foreground">Current order</p>
              <button onClick={clearCart} className="text-[11px] text-muted-foreground hover:text-rose-500 transition-colors flex items-center gap-1"><Trash2 className="size-3" /> Clear</button>
            </div>
            {snackItems.filter(i => (cart[i.id] ?? 0) > 0).map(item => (
              <div key={item.id} className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-0">
                <span className="text-xl">{item.icon}</span>
                <div className="flex-1">
                  <p className="text-[12px] font-bold text-foreground">{item.name}</p>
                  <p className="text-[10px] text-muted-foreground">KES {item.price} × {cart[item.id]}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => removeItem(item.id)} className="size-6 rounded-lg border border-border flex items-center justify-center hover:bg-muted"><Minus className="size-3" /></button>
                  <span className="w-6 text-center text-sm font-bold">{cart[item.id]}</span>
                  <button onClick={() => addItem(item.id)} className="size-6 rounded-lg border border-border flex items-center justify-center hover:bg-muted"><Plus className="size-3" /></button>
                </div>
                <p className="text-[12px] font-bold text-foreground w-16 text-right">KES {item.price * (cart[item.id] ?? 0)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment sidebar */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden sticky top-20">
        <div className="px-5 py-4 border-b border-border bg-muted/30">
          <p className="text-[11px] font-bold text-foreground">Payment</p>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <p className="text-[10px] text-muted-foreground mb-1">Total</p>
            <p className="text-3xl font-black text-foreground">KES {total.toLocaleString()}</p>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-muted-foreground">Cash received</label>
            <input type="number" value={cashIn} onChange={e => setCashIn(e.target.value)}
              placeholder="0"
              className="w-full h-10 px-3.5 rounded-xl border border-border bg-card text-base font-bold text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
          </div>
          {cashNum >= total && total > 0 && (
            <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-center">
              <p className="text-[10px] text-muted-foreground">Change due</p>
              <p className="text-xl font-black text-emerald-600">KES {change.toLocaleString()}</p>
            </div>
          )}
          <button
            disabled={total === 0 || cashNum < total}
            onClick={() => setSuccess(true)}
            className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 shadow-md shadow-primary/20 transition-all disabled:opacity-40 disabled:pointer-events-none">
            Confirm sale
          </button>
          {total > 0 && cashNum > 0 && cashNum < total && (
            <p className="text-[10px] text-rose-500 text-center font-semibold">Cash short by KES {(total - cashNum).toLocaleString()}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SnackSalesPage() {
  const [tab, setTab] = useState<"roaming" | "window">("roaming");

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500">

      {/* Header */}
      <div>
        <Link href="/pos">
          <button className="flex items-center gap-1.5 text-[11px] font-bold text-primary hover:text-primary/80 transition-colors mb-4 uppercase tracking-[0.15em]">
            <ChevronLeft className="size-3.5" /> Back to POS terminal
          </button>
        </Link>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] mb-1">Canteen operations</p>
            <h1 className="text-2xl font-black text-foreground tracking-tight leading-none">Snack Sales</h1>
            <p className="text-sm text-muted-foreground mt-1.5">Reconcile roaming reps or ring up window counter sales.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1 p-1 bg-muted/50 rounded-xl border border-border">
              <button onClick={() => setTab("roaming")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-bold transition-all ${tab === "roaming" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                <User className="size-3.5" /> Roaming reps
              </button>
              <button onClick={() => setTab("window")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-bold transition-all ${tab === "window" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                <ShoppingBag className="size-3.5" /> Window sales
              </button>
            </div>
          </div>
        </div>
      </div>

      {tab === "roaming" ? <RoamingTab /> : <WindowTab />}
    </div>
  );
}
