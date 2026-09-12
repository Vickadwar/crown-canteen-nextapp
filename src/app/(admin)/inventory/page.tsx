"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Package,
  Plus,
  RefreshCw,
  AlertTriangle,
  ChevronRight,
  Boxes,
  CheckCircle2,
  XCircle,
  Tag,
  DollarSign,
  Layers,
  ShieldCheck,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface ItemDoc {
  name: string; // item_code
  item_name?: string;
  item_group?: string;
  stock_uom?: string;
  valuation_rate?: number;
  standard_rate?: number;
  is_stock_item?: number;
  disabled?: number;
  description?: string;
}

// Fallback demo inventory items if bench database is clean or connecting offline
const defaultItems: ItemDoc[] = [
  {
    name: "RICE-BASMATI-50KG",
    item_name: "Rice (Basmati Grade A)",
    item_group: "Grains & Cereals",
    stock_uom: "Bags",
    valuation_rate: 6200,
    is_stock_item: 1,
    disabled: 0,
  },
  {
    name: "COOKING-OIL-20L",
    item_name: "Vegetable Cooking Oil",
    item_group: "Dry Goods & Condiments",
    stock_uom: "Jerrycans",
    valuation_rate: 4500,
    is_stock_item: 1,
    disabled: 0,
  },
  {
    name: "BEEF-CUTS-PRIME",
    item_name: "Prime Beef Cuts (Boneless)",
    item_group: "Meat & Butchery",
    stock_uom: "Kg",
    valuation_rate: 650,
    is_stock_item: 1,
    disabled: 0,
  },
  {
    name: "SUGAR-BROWN-50KG",
    item_name: "Brown Sugar 50kg",
    item_group: "Dry Goods & Condiments",
    stock_uom: "Bags",
    valuation_rate: 7100,
    is_stock_item: 1,
    disabled: 0,
  },
  {
    name: "MILK-WHOLE-500ML",
    item_name: "Fresh Whole Milk Packets",
    item_group: "Dairy & Beverages",
    stock_uom: "Packets",
    valuation_rate: 60,
    is_stock_item: 1,
    disabled: 0,
  },
  {
    name: "VEG-MIX-FRESH",
    item_name: "Fresh Green Vegetables Mix",
    item_group: "Vegetables & Greens",
    stock_uom: "Kg",
    valuation_rate: 120,
    is_stock_item: 1,
    disabled: 0,
  },
];

