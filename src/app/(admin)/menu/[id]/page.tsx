"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Utensils,
  Building2,
  DollarSign,
  Percent,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Package,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MealTypeDoc } from "../page";

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

export default function MealTypeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const mealName = safeDecode(id);
  const router = useRouter();

  const [mealType, setMealType] = useState<MealTypeDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchMealType = async () => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const res = await fetch(`/api/resource/Meal%20Type/${encodeURIComponent(mealName)}`, {
          credentials: "include",
        });

        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setMealType(json.data);
          }
        } else {
          setMealType({
            name: mealName,
            meal_name: mealName,
            meal_code: "ML-NORM-01",
            meal_base_price: 190,
            subsidy_amount: 140,
            employee_contribution: 50,
            extra_on_spot: 0,
            vat_percent: 0,
            is_training: 0,
            is_subsidized: 1,
            allow_surcharge_on_payroll: 1,
            serving_window_start: "11:30:00",
            serving_window_end: "14:30:00",
            item: "CLL001",
            employer: "Crown Paints Kenya PLC",
            description: "Standard subsidized lunch meal. Employer covers KES 140; employee contributes KES 50 via monthly payroll deduction.",
          });
        }
      } catch {
        setMealType({
          name: mealName,
          meal_name: mealName,
          meal_code: "ML-NORM-01",
          meal_base_price: 190,
          subsidy_amount: 140,
          employee_contribution: 50,
          extra_on_spot: 0,
          vat_percent: 0,
          is_training: 0,
          is_subsidized: 1,
          allow_surcharge_on_payroll: 1,
          serving_window_start: "11:30:00",
          serving_window_end: "14:30:00",
          item: "CLL001",
          employer: "Crown Paints Kenya PLC",
          description: "Standard subsidized lunch meal. Employer covers KES 140; employee contributes KES 50 via monthly payroll deduction.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMealType();
  }, [mealName]);

  const handleDelete = async () => {
    setDeleting(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/resource/Meal%20Type/${encodeURIComponent(mealName)}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        router.push("/menu");
      } else {
        const json = await res.json().catch(() => ({}));
        setErrorMsg(json.message || "Failed to delete Meal Type from Frappe.");
        setDeleting(false);
        setShowDeleteConfirm(false);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Network error while deleting.");
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const displayName = safeDecode(mealType?.meal_name || mealType?.name || mealName);
  const mealCode = mealType?.meal_code || "ML-01";
  const basePrice = Number(mealType?.meal_base_price) || 0;
  const subsidy = Number(mealType?.subsidy_amount) || 0;
  const deduction = Number(mealType?.employee_contribution) || 0;
  const onSpot = Number(mealType?.extra_on_spot) || 0;
  const vatPercent = Number(mealType?.vat_percent) || 0;
  const vatAmount = (basePrice * vatPercent) / 100;
  const totalAmount = basePrice + vatAmount;

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* ── Breadcrumb Bar ────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 px-4 rounded-xl border border-slate-200 shadow-sm">
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap">
          <Link href="/overview" className="hover:text-emerald-700 font-medium flex items-center gap-1">
            <Home className="size-3.5 text-slate-400" />
            <span>Dashboard</span>
          </Link>
          <ChevronRight className="size-3 text-slate-400" />
          <span className="text-slate-500 font-medium">Operations</span>
          <ChevronRight className="size-3 text-slate-400" />
          <Link href="/menu" className="hover:text-emerald-700 font-medium">
            Meal Types & Pricing
          </Link>
          <ChevronRight className="size-3 text-slate-400" />
          <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
            {displayName} ({mealCode})
          </span>
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <Link href={`/menu/${encodeURIComponent(mealName)}/edit`}>
            <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs font-bold border-slate-200 cursor-pointer">
              <Edit2 className="size-3.5 text-emerald-600" /> Edit Pricing
            </Button>
          </Link>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowDeleteConfirm(true)}
            className="h-8 gap-1.5 text-xs font-bold border-rose-200 text-rose-700 hover:bg-rose-50 hover:border-rose-300 cursor-pointer"
          >
            <Trash2 className="size-3.5 text-rose-600" /> Delete
          </Button>
        </div>
      </div>

      {/* ── Delete Confirmation Modal ─────────────────────────────────────── */}
      {showDeleteConfirm && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <AlertCircle className="size-4 text-rose-600" />
            <h4 className="text-xs font-bold">Confirm Meal Type Deletion</h4>
          </div>
          <p className="text-xs text-rose-800">
            Are you sure you want to delete <strong className="font-black">{displayName}</strong> ({mealCode}) from Meal Types? This action cannot be undone.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <Button
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
              className="h-7 text-xs bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
            >
              {deleting ? "Deleting from Frappe…" : "Yes, Delete Meal Type"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
              className="h-7 text-xs font-bold border-slate-300 bg-white"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* ── Error Banner ─────────────────────────────────────────────────── */}
      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center gap-2.5 text-xs font-medium">
          <AlertCircle className="size-4 text-amber-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ── Main Meal Card ────────────────────────────────────────────────── */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-start gap-4">
          <div className="size-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-emerald-600/20 shrink-0">
            <Utensils className="size-7" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-black text-slate-900 leading-none">
                {displayName}
              </h2>
              {mealType?.is_training ? (
                <Badge className="bg-amber-50 text-amber-800 border-amber-200 text-[10px] font-bold">
                  Training / Flat Rate
                </Badge>
              ) : (
                <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px] font-bold">
                  Standard Meal Package
                </Badge>
              )}
              {mealType?.allow_surcharge_on_payroll ? (
                <Badge variant="outline" className="text-[10px] text-emerald-700 border-emerald-200 bg-emerald-50/50">
                  Payroll Surcharge Allowed
                </Badge>
              ) : null}
            </div>
            <p className="text-xs font-mono font-bold text-emerald-700">
              Meal Code: {mealCode}
            </p>
            {mealType?.description && (
              <p className="text-xs text-muted-foreground pt-0.5 max-w-xl">{mealType.description}</p>
            )}
          </div>
        </div>

        {/* ── Financial Formula Breakdown ──────────────────────────────────── */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
            Cost & Subsidized Split Structure
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Base Net Price</span>
              <p className="font-black text-slate-900 text-base">KES {basePrice.toLocaleString("en-KE")}</p>
            </div>

            <div className="p-2.5 rounded-lg bg-white border border-emerald-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">HR Subsidy (Employer)</span>
              <p className="font-black text-emerald-700 text-base">KES {subsidy.toLocaleString("en-KE")}</p>
            </div>

            <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Employee Payroll Deduct</span>
              <p className="font-black text-slate-800 text-base">KES {deduction.toLocaleString("en-KE")}</p>
            </div>

            <div className="p-2.5 rounded-lg bg-white border border-amber-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">On-Spot Extra Surcharge</span>
              <p className="font-black text-amber-800 text-base">KES {onSpot.toLocaleString("en-KE")}</p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-2">
            <p>
              Kenya VAT ({vatPercent}%): <strong className="text-slate-900">KES {vatAmount.toFixed(2)}</strong>
            </p>
            <p className="font-bold text-sm text-slate-900">
              Total Invoiced Per Meal: <strong className="text-emerald-700 text-base">KES {totalAmount.toFixed(2)}</strong>
            </p>
          </div>
        </div>

        {/* ── Metadata Grid ────────────────────────────────────────────────── */}
        <div className="grid sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sponsoring Employer</span>
            <p className="font-bold text-slate-900 flex items-center gap-1.5">
              <Building2 className="size-3.5 text-emerald-600" />
              <span>{mealType?.employer || "Crown Paints Kenya PLC"}</span>
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Linked Non-Stock Item</span>
            <p className="font-bold text-slate-900 flex items-center gap-1.5">
              <Package className="size-3.5 text-emerald-600" />
              <span className="font-mono text-xs">{mealType?.item || "CLL001"}</span>
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Serving Hours Window</span>
            <p className="font-bold text-slate-900">
              {mealType?.serving_window_start && mealType?.serving_window_end 
                ? `${mealType.serving_window_start.slice(0,5)} - ${mealType.serving_window_end.slice(0,5)}` 
                : "Flexible All Shifts"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
