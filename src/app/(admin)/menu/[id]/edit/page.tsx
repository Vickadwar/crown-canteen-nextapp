"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Home,
  Utensils,
  Building2,
  Package,
  DollarSign,
  Check,
  Save,
  Trash2,
  AlertCircle,
  Clock,
  HelpCircle,
  Globe,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Info,
  Layers,
  Sparkles,
  ArrowLeft,
  Sliders
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

// ── Standard Canteen Service Items ────────────────────────────────────────────
export const standardCanteenServiceItems = [
  { name: "CLL001",  item_name: "Canteen Normal Lunch",              item_group: "Services" },
  { name: "CLS001",  item_name: "Canteen Speccial Lunch",            item_group: "Services" },
  { name: "CTB001",  item_name: "Training Breakfast & Morning Tea",  item_group: "Services" },
  { name: "CTL001",  item_name: "Training Lunch",                    item_group: "Services" },
  { name: "CTTE001", item_name: "Training Evening Tea & Snacks",     item_group: "Services" },
  { name: "CTFP001", item_name: "Training Full-Day Catering Package", item_group: "Services" },
  { name: "CMG001",  item_name: "Company-Sponsored Guest Dining",     item_group: "Services" },
  { name: "CSM001",  item_name: "Morning Snacks & Beverages",         item_group: "Services" },
];

const DEFAULT_EMPLOYERS = [
  { name: "All Corporate Clients", customer_name: "All Corporate Clients (Universal)" },
];

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

// ── Time Formatting Helpers ──────────────────────────────────────────────────
function parse24To12(time24: string): { hour12: number; minute: string; period: "AM" | "PM" } {
  if (!time24) return { hour12: 12, minute: "30", period: "PM" };
  const parts = time24.split(":");
  let h = parseInt(parts[0], 10);
  const m = parts[1] ? parts[1].slice(0, 2) : "00";
  if (isNaN(h)) h = 12;
  const period: "AM" | "PM" = h >= 12 ? "PM" : "AM";
  let hour12 = h % 12 === 0 ? 12 : h % 12;
  return { hour12, minute: m, period };
}

function format12To24(hour12: number, minute: string, period: "AM" | "PM"): string {
  let h = hour12;
  if (period === "AM") {
    if (h === 12) h = 0;
  } else {
    if (h !== 12) h += 12;
  }
  const hh = String(h).padStart(2, "0");
  const mm = minute.padStart(2, "0");
  return `${hh}:${mm}`;
}

function display12Hour(time24: string): string {
  const { hour12, minute, period } = parse24To12(time24);
  return `${String(hour12).padStart(2, "0")}:${minute} ${period}`;
}

