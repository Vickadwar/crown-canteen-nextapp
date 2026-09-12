"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Home,
  Utensils,
  UtensilsCrossed,
  Building2,
  Package,
  DollarSign,
  Percent,
  Check,
  Save,
  AlertCircle,
  Sparkles,
  Clock,
  HelpCircle,
  Zap,
  Globe,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Info,
  Calendar,
  Layers,
  ArrowRight,
  Search,
  CheckCircle2,
  Sliders,
  ShieldCheck,
  Smartphone,
  Coffee,
  GraduationCap,
  Award,
  UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

// ── Standard Canteen Service Items (strictly non-stock dining items) ──────────
export const standardCanteenServiceItems = [
  { name: "CLL001", item_name: "Canteen Normal Lunch", item_group: "Services" },
  { name: "CLS001", item_name: "Canteen Speccial Lunch", item_group: "Services" },
  { name: "CTB001", item_name: "Training Breakfast & Morning Tea", item_group: "Services" },
  { name: "CTL001", item_name: "Training Lunch", item_group: "Services" },
  { name: "CTTE001", item_name: "Training Evening Tea & Snacks", item_group: "Services" },
  { name: "CTFP001", item_name: "Training Full-Day Catering Package", item_group: "Services" },
  { name: "CMG001", item_name: "Company-Sponsored Guest Dining", item_group: "Services" },
  { name: "CSM001", item_name: "Morning Snacks & Beverages", item_group: "Services" },
];

const DEFAULT_EMPLOYERS = [
  { name: "All Corporate Clients", customer_name: "All Corporate Clients (Universal)" },
];

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

