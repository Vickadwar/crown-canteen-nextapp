"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  ArrowDownToLine,
  Warehouse,
  Package,
  Plus,
  Trash2,
  Save,
  Check,
  AlertCircle,
  Sparkles,
  Calendar,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReceiptItemRow {
  item_code: string;
  qty: number;
  uom: string;
  rate: number;
}

function StockReceiptForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialWarehouse = searchParams.get("warehouse") || "";
  const initialItem = searchParams.get("item") || "";

  const [toWarehouse, setToWarehouse] = useState(initialWarehouse);
  const [supplier, setSupplier] = useState("");
  const [postingDate, setPostingDate] = useState(new Date().toISOString().split("T")[0]);
  const [remarks, setRemarks] = useState("Supplier delivery & fresh inventory intake");
  const [items, setItems] = useState<ReceiptItemRow[]>([
    { item_code: initialItem, qty: 1, uom: "Kg", rate: 0 },
  ]);

  const [warehousesList, setWarehousesList] = useState<{ name: string; warehouse_name?: string }[]>([]);
  const [suppliersList, setSuppliersList] = useState<{ name: string; supplier_name?: string }[]>([]);
  const [itemsList, setItemsList] = useState<{ name: string; item_name?: string; stock_uom?: string; valuation_rate?: number }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Load live Warehouses, Suppliers, & Items
  useEffect(() => {
    const loadOptions = async () => {
      try {
        // 1. Warehouses
        const whRes = await fetch(
          '/api/resource/Warehouse?fields=["name","warehouse_name"]&limit_page_length=50',
          { credentials: "include" }
        );
        if (whRes.ok) {
          const json = await whRes.json();
          if (json.data && Array.isArray(json.data) && json.data.length > 0) {
            setWarehousesList(json.data);
            if (!initialWarehouse) {
              setToWarehouse(json.data[0].name);
            }
          }
        }

        // 2. Suppliers
        const supRes = await fetch(
          '/api/resource/Supplier?fields=["name","supplier_name"]&limit_page_length=50',
          { credentials: "include" }
        );
        if (supRes.ok) {
          const sJson = await supRes.json();
          if (sJson.data && Array.isArray(sJson.data) && sJson.data.length > 0) {
            setSuppliersList(sJson.data);
            setSupplier(sJson.data[0].name);
          }
        }

        // 3. Items
        const itemRes = await fetch(
          '/api/resource/Item?fields=["name","item_name","stock_uom","valuation_rate"]&limit_page_length=100',
          { credentials: "include" }
        );
        if (itemRes.ok) {
          const iJson = await itemRes.json();
          if (iJson.data && Array.isArray(iJson.data) && iJson.data.length > 0) {
            setItemsList(iJson.data);
            if (!initialItem) {
              setItems([
                {
                  item_code: iJson.data[0].name,
                  qty: 1,
                  uom: iJson.data[0].stock_uom || "Kg",
                  rate: iJson.data[0].valuation_rate || 0,
                },
              ]);
            }
          }
        }
      } catch {
        setWarehousesList([{ name: "Main Stores - CP", warehouse_name: "Main Kitchen Stores" }]);
        if (!initialWarehouse) setToWarehouse("Main Stores - CP");
      }
    };

    loadOptions();
  }, [initialWarehouse, initialItem]);

  const handleAddItem = () => {
    const firstItem = itemsList[0];
    setItems([
      ...items,
      {
        item_code: firstItem ? firstItem.name : "",
        qty: 1,
        uom: firstItem?.stock_uom || "Kg",
        rate: firstItem?.valuation_rate || 0,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemCodeChange = (index: number, code: string) => {
    const selected = itemsList.find((i) => i.name === code);
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      item_code: code,
      uom: selected?.stock_uom || updated[index].uom,
      rate: selected?.valuation_rate || updated[index].rate,
    };
    setItems(updated);
  };

  const handleQtyChange = (index: number, val: number) => {
    const updated = [...items];
    updated[index] = { ...updated[index], qty: val };
    setItems(updated);
  };

  const handleRateChange = (index: number, val: number) => {
    const updated = [...items];
    updated[index] = { ...updated[index], rate: val };
    setItems(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!toWarehouse) {
      setErrorMsg("Target Warehouse is required.");
      return;
    }

    const validItems = items.filter((i) => i.item_code && i.qty > 0);
    if (validItems.length === 0) {
      setErrorMsg("Please specify at least one valid item to receive.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        stock_entry_type: "Material Receipt",
        purpose: "Material Receipt",
        posting_date: postingDate,
        to_warehouse: toWarehouse,
        remarks: `${remarks} ${supplier ? `(Supplier: ${supplier})` : ""}`.trim(),
        items: validItems.map((i) => ({
          t_warehouse: toWarehouse,
          item_code: i.item_code,
          qty: Number(i.qty),
          uom: i.uom,
          basic_rate: Number(i.rate) || 0,
        })),
      };

      const res = await fetch("/api/resource/Stock%20Entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccessMsg("Stock Receipt voucher created successfully!");
        setTimeout(() => {
          router.push(`/warehouse/${encodeURIComponent(toWarehouse)}`);
        }, 800);
      } else {
        const json = await res.json().catch(() => ({}));
        setErrorMsg(json.message || "Failed to submit Stock Receipt to Frappe.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to reach server.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3 text-xs">
          <AlertCircle className="size-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Stock Entry Error</p>
            <p className="font-medium">{errorMsg}</p>
          </div>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3 text-xs font-bold">
          <Check className="size-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-3.5">
        {/* Target Warehouse */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">
            Target Warehouse (Receive Into) <span className="text-rose-500">*</span>
          </label>
          <Select value={toWarehouse} onValueChange={setToWarehouse}>
            <SelectTrigger className="w-full h-9 text-xs font-semibold">
              <SelectValue placeholder="Select Target Warehouse" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {warehousesList.map((w) => (
                <SelectItem key={w.name} value={w.name} className="text-xs">
                  {w.warehouse_name || w.name} ({w.name})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Delivering Supplier */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">
            Delivering Supplier (Optional)
          </label>
          <Select value={supplier} onValueChange={setSupplier}>
            <SelectTrigger className="w-full h-9 text-xs font-semibold">
              <SelectValue placeholder="Select Supplier" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {suppliersList.map((s) => (
                <SelectItem key={s.name} value={s.name} className="text-xs">
                  {s.supplier_name || s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Posting Date */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">
            Posting Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
            <Input
              type="date"
              value={postingDate}
              onChange={(e) => setPostingDate(e.target.value)}
              className="h-9 pl-9 text-xs font-semibold"
            />
          </div>
        </div>

        {/* Remarks */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">
            Delivery Note / Invoice Ref
          </label>
          <Input
            type="text"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="e.g. GRN-2026-0901 Fresh Grains Intake"
            className="h-9 text-xs font-medium"
          />
        </div>
      </div>

      {/* ── Items to Receive Table ───────────────────────────────────────── */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
            Received Items & Unit Rates
          </h3>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleAddItem}
            className="h-7 text-xs font-bold gap-1 border-slate-200"
          >
            <Plus className="size-3" /> Add Item
          </Button>
        </div>

        <div className="space-y-2">
          {items.map((row, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80"
            >
              {/* Item Select */}
              <div className="flex-1">
                <Select
                  value={row.item_code}
                  onValueChange={(val) => handleItemCodeChange(idx, val)}
                >
                  <SelectTrigger className="w-full h-8 text-xs bg-white">
                    <SelectValue placeholder="Select Item to Receive" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {itemsList.map((item) => (
                      <SelectItem key={item.name} value={item.name} className="text-xs">
                        {item.item_name || item.name} ({item.name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Quantity */}
              <div className="w-24">
                <Input
                  type="number"
                  min="0.1"
                  step="any"
                  value={row.qty}
                  onChange={(e) => handleQtyChange(idx, parseFloat(e.target.value) || 0)}
                  className="h-8 text-xs font-bold text-center bg-white"
                />
              </div>

              {/* UOM */}
              <div className="w-20">
                <Input
                  type="text"
                  value={row.uom}
                  disabled
                  className="h-8 text-xs font-semibold text-center bg-slate-100 opacity-80"
                />
              </div>

              {/* Basic Unit Rate */}
              <div className="w-28">
                <Input
                  type="number"
                  min="0"
                  step="any"
                  value={row.rate}
                  onChange={(e) => handleRateChange(idx, parseFloat(e.target.value) || 0)}
                  placeholder="KES Rate"
                  className="h-8 text-xs font-mono font-semibold text-right bg-white"
                />
              </div>

              {/* Remove Row */}
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => handleRemoveItem(idx)}
                disabled={items.length <= 1}
                className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
        <Link href="/warehouse">
          <Button
            type="button"
            variant="outline"
            className="h-9 text-xs font-bold border-slate-200 text-slate-700"
          >
            Cancel
          </Button>
        </Link>
        <Button
          type="submit"
          disabled={submitting}
          className="h-9 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md shadow-emerald-600/20 cursor-pointer"
        >
          <Save className="size-3.5 mr-1" />
          <span>{submitting ? "Posting Receipt…" : "Submit Stock Receipt"}</span>
        </Button>
      </div>
    </form>
  );
}

export default function NewStockReceiptPage() {
  return (
    <div className="space-y-4 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* ── Breadcrumb Bar ────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 px-4 rounded-xl border border-slate-200 shadow-sm">
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap">
          <Link href="/overview" className="hover:text-emerald-700 font-medium flex items-center gap-1">
            <Home className="size-3.5 text-slate-400" />
            <span>Dashboard</span>
          </Link>
          <ChevronRight className="size-3 text-slate-400" />
          <Link href="/warehouse" className="hover:text-emerald-700 font-medium">
            Warehouses
          </Link>
          <ChevronRight className="size-3 text-slate-400" />
          <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
            New Stock Receipt (Material Inward)
          </span>
        </nav>

        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
          <ArrowDownToLine className="size-3 text-emerald-600" /> Material Receipt
        </span>
      </div>

      <Suspense fallback={<div className="p-8 text-center text-xs font-bold text-slate-500">Loading stock receipt form…</div>}>
        <StockReceiptForm />
      </Suspense>
    </div>
  );
}