// ── Modern Time Selector Component ───────────────────────────────────────────
function ModernTimePicker({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (val: string) => void;
  label: string;
  presets?: string[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { hour12, minute, period } = parse24To12(value);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const adjustHour = (delta: number) => {
    let next = hour12 + delta;
    if (next > 12) next = 1;
    if (next < 1) next = 12;
    onChange(format12To24(next, minute, period));
  };

  const adjustMinute = (deltaMinutes: number) => {
    const currentM = parseInt(minute, 10) || 0;
    let nextM = currentM + deltaMinutes;
    if (nextM >= 60) nextM = 0;
    if (nextM < 0) nextM = 45;
    const mStr = String(nextM).padStart(2, "0");
    onChange(format12To24(hour12, mStr, period));
  };

  const togglePeriod = (p: "AM" | "PM") => {
    onChange(format12To24(hour12, minute, p));
  };

  const canteenShiftWindows = [
    { label: "07:30 AM", time: "07:30", note: "Breakfast Window Opens" },
    { label: "10:00 AM", time: "10:00", note: "Morning Shift Window Closes" },
    { label: "12:30 PM", time: "12:30", note: "Standard Lunch Window Opens" },
    { label: "01:30 PM", time: "13:30", note: "Standard Lunch Window Closes" },
    { label: "02:30 PM", time: "14:30", note: "Extended Canteen Dining" },
    { label: "04:00 PM", time: "16:00", note: "Evening Tea & Snacks" },
  ];

  return (
    <div className="space-y-1.5" ref={ref}>
      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
        <Clock className="size-3.5 text-slate-400" />
        <span>{label}</span>
      </label>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className={`w-full h-11 px-3.5 rounded-xl border bg-white text-xs font-bold text-slate-800 text-left flex items-center justify-between transition-all cursor-pointer shadow-xs ${
            open
              ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm"
              : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-xs font-bold">
              {display12Hour(value)}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">({value} 24h)</span>
          </div>
          <ChevronDown
            className={`size-3.5 text-slate-400 transition-transform ${
              open ? "rotate-180 text-emerald-600" : ""
            }`}
          />
        </button>

        {open && (
          <div className="absolute z-50 top-full mt-2 left-0 w-88 max-w-[95vw] rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-900/15 ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-150 space-y-4">
            {/* Header Preview */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Shift Window Tuner
              </span>
              <div className="flex items-center gap-1.5 font-mono text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                <Clock className="size-3 text-emerald-600" />
                <span>{display12Hour(value)}</span>
              </div>
            </div>

            {/* Digital Clock Stepper */}
            <div className="p-3.5 rounded-2xl bg-slate-900 text-white flex items-center justify-between shadow-inner">
              {/* Hour Box */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => adjustHour(1)}
                  className="size-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Hour Up"
                >
                  <ChevronUp className="size-4" />
                </button>
                <span className="font-mono text-2xl font-black tracking-tight py-1">
                  {String(hour12).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  onClick={() => adjustHour(-1)}
                  className="size-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Hour Down"
                >
                  <ChevronDown className="size-4" />
                </button>
              </div>

              <span className="font-mono text-2xl font-black text-emerald-400 animate-pulse">:</span>

              {/* Minute Box */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => adjustMinute(15)}
                  className="size-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Minute Up (+15m)"
                >
                  <ChevronUp className="size-4" />
                </button>
                <span className="font-mono text-2xl font-black tracking-tight py-1">
                  {String(minute).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  onClick={() => adjustMinute(-15)}
                  className="size-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Minute Down (-15m)"
                >
                  <ChevronDown className="size-4" />
                </button>
              </div>

              {/* AM / PM Segment */}
              <div className="flex flex-col gap-1.5 pl-3 border-l border-slate-800">
                <button
                  type="button"
                  onClick={() => togglePeriod("AM")}
                  className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
                    period === "AM"
                      ? "bg-emerald-500 text-white shadow-sm font-black"
                      : "bg-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  AM
                </button>
                <button
                  type="button"
                  onClick={() => togglePeriod("PM")}
                  className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
                    period === "PM"
                      ? "bg-emerald-500 text-white shadow-sm font-black"
                      : "bg-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  PM
                </button>
              </div>
            </div>

            {/* Standard Canteen Shift Window Chips */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Standard Canteen Shifts
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {canteenShiftWindows.map((w) => {
                  const isCur = value === w.time;
                  return (
                    <button
                      key={w.time}
                      type="button"
                      onClick={() => {
                        onChange(w.time);
                        setOpen(false);
                      }}
                      className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                        isCur
                          ? "bg-emerald-50 border-emerald-300 text-emerald-950 font-bold"
                          : "bg-slate-50/70 border-slate-200/80 hover:bg-slate-100/80 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-black">{w.label}</span>
                        {isCur && <Check className="size-3 text-emerald-600" />}
                      </div>
                      <span className="text-[10px] text-slate-500 block truncate">{w.note}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Modern Employer Select Component ──────────────────────────────────────────
function ModernEmployerSelect({
  value,
  onChange,
  employers,
}: {
  value: string;
  onChange: (val: string) => void;
  employers: { name: string; customer_name?: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isUniversal =
    !value ||
    value === "All Corporate Clients" ||
    value === "All Corporate Clients (Universal)";

  const selectedItem = employers.find((e) => e.name === value);
  const selectedLabel = isUniversal
    ? "All Corporate Clients (Universal)"
    : selectedItem?.customer_name || value;

  const filtered = employers.filter((e) =>
    (e.customer_name || e.name).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-1.5" ref={ref}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Building2 className="size-3.5 text-slate-400" /> Corporate Client Contract Scope
        </label>
        <span className="text-[10px] text-slate-400 font-semibold">
          {isUniversal ? "All Employers" : "Specific Employer"}
        </span>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className={`w-full h-11 px-3.5 rounded-xl border bg-white text-xs font-bold text-left flex items-center justify-between transition-all cursor-pointer ${
            open
              ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm"
              : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center gap-2 truncate">
            {isUniversal ? (
              <span className="size-2.5 rounded-full bg-emerald-500 shrink-0" />
            ) : (
              <span className="size-2.5 rounded-full bg-blue-500 shrink-0" />
            )}
            <span className="truncate text-slate-800 font-bold">{selectedLabel}</span>
          </div>
          <ChevronDown
            className={`size-3.5 text-slate-400 transition-transform shrink-0 ${
              open ? "rotate-180 text-emerald-600" : ""
            }`}
          />
        </button>

        {open && (
          <div className="absolute z-50 top-full mt-2 left-0 w-full rounded-2xl border border-slate-200 bg-white p-3 shadow-xl animate-in fade-in zoom-in-95 duration-150 space-y-2">
            <input
              type="text"
              placeholder="Search corporate employer…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none focus:border-emerald-500"
            />

            <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
              <button
                type="button"
                onClick={() => {
                  onChange("All Corporate Clients");
                  setOpen(false);
                }}
                className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer ${
                  isUniversal ? "bg-emerald-50 text-emerald-900 font-bold" : "hover:bg-slate-50 text-slate-700"
                }`}
              >
                <Globe className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold leading-snug">All Corporate Clients (Universal)</p>
                </div>
                {isUniversal && <Check className="size-4 text-emerald-600 ml-auto shrink-0" />}
              </button>

              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>ERPNext Corporate Employers</span>
                <span className="text-emerald-700 font-mono font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                  {employers.length - 1} Loaded from Customer Table
                </span>
              </div>

              {filtered
                .filter((e) => e.name !== "All Corporate Clients")
                .map((e) => {
                  const isSel = value === e.name;
                  return (
                    <button
                      key={e.name}
                      type="button"
                      onClick={() => {
                        onChange(e.name);
                        setOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer ${
                        isSel ? "bg-blue-50 text-blue-900 font-bold" : "hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <Briefcase className="size-3.5 text-blue-600 shrink-0" />
                      <span className="text-xs font-semibold truncate flex-1">
                        {e.customer_name || e.name}
                      </span>
                      {isSel && <Check className="size-3.5 text-blue-600 shrink-0" />}
                    </button>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Modern Linked Non-Stock Item Select Component ─────────────────────────────
function ModernServiceItemSelect({
  value,
  onChange,
  items,
}: {
  value: string;
  onChange: (val: string) => void;
  items: { name: string; item_name?: string; item_group?: string }[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedItem = items.find((i) => i.name === value);

  return (
    <div className="space-y-1.5" ref={ref}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Package className="size-3.5 text-slate-400" /> Linked ERPNext Non-Stock Item
        </label>
        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
          Services Only
        </span>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className={`w-full h-10 px-3.5 rounded-xl border bg-white text-xs font-semibold text-left flex items-center justify-between transition-all cursor-pointer ${
            open
              ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm"
              : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center gap-2 truncate">
            <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {value}
            </span>
            <span className="truncate text-slate-800 font-bold">
              {selectedItem?.item_name || "Select Canteen Service Item"}
            </span>
          </div>
          <ChevronDown
            className={`size-3.5 text-slate-400 transition-transform shrink-0 ${
              open ? "rotate-180 text-emerald-600" : ""
            }`}
          />
        </button>

        {open && (
          <div className="absolute z-50 top-full mt-1.5 left-0 w-full rounded-2xl border border-slate-200 bg-white p-2.5 shadow-xl animate-in fade-in zoom-in-95 duration-150 space-y-1">
            <div className="px-2 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <span>Catering Service Items</span>
            </div>

            <div className="max-h-56 overflow-y-auto space-y-1 pt-1 pr-1">
              {items.map((i) => {
                const isSel = value === i.name;
                return (
                  <button
                    key={i.name}
                    type="button"
                    onClick={() => {
                      onChange(i.name);
                      setOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer ${
                      isSel ? "bg-emerald-50 text-emerald-900 font-bold" : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200 shrink-0">
                      {i.name}
                    </span>
                    <span className="text-xs font-bold truncate flex-1">
                      {i.item_name || i.name}
                    </span>
                    {isSel && <Check className="size-3.5 text-emerald-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Edit Meal Type Page ───────────────────────────────────────────────────────
export default function EditMealTypePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const mealName = safeDecode(id);
  const router = useRouter();

  // Form State
  const [mealCode, setMealCode] = useState("");
  const [mealBasePrice, setMealBasePrice] = useState<number>(190);
  const [subsidyAmount, setSubsidyAmount] = useState<number>(140);
  const [employeeContribution, setEmployeeContribution] = useState<number>(50);
  const [extraOnSpot, setExtraOnSpot] = useState<number>(0);
  const [vatPercent, setVatPercent] = useState<number>(0);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [isSubsidized, setIsSubsidized] = useState<boolean>(true);
  const [allowSurchargeOnPayroll, setAllowSurchargeOnPayroll] = useState<boolean>(true);
  const [servingWindowStart, setServingWindowStart] = useState("11:30");
  const [servingWindowEnd, setServingWindowEnd] = useState("14:30");
  const [description, setDescription] = useState("");
  const [employer, setEmployer] = useState("All Corporate Clients");
  const [item, setItem] = useState("CLL001");

  // Options & Status
  const [employersList, setEmployersList] = useState<{ name: string; customer_name?: string }[]>(
    DEFAULT_EMPLOYERS
  );
  const [itemsList, setItemsList] = useState<{ name: string; item_name?: string; item_group?: string }[]>(
    standardCanteenServiceItems
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Load existing meal type and options
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setErrorMsg(null);
      try {
        // Load Customers dynamically from ERPNext Customer Master
        const custRes = await fetch(
          '/api/resource/Customer?fields=["name","customer_name"]&limit_page_length=200',
          { credentials: "include" }
        );
        if (custRes.ok) {
          const json = await custRes.json();
          if (json.data && Array.isArray(json.data) && json.data.length > 0) {
            setEmployersList([
              { name: "All Corporate Clients", customer_name: "All Corporate Clients (Universal)" },
              ...json.data.map((c: any) => ({
                name: c.name,
                customer_name: c.customer_name || c.name,
              })),
            ]);
          }
        }

        // Load Service Items
        const itemRes = await fetch(
          '/api/resource/Item?filters=[["item_group","in",["Services","Canteen Services"]]]&fields=["name","item_name","item_group"]&limit_page_length=50',
          { credentials: "include" }
        );
        if (itemRes.ok) {
          const iJson = await itemRes.json();
          if (iJson.data && Array.isArray(iJson.data) && iJson.data.length > 0) {
            const merged = [...iJson.data];
            for (const std of standardCanteenServiceItems) {
              if (!merged.some((m) => m.name === std.name)) {
                merged.push(std);
              }
            }
            setItemsList(merged);
          }
        }

        // Load Document Data
        const res = await fetch(`/api/resource/Meal Type/${encodeURIComponent(mealName)}`, {
          credentials: "include",
        });

        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setMealCode(json.data.meal_code || json.data.name || "");
            setMealBasePrice(Number(json.data.meal_base_price) || 0);
            setSubsidyAmount(Number(json.data.subsidy_amount) || 0);
            setEmployeeContribution(Number(json.data.employee_contribution) || 0);
            setExtraOnSpot(Number(json.data.extra_on_spot) || 0);
            setVatPercent(Number(json.data.vat_percent) || 0);
            setIsTraining(Boolean(json.data.is_training));
            setIsSubsidized(json.data.is_subsidized !== undefined ? Boolean(json.data.is_subsidized) : true);
            setAllowSurchargeOnPayroll(
              json.data.allow_surcharge_on_payroll !== undefined ? Boolean(json.data.allow_surcharge_on_payroll) : true
            );
            setServingWindowStart(
              json.data.serving_window_start ? json.data.serving_window_start.slice(0, 5) : "11:30"
            );
            setServingWindowEnd(
              json.data.serving_window_end ? json.data.serving_window_end.slice(0, 5) : "14:30"
            );
            setDescription(json.data.description || "");
            setEmployer(json.data.employer || "All Corporate Clients");
            setItem(json.data.item || "CLL001");
          }
        }
      } catch {
        setMealCode("ML-NORM-01");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [mealName]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const payload = {
      meal_code: mealCode.trim(),
      meal_base_price: Number(mealBasePrice) || 0,
      subsidy_amount: Number(subsidyAmount) || 0,
      employee_contribution: Number(employeeContribution) || 0,
      extra_on_spot: Number(extraOnSpot) || 0,
      vat_percent: Number(vatPercent) || 0,
      is_training: isTraining ? 1 : 0,
      is_subsidized: isSubsidized ? 1 : 0,
      allow_surcharge_on_payroll: allowSurchargeOnPayroll ? 1 : 0,
      serving_window_start: servingWindowStart.length === 5 ? `${servingWindowStart}:00` : servingWindowStart,
      serving_window_end: servingWindowEnd.length === 5 ? `${servingWindowEnd}:00` : servingWindowEnd,
      description: description.trim(),
      employer: employer === "All Corporate Clients" ? "" : employer,
      item: item,
    };

    try {
      const res = await fetch(`/api/resource/Meal Type/${encodeURIComponent(mealName)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.exception || err._server_messages || "Failed to update meal type.");
      }

      setSuccessMsg("Meal type updated successfully!");
      setTimeout(() => {
        router.push("/menu");
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || "Could not save changes to ERP.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/resource/Meal Type/${encodeURIComponent(mealName)}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.exception || err._server_messages || "Failed to delete meal type.");
      }

      router.push("/menu");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to delete meal type.");
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const formulaSum = Number(subsidyAmount) + Number(employeeContribution) + Number(extraOnSpot);
  const formulaMatch = Math.abs(formulaSum - Number(mealBasePrice)) < 0.01;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <div className="size-7 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-500">Loading meal configuration…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto pb-16 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* ── Breadcrumb Bar ────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <nav className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
          <Link href="/overview" className="hover:text-emerald-700 font-medium flex items-center gap-1">
            <Home className="size-3.5 text-slate-400" />
            <span>Dashboard</span>
          </Link>
          <ChevronRight className="size-3 text-slate-400" />
          <Link href="/menu" className="hover:text-emerald-700 font-medium">
            Meal Types &amp; Pricing
          </Link>
          <ChevronRight className="size-3 text-slate-400" />
          <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-lg">
            Edit: {mealName}
          </span>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="h-8 px-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-bold hover:bg-rose-100 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="size-3.5" />
            <span>Delete Meal</span>
          </button>
        </div>
      </div>

      {/* ── Error & Success Banners ───────────────────────────────────────── */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3 text-xs animate-in fade-in duration-150">
          <AlertCircle className="size-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold">Meal Update Error</p>
            <p className="font-medium">{errorMsg}</p>
          </div>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3 text-xs font-bold animate-in fade-in duration-150">
          <Check className="size-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* ── Wide Two-Column Form Layout ──────────────────────────────────── */}
      <form onSubmit={handleSave} className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">
        {/* ── Left Column: Form Fields ─────────────────────────────────────── */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          {/* Section 1: Basic Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Utensils className="size-4 text-emerald-600" />
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                1. Meal Identification &amp; Item Link
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Meal Name */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700">
                  Meal Type Name (Primary Document Key)
                </label>
                <Input
                  type="text"
                  value={mealName}
                  disabled
                  className="h-10 text-xs font-bold bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed"
                />
              </div>

              {/* Meal Code */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    Meal Code
                  </label>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                    Read-only
                  </span>
                </div>
                <Input
                  type="text"
                  value={mealCode}
                  disabled
                  className="h-10 text-xs font-mono font-bold bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed uppercase tracking-wider"
                />
              </div>

              {/* Linked Non-Stock Item */}
              <ModernServiceItemSelect
                value={item}
                onChange={setItem}
                items={itemsList}
              />
            </div>
          </div>

          {/* Section 2: Serving Schedule */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Clock className="size-4 text-emerald-600" />
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                2. Serving Time Schedule Window
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <ModernTimePicker
                value={servingWindowStart}
                onChange={setServingWindowStart}
                label="Serving Window Opens (Start Time)"
                presets={["07:00", "07:30", "11:00", "11:30", "12:00", "15:30"]}
              />

              <ModernTimePicker
                value={servingWindowEnd}
                onChange={setServingWindowEnd}
                label="Serving Window Closes (End Time)"
                presets={["09:30", "10:00", "14:00", "14:30", "15:00", "17:00"]}
              />
            </div>
          </div>

          {/* Section 3: Financial Rates & Subsidies */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <DollarSign className="size-4 text-emerald-600" />
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                3. Financial Breakdown &amp; Subsidies (KES)
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Total Meal Contract Base Price (KES) <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="number"
                  min="0"
                  value={mealBasePrice}
                  onChange={(e) => setMealBasePrice(parseFloat(e.target.value) || 0)}
                  required
                  className="h-10 text-sm font-black font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-emerald-800">
                  Employer Subsidy (Billed on Corporate Invoice)
                </label>
                <Input
                  type="number"
                  min="0"
                  value={subsidyAmount}
                  onChange={(e) => setSubsidyAmount(parseFloat(e.target.value) || 0)}
                  className="h-10 text-sm font-black font-mono text-emerald-800 bg-emerald-50/40 border-emerald-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Employee Contribution (Payslip Deduction)
                </label>
                <Input
                  type="number"
                  min="0"
                  value={employeeContribution}
                  onChange={(e) => setEmployeeContribution(parseFloat(e.target.value) || 0)}
                  className="h-10 text-sm font-bold font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-amber-800">
                  Extra Surcharge (e.g. 100 on Special Lunch)
                </label>
                <Input
                  type="number"
                  min="0"
                  value={extraOnSpot}
                  onChange={(e) => setExtraOnSpot(parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="h-10 text-sm font-bold font-mono text-amber-800 bg-amber-50/40 border-amber-200"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Corporate Client Scope & Description */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Building2 className="size-4 text-emerald-600" />
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                4. Corporate Client Scope &amp; Operational Notes
              </h2>
            </div>

            <div className="space-y-4">
              <ModernEmployerSelect
                value={employer}
                onChange={setEmployer}
                employers={employersList}
              />

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    Operational Description &amp; Diner Guidelines
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {description.length} characters
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Operational notes, guidelines, and meal description…"
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50/40 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link href="/menu">
              <Button
                type="button"
                variant="outline"
                className="h-11 px-5 text-xs font-bold border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl cursor-pointer"
              >
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={saving}
              className="h-11 px-7 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-600/25 flex items-center gap-2 cursor-pointer disabled:opacity-40"
            >
              <Save className="size-4" />
              <span>{saving ? "Updating ERPNext…" : "Save Changes"}</span>
            </Button>
          </div>
        </div>

        {/* ── Right Column: Live Telemetry & Rules Card ───────────────────── */}
        <div className="space-y-5 sticky top-20">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <DollarSign className="size-4 text-emerald-600" />
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Live Pricing Balance
                </h3>
              </div>
              <span
                className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                  formulaMatch
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}
              >
                {formulaMatch ? "Balanced" : "Review Split"}
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-semibold">Employer Covers:</span>
                <span className="font-black text-emerald-700 font-mono text-sm">
                  KES {subsidyAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-semibold">Staff Payroll Deduction:</span>
                <span className="font-black text-slate-900 font-mono text-sm">
                  KES {employeeContribution.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-semibold">Extra Surcharge:</span>
                <span className="font-black text-amber-800 font-mono text-sm">
                  {extraOnSpot > 0 ? `+KES ${extraOnSpot.toLocaleString()}` : "KES 0"}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Total Base Price:
                </span>
                <span className="font-black text-slate-900 font-mono text-base">
                  KES {mealBasePrice.toLocaleString()}
                </span>
              </div>
            </div>

            {!formulaMatch && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                <AlertCircle className="size-4 shrink-0 text-amber-600 mt-0.5" />
                <p>
                  Sum of Subsidy ({subsidyAmount}) + Staff ({employeeContribution}) + Extra ({extraOnSpot}) = <strong>KES {formulaSum}</strong>, differing from Base Price ({mealBasePrice}).
                </p>
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Sliders className="size-4 text-emerald-600" />
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Operational Toggles
              </h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div className="space-y-0.5 pr-2">
                  <span className="text-xs font-bold text-slate-800 block">Active Subsidized Meal</span>
                  <span className="text-[11px] text-slate-500 leading-tight block">
                    Available for cashier marking during serving hours.
                  </span>
                </div>
                <Switch
                  checked={isSubsidized}
                  onCheckedChange={setIsSubsidized}
                  aria-label="Active Subsidized Meal"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div className="space-y-0.5 pr-2">
                  <span className="text-xs font-bold text-slate-800 block">Allow Surcharge on Payroll</span>
                  <span className="text-[11px] text-slate-500 leading-tight block">
                    Diner can defer extra KES 100 surcharge to monthly salary.
                  </span>
                </div>
                <Switch
                  checked={allowSurchargeOnPayroll}
                  onCheckedChange={setAllowSurchargeOnPayroll}
                  aria-label="Allow Surcharge on Payroll"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div className="space-y-0.5 pr-2">
                  <span className="text-xs font-bold text-slate-800 block">Corporate Training Event</span>
                  <span className="text-[11px] text-slate-500 leading-tight block">
                    100% funded by sponsor company training budget.
                  </span>
                </div>
                <Switch
                  checked={isTraining}
                  onCheckedChange={setIsTraining}
                  aria-label="Corporate Training Event"
                />
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* ── Delete Confirmation Modal ─────────────────────────────────────── */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="size-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center">
              <Trash2 className="size-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Delete Meal Type?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete <strong>{mealName}</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="h-10 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="h-10 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 cursor-pointer disabled:opacity-50"
              >
                {deleting ? "Deleting…" : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
