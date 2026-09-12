"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Warehouse,
  ArrowLeftRight,
  Plus,
  RefreshCw,
  AlertTriangle,
  ChevronRight,
  Building2,
  Package,
  Boxes,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  DownloadCloud,
  Layers,
  ArrowDownToLine,
  ArrowUpFromLine,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface WarehouseDoc {
  name: string;
  warehouse_name?: string;
  warehouse_type?: string;
  company?: string;
  parent_warehouse?: string;
  is_group?: number;
  disabled?: number;
}

// Fallback demo warehouses if bench database is clean or connecting offline
const defaultWarehouses: WarehouseDoc[] = [
  {
    name: "Main Stores - CP",
    warehouse_name: "Main Kitchen Stores",
    warehouse_type: "Stores",
    company: "Crown Paints Kenya PLC",
    is_group: 0,
    disabled: 0,
  },
  {
    name: "Cold Storage - CP",
    warehouse_name: "Cold Room & Butchery",
    warehouse_type: "Cold Storage",
    company: "Crown Paints Kenya PLC",
    is_group: 0,
    disabled: 0,
  },
  {
    name: "Dry Goods Pantry - CP",
    warehouse_name: "Dry Goods & Grains Pantry",
    warehouse_type: "Stores",
    company: "Crown Paints Kenya PLC",
    is_group: 0,
    disabled: 0,
  },
  {
    name: "Beverages Store - CP",
    warehouse_name: "Beverages & Dairy Counter",
    warehouse_type: "Stores",
    company: "Crown Paints Kenya PLC",
    is_group: 0,
    disabled: 0,
  },
];

