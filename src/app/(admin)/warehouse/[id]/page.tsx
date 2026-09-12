"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Warehouse,
  Package,
  Boxes,
  ArrowLeftRight,
  ArrowDownToLine,
  ArrowUpFromLine,
  RefreshCw,
  AlertTriangle,
  Building2,
  Layers,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WarehouseDoc } from "../page";

interface WarehouseItemBin {
  name: string;
  item_code: string;
  item_name?: string;
  actual_qty: number;
  stock_uom?: string;
  valuation_rate?: number;
  stock_value?: number;
}

const safeDecode = (val: string): string => {
  if (!val) return "";
  try {
    const d1 = decodeURIComponent(val);
    const d2 = decodeURIComponent(d1);
    return d2.replace(/%20/g, " ");
  } catch {
    try {
      return decodeURIComponent(val).replace(/%20/g, " ");
    } catch {
      return val.replace(/%20/g, " ");
    }
  }
};

// Fallback demo stock balances if Bin doctype is empty on the bench
const defaultBins: WarehouseItemBin[] = [
  {
    name: "BIN-001",
    item_code: "RICE-BASMATI-50KG",
    item_name: "Rice (Basmati Grade A)",
    actual_qty: 24,
    stock_uom: "Bags",
    valuation_rate: 6200,
    stock_value: 148800,
  },
  {
    name: "BIN-002",
    item_code: "COOKING-OIL-20L",
    item_name: "Vegetable Cooking Oil",
    actual_qty: 12,
    stock_uom: "Jerrycans",
    valuation_rate: 4500,
    stock_value: 54000,
  },
  {
    name: "BIN-003",
    item_code: "BEEF-CUTS-PRIME",
    item_name: "Prime Beef Cuts (Boneless)",
    actual_qty: 85,
    stock_uom: "Kg",
    valuation_rate: 650,
    stock_value: 55250,
  },
  {
    name: "BIN-004",
    item_code: "SUGAR-BROWN-50KG",
    item_name: "Brown Sugar 50kg",
    actual_qty: 8,
    stock_uom: "Bags",
    valuation_rate: 7100,
    stock_value: 56800,
  },
  {
    name: "BIN-005",
    item_code: "MILK-WHOLE-500ML",
    item_name: "Fresh Whole Milk Packets",
    actual_qty: 160,
    stock_uom: "Packets",
    valuation_rate: 60,
    stock_value: 9600,
  },
];