export default function InventoryPage() {
  const [items, setItems] = useState<ItemDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterGroup, setFilterGroup] = useState<string>("All");
  const [isLiveSync, setIsLiveSync] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch live Item Doctype
  const fetchLiveItems = async () => {
    setRefreshing(true);
    setErrorMsg(null);
    try {
      const params = new URLSearchParams({
        fields: JSON.stringify([
          "name",
          "item_name",
          "item_group",
          "stock_uom",
          "valuation_rate",
          "standard_rate",
          "is_stock_item",
          "disabled",
          "description",
        ]),
        limit_page_length: "150",
      });

      let res = await fetch(`/api/resource/Item?${params.toString()}`, {
        credentials: "include",
      });

      if (!res.ok && res.status !== 403 && res.status !== 401) {
        const fallbackParams = new URLSearchParams({
          fields: JSON.stringify(["*"]),
          limit_page_length: "150",
        });
        res = await fetch(`/api/resource/Item?${fallbackParams.toString()}`, {
          credentials: "include",
        });
      }

      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
          setItems(json.data);
          setIsLiveSync(true);
          setErrorMsg(null);
        } else {
          setItems(defaultItems);
          setIsLiveSync(true);
        }
      } else if (res.status === 403 || res.status === 401) {
        setIsLiveSync(false);
        setItems(defaultItems);
        setErrorMsg("Session expired or permission required for Item Doctype. Please sign in.");
      } else {
        const errJson = await res.json().catch(() => ({}));
        setIsLiveSync(false);
        setItems(defaultItems);
        setErrorMsg(errJson.message || `Server returned status ${res.status}`);
      }
    } catch (err: any) {
      setIsLiveSync(false);
      setItems(defaultItems);
      setErrorMsg(err.message || "Failed to reach Frappe API");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLiveItems();
  }, []);

  // Dynamically extract unique item groups
  const dynamicGroups = React.useMemo(() => {
    const groups = Array.from(
      new Set(
        items
          .map((i) => i.item_group?.trim())
          .filter((g): g is string => Boolean(g))
      )
    ).sort();
    return ["All", ...groups];
  }, [items]);

  // Filter list
  const filtered = items.filter((i) => {
    const name = (i.item_name || i.name || "").toLowerCase();
    const code = (i.name || "").toLowerCase();
    const group = (i.item_group || "").toLowerCase();
    const q = search.toLowerCase();

    const matchesSearch =
      name.includes(q) ||
      code.includes(q) ||
      group.includes(q);

    const matchesGroup =
      filterGroup === "All" || (i.item_group || "").trim() === filterGroup;

    return matchesSearch && matchesGroup;
  });

  const totalCount = items.length;
  const activeCount = items.filter((i) => !i.disabled).length;
  const stockItemsCount = items.filter((i) => i.is_stock_item).length;

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">
              Item & Inventory Catalog
            </h1>
            {isLiveSync ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
                <span className="size-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Live Item Doctype ({items.length} items)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold">
                <AlertTriangle className="size-3 text-amber-600" />
                Synced Cache
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Food ingredients, meal raw materials, packaging, and beverages synchronized with ERPNext Item master.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={fetchLiveItems}
            disabled={refreshing}
            suppressHydrationWarning
            className="h-8 gap-1.5 text-xs font-bold border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            <RefreshCw className={`size-3.5 ${refreshing ? "animate-spin text-emerald-600" : ""}`} />
            <span>{refreshing ? "Syncing…" : "Refresh"}</span>
          </Button>

          <Link href="/inventory/new">
            <Button
              size="sm"
              suppressHydrationWarning
              className="h-8 gap-1.5 text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>Add Item</span>
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
          { label: "Total SKUs", value: totalCount.toString(), icon: Package, color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
          { label: "Active Items", value: activeCount.toString(), icon: CheckCircle2, color: "text-teal-700 bg-teal-50 border-teal-200" },
          { label: "Stock Tracked", value: stockItemsCount.toString(), icon: Boxes, color: "text-slate-700 bg-slate-100 border-slate-200" },
          { label: "Catalog Sync", value: isLiveSync ? "100% Live" : "Cached", icon: ShieldCheck, color: isLiveSync ? "text-emerald-700 bg-emerald-50 border-emerald-200" : "text-amber-700 bg-amber-50 border-amber-200" },
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
            placeholder="Search by item code, name, or group…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            suppressHydrationWarning
            className="w-full h-8 pl-8 pr-3 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-600 focus:outline-none transition-all font-medium"
          />
        </div>

        {/* Dynamic Group Filter Pills */}
        <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto">
          {dynamicGroups.map((grp) => (
            <button
              key={grp}
              onClick={() => setFilterGroup(grp)}
              suppressHydrationWarning
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                filterGroup === grp
                  ? "bg-emerald-600 text-white font-black shadow-sm"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {grp}
            </button>
          ))}
        </div>
      </div>

      {/* ── High-Density Item Catalog Table ───────────────────────────────── */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center space-y-2">
            <RefreshCw className="size-6 text-emerald-600 animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-600">Connecting to Frappe Item Doctype…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Package className="size-8 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No inventory items match your filter.</p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => { setSearch(""); setFilterGroup("All"); fetchLiveItems(); }}
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
                  <th className="py-2.5 px-3.5">Item Name & SKU Code</th>
                  <th className="py-2.5 px-3.5">Item Group</th>
                  <th className="py-2.5 px-3.5">Stock Unit (UOM)</th>
                  <th className="py-2.5 px-3.5 text-right">Valuation Rate</th>
                  <th className="py-2.5 px-3.5">Stock Tracking</th>
                  <th className="py-2.5 px-3.5">Status</th>
                  <th className="py-2.5 px-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filtered.map((item) => {
                  const displayName = item.item_name || item.name;
                  const isActive = !item.disabled;
                  const rate = Number(item.valuation_rate || item.standard_rate) || 0;

                  return (
                    <tr
                      key={item.name}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Name + Code */}
                      <td className="py-2.5 px-3.5">
                        <Link
                          href={`/inventory/${encodeURIComponent(item.name)}`}
                          className="flex items-center gap-2.5 group-hover:text-emerald-700 transition-colors"
                        >
                          <div className="size-8 rounded-lg bg-slate-100 text-slate-700 group-hover:bg-emerald-100 group-hover:text-emerald-800 font-black text-xs flex items-center justify-center shrink-0 border border-slate-200 transition-colors">
                            <Package className="size-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 leading-tight">
                              {displayName}
                            </p>
                            <p className="text-[10px] font-mono text-emerald-700 font-bold mt-0.5">
                              {item.name}
                            </p>
                          </div>
                        </Link>
                      </td>

                      {/* Item Group */}
                      <td className="py-2.5 px-3.5">
                        <Badge
                          variant="outline"
                          className="text-[10px] font-bold uppercase tracking-wider bg-slate-50 border-slate-200"
                        >
                          {item.item_group || "Consumable"}
                        </Badge>
                      </td>

                      {/* Stock UOM */}
                      <td className="py-2.5 px-3.5">
                        <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px] border border-slate-200">
                          {item.stock_uom || "Units"}
                        </span>
                      </td>

                      {/* Valuation Rate */}
                      <td className="py-2.5 px-3.5 text-right font-mono font-bold text-slate-900">
                        KES {rate.toLocaleString("en-KE", { minimumFractionDigits: 2 })}
                      </td>

                      {/* Stock Item Flag */}
                      <td className="py-2.5 px-3.5">
                        {item.is_stock_item ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                            <Boxes className="size-3" /> Maintained
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">Non-Stock</span>
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

                      {/* Action */}
                      <td className="py-2.5 px-3.5 text-right">
                        <Link href={`/inventory/${encodeURIComponent(item.name)}`}>
                          <Button
                            size="sm"
                            variant="ghost"
                            suppressHydrationWarning
                            className="h-7 px-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50 rounded-md"
                          >
                            <span>Stock Levels</span>
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
            <strong className="text-slate-800">{totalCount}</strong> inventory items
          </p>
          <p className="text-[11px]">Direct integration with Frappe Item Doctype</p>
        </div>
      </div>
    </div>
  );
}