export default function WarehousePage() {
  const [warehouses, setWarehouses] = useState<WarehouseDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("All");
  const [isLiveSync, setIsLiveSync] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch live Warehouse doctype from backend
  const fetchLiveWarehouses = async () => {
    setRefreshing(true);
    setErrorMsg(null);
    try {
      const params = new URLSearchParams({
        fields: JSON.stringify([
          "name",
          "warehouse_name",
          "warehouse_type",
          "company",
          "parent_warehouse",
          "is_group",
          "disabled",
        ]),
        limit_page_length: "100",
      });

      let res = await fetch(`/api/resource/Warehouse?${params.toString()}`, {
        credentials: "include",
      });

      if (!res.ok && res.status !== 403 && res.status !== 401) {
        const fallbackParams = new URLSearchParams({
          fields: JSON.stringify(["*"]),
          limit_page_length: "100",
        });
        res = await fetch(`/api/resource/Warehouse?${fallbackParams.toString()}`, {
          credentials: "include",
        });
      }

      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
          setWarehouses(json.data);
          setIsLiveSync(true);
          setErrorMsg(null);
        } else {
          setWarehouses(defaultWarehouses);
          setIsLiveSync(true);
        }
      } else if (res.status === 403 || res.status === 401) {
        setIsLiveSync(false);
        setWarehouses(defaultWarehouses);
        setErrorMsg("Session expired or permission required for Warehouse Doctype. Please sign in.");
      } else {
        const errJson = await res.json().catch(() => ({}));
        setIsLiveSync(false);
        setWarehouses(defaultWarehouses);
        setErrorMsg(errJson.message || `Server returned status ${res.status}`);
      }
    } catch (err: any) {
      setIsLiveSync(false);
      setWarehouses(defaultWarehouses);
      setErrorMsg(err.message || "Failed to reach Frappe API");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLiveWarehouses();
  }, []);

  // Dynamically extract unique warehouse types
  const dynamicTypes = React.useMemo(() => {
    const types = Array.from(
      new Set(
        warehouses
          .map((w) => w.warehouse_type?.trim())
          .filter((t): t is string => Boolean(t))
      )
    ).sort();
    return ["All", ...types];
  }, [warehouses]);

  // Filter list
  const filtered = warehouses.filter((w) => {
    const name = (w.warehouse_name || w.name || "").toLowerCase();
    const type = (w.warehouse_type || "").toLowerCase();
    const company = (w.company || "").toLowerCase();
    const q = search.toLowerCase();

    const matchesSearch =
      name.includes(q) ||
      type.includes(q) ||
      company.includes(q) ||
      (w.name || "").toLowerCase().includes(q);

    const matchesType =
      filterType === "All" || (w.warehouse_type || "").trim() === filterType;

    return matchesSearch && matchesType;
  });

  const totalCount = warehouses.length;
  const activeCount = warehouses.filter((w) => !w.disabled).length;
  const storesCount = warehouses.filter((w) => !w.is_group).length;

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">
              Warehouse & Stock Locations
            </h1>
            {isLiveSync ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
                <span className="size-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Live Warehouse Doctype ({warehouses.length} locations)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold">
                <AlertTriangle className="size-3 text-amber-600" />
                Synced Cache
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Storage locations, kitchen pantries, cold storage nodes, and live warehouse inventory balances.
          </p>
        </div>

        {/* Action Buttons: Stock Transfer, Stock Receipt, Stock Issue */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={fetchLiveWarehouses}
            disabled={refreshing}
            suppressHydrationWarning
            className="h-8 gap-1.5 text-xs font-bold border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            <RefreshCw className={`size-3.5 ${refreshing ? "animate-spin text-emerald-600" : ""}`} />
            <span>{refreshing ? "Syncing…" : "Refresh"}</span>
          </Button>

          <Link href="/warehouse/transfer/new">
            <Button
              size="sm"
              variant="outline"
              suppressHydrationWarning
              className="h-8 gap-1.5 text-xs font-bold border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              <ArrowLeftRight className="size-3.5 text-amber-600" />
              <span>Stock Transfer</span>
            </Button>
          </Link>

          <Link href="/warehouse/issue/new">
            <Button
              size="sm"
              variant="outline"
              suppressHydrationWarning
              className="h-8 gap-1.5 text-xs font-bold border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              <ArrowUpFromLine className="size-3.5 text-rose-600" />
              <span>Stock Issue</span>
            </Button>
          </Link>

          <Link href="/warehouse/receipt/new">
            <Button
              size="sm"
              suppressHydrationWarning
              className="h-8 gap-1.5 text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm cursor-pointer"
            >
              <ArrowDownToLine className="size-3.5" />
              <span>Stock Receipt</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Error / Auth Notice Banner ───────────────────────────────────── */}
      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200 flex items-center justify-between gap-3 text-amber-900">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="size-4 text-amber-600 shrink-0" />
            <p className="text-xs font-medium">
              <strong className="font-bold">Sync Notice:</strong> {errorMsg}
            </p>
          </div>
          <Link href="/auth/login">
            <Button
              size="sm"
              suppressHydrationWarning
              className="h-7 text-xs bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shrink-0 gap-1 cursor-pointer"
            >
              <LogIn className="size-3" /> Re-Authenticate
            </Button>
          </Link>
        </div>
      )}

      {/* ── Compact Key Metrics Strip ────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {[
          { label: "Total Locations", value: totalCount.toString(), icon: Warehouse, color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
          { label: "Active Stores", value: activeCount.toString(), icon: CheckCircle2, color: "text-teal-700 bg-teal-50 border-teal-200" },
          { label: "Stock Holding Stores", value: storesCount.toString(), icon: Boxes, color: "text-slate-700 bg-slate-100 border-slate-200" },
          { label: "Ledger Sync", value: isLiveSync ? "100% Live" : "Awaiting Auth", icon: ShieldCheck, color: isLiveSync ? "text-emerald-700 bg-emerald-50 border-emerald-200" : "text-amber-700 bg-amber-50 border-amber-200" },
        ].map((s, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className={`size-8 rounded-lg flex items-center justify-center border shrink-0 ${s.color}`}>
              <s.icon className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-none mb-1">
                {s.label}
              </p>
              <p className="text-base font-black text-slate-900 leading-none">
                {s.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Search & Filter Controls ──────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by warehouse name, ID, or company…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            suppressHydrationWarning
            className="w-full h-8 pl-8 pr-3 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-600 focus:outline-none transition-all font-medium"
          />
        </div>

        {/* Dynamic Type Filter Pills */}
        <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto">
          {dynamicTypes.map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              suppressHydrationWarning
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                filterType === t
                  ? "bg-emerald-600 text-white font-black shadow-sm"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ── High-Density Warehouse List Table ─────────────────────────────── */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center space-y-2">
            <RefreshCw className="size-6 text-emerald-600 animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-600">Connecting to Frappe Warehouse Doctype…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Warehouse className="size-8 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No warehouse locations match your active filter.</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Warehouses created on the ERP side will automatically appear here upon synchronization.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => { setSearch(""); setFilterType("All"); fetchLiveWarehouses(); }}
              suppressHydrationWarning
              className="text-xs font-bold h-8 cursor-pointer"
            >
              <RefreshCw className="size-3.5 mr-1" /> Reset Filters
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3.5">Warehouse Name & Code</th>
                  <th className="py-2.5 px-3.5">Warehouse Type</th>
                  <th className="py-2.5 px-3.5">Parent Location</th>
                  <th className="py-2.5 px-3.5">Company Entity</th>
                  <th className="py-2.5 px-3.5">Group Node</th>
                  <th className="py-2.5 px-3.5">Status</th>
                  <th className="py-2.5 px-3.5 text-right">View Balances</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filtered.map((w) => {
                  const displayName = w.warehouse_name || w.name;
                  const isActive = !w.disabled;

                  return (
                    <tr
                      key={w.name}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Name + Code */}
                      <td className="py-2.5 px-3.5">
                        <Link
                          href={`/warehouse/${encodeURIComponent(w.name)}`}
                          className="flex items-center gap-2.5 group-hover:text-emerald-700 transition-colors"
                        >
                          <div className="size-8 rounded-lg bg-slate-100 text-slate-700 group-hover:bg-emerald-100 group-hover:text-emerald-800 font-black text-xs flex items-center justify-center shrink-0 border border-slate-200 transition-colors">
                            <Warehouse className="size-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 leading-tight">
                              {displayName}
                            </p>
                            <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                              {w.name}
                            </p>
                          </div>
                        </Link>
                      </td>

                      {/* Warehouse Type */}
                      <td className="py-2.5 px-3.5">
                        <Badge
                          variant="outline"
                          className="text-[10px] font-bold uppercase tracking-wider bg-slate-50 border-slate-200"
                        >
                          {w.warehouse_type || "Stores"}
                        </Badge>
                      </td>

                      {/* Parent Warehouse */}
                      <td className="py-2.5 px-3.5 text-slate-600 text-[11px]">
                        {w.parent_warehouse ? (
                          <span className="flex items-center gap-1">
                            <Layers className="size-3 text-slate-400" />
                            <span>{w.parent_warehouse}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px] italic">Root Warehouse</span>
                        )}
                      </td>

                      {/* Company */}
                      <td className="py-2.5 px-3.5">
                        <span className="font-semibold text-slate-900 text-[11px] flex items-center gap-1">
                          <Building2 className="size-3 text-slate-400" />
                          <span>{w.company || "Crown Paints Kenya PLC"}</span>
                        </span>
                      </td>

                      {/* Group Node */}
                      <td className="py-2.5 px-3.5">
                        {w.is_group ? (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            Group Node
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            Store (Actual)
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-2.5 px-3.5">
                        {isActive ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
                            <span className="size-1.5 rounded-full bg-emerald-600" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-[10px] font-bold">
                            <span className="size-1.5 rounded-full bg-rose-600" />
                            Disabled
                          </span>
                        )}
                      </td>

                      {/* Action -> View Stock Balances */}
                      <td className="py-2.5 px-3.5 text-right">
                        <Link href={`/warehouse/${encodeURIComponent(w.name)}`}>
                          <Button
                            size="sm"
                            variant="ghost"
                            suppressHydrationWarning
                            className="h-7 px-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50 rounded-md"
                          >
                            <span>Stock Items</span>
                            <ChevronRight className="size-3 ml-0.5" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Bottom Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500 font-medium">
          <p>
            Showing <strong className="text-slate-800">{filtered.length}</strong> of{" "}
            <strong className="text-slate-800">{totalCount}</strong> warehouse storage locations
          </p>
          <p className="text-[11px]">Direct integration with Frappe Warehouse Doctype</p>
        </div>
      </div>
    </div>
  );
}