// ── Modern Switch Toggle Component ───────────────────────────────────────────
function ModernToggle({
  checked,
  onChange,
  label,
  description,
  badge,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description: string;
  badge?: string;
}) {
  return (
    <div
      onClick={() => onChange(!checked)}
      className={`group relative flex items-center justify-between gap-4 p-3.5 rounded-2xl border transition-all cursor-pointer select-none ${
        checked
          ? "border-emerald-200 bg-emerald-50/40 shadow-xs"
          : "border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/50"
      }`}
    >
      <div className="space-y-0.5 pr-2">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold transition-colors ${checked ? "text-emerald-950" : "text-slate-800"}`}>
            {label}
          </span>
          {badge && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {badge}
            </span>
          )}
        </div>
        <p className="text-[11px] text-slate-500 leading-snug">{description}</p>
      </div>

      <Switch
        checked={checked}
        onCheckedChange={onChange}
        aria-label={label}
      />
    </div>
  );
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
      <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
        <Clock className="size-3.5 text-slate-400" />
        <span>{label}</span>
      </label>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className={`w-full h-11 px-3.5 rounded-xl border bg-white text-xs font-bold text-slate-800 text-left flex items-center justify-between transition-all cursor-pointer shadow-xs ${
            open
              ? "border-emerald-500 ring-3 ring-emerald-500/15 shadow-sm"
              : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/40"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-mono text-xs font-bold tracking-tight">
              {display12Hour(value)}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              ({value} 24h)
            </span>
          </div>
          <ChevronDown
            className={`size-4 text-slate-400 transition-transform duration-200 ${
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
        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
          <Building2 className="size-3.5 text-slate-400" />
          <span>Corporate Client Contract Scope</span>
        </label>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${isUniversal
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-blue-50 text-blue-800 border-blue-200"
            }`}
        >
          {isUniversal ? "All Employers" : "Specific Employer"}
        </span>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className={`w-full h-11 px-3.5 rounded-xl border bg-white text-xs font-bold text-left flex items-center justify-between transition-all cursor-pointer shadow-xs ${open
              ? "border-emerald-500 ring-3 ring-emerald-500/15 shadow-sm"
              : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/40"
            }`}
        >
          <div className="flex items-center gap-2.5 truncate">
            <span
              className={`size-2.5 rounded-full shrink-0 ${isUniversal ? "bg-emerald-500 ring-4 ring-emerald-100" : "bg-blue-500 ring-4 ring-blue-100"
                }`}
            />
            <span className="truncate text-slate-900 font-bold">{selectedLabel}</span>
          </div>
          <ChevronDown
            className={`size-4 text-slate-400 transition-transform shrink-0 duration-200 ${open ? "rotate-180 text-emerald-600" : ""
              }`}
          />
        </button>

        {open && (
          <div className="absolute z-50 top-full mt-2 left-0 w-full rounded-2xl border border-slate-200/90 bg-white p-3 shadow-xl shadow-slate-900/10 ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-150 space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search corporate employer or organization…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div className="max-h-56 overflow-y-auto space-y-1 pr-1">
              {/* Universal Option */}
              <button
                type="button"
                onClick={() => {
                  onChange("All Corporate Clients");
                  setOpen(false);
                }}
                className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-colors cursor-pointer border ${isUniversal
                    ? "bg-emerald-50 border-emerald-200 text-emerald-950 font-bold"
                    : "border-transparent hover:bg-slate-50 text-slate-700"
                  }`}
              >
                <div className="size-8 rounded-lg bg-emerald-100/70 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
                  <Globe className="size-4 text-emerald-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold leading-tight truncate">
                      All Corporate Clients (Universal)
                    </p>
                    <span className="text-[9px] uppercase font-black tracking-wider px-1.5 py-0.2 rounded bg-emerald-200/60 text-emerald-900">
                      Standard
                    </span>
                  </div>
                </div>
                {isUniversal && <CheckCircle2 className="size-4 text-emerald-600 shrink-0 ml-1 mt-0.5" />}
              </button>

              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>ERPNext Corporate Employers</span>
                <span className="text-emerald-700 font-mono font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                  {employers.length - 1} Loaded from Customer Table
                </span>
              </div>

              {/* Specific Employers */}
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
                      className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer border ${isSel
                          ? "bg-blue-50 border-blue-200 text-blue-950 font-bold"
                          : "border-transparent hover:bg-slate-50 text-slate-700"
                        }`}
                    >
                      <div className="size-6 rounded-md bg-slate-100 flex items-center justify-center shrink-0 text-slate-600">
                        <Briefcase className="size-3.5" />
                      </div>
                      <span className="text-xs font-semibold truncate flex-1">
                        {e.customer_name || e.name}
                      </span>
                      {isSel && <Check className="size-3.5 text-blue-600 shrink-0" />}
                    </button>
                  );
                })}

              {filtered.length === 0 && (
                <div className="py-4 text-center text-xs text-slate-400">
                  No matching corporate employers found.
                </div>
              )}
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

  const selectedItem = items.find((i) => i.name === value);

  const filtered = items.filter((i) =>
    `${i.name} ${i.item_name || ""}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-1.5" ref={ref}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
          <Package className="size-3.5 text-slate-400" />
          <span>Linked ERPNext Non-Stock Item</span>
        </label>
        <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          Services
        </span>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className={`w-full h-11 px-3.5 rounded-xl border bg-white text-xs font-semibold text-left flex items-center justify-between transition-all cursor-pointer shadow-xs ${open
              ? "border-emerald-500 ring-3 ring-emerald-500/15 shadow-sm"
              : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/40"
            }`}
        >
          <div className="flex items-center gap-2.5 truncate">
            <span className="font-mono text-xs font-bold text-emerald-900 bg-emerald-100/70 px-2.5 py-1 rounded-md border border-emerald-200 shrink-0">
              {value}
            </span>
            <span className="truncate text-slate-900 font-bold text-xs">
              {selectedItem?.item_name || "Select Canteen Service Item"}
            </span>
          </div>
          <ChevronDown
            className={`size-4 text-slate-400 transition-transform shrink-0 duration-200 ${open ? "rotate-180 text-emerald-600" : ""
              }`}
          />
        </button>

        {open && (
          <div className="absolute z-50 top-full mt-2 left-0 w-full rounded-2xl border border-slate-200/90 bg-white p-3 shadow-xl shadow-slate-900/10 ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-150 space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search dining service item code or name…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <span>Catering Service Items</span>
            </div>

            <div className="max-h-56 overflow-y-auto space-y-1 pt-1 pr-1">
              {filtered.map((i) => {
                const isSel = value === i.name;
                return (
                  <button
                    key={i.name}
                    type="button"
                    onClick={() => {
                      onChange(i.name);
                      setOpen(false);
                    }}
              className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer border ${isSel
                        ? "bg-emerald-50 border-emerald-200 text-emerald-950 font-bold"
                        : "border-transparent hover:bg-slate-50 text-slate-700"
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

// ── Main Page Component ───────────────────────────────────────────────────────
export default function NewMealTypePage() {
  const router = useRouter();

  // Form State
  const [mealCode, setMealCode] = useState("");
  const [mealName, setMealName] = useState("Normal Lunch");
  const [appliedPreset, setAppliedPreset] = useState<string | null>("normal");
  const [mealBasePrice, setMealBasePrice] = useState<number>(190);
  const [subsidyAmount, setSubsidyAmount] = useState<number>(140);
  const [employeeContribution, setEmployeeContribution] = useState<number>(50);
  const [extraOnSpot, setExtraOnSpot] = useState<number>(0);
  const [vatPercent, setVatPercent] = useState<number>(0);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [isSubsidized, setIsSubsidized] = useState<boolean>(true);
  const [allowSurchargeOnPayroll, setAllowSurchargeOnPayroll] = useState<boolean>(true);
  const [servingWindowStart, setServingWindowStart] = useState("12:30");
  const [servingWindowEnd, setServingWindowEnd] = useState("13:30");
  const [description, setDescription] = useState(
    "Standard subsidized daily lunch. Employer covers KES 140; employee contributes KES 50 deducted at end of month via payroll."
  );
  const [employer, setEmployer] = useState("All Corporate Clients");
  const [item, setItem] = useState("CLL001");

  // Options State
  const [employersList, setEmployersList] = useState<{ name: string; customer_name?: string }[]>(
    DEFAULT_EMPLOYERS
  );
  const [itemsList, setItemsList] = useState<{ name: string; item_name?: string; item_group?: string }[]>(
    standardCanteenServiceItems
  );
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Quick Preset Handlers - Sets parameters without forcing rigid code
  const applyPreset = (type: "normal" | "special" | "train_lunch" | "train_breakfast" | "train_full" | "guest") => {
    setAppliedPreset(type);
    setErrorMsg(null);
    setSuccessMsg(null);

    if (type === "normal") {
      setMealName("Normal Lunch");
      setMealBasePrice(190);
      setSubsidyAmount(140);
      setEmployeeContribution(50);
      setExtraOnSpot(0);
      setIsTraining(false);
      setIsSubsidized(true);
      setAllowSurchargeOnPayroll(true);
      setItem("CLL001");
      setServingWindowStart("12:30");
      setServingWindowEnd("13:30");
      setDescription("Standard subsidized daily lunch. Employer covers KES 140; employee contributes KES 50 deducted at end of month via payroll.");
    } else if (type === "special") {
      setMealName("Special Lunch");
      setMealBasePrice(290);
      setSubsidyAmount(140);
      setEmployeeContribution(50);
      setExtraOnSpot(100);
      setIsTraining(false);
      setIsSubsidized(true);
      setAllowSurchargeOnPayroll(true);
      setItem("CLS001");
      setServingWindowStart("12:30");
      setServingWindowEnd("13:30");
      setDescription("Special menu lunch. Employer covers KES 140; employee pays KES 50 plus KES 100 surcharge (payable on spot via Cash/M-Pesa or deferred to payroll).");
    } else if (type === "train_lunch") {
      setMealName("Training Lunch Buffet");
      setMealBasePrice(350);
      setSubsidyAmount(350);
      setEmployeeContribution(0);
      setExtraOnSpot(0);
      setIsTraining(true);
      setIsSubsidized(true);
      setAllowSurchargeOnPayroll(false);
      setItem("CTL001");
      setServingWindowStart("12:30");
      setServingWindowEnd("14:30");
      setDescription("Corporate training seminar lunch buffet. 100% employer funded under corporate training cost center.");
    } else if (type === "train_breakfast") {
      setMealName("Training Breakfast & Morning Tea");
      setMealBasePrice(150);
      setSubsidyAmount(150);
      setEmployeeContribution(0);
      setExtraOnSpot(0);
      setIsTraining(true);
      setIsSubsidized(true);
      setAllowSurchargeOnPayroll(false);
      setItem("CTB001");
      setServingWindowStart("07:30");
      setServingWindowEnd("10:00");
      setDescription("Corporate training morning tea, coffee & fresh pastries. 100% employer funded.");
    } else if (type === "train_full") {
      setMealName("Training Full-Day Catering Package");
      setMealBasePrice(600);
      setSubsidyAmount(600);
      setEmployeeContribution(0);
      setExtraOnSpot(0);
      setIsTraining(true);
      setIsSubsidized(true);
      setAllowSurchargeOnPayroll(false);
      setItem("CTFP001");
      setServingWindowStart("07:30");
      setServingWindowEnd("17:00");
      setDescription("Comprehensive full-day seminar catering: Morning tea & pastries + Lunch buffet + Evening tea & confectionery. 100% employer funded.");
    } else if (type === "guest") {
      setMealName("Company-Sponsored Guest Dining");
      setMealBasePrice(290);
      setSubsidyAmount(290);
      setEmployeeContribution(0);
      setExtraOnSpot(0);
      setIsTraining(false);
      setIsSubsidized(true);
      setAllowSurchargeOnPayroll(false);
      setItem("CMG001");
      setServingWindowStart("12:30");
      setServingWindowEnd("14:00");
      setDescription("Authorized external visitor & supplier dining. Billed 100% to host department cost center.");
    }
  };

  // Load live Customers and strictly Service Items from Frappe
  useEffect(() => {
    const loadOptions = async () => {
      try {
        // 1. Fetch Customers dynamically from ERPNext Customer master
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

        // 2. Fetch strictly Service Items (Non-Stock)
        const itemRes = await fetch(
          '/api/resource/Item?filters=[["item_group","in",["Services","Canteen Services"]]]&fields=["name","item_name","item_group"]&limit_page_length=100',
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
      } catch (err) {
        console.warn("Using default canteen catalog options:", err);
      }
    };
    loadOptions();
  }, []);

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const generatedCode = mealName.trim().toUpperCase().replace(/[^A-Z0-9]/g, "-").slice(0, 16);
    const finalMealCode = mealCode.trim() || generatedCode;

    const payload = {
      meal_code: finalMealCode,
      meal_name: mealName.trim(),
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
      is_active: 1,
    };

    try {
      const res = await fetch("/api/resource/Meal Type", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
          err.exception ||
          err._server_messages ||
          `Server error: ${res.statusText}`
        );
      }

      setSuccessMsg(`Meal Type "${mealName}" created successfully!`);
      setTimeout(() => {
        router.push("/menu");
      }, 1200);
    } catch (err: any) {
      console.error("Submission failed:", err);
      setErrorMsg(err.message || "Failed to create meal type document in Frappe.");
    } finally {
      setSubmitting(false);
    }
  };

  const formulaSum = Number(subsidyAmount) + Number(employeeContribution) + Number(extraOnSpot);
  const formulaMatch = Math.abs(formulaSum - Number(mealBasePrice)) < 0.01;

  // Percentage Calculations for Visual Bar
  const totalSafe = Number(mealBasePrice) || 1;
  const subsidyPercent = Math.min(100, Math.max(0, (Number(subsidyAmount) / totalSafe) * 100));
  const staffPercent = Math.min(100, Math.max(0, (Number(employeeContribution) / totalSafe) * 100));
  const surchargePercent = Math.min(100, Math.max(0, (Number(extraOnSpot) / totalSafe) * 100));

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-2 duration-300" suppressHydrationWarning>
      {/* ── Breadcrumb & Header Bar ───────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="space-y-1">
          <nav className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
            <Link href="/overview" className="hover:text-emerald-700 font-medium flex items-center gap-1 transition-colors">
              <Home className="size-3.5 text-slate-400" />
              <span>Dashboard</span>
            </Link>
            <ChevronRight className="size-3 text-slate-400" />
            <span className="text-slate-500 font-medium">Canteen Operations</span>
            <ChevronRight className="size-3 text-slate-400" />
            <Link href="/menu" className="hover:text-emerald-700 font-medium transition-colors">
              Meal Types &amp; Pricing
            </Link>
            <ChevronRight className="size-3 text-slate-400" />
            <span className="font-bold text-slate-900 bg-slate-100/80 px-2.5 py-0.5 rounded-md border border-slate-200/60">
              New Meal Type
            </span>
          </nav>
          <div className="flex items-center gap-2 pt-0.5">
            <h1 className="text-lg font-black text-slate-900 tracking-tight">Create Meal Type Document</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold shadow-xs">
            <Sparkles className="size-3.5 text-emerald-600" />
            <span>Dynamic Contract Engine</span>
          </span>
        </div>
      </div>

      {/* ── 1-Click Operational Presets (3-3 in Two Rows) ──────────────────── */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-wider">
            <div className="size-6 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Zap className="size-3.5 text-amber-600" />
            </div>
            <span>1-Click Operational Presets</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            Click a preset to populate standardized pricing, schedules, and service links
          </span>
        </div>

        {/* 2 Lines of 3 Innovative Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Row 1, Card 1: Normal Lunch */}
          <button
            type="button"
            onClick={() => applyPreset("normal")}
            className={`group relative p-4 rounded-2xl border text-left transition-all cursor-pointer hover:shadow-md ${
              appliedPreset === "normal"
                ? "bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm"
                : "bg-white border-slate-200/90 hover:border-emerald-300 hover:bg-emerald-50/20"
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shadow-xs">
                  <Utensils className="size-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-900">Normal Lunch</span>
                    <span className="text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded border border-emerald-200">
                      CLL001
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500">Standard subsidized daily lunch</span>
                </div>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1 text-[11px] font-mono">
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Employer KES 140
                </span>
                <span className="font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  Staff KES 50
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                <Clock className="size-3" /> 12:30 – 1:30 PM
              </span>
            </div>
          </button>

          {/* Row 1, Card 2: Special Lunch */}
          <button
            type="button"
            onClick={() => applyPreset("special")}
            className={`group relative p-4 rounded-2xl border text-left transition-all cursor-pointer hover:shadow-md ${
              appliedPreset === "special"
                ? "bg-gradient-to-br from-amber-50 via-white to-amber-50/30 border-amber-500 ring-2 ring-amber-500/20 shadow-sm"
                : "bg-white border-slate-200/90 hover:border-amber-300 hover:bg-amber-50/20"
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold shadow-xs">
                  <Sparkles className="size-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-900">Special Lunch</span>
                    <span className="text-[9px] font-mono font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded border border-amber-200">
                      CLS001
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500">Premium menu with extra surcharge</span>
                </div>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1 text-[11px] font-mono">
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Employer KES 140
                </span>
                <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  +100 Surcharge
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                <Clock className="size-3" /> 12:30 – 1:30 PM
              </span>
            </div>
          </button>

          {/* Row 1, Card 3: Corporate Guest Dining */}
          <button
            type="button"
            onClick={() => applyPreset("guest")}
            className={`group relative p-4 rounded-2xl border text-left transition-all cursor-pointer hover:shadow-md ${
              appliedPreset === "guest"
                ? "bg-gradient-to-br from-slate-100 via-white to-slate-50 border-slate-500 ring-2 ring-slate-500/20 shadow-sm"
                : "bg-white border-slate-200/90 hover:border-slate-400 hover:bg-slate-50/40"
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-xl bg-slate-200 text-slate-800 flex items-center justify-center font-bold shadow-xs">
                  <UserCheck className="size-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-900">Corporate Guest</span>
                    <span className="text-[9px] font-mono font-bold bg-slate-200 text-slate-800 px-1.5 py-0.2 rounded border border-slate-300">
                      CMG001
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500">Host department-sponsored visitor</span>
                </div>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1 text-[11px] font-mono">
                <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  Host Billed KES 290
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                <Clock className="size-3" /> 12:30 – 2:00 PM
              </span>
            </div>
          </button>

          {/* Row 2, Card 4: Training Breakfast */}
          <button
            type="button"
            onClick={() => applyPreset("train_breakfast")}
            className={`group relative p-4 rounded-2xl border text-left transition-all cursor-pointer hover:shadow-md ${
              appliedPreset === "train_breakfast"
                ? "bg-gradient-to-br from-indigo-50 via-white to-indigo-50/30 border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm"
                : "bg-white border-slate-200/90 hover:border-indigo-300 hover:bg-indigo-50/20"
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold shadow-xs">
                  <Coffee className="size-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-900">Training Breakfast</span>
                    <span className="text-[9px] font-mono font-bold bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded border border-indigo-200">
                      CTB001
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500">Morning tea & fresh pastries</span>
                </div>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1 text-[11px] font-mono">
                <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  100% Sponsor KES 150
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                <Clock className="size-3" /> 07:30 – 10:00 AM
              </span>
            </div>
          </button>

          {/* Row 2, Card 5: Training Lunch */}
          <button
            type="button"
            onClick={() => applyPreset("train_lunch")}
            className={`group relative p-4 rounded-2xl border text-left transition-all cursor-pointer hover:shadow-md ${
              appliedPreset === "train_lunch"
                ? "bg-gradient-to-br from-blue-50 via-white to-blue-50/30 border-blue-500 ring-2 ring-blue-500/20 shadow-sm"
                : "bg-white border-slate-200/90 hover:border-blue-300 hover:bg-blue-50/20"
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold shadow-xs">
                  <GraduationCap className="size-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-900">Training Lunch</span>
                    <span className="text-[9px] font-mono font-bold bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded border border-blue-200">
                      CTL001
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500">Full seminar lunch buffet</span>
                </div>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1 text-[11px] font-mono">
                <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  100% Sponsor KES 350
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                <Clock className="size-3" /> 12:30 – 2:30 PM
              </span>
            </div>
          </button>

          {/* Row 2, Card 6: Full-Day Seminar Package */}
          <button
            type="button"
            onClick={() => applyPreset("train_full")}
            className={`group relative p-4 rounded-2xl border text-left transition-all cursor-pointer hover:shadow-md ${
              appliedPreset === "train_full"
                ? "bg-gradient-to-br from-purple-50 via-white to-purple-50/30 border-purple-500 ring-2 ring-purple-500/20 shadow-sm"
                : "bg-white border-slate-200/90 hover:border-purple-300 hover:bg-purple-50/20"
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold shadow-xs">
                  <Award className="size-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-900">Full-Day Seminar Package</span>
                    <span className="text-[9px] font-mono font-bold bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded border border-purple-200">
                      CTFP001
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500">Breakfast + Lunch + Evening Tea</span>
                </div>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1 text-[11px] font-mono">
                <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  100% Sponsor KES 600
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                <Clock className="size-3" /> 07:30 AM – 5:00 PM
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* ── Status Banners ────────────────────────────────────────────────── */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50/90 border border-rose-200 text-rose-900 flex items-start gap-3 text-xs animate-in fade-in duration-150 shadow-xs">
          <AlertCircle className="size-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold">Meal Type Creation Error</p>
            <p className="font-medium text-rose-700">{errorMsg}</p>
          </div>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200 text-emerald-950 flex items-center gap-3 text-xs font-bold animate-in fade-in duration-150 shadow-xs">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <span>{successMsg} Redirecting to menu catalog…</span>
        </div>
      )}

      {/* ── Main Two-Column Layout ────────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="grid lg:grid-cols-[1fr_360px] gap-6 items-start" suppressHydrationWarning>
        {/* ── Left Column: Form Cards ──────────────────────────────────────── */}
        <div className="space-y-6">
          {/* Card 1: Identity & ERP Service Link */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="size-7 rounded-lg bg-emerald-600/10 flex items-center justify-center">
                <Utensils className="size-4 text-emerald-700" />
              </div>
              <div>
                <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  1. Identification &amp; Non-Stock Service Link
                </h2>
                <p className="text-[11px] text-slate-500">
                  Primary labels and ERP item master connection for cashier dispatch
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Meal Name */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <span>Meal Type Name</span>
                  <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Utensils className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="e.g. Normal Lunch, Special Lunch, Training Breakfast"
                    value={mealName}
                    onChange={(e) => setMealName(e.target.value)}
                    required
                    className="h-11 pl-10 text-xs font-bold text-slate-900 rounded-xl"
                  />
                </div>
              </div>

              {/* Meal Code */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <span>Meal Type Code</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">Optional / Auto-generated</span>
                </div>
                <Input
                  type="text"
                  placeholder="e.g. NORM-01, SPEC-01 (or auto-assigned)"
                  value={mealCode}
                  onChange={(e) => setMealCode(e.target.value)}
                  className="h-11 text-xs font-mono font-bold uppercase tracking-wider rounded-xl"
                />
              </div>

              {/* Linked Service Item */}
              <ModernServiceItemSelect
                value={item}
                onChange={setItem}
                items={itemsList}
              />
            </div>
          </div>

          {/* Card 2: Serving Schedule Window */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="size-7 rounded-lg bg-emerald-600/10 flex items-center justify-center">
                <Clock className="size-4 text-emerald-700" />
              </div>
              <div>
                <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  2. Serving Time Schedule Window
                </h2>
                <p className="text-[11px] text-slate-500">
                  Defines the daily operating hours during which cashiers can log this meal
                </p>
              </div>
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

            <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
              <Info className="size-3.5 text-slate-400 shrink-0" />
              <span>
                Active Daily Duration: <strong>{display12Hour(servingWindowStart)}</strong> to <strong>{display12Hour(servingWindowEnd)}</strong>
              </span>
            </div>
          </div>

          {/* Card 3: Financial Breakdown & Subsidies */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="size-7 rounded-lg bg-emerald-600/10 flex items-center justify-center">
                <DollarSign className="size-4 text-emerald-700" />
              </div>
              <div>
                <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  3. Financial Breakdown &amp; Subsidies (KES)
                </h2>
                <p className="text-[11px] text-slate-500">
                  Set the contract base price and split allocation between employer and employee
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Total Base Price */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <span>Total Base Contract Price (KES)</span>
                  <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 font-mono">
                    KES
                  </span>
                  <Input
                    type="number"
                    min="0"
                    value={mealBasePrice}
                    onChange={(e) => setMealBasePrice(parseFloat(e.target.value) || 0)}
                    required
                    className="h-11 pl-12 text-sm font-black font-mono rounded-xl text-slate-900"
                  />
                </div>
              </div>

              {/* Employer Subsidy */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-emerald-900">
                  Employer Subsidy (Billed on Invoice)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-600 font-mono">
                    KES
                  </span>
                  <Input
                    type="number"
                    min="0"
                    value={subsidyAmount}
                    onChange={(e) => setSubsidyAmount(parseFloat(e.target.value) || 0)}
                    className="h-11 pl-12 text-sm font-black font-mono text-emerald-900 bg-emerald-50/50 border-emerald-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Employee Contribution */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Employee Contribution (Payslip Deduction)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 font-mono">
                    KES
                  </span>
                  <Input
                    type="number"
                    min="0"
                    value={employeeContribution}
                    onChange={(e) => setEmployeeContribution(parseFloat(e.target.value) || 0)}
                    className="h-11 pl-12 text-sm font-bold font-mono rounded-xl text-slate-800"
                  />
                </div>
              </div>

              {/* Extra Surcharge */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-amber-900">
                  Extra Surcharge (Special / Premium Options)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-600 font-mono">
                    KES
                  </span>
                  <Input
                    type="number"
                    min="0"
                    value={extraOnSpot}
                    onChange={(e) => setExtraOnSpot(parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="h-11 pl-12 text-sm font-bold font-mono text-amber-900 bg-amber-50/50 border-amber-200 rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Corporate Scope & Notes */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="size-7 rounded-lg bg-emerald-600/10 flex items-center justify-center">
                <Building2 className="size-4 text-emerald-700" />
              </div>
              <div>
                <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  4. Corporate Client Scope &amp; Operational Notes
                </h2>
                <p className="text-[11px] text-slate-500">
                  Target client employer and guidelines visible to cashiers and accounting
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Employer Dropdown */}
              <ModernEmployerSelect
                value={employer}
                onChange={setEmployer}
                employers={employersList}
              />

              {/* Description */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">
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
                  placeholder="e.g. Standard subsidized lunch for plant floor and administrative personnel. Subsidy split applied automatically at POS."
                  className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-end gap-3">
            <Link href="/menu">
              <Button
                type="button"
                variant="outline"
                className="h-11 px-6 text-xs font-bold border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl cursor-pointer"
              >
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={submitting}
              className="h-11 px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-600/20 flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-all"
            >
              <Save className="size-4" />
              <span>{submitting ? "Saving to ERPNext…" : "Save & Publish Meal Type"}</span>
            </Button>
          </div>
        </div>

        {/* ── Right Column: Live Telemetry & Rules Card ───────────────────── */}
        <div className="space-y-5 sticky top-20">
          {/* Card A: Financial Balance Card with Ratio Bar */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="size-6 rounded-md bg-emerald-600/10 flex items-center justify-center">
                  <DollarSign className="size-3.5 text-emerald-700" />
                </div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Live Price Ratio
                </h3>
              </div>
              <span
                className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${formulaMatch
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-amber-50 text-amber-800 border-amber-200"
                  }`}
              >
                {formulaMatch ? "Balanced (100%)" : "Review Allocation"}
              </span>
            </div>

            {/* Stacked Proportional Bar */}
            <div className="space-y-1.5">
              <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden flex">
                <div
                  style={{ width: `${subsidyPercent}%` }}
                  className="bg-emerald-500 transition-all duration-300"
                  title={`Employer: ${subsidyPercent.toFixed(0)}%`}
                />
                <div
                  style={{ width: `${staffPercent}%` }}
                  className="bg-slate-700 transition-all duration-300"
                  title={`Staff: ${staffPercent.toFixed(0)}%`}
                />
                <div
                  style={{ width: `${surchargePercent}%` }}
                  className="bg-amber-500 transition-all duration-300"
                  title={`Surcharge: ${surchargePercent.toFixed(0)}%`}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-emerald-500" /> Employer
                </span>
                <span className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-slate-700" /> Staff
                </span>
                {extraOnSpot > 0 && (
                  <span className="flex items-center gap-1">
                    <span className="size-2 rounded-full bg-amber-500" /> Surcharge
                  </span>
                )}
              </div>
            </div>

            {/* Financial Ledger Breakdown */}
            <div className="space-y-2.5 pt-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Employer Covers:</span>
                <span className="font-black text-emerald-700 font-mono text-sm">
                  KES {subsidyAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Staff Payroll Deduction:</span>
                <span className="font-black text-slate-800 font-mono text-sm">
                  KES {employeeContribution.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Extra Surcharge:</span>
                <span className="font-black text-amber-800 font-mono text-sm">
                  {extraOnSpot > 0 ? `+KES ${extraOnSpot.toLocaleString()}` : "KES 0"}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Total Contract Base:
                </span>
                <span className="font-black text-slate-900 font-mono text-base">
                  KES {mealBasePrice.toLocaleString()}
                </span>
              </div>
            </div>

            {!formulaMatch && (
              <div className="p-3 rounded-xl bg-amber-50/90 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                <AlertCircle className="size-4 shrink-0 text-amber-600 mt-0.5" />
                <p>
                  Sum of components (KES {formulaSum}) does not match contract Base Price (KES {mealBasePrice}). Check subsidies before saving.
                </p>
              </div>
            )}
          </div>

          {/* Card B: Live POS Terminal Card Preview */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Smartphone className="size-3 text-slate-400" />
                <span>POS Cashier Terminal Preview</span>
              </span>
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            {/* Virtual POS Meal Card */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-1.5 py-0.5 rounded border border-emerald-200">
                    {mealCode || "ML-CODE"}
                  </span>
                  <h4 className="text-xs font-black text-slate-900 mt-1">
                    {mealName || "Untitled Meal Type"}
                  </h4>
                </div>
                <span className="font-mono text-xs font-black text-slate-900">
                  KES {mealBasePrice}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                <Clock className="size-3 text-slate-400" />
                <span>
                  {display12Hour(servingWindowStart)} – {display12Hour(servingWindowEnd)}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                <span className="text-slate-500 font-medium">Employee Pays:</span>
                <span className="font-bold text-slate-800 font-mono">
                  KES {Number(employeeContribution) + Number(extraOnSpot)}
                </span>
              </div>
            </div>
          </div>

          {/* Card C: Operational Policy Toggles */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3.5">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Sliders className="size-3.5 text-slate-500" />
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Operational Policies
              </h3>
            </div>

            <div className="space-y-2.5">
              <ModernToggle
                checked={isSubsidized}
                onChange={setIsSubsidized}
                label="Active Subsidized Meal"
                description="Immediately unlocks meal on POS checkout terminals during serving window hours."
                badge="POS Live"
              />

              <ModernToggle
                checked={allowSurchargeOnPayroll}
                onChange={setAllowSurchargeOnPayroll}
                label="Allow Surcharge on Payroll"
                description="Allows diner to defer the extra surcharge to monthly salary deduction."
              />

              <ModernToggle
                checked={isTraining}
                onChange={setIsTraining}
                label="Corporate Training Event"
                description="Designates this meal as 100% employer-funded under company training cost center."
                badge="Training"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}