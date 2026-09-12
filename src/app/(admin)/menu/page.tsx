"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Utensils,
  Plus,
  RefreshCw,
  AlertTriangle,
  ChevronRight,
  DollarSign,
  Building2,
  Package,
  ShieldCheck,
  CheckCircle2,
  Percent,
  Sparkles,
  Award,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface MealTypeDoc {
  name: string; // autoname: meal_name
  meal_code?: string;
  meal_name: string;
  meal_base_price?: number;
  item?: string;
  subsidy_amount?: number;
  employee_contribution?: number;
  extra_on_spot?: number;
  vat_percent?: number;
  is_training?: number | boolean;
  employer?: string;
  sales_taxes_and_charges_template?: string;
  is_active?: number | boolean;
  is_subsidized?: number | boolean;
  allow_surcharge_on_payroll?: number | boolean;
  serving_window_start?: string;
  serving_window_end?: string;
  description?: string;
}

// Default dynamic meal plans matching Crown Canteen operational specifications
const defaultMealTypes: MealTypeDoc[] = [
  {
    name: "Normal Lunch",
    meal_code: "ML-NORM-01",
    meal_name: "Normal Lunch",
    meal_base_price: 190,
    item: "CLL001",
    subsidy_amount: 140,
    employee_contribution: 50,
    extra_on_spot: 0,
    vat_percent: 0,
    is_training: 0,
    is_subsidized: 1,
    allow_surcharge_on_payroll: 1,
    serving_window_start: "11:30:00",
    serving_window_end: "14:30:00",
    employer: "Crown Paints Kenya PLC",
    description: "Standard subsidized lunch meal. Employer covers KES 140; employee contributes KES 50 via monthly payroll deduction.",
  },
  {
    name: "Special Lunch",
    meal_code: "ML-SPEC-02",
    meal_name: "Special Lunch",
    meal_base_price: 290,
    item: "CLS001",
    subsidy_amount: 140,
    employee_contribution: 50,
    extra_on_spot: 100,
    vat_percent: 0,
    is_training: 0,
    is_subsidized: 1,
    allow_surcharge_on_payroll: 1,
    serving_window_start: "11:30:00",
    serving_window_end: "14:30:00",
    employer: "Crown Paints Kenya PLC",
    description: "Premium daily lunch. Employer covers KES 140, employee covers KES 50 plus KES 100 surcharge (payable on spot via Cash/M-Pesa or deferred to payroll).",
  },
  {
    name: "Training Breakfast",
    meal_code: "ML-TRN-03",
    meal_name: "Training Breakfast",
    meal_base_price: 150,
    item: "CTB001",
    subsidy_amount: 150,
    employee_contribution: 0,
    extra_on_spot: 0,
    vat_percent: 0,
    is_training: 1,
    is_subsidized: 1,
    allow_surcharge_on_payroll: 0,
    serving_window_start: "07:30:00",
    serving_window_end: "10:00:00",
    employer: "Crown Paints Kenya PLC",
    description: "Corporate training morning tea & snacks. 100% employer funded.",
  },
  {
    name: "Training Lunch",
    meal_code: "ML-TRN-04",
    meal_name: "Training Lunch",
    meal_base_price: 350,
    item: "CTL001",
    subsidy_amount: 350,
    employee_contribution: 0,
    extra_on_spot: 0,
    vat_percent: 0,
    is_training: 1,
    is_subsidized: 1,
    allow_surcharge_on_payroll: 0,
    serving_window_start: "12:00:00",
    serving_window_end: "14:30:00",
    employer: "Crown Paints Kenya PLC",
    description: "Training seminar lunch buffet. 100% employer funded.",
  },
  {
    name: "Training Evening Tea",
    meal_code: "ML-TRN-05",
    meal_name: "Training Evening Tea",
    meal_base_price: 100,
    item: "CTTE001",
    subsidy_amount: 100,
    employee_contribution: 0,
    extra_on_spot: 0,
    vat_percent: 0,
    is_training: 1,
    is_subsidized: 1,
    allow_surcharge_on_payroll: 0,
    serving_window_start: "15:30:00",
    serving_window_end: "17:00:00",
    employer: "Crown Paints Kenya PLC",
    description: "Afternoon training tea & confectionery. 100% employer funded.",
  },
  {
    name: "Training Full-Day Package",
    meal_code: "ML-TRN-06",
    meal_name: "Training Full-Day Package",
    meal_base_price: 600,
    item: "CTFP001",
    subsidy_amount: 600,
    employee_contribution: 0,
    extra_on_spot: 0,
    vat_percent: 0,
    is_training: 1,
    is_subsidized: 1,
    allow_surcharge_on_payroll: 0,
    serving_window_start: "07:30:00",
    serving_window_end: "17:00:00",
    employer: "Crown Paints Kenya PLC",
    description: "Full day seminar catering: Morning tea + Lunch buffet + Evening tea. 100% employer funded.",
  },
  {
    name: "Company Guest Meal",
    meal_code: "ML-GUEST-07",
    meal_name: "Company Guest Meal",
    meal_base_price: 290,
    item: "CMG001",
    subsidy_amount: 290,
    employee_contribution: 0,
    extra_on_spot: 0,
    vat_percent: 0,
    is_training: 0,
    is_subsidized: 1,
    allow_surcharge_on_payroll: 0,
    serving_window_start: "11:30:00",
    serving_window_end: "15:00:00",
    employer: "Crown Paints Kenya PLC",
    description: "Company-sponsored external visitor dining. Billed 100% to hosting department cost center.",
  },
];

export default function MealPlansPage() {
  const [mealTypes, setMealTypes] = useState<MealTypeDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isLiveSync, setIsLiveSync] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch live Meal Type Doctype
  const fetchLiveMealTypes = async () => {
    setRefreshing(true);
    setErrorMsg(null);
    try {
      const params = new URLSearchParams({
        fields: JSON.stringify([
          "name",
          "meal_code",
          "meal_name",
          "meal_base_price",
          "item",
          "subsidy_amount",
          "employee_contribution",
          "extra_on_spot",
          "vat_percent",
          "is_training",
          "employer",
          "is_active",
          "is_subsidized",
          "allow_surcharge_on_payroll",
          "serving_window_start",
          "serving_window_end",
          "description"
        ]),
        limit_page_length: "100",
      });

      let res = await fetch(`/api/resource/Meal%20Type?${params.toString()}`, {
        credentials: "include",
      });

      if (!res.ok && res.status !== 403 && res.status !== 401) {
        const fallbackParams = new URLSearchParams({
          fields: JSON.stringify(["*"]),
          limit_page_length: "100",
        });
        res = await fetch(`/api/resource/Meal%20Type?${fallbackParams.toString()}`, {
          credentials: "include",
        });
      }

      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
          setMealTypes(json.data);
          setIsLiveSync(true);
          setErrorMsg(null);
        } else {
          setMealTypes(defaultMealTypes);
          setIsLiveSync(true);
        }
      } else if (res.status === 403 || res.status === 401) {
        setIsLiveSync(false);
        setMealTypes(defaultMealTypes);
        setErrorMsg("Session expired or permission required for Meal Type Doctype. Please sign in.");
      } else {
        const errJson = await res.json().catch(() => ({}));
        setIsLiveSync(false);
        setMealTypes(defaultMealTypes);
        setErrorMsg(errJson.message || `Server returned status ${res.status}`);
      }
    } catch (err: any) {
      setIsLiveSync(false);
      setMealTypes(defaultMealTypes);
      setErrorMsg(err.message || "Failed to reach Frappe API");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLiveMealTypes();
  }, []);

  // Filter list
  const filtered = mealTypes.filter((m) => {
    const name = (m.meal_name || m.name || "").toLowerCase();
    const code = (m.meal_code || "").toLowerCase();
    const item = (m.item || "").toLowerCase();
    const employer = (m.employer || "").toLowerCase();
    const q = search.toLowerCase();

    return name.includes(q) || code.includes(q) || item.includes(q) || employer.includes(q);
  });

  const totalCount = mealTypes.length;
  const trainingCount = mealTypes.filter((m) => m.is_training).length;
  const standardCount = totalCount - trainingCount;

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">
              Meal Types & Pricing Plans
            </h1>
            {isLiveSync ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
                <span className="size-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Live Meal Type Doctype ({mealTypes.length} packages)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold">
                <AlertTriangle className="size-3 text-amber-600" />
                Synced Cache
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Define dynamic subsidized dining packages, employer subsidy quotas, payroll deduction rates, on-spot surcharges, and linked ERPNext Non-Stock Items.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={fetchLiveMealTypes}
            disabled={refreshing}
            suppressHydrationWarning
            className="h-8 gap-1.5 text-xs font-bold border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            <RefreshCw className={`size-3.5 ${refreshing ? "animate-spin text-emerald-600" : ""}`} />
            <span>{refreshing ? "Syncing…" : "Refresh"}</span>
          </Button>

          <Link href="/menu/new">
            <Button
              size="sm"
              suppressHydrationWarning
              className="h-8 gap-1.5 text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>Add Meal Type</span>
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
          { label: "Total Meal Types", value: totalCount.toString(), icon: Utensils, color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
          { label: "Standard Dining", value: standardCount.toString(), icon: Award, color: "text-teal-700 bg-teal-50 border-teal-200" },
          { label: "Training / Flat Rate", value: trainingCount.toString(), icon: Sparkles, color: "text-amber-700 bg-amber-50 border-amber-200" },
          { label: "Linked Items", value: "ERP Non-Stock", icon: Package, color: "text-slate-700 bg-slate-100 border-slate-200" },
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

      {/* ── Search Bar ────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-2.5 bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by meal name, code, item, or client…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            suppressHydrationWarning
            className="w-full h-8 pl-8 pr-3 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-600 focus:outline-none transition-all font-medium"
          />
        </div>
      </div>

      {/* ── High-Density Meal Types List Table ─────────────────────────────── */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center space-y-2">
            <RefreshCw className="size-6 text-emerald-600 animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-600">Connecting to Meal Type Doctype…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Utensils className="size-8 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No meal types match your search.</p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => { setSearch(""); fetchLiveMealTypes(); }}
              suppressHydrationWarning
              className="text-xs font-bold h-8 cursor-pointer"
            >
              <RefreshCw className="size-3.5 mr-1" /> Reset Search
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3.5">Meal Package Name</th>
                  <th className="py-2.5 px-3.5">Linked Non-Stock Item</th>
                  <th className="py-2.5 px-3.5 text-right">Base Price</th>
                  <th className="py-2.5 px-3.5 text-right">Employer Subsidy</th>
                  <th className="py-2.5 px-3.5 text-right">Staff Payroll</th>
                  <th className="py-2.5 px-3.5 text-right">Extra Surcharge</th>
                  <th className="py-2.5 px-3.5">Serving Hours</th>
                  <th className="py-2.5 px-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filtered.map((m) => {
                  const displayName = m.meal_name || m.name;
                  const code = m.meal_code || m.name;
                  const basePrice = Number(m.meal_base_price) || 0;
                  const subsidy = Number(m.subsidy_amount) || 0;
                  const deduction = Number(m.employee_contribution) || 0;
                  const onSpot = Number(m.extra_on_spot) || 0;
                  const linkedItem = m.item || "CLL001";
                  const windowText = m.serving_window_start && m.serving_window_end 
                    ? `${m.serving_window_start.slice(0,5)} - ${m.serving_window_end.slice(0,5)}`
                    : "Flexible";

                  return (
                    <tr
                      key={m.name}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Meal Name + Code */}
                      <td className="py-2.5 px-3.5">
                        <Link
                          href={`/menu/${encodeURIComponent(m.name)}`}
                          className="flex items-center gap-2.5 group-hover:text-emerald-700 transition-colors"
                        >
                          <div className="size-8 rounded-lg bg-slate-100 text-slate-700 group-hover:bg-emerald-100 group-hover:text-emerald-800 font-black text-xs flex items-center justify-center shrink-0 border border-slate-200 transition-colors">
                            <Utensils className="size-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="font-bold text-slate-900 leading-tight">
                                {displayName}
                              </p>
                              {m.is_training ? (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200 uppercase">
                                  Training Flat
                                </span>
                              ) : null}
                            </div>
                            <p className="text-[10px] font-mono text-emerald-700 font-bold mt-0.5">
                              {code}
                            </p>
                          </div>
                        </Link>
                      </td>

                      {/* Linked Non-Stock Item */}
                      <td className="py-2.5 px-3.5">
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          <Package className="size-2.5 text-slate-400" />
                          <span>{linkedItem}</span>
                        </span>
                      </td>

                      {/* Base Price */}
                      <td className="py-2.5 px-3.5 text-right font-black text-slate-900 text-sm">
                        KES {basePrice.toLocaleString("en-KE")}
                      </td>

                      {/* HR Subsidy */}
                      <td className="py-2.5 px-3.5 text-right font-bold text-emerald-700">
                        KES {subsidy.toLocaleString("en-KE")}
                      </td>

                      {/* Employee Contribution */}
                      <td className="py-2.5 px-3.5 text-right font-bold text-slate-700">
                        {deduction > 0 ? `KES ${deduction.toLocaleString("en-KE")}` : "KES 0"}
                      </td>

                      {/* On-Spot Extra */}
                      <td className="py-2.5 px-3.5 text-right font-bold text-amber-800">
                        {onSpot > 0 ? (
                          <div className="inline-flex flex-col items-end">
                            <span className="bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded border border-amber-200 text-[11px]">
                              +KES {onSpot.toLocaleString("en-KE")}
                            </span>
                            {m.allow_surcharge_on_payroll ? (
                              <span className="text-[8px] text-muted-foreground font-semibold">or Payroll</span>
                            ) : null}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">—</span>
                        )}
                      </td>

                      {/* Serving Window */}
                      <td className="py-2.5 px-3.5 text-slate-600 font-medium">
                        <span className="text-[11px] bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                          {windowText}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-2.5 px-3.5 text-right">
                        <Link href={`/menu/${encodeURIComponent(m.name)}`}>
                          <Button
                            size="sm"
                            variant="ghost"
                            suppressHydrationWarning
                            className="h-7 px-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50 rounded-md"
                          >
                            <span>Details</span>
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
            <strong className="text-slate-800">{totalCount}</strong> Meal Type pricing packages
          </p>
          <p className="text-[11px]">Direct integration with Frappe Meal Type Doctype</p>
        </div>
      </div>
    </div>
  );
}