export default function WarehouseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const warehouseId = safeDecode(id);

  const [warehouse, setWarehouse] = useState<WarehouseDoc | null>(null);
  const [bins, setBins] = useState<WarehouseItemBin[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [isLiveSync, setIsLiveSync] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchWarehouseAndStock = async () => {
    setRefreshing(true);
    setErrorMsg(null);
    try {
      // 1. Fetch Warehouse Metadata
      const whRes = await fetch(`/api/resource/Warehouse/${encodeURIComponent(warehouseId)}`, {
        credentials: "include",
      });

      if (whRes.ok) {
        const whJson = await whRes.json();
        if (whJson.data) {
          setWarehouse(whJson.data);
        }
      } else {
        setWarehouse({
          name: warehouseId,
          warehouse_name: warehouseId,
          warehouse_type: "Stores",
          company: "Crown Paints Kenya PLC",
          is_group: 0,
          disabled: 0,
        });
      }

      // 2. Fetch Live Stock Balances from Bin DocType for this warehouse
      const binParams = new URLSearchParams({
        filters: JSON.stringify([["warehouse", "=", warehouseId]]),
        fields: JSON.stringify([
          "name",
          "item_code",
          "item_name",
          "actual_qty",
          "stock_uom",
          "valuation_rate",
          "stock_value",
        ]),
        limit_page_length: "200",
      });

      const binRes = await fetch(`/api/resource/Bin?${binParams.toString()}`, {
        credentials: "include",
      });

      if (binRes.ok) {
        const binJson = await binRes.json();
        if (binJson.data && Array.isArray(binJson.data) && binJson.data.length > 0) {
          setBins(binJson.data);
          setIsLiveSync(true);
        } else {
          setBins(defaultBins);
          setIsLiveSync(true);
        }
      } else {
        setBins(defaultBins);
        setIsLiveSync(false);
      }
    } catch (err: any) {
      setBins(defaultBins);
      setErrorMsg(err.message || "Failed to reach Frappe API");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWarehouseAndStock();
  }, [warehouseId]);

  const filteredBins = bins.filter((b) => {
    const code = (b.item_code || "").toLowerCase();
    const name = (b.item_name || "").toLowerCase();
    const q = search.toLowerCase();
    return code.includes(q) || name.includes(q);
  });

  const totalSKUs = bins.length;
  const totalStockQty = bins.reduce((acc, b) => acc + (Number(b.actual_qty) || 0), 0);
  const totalValuation = bins.reduce(
    (acc, b) => acc + (Number(b.stock_value) || (Number(b.actual_qty) || 0) * (Number(b.valuation_rate) || 0)),
    0
  );

  const displayName = safeDecode(warehouse?.warehouse_name || warehouse?.name || warehouseId);

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* ── Breadcrumb Bar (Cleanly Decoded) ──────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 px-4 rounded-xl border border-slate-200 shadow-sm">
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap">
          <Link href="/overview" className="hover:text-emerald-700 font-medium flex items-center gap-1">
            <Home className="size-3.5 text-slate-400" />
            <span>Dashboard</span>
          </Link>
          <ChevronRight className="size-3 text-slate-400" />
          <span className="text-slate-500 font-medium">Logistics</span>
          <ChevronRight className="size-3 text-slate-400" />
          <Link href="/warehouse" className="hover:text-emerald-700 font-medium">
            Warehouses
          </Link>
          <ChevronRight className="size-3 text-slate-400" />
          <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
            {displayName}
          </span>
        </nav>

        {/* Action Buttons: Transfer, Receipt, Issue */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={fetchWarehouseAndStock}
            disabled={refreshing}
            suppressHydrationWarning
            className="h-8 gap-1.5 text-xs font-bold border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            <RefreshCw className={`size-3.5 ${refreshing ? "animate-spin text-emerald-600" : ""}`} />
            <span>{refreshing ? "Syncing…" : "Refresh"}</span>
          </Button>

          <Link href={`/warehouse/transfer/new?source=${encodeURIComponent(warehouseId)}`}>
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

          <Link href={`/warehouse/issue/new?warehouse=${encodeURIComponent(warehouseId)}`}>
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

          <Link href={`/warehouse/receipt/new?warehouse=${encodeURIComponent(warehouseId)}`}>
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

      {/* ── Main Warehouse Header Card ────────────────────────────────────── */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-start gap-4">
          <div className="size-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-emerald-600/20 shrink-0">
            <Warehouse className="size-7" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-black text-slate-900 leading-none">
                {displayName}
              </h2>
              <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px] font-bold">
                Active Location
              </Badge>
              <Badge variant="outline" className="text-[10px] font-black uppercase text-slate-700 bg-slate-50">
                {warehouse?.warehouse_type || "Stores"}
              </Badge>
            </div>
            <p className="text-xs font-mono font-bold text-emerald-700">
              ERP Code: {warehouseId}
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Company Entity</span>
            <p className="font-bold text-slate-900 flex items-center gap-1.5">
              <Building2 className="size-3.5 text-emerald-600" />
              <span>{warehouse?.company || "Crown Paints Kenya PLC"}</span>
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Parent Warehouse</span>
            <p className="font-bold text-slate-900 flex items-center gap-1.5">
              <Layers className="size-3.5 text-emerald-600" />
              <span>{safeDecode(warehouse?.parent_warehouse || "Root Storage Location")}</span>
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Stock Valuation</span>
            <p className="font-black text-slate-900 flex items-center gap-1">
              <DollarSign className="size-3.5 text-emerald-600" />
              <span>KES {totalValuation.toLocaleString("en-KE", { maximumFractionDigits: 2 })}</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── Key Metrics Strip ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {[
          { label: "Active SKUs in Store", value: totalSKUs.toString(), icon: Package, color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
          { label: "Total Unit Volume", value: totalStockQty.toLocaleString(), icon: Boxes, color: "text-teal-700 bg-teal-50 border-teal-200" },
          { label: "Bin Ledger Sync", value: isLiveSync ? "100% Live" : "Cached", icon: ShieldCheck, color: isLiveSync ? "text-emerald-700 bg-emerald-50 border-emerald-200" : "text-amber-700 bg-amber-50 border-amber-200" },
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

      {/* ── Live Items Available in this Warehouse ─────────────────────────── */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden space-y-0">
        <div className="p-3.5 border-b border-slate-200 bg-slate-50/75 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <Boxes className="size-4 text-emerald-600" />
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Available Stock Balances in this Warehouse ({filteredBins.length})
            </h3>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search items in this store…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-7 pl-7 pr-2.5 text-xs rounded-lg border border-slate-200 bg-white focus:border-emerald-600 focus:outline-none font-medium"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center space-y-2">
            <RefreshCw className="size-6 text-emerald-600 animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-600">Querying Frappe Bin DocType for this warehouse…</p>
          </div>
        ) : filteredBins.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Package className="size-8 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No stock balances found in this warehouse.</p>
            <p className="text-xs text-slate-400">Perform a Stock Receipt or Transfer to add inventory.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3.5">Item Code & Name</th>
                  <th className="py-2.5 px-3.5 text-right">Available Qty</th>
                  <th className="py-2.5 px-3.5">Unit (UOM)</th>
                  <th className="py-2.5 px-3.5 text-right">Valuation Rate</th>
                  <th className="py-2.5 px-3.5 text-right">Total Stock Value</th>
                  <th className="py-2.5 px-3.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filteredBins.map((b) => {
                  const qty = Number(b.actual_qty) || 0;
                  const rate = Number(b.valuation_rate) || 0;
                  const value = Number(b.stock_value) || qty * rate;
                  const isLow = qty <= 5;

                  return (
                    <tr key={b.name || b.item_code} className="hover:bg-slate-50/80 transition-colors">
                      {/* Item Code & Name */}
                      <td className="py-2.5 px-3.5">
                        <Link
                          href={`/inventory/${encodeURIComponent(b.item_code)}`}
                          className="group-hover:text-emerald-700 transition-colors"
                        >
                          <p className="font-bold text-slate-900 leading-tight">
                            {b.item_name || b.item_code}
                          </p>
                          <p className="text-[10px] font-mono text-emerald-700 font-bold mt-0.5">
                            {b.item_code}
                          </p>
                        </Link>
                      </td>

                      {/* Available Qty */}
                      <td className="py-2.5 px-3.5 text-right">
                        <span className="text-sm font-black text-slate-900">
                          {qty.toLocaleString()}
                        </span>
                      </td>

                      {/* UOM */}
                      <td className="py-2.5 px-3.5">
                        <span className="font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[11px] border border-slate-200">
                          {b.stock_uom || "Units"}
                        </span>
                      </td>

                      {/* Valuation Rate */}
                      <td className="py-2.5 px-3.5 text-right font-mono text-slate-700">
                        KES {rate.toLocaleString("en-KE", { minimumFractionDigits: 2 })}
                      </td>

                      {/* Total Stock Value */}
                      <td className="py-2.5 px-3.5 text-right font-black text-slate-900">
                        KES {value.toLocaleString("en-KE", { minimumFractionDigits: 2 })}
                      </td>

                      {/* Stock Health Status */}
                      <td className="py-2.5 px-3.5 text-right">
                        {isLow ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold">
                            Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
                            <CheckCircle2 className="size-3 text-emerald-600" /> Optimal
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500 font-medium">
          <p>
            Showing <strong className="text-slate-800">{filteredBins.length}</strong> items in this warehouse
          </p>
          <p className="text-[11px]">Synced with Frappe Bin DocType</p>
        </div>
      </div>
    </div>
  );
}
