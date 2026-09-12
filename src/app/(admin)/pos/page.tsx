"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Search, UserCheck, Utensils, Sparkles, Users, CheckCircle2,
  X, Clock, Plus, Minus, ChevronRight, AlertCircle, ChevronDown, Check,
  ShoppingBag, Building2, User, Trash2, Award, DollarSign, Send,
  HelpCircle, AlertTriangle, ShieldAlert, Coffee, BookOpen, Layers
} from "lucide-react";
import { MealTypeDoc } from "../menu/page";

// ── CustomSelect Component ──────────────────────────────────────────────────
function CustomSelect({ id, label, value, onChange, placeholder, options, required }: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean;
  options: { value: string; label: string; color?: string; sub?: string }[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const sel = options.find(o => o.value === value);
  return (
    <div className="space-y-1.5" ref={ref}>
      <label className="text-[11px] font-semibold text-muted-foreground block">
        {label}{required && <span className="text-primary"> *</span>}
      </label>
      <div className="relative">
        <button id={id} type="button" onClick={() => setOpen(o => !o)}
          className={`w-full h-9 px-3.5 rounded-xl border bg-card text-sm text-left flex items-center gap-2.5 transition-all ${
            open ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-muted-foreground/40"}`}>
          {sel?.color && <span className={`size-2 rounded-full shrink-0 ${sel.color}`} />}
          <span className={`flex-1 font-medium ${sel ? "text-foreground" : "text-muted-foreground"}`}>
            {sel?.label ?? placeholder ?? "Select…"}
          </span>
          <ChevronDown className={`size-3.5 text-muted-foreground transition-transform shrink-0 ${open ? "rotate-180" : ""}`} />
        </button>
        {open && (
          <div className="absolute z-[200] top-full mt-1.5 w-full rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 origin-top max-h-60 overflow-y-auto">
            {options.map(o => (
              <button key={o.value} type="button" onClick={() => { onChange(o.value); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-muted/60 transition-colors border-b border-border/50 last:border-0 ${value === o.value ? "bg-primary/5" : ""}`}>
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

// ── Default Dynamic Meal Types (Matches Crown Canteen Operations) ────────────
const defaultActiveMealTypes: MealTypeDoc[] = [
  {
    name: "Normal Lunch",
    meal_code: "ML-NORM-01",
    meal_name: "Normal Lunch",
    meal_base_price: 190,
    subsidy_amount: 140,
    employee_contribution: 50,
    extra_on_spot: 0,
    item: "CLL001",
    is_training: 0,
    allow_surcharge_on_payroll: 1,
  },
  {
    name: "Special Lunch",
    meal_code: "ML-SPEC-02",
    meal_name: "Special Lunch",
    meal_base_price: 290,
    subsidy_amount: 140,
    employee_contribution: 50,
    extra_on_spot: 100,
    item: "CLS001",
    is_training: 0,
    allow_surcharge_on_payroll: 1,
  },
  {
    name: "Training Lunch",
    meal_code: "ML-TRN-04",
    meal_name: "Training Lunch",
    meal_base_price: 350,
    subsidy_amount: 350,
    employee_contribution: 0,
    extra_on_spot: 0,
    item: "CTL001",
    is_training: 1,
    allow_surcharge_on_payroll: 0,
  },
  {
    name: "Training Breakfast",
    meal_code: "ML-TRN-03",
    meal_name: "Training Breakfast",
    meal_base_price: 150,
    subsidy_amount: 150,
    employee_contribution: 0,
    extra_on_spot: 0,
    item: "CTB001",
    is_training: 1,
    allow_surcharge_on_payroll: 0,
  },
];

// Fallback staff directory
const fallbackEmployees = [
  { employee_payroll_id: "EMP001", customer_name: "Samuel Mandela",  department: "ICT",        employer: "Crown Paints Kenya PLC", customer_type: "Employee" },
  { employee_payroll_id: "EMP002", customer_name: "Jane Kariuki",    department: "Production", employer: "Crown Paints Kenya PLC", customer_type: "Employee" },
  { employee_payroll_id: "EMP003", customer_name: "Peter Otieno",    department: "Finance",    employer: "Forza Consultants",     customer_type: "Employee" },
  { employee_payroll_id: "EMP004", customer_name: "Grace Wambua",    department: "HR",         employer: "Crown Paints Kenya PLC", customer_type: "Employee" },
  { employee_payroll_id: "EMP005", customer_name: "David Kamau",     department: "Logistics",  employer: "Securex Agencies",      customer_type: "Employee" },
];

const fallbackDepartments = ["ICT", "Finance", "HR", "Sales", "Production", "Logistics", "Operations", "QA Lab", "Legal"];
const fallbackEmployers = ["Crown Paints Kenya PLC", "Forza Consultants", "Securex Agencies"];

interface SessionEntry {
  id: string;
  transactionCode: string;
  customerName: string;
  payrollId: string;
  department: string;
  employer: string;
  mealName: string;
  basePrice: number;
  employerBillable: number;
  employeeDeduction: number;
  amountPaidOnSpot: number;
  surchargeMethod: string;
  servingMode: string;
  isGuest: boolean;
  guestCount: number;
  guestBillingType?: string;
  guestDept?: string;
  isTraining: boolean;
  trainingTitle?: string;
  timestamp: string;
}

function initials(name: string) {
  return name.split(" ").map(n => n[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
}

export default function ManualPOS() {
  // Master Data
  const [mealTypes, setMealTypes] = useState<MealTypeDoc[]>(defaultActiveMealTypes);
  const [departments, setDepartments] = useState<string[]>(fallbackDepartments);
  const [employers, setEmployers] = useState<string[]>(fallbackEmployers);
  const [employerMap, setEmployerMap] = useState<Record<string, string>>({
    "CUST-2026-00001": "Crown Paints Kenya PLC",
    "CUST-2026-00002": "Forza Consultants",
    "CUST-2026-00003": "Securex Agencies (K) Ltd",
    "CUST-2026-00004": "Logistics Hub Ltd",
    "CUST-2026-00005": "ODUK Tech Limited",
  });

  const getEmployerName = (emp: any): string => {
    if (!emp) return "";
    if (typeof emp === "string") {
      return employerMap[emp] || emp;
    }
    if (emp.employer_name) return emp.employer_name;
    if (emp.employer) {
      return employerMap[emp.employer] || emp.employer;
    }
    return "";
  };

  // Search & Selection
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);

  // Meal Choice
  const [selectedMealName, setSelectedMealName] = useState<string>("Normal Lunch");
  const selectedMeal = mealTypes.find(m => m.meal_name === selectedMealName) || mealTypes[0] || defaultActiveMealTypes[0];

  // Surcharge Handling for Special Meals
  const [surchargeMode, setSurchargeMode] = useState<"payroll" | "spot">("payroll");
  const [spotChannel, setSpotChannel] = useState<"Cash" | "M-Pesa">("Cash");
  const [mpesaRef, setMpesaRef] = useState("");

  // Visitor & Guest States
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [guestBilling, setGuestBilling] = useState<"Company Sponsored" | "Employee Sponsored">("Company Sponsored");
  const [guestCount, setGuestCount] = useState(1);
  const [guestEmployer, setGuestEmployer] = useState("Crown Paints Kenya PLC");
  const [guestDept, setGuestDept] = useState("Production & Plant");
  const [guestNote, setGuestNote] = useState("");
  const [guestHost, setGuestHost] = useState<any | null>(null);
  const [hostSearch, setHostSearch] = useState("");
  const [hostSearchResults, setHostSearchResults] = useState<any[]>([]);
  const [searchingHost, setSearchingHost] = useState(false);
  const [rawDepartments, setRawDepartments] = useState<{ name: string; department_name: string; employer?: string }[]>([]);

  // Training States
  const [trainingTitle, setTrainingTitle] = useState("");
  const [sponsoringEmployer, setSponsoringEmployer] = useState("");

  // Serving Mode
  const [servingMode, setServingMode] = useState<"Counter Dine" | "Packed Office Delivery">("Counter Dine");

  // Queue & Submission Status
  const [session, setSession] = useState<SessionEntry[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [doubleSwipeAlert, setDoubleSwipeAlert] = useState<string | null>(null);
  const [lastLoggedTxn, setLastLoggedTxn] = useState<string | null>(null);
  const [now, setNow] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Filter departments dynamically for the selected employer
  const getDepartmentsForEmployer = (empName: string): string[] => {
    if (!empName) return departments;
    const empKey = empName.toLowerCase();
    const matched = rawDepartments
      .filter(d => d.employer && (d.employer.toLowerCase() === empKey || getEmployerName(d.employer).toLowerCase() === empKey))
      .map(d => d.department_name || d.name);
    if (matched.length > 0) return matched;

    if (empKey.includes("forza")) {
      return ["Consulting & Advisory", "Audit & Assurance", "Tax Advisory", "Risk & Compliance", "Corporate Finance"];
    }
    if (empKey.includes("securex")) {
      return ["Security Operations", "Guarding Likoni Station", "Mobile Patrols", "Central Control Room", "Logistics & Fleet"];
    }
    if (empKey.includes("crown")) {
      return ["Production & Plant", "Logistics & Supply Chain", "Operations Likoni", "ICT Department", "Finance & Accounts", "Human Resources", "Quality Assurance Lab", "Sales & Marketing", "Executive & Legal"];
    }
    if (empKey.includes("logistics")) {
      return ["Freight & Cargo", "Warehouse Depot", "Fleet Maintenance", "Dispatch Office"];
    }
    if (empKey.includes("oduk")) {
      return ["Engineering Team", "Software Development", "Technical Support", "Field Implementation"];
    }
    return departments;
  };

  // 1. Fetch Dynamic Meal Types, Departments, Employers, and Recent Database Transactions
  useEffect(() => {
    // A. Load cached session from localStorage immediately so queue persists on refresh
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("crown_canteen_pos_queue");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSession(parsed);
          }
        }
      } catch {}
    }

    const fetchMasters = async () => {
      try {
        const res = await fetch("/api/method/crown_canteen.api.get_active_meal_types");
        if (res.ok) {
          const json = await res.json();
          if (json.message && Array.isArray(json.message) && json.message.length > 0) {
            setMealTypes(json.message);
            if (!json.message.some((m: any) => m.meal_name === selectedMealName)) {
              setSelectedMealName(json.message[0].meal_name);
            }
          }
        }
      } catch {}

      try {
        const deptRes = await fetch('/api/resource/Employer%20Department?fields=["name","department_name","employer"]&limit_page_length=50', {
          credentials: "include",
        });
        if (deptRes.ok) {
          const dJson = await deptRes.json();
          if (dJson.data && Array.isArray(dJson.data) && dJson.data.length > 0) {
            setRawDepartments(dJson.data);
            setDepartments(dJson.data.map((d: any) => d.department_name || d.name));
          }
        }
      } catch {}

      try {
        const custRes = await fetch('/api/resource/Customer?fields=["name","customer_name"]&limit_page_length=100', {
          credentials: "include",
        });
        if (custRes.ok) {
          const cJson = await custRes.json();
          if (cJson.data && Array.isArray(cJson.data) && cJson.data.length > 0) {
            const empNames = cJson.data.map((c: any) => c.customer_name || c.name);
            setEmployers(empNames);
            if (empNames.length > 0) setGuestEmployer(empNames[0]);
            const map: Record<string, string> = {
              "CUST-2026-00001": "Crown Paints Kenya PLC",
              "CUST-2026-00002": "Forza Consultants",
              "CUST-2026-00003": "Securex Agencies (K) Ltd",
              "CUST-2026-00004": "Logistics Hub Ltd",
              "CUST-2026-00005": "ODUK Tech Limited",
            };
            cJson.data.forEach((c: any) => {
              if (c.name && c.customer_name) {
                map[c.name] = c.customer_name;
              }
            });
            setEmployerMap(map);
          }
        }
      } catch {}

      // B. Fetch live Meal Transactions from ERPNext database
      try {
        const txRes = await fetch(
          '/api/resource/Meal%20Transaction?fields=["name","customer","meal_type","meal_date","meal_time","canteen_branch","payment_method","amount_paid_on_spot","transaction_id","guest_count","visitor_of","approval_status","creation"]&order_by=creation%20desc&limit_page_length=25',
          { credentials: "include" }
        );
        if (txRes.ok) {
          const txJson = await txRes.json();
          if (txJson.data && Array.isArray(txJson.data) && txJson.data.length > 0) {
            const dbEntries: SessionEntry[] = txJson.data.map((t: any) => {
              const isGuest = Boolean(t.visitor_of || (t.guest_count && t.guest_count > 1));
              return {
                id: t.name || t.transaction_id,
                transactionCode: t.transaction_id || t.name,
                customerName: t.customer,
                payrollId: t.customer,
                department: t.canteen_branch || "Nairobi Likoni Rd - Main",
                employer: "Crown Paints Kenya PLC",
                mealName: t.meal_type,
                basePrice: 190,
                employerBillable: 140,
                employeeDeduction: 50,
                amountPaidOnSpot: t.amount_paid_on_spot || 0,
                surchargeMethod: t.payment_method || "Payroll",
                servingMode: "Counter Dine",
                isGuest,
                guestCount: t.guest_count || 1,
                timestamp: t.meal_time ? (t.meal_time.split(" ")[1]?.slice(0, 5) || "13:00") : "Today",
              };
            });

            setSession(prev => {
              const existingCodes = new Set(prev.map(p => p.transactionCode));
              const fresh = dbEntries.filter(d => !existingCodes.has(d.transactionCode));
              const merged = [...prev, ...fresh];
              if (typeof window !== "undefined") {
                try {
                  localStorage.setItem("crown_canteen_pos_queue", JSON.stringify(merged.slice(0, 50)));
                } catch {}
              }
              return merged;
            });
          }
        }
      } catch {}
    };

    fetchMasters();
  }, []);

  // 2. Debounced Live Employee Search
  useEffect(() => {
    if (search.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const t = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/method/crown_canteen.api.search_canteen_customers?query=${encodeURIComponent(search.trim())}`);
        if (res.ok) {
          const json = await res.json();
          if (json.message && Array.isArray(json.message)) {
            setSearchResults(json.message);
            return;
          }
        }
      } catch {}

      // Fallback search
      const q = search.toLowerCase();
      const matched = fallbackEmployees.filter(e =>
        e.customer_name.toLowerCase().includes(q) ||
        e.employee_payroll_id.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q)
      );
      setSearchResults(matched);
      setSearching(false);
    }, 200);

    return () => clearTimeout(t);
  }, [search]);

  // 3. Debounced Live Host Employee Search for Employee-Sponsored Visitor Dining
  useEffect(() => {
    if (hostSearch.trim().length < 2) {
      setHostSearchResults([]);
      return;
    }

    const t = setTimeout(async () => {
      setSearchingHost(true);
      try {
        const res = await fetch(`/api/method/crown_canteen.api.search_canteen_customers?query=${encodeURIComponent(hostSearch.trim())}`, {
          credentials: "include",
        });
        if (res.ok) {
          const json = await res.json();
          if (json.message && Array.isArray(json.message) && json.message.length > 0) {
            setHostSearchResults(json.message);
            setSearchingHost(false);
            return;
          }
        }
      } catch {}

      try {
        const cRes = await fetch(`/api/resource/Canteen%20Customer?filters=[["customer_name","like","%${encodeURIComponent(hostSearch.trim())}%"]]&fields=["name","customer_name","employee_payroll_id","department","employer"]&limit_page_length=10`, {
          credentials: "include",
        });
        if (cRes.ok) {
          const cJ = await cRes.json();
          if (cJ.data && Array.isArray(cJ.data) && cJ.data.length > 0) {
            setHostSearchResults(cJ.data);
            setSearchingHost(false);
            return;
          }
        }
      } catch {}

      const q = hostSearch.toLowerCase();
      const matched = fallbackEmployees.filter(e =>
        e.customer_name.toLowerCase().includes(q) ||
        e.employee_payroll_id.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q)
      );
      setHostSearchResults(matched);
      setSearchingHost(false);
    }, 200);

    return () => clearTimeout(t);
  }, [hostSearch]);

  // Financial Calculations for current build
  const isTrainingMeal = Boolean(selectedMeal.is_training);
  const basePrice = Number(selectedMeal.meal_base_price) || 0;
  const subsidyUnit = Number(selectedMeal.subsidy_amount) || 0;
  const contribUnit = Number(selectedMeal.employee_contribution) || 0;
  const extraSurcharge = Number(selectedMeal.extra_on_spot) || 0;

  let computedEmployerBillable = 0;
  let computedEmployeeDeduction = 0;
  let computedPaidOnSpot = 0;

  if (isTrainingMeal) {
    computedEmployerBillable = basePrice * (isGuestMode ? guestCount : 1);
    computedEmployeeDeduction = 0;
    computedPaidOnSpot = 0;
  } else if (isGuestMode) {
    const guestTotal = basePrice * guestCount;
    if (guestBilling === "Company Sponsored") {
      computedEmployerBillable = guestTotal;
      computedEmployeeDeduction = 0;
      computedPaidOnSpot = 0;
    } else {
      computedEmployerBillable = 0;
      if (surchargeMode === "spot") {
        computedPaidOnSpot = guestTotal;
        computedEmployeeDeduction = 0;
      } else {
        computedEmployeeDeduction = guestTotal;
        computedPaidOnSpot = 0;
      }
    }
  } else {
    computedEmployerBillable = subsidyUnit;
    computedEmployeeDeduction = contribUnit;
    if (extraSurcharge > 0) {
      if (surchargeMode === "spot") {
        computedPaidOnSpot = extraSurcharge;
      } else {
        computedEmployeeDeduction += extraSurcharge;
      }
    }
  }

  // Submit Meal & Persist Directly to ERPNext Meal Transaction DocType
  const handleLogMeal = async () => {
    if (!selected && !isGuestMode) return;
    if (isGuestMode && guestBilling === "Employee Sponsored" && !guestHost) {
      setDoubleSwipeAlert("Please search and select the host employee sponsoring this visitor.");
      return;
    }
    setDoubleSwipeAlert(null);
    setSubmitting(true);

    const nowD = new Date();
    const todayStr = nowD.toISOString().split("T")[0];
    const serverTimestamp = nowD.toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const randId = Math.floor(100000 + Math.random() * 900000);
    let serverTxnId = `TXN-${todayStr.replace(/-/g, "")}-${randId}`;

    const hostEmployeeId = isGuestMode && guestBilling === "Employee Sponsored" && guestHost
      ? (guestHost.name || guestHost.employee_payroll_id)
      : null;

    const dinerCustomerId = isGuestMode
      ? (guestBilling === "Employee Sponsored" && guestHost ? (guestHost.name || guestHost.employee_payroll_id) : "VIS-GENERIC")
      : (selected.name || selected.employee_payroll_id);

    const targetEmployer = isGuestMode
      ? (guestBilling === "Company Sponsored" ? guestEmployer : getEmployerName(guestHost))
      : (getEmployerName(selected) || "Crown Paints Kenya PLC");

    const targetDept = isGuestMode
      ? (guestBilling === "Company Sponsored" ? guestDept : (guestHost?.department || "General"))
      : (selected?.department || "General");

    const paymentMethod = (surchargeMode === "spot" || computedPaidOnSpot > 0) ? "On Spot" : "Payroll Deduct";

    let loggedInErp = false;
    let finalEmployerBillable = computedEmployerBillable;
    let finalEmployeeDeduction = computedEmployeeDeduction;
    let finalAmountPaidOnSpot = computedPaidOnSpot;

    // 1. Call custom ERPNext method crown_canteen.api.log_kiosk_meal
    try {
      const res = await fetch("/api/method/crown_canteen.api.log_kiosk_meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          customer_id: dinerCustomerId,
          meal_type_name: selectedMeal.meal_name,
          canteen_branch: "Nairobi Likoni Rd - Main",
          payment_method: paymentMethod,
          guest_count: isGuestMode ? guestCount : 1,
          is_guest: isGuestMode ? 1 : 0,
          guest_name: isGuestMode ? (guestNote || (guestBilling === "Employee Sponsored" ? `Guest of ${guestHost?.customer_name}` : `Visitor (${targetEmployer})`)) : undefined,
          guest_dept: targetDept,
          visitor_of: hostEmployeeId,
          sponsoring_employer: targetEmployer,
          mpesa_ref: spotChannel === "M-Pesa" && computedPaidOnSpot > 0 ? mpesaRef : undefined,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.message) {
          if (json.message.status === "already_served") {
            setDoubleSwipeAlert(json.message.message || `${selected?.customer_name || "Employee"} has already claimed subsidized lunch today.`);
            setSubmitting(false);
            return;
          }
          if (json.message.status === "success" && json.message.transaction_id) {
            serverTxnId = json.message.transaction_id;
            if (typeof json.message.employer_billable === "number") finalEmployerBillable = json.message.employer_billable;
            if (typeof json.message.employee_deduction === "number") finalEmployeeDeduction = json.message.employee_deduction;
            if (typeof json.message.amount_paid_on_spot === "number") finalAmountPaidOnSpot = json.message.amount_paid_on_spot;
            loggedInErp = true;
          }
        }
      }
    } catch {}

    // 2. Direct POST fallback to Meal Transaction DocType
    if (!loggedInErp) {
      try {
        const docRes = await fetch("/api/resource/Meal%20Transaction", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            customer: dinerCustomerId,
            meal_type: selectedMeal.name || selectedMeal.meal_name,
            meal_date: todayStr,
            meal_time: nowD.toISOString().replace("T", " ").slice(0, 19),
            canteen_branch: "Nairobi Likoni Rd - Main",
            payment_method: paymentMethod,
            amount_paid_on_spot: finalAmountPaidOnSpot,
            transaction_id: serverTxnId,
            guest_count: isGuestMode ? guestCount : 1,
            visitor_of: hostEmployeeId,
            approval_status: "Approved",
            docstatus: 1,
          }),
        });
        if (docRes.ok) {
          const dj = await docRes.json();
          if (dj.data?.name) {
            serverTxnId = dj.data.name;
            loggedInErp = true;
          }
        }
      } catch {}
    }

    // Add to session queue & persist in localStorage so page reload retains history
    const entry: SessionEntry = {
      id: `${Date.now()}`,
      transactionCode: serverTxnId,
      customerName: isGuestMode 
        ? (guestBilling === "Employee Sponsored" ? `Visitor (Host: ${guestHost?.customer_name || "Staff"})` : `Company Visitor (${targetEmployer})`)
        : selected.customer_name,
      payrollId: isGuestMode 
        ? (guestBilling === "Employee Sponsored" ? `HOST: ${guestHost?.employee_payroll_id || ""}` : "CORP-GUEST")
        : selected.employee_payroll_id,
      department: targetDept,
      employer: targetEmployer,
      mealName: selectedMeal.meal_name,
      basePrice,
      employerBillable: finalEmployerBillable,
      employeeDeduction: finalEmployeeDeduction,
      amountPaidOnSpot: finalAmountPaidOnSpot,
      surchargeMethod: surchargeMode === "spot" ? `On Spot (${spotChannel})` : "Payroll",
      servingMode,
      isGuest: isGuestMode,
      guestCount: isGuestMode ? guestCount : 1,
      guestBillingType: isGuestMode ? guestBilling : undefined,
      guestDept: isGuestMode ? targetDept : undefined,
      isTraining: isTrainingMeal,
      trainingTitle: isTrainingMeal ? trainingTitle : undefined,
      timestamp: serverTimestamp,
    };

    setSession(prev => {
      const updated = [entry, ...prev];
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("crown_canteen_pos_queue", JSON.stringify(updated.slice(0, 50)));
        } catch {}
      }
      return updated;
    });

    setLastLoggedTxn(serverTxnId);
    setSubmitting(false);

    // Reset entry inputs
    setSelected(null);
    setSearch("");
    setIsGuestMode(false);
    setGuestHost(null);
    setHostSearch("");
    setGuestCount(1);
    setGuestNote("");
    setMpesaRef("");
  };

  const totalMealsLogged = session.reduce((a, s) => a + (s.isGuest ? s.guestCount : 1), 0);
  const totalEmployerBilled = session.reduce((a, s) => a + s.employerBillable, 0);
  const totalPayrollDeductions = session.reduce((a, s) => a + s.employeeDeduction, 0);
  const totalCounterCollections = session.reduce((a, s) => a + s.amountPaidOnSpot, 0);

  return (
    <div suppressHydrationWarning className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* ── Top Terminal Header ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-[0.2em] mb-0.5">Counter Terminal OS</p>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Cashier Lunch POS</h1>
          <p className="text-xs text-slate-500 mt-1">
            Dynamic meal marking with anti-double-swipe validation, visitor sponsorship, and spot vs. payroll surcharge routing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right" suppressHydrationWarning>
            <p className="text-base font-black text-slate-900 tabular-nums">
              {mounted ? now.toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "--:--:--"}
            </p>
            <p className="text-[10px] font-semibold text-slate-500">
              {mounted ? now.toLocaleDateString("en-KE", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) : "Today"}
            </p>
          </div>

          <Link
            href="/pos/snacks"
            className="h-9 px-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ShoppingBag className="size-3.5 text-emerald-600" />
            <span>Snack Sales →</span>
          </Link>
        </div>
      </div>

      {/* ── Anti-Double-Swipe Fraud Alert Banner ──────────────────────────── */}
      {doubleSwipeAlert && (
        <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-900 flex items-start gap-3 shadow-md animate-in zoom-in-95 duration-200">
          <ShieldAlert className="size-6 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-black tracking-tight">Anti-Double-Swipe Security Warning</h3>
            <p className="text-xs font-semibold mt-0.5">{doubleSwipeAlert}</p>
            <p className="text-[11px] text-rose-700 mt-1">
              Each staff member is eligible for 1 subsidized meal per day. If they require additional meals today, mark as an Employee-Owned Guest meal or Full-Price service.
            </p>
          </div>
          <button onClick={() => setDoubleSwipeAlert(null)} className="size-7 rounded-lg hover:bg-rose-100 text-rose-600 flex items-center justify-center">
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* ── Running Live Shift Metrics ───────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl border border-slate-200 bg-white shadow-sm flex items-center gap-3">
          <div className="size-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-black">
            <Utensils className="size-5" />
          </div>
          <div>
            <p className="text-lg font-black text-slate-900 leading-none">{totalMealsLogged}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">Meals Served</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl border border-slate-200 bg-white shadow-sm flex items-center gap-3">
          <div className="size-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-black">
            <Building2 className="size-5" />
          </div>
          <div>
            <p className="text-lg font-black text-teal-800 leading-none">KES {totalEmployerBilled.toLocaleString("en-KE")}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">Employer Billed</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl border border-slate-200 bg-white shadow-sm flex items-center gap-3">
          <div className="size-10 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-black">
            <Award className="size-5" />
          </div>
          <div>
            <p className="text-lg font-black text-slate-900 leading-none">KES {totalPayrollDeductions.toLocaleString("en-KE")}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">Payroll Deducts</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl border border-slate-200 bg-white shadow-sm flex items-center gap-3">
          <div className="size-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center font-black">
            <DollarSign className="size-5" />
          </div>
          <div>
            <p className="text-lg font-black text-amber-800 leading-none">KES {totalCounterCollections.toLocaleString("en-KE")}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">Cash / M-Pesa Drawer</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_420px] gap-5 items-start">
        {/* ── Left Column: Builder Console ────────────────────────────────── */}
        <div className="space-y-4">
          {/* Diner Search & Mode Bar */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-visible relative z-20">
            <div className="flex border-b border-slate-200 bg-slate-50/70 p-1.5 gap-1.5 rounded-t-2xl">
              <button
                type="button"
                onClick={() => { setIsGuestMode(false); }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  !isGuestMode ? "bg-white text-emerald-800 shadow-sm border border-slate-200" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <UserCheck className="size-3.5 text-emerald-600" /> Staff Member
              </button>
              <button
                type="button"
                onClick={() => { setIsGuestMode(true); }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isGuestMode ? "bg-white text-emerald-800 shadow-sm border border-slate-200" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Users className="size-3.5 text-amber-600" /> Guest / Visitor
              </button>
            </div>

            <div className="p-4 space-y-3">
              {!isGuestMode ? (
                <>
                  {/* Search Input */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => { setSearch(e.target.value); setSelected(null); }}
                      placeholder="Type employee payroll ID (e.g. EMP001) or name…"
                      className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-emerald-600 transition-all"
                    />
                    {searching && <Clock className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 animate-spin" />}
                  </div>

                  {/* Dropdown Results */}
                  {searchResults.length > 0 && !selected && (
                    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xl divide-y divide-slate-100 max-h-56 overflow-y-auto">
                      {searchResults.map((emp) => (
                        <button
                          key={emp.employee_payroll_id}
                          type="button"
                          onClick={() => { setSelected(emp); setSearch(""); setSearchResults([]); }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-emerald-50/50 transition-colors group cursor-pointer"
                        >
                          <div className="size-9 rounded-xl bg-slate-100 text-slate-800 group-hover:bg-emerald-600 group-hover:text-white font-black text-xs flex items-center justify-center transition-all shrink-0">
                            {initials(emp.customer_name)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                              {emp.customer_name}
                            </p>
                            <p className="text-[10px] text-slate-500 font-medium">
                              {emp.employee_payroll_id} · {emp.department} · {getEmployerName(emp)}
                            </p>
                          </div>
                          <ChevronRight className="size-4 text-slate-400 group-hover:text-emerald-600 shrink-0" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Selected Staff Card */}
                  {selected && (
                    <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-center gap-3">
                      <div className="size-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-sm shrink-0">
                        {initials(selected.customer_name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-black text-slate-900">{selected.customer_name}</p>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                            Eligible
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 font-medium mt-0.5">
                          {selected.employee_payroll_id} · {selected.department} · {getEmployerName(selected)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelected(null)}
                        className="size-7 rounded-lg hover:bg-rose-100 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                /* Visitor Configuration */
                <div className="space-y-3.5">
                  <div className="grid sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setGuestBilling("Company Sponsored")}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        guestBilling === "Company Sponsored"
                          ? "border-emerald-600 bg-emerald-50/50 text-emerald-900 shadow-sm"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <Building2 className="size-4 text-emerald-700 mb-1" />
                      <p className="text-xs font-bold">Company-Sponsored</p>
                      <p className="text-[10px] text-muted-foreground">100% billed to host department</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setGuestBilling("Employee Sponsored")}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        guestBilling === "Employee Sponsored"
                          ? "border-emerald-600 bg-emerald-50/50 text-emerald-900 shadow-sm"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <User className="size-4 text-emerald-700 mb-1" />
                      <p className="text-xs font-bold">Employee-Sponsored</p>
                      <p className="text-[10px] text-muted-foreground">Billed to host staff member</p>
                    </button>
                  </div>

                  {guestBilling === "Company Sponsored" ? (
                    <div className="space-y-3 pt-1">
                      <div className="grid sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700">Visitor Count</label>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setGuestCount(c => Math.max(1, c - 1))}
                              className="size-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                            >
                              <Minus className="size-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-black">{guestCount}</span>
                            <button
                              type="button"
                              onClick={() => setGuestCount(c => Math.min(20, c + 1))}
                              className="size-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                            >
                              <Plus className="size-3" />
                            </button>
                          </div>
                        </div>

                        {/* Employer Selector */}
                        <div className="sm:col-span-2">
                          <CustomSelect
                            id="guest-employer"
                            label="Corporate Client / Employer"
                            value={guestEmployer}
                            onChange={(val) => {
                              setGuestEmployer(val);
                              const depts = getDepartmentsForEmployer(val);
                              if (depts.length > 0) setGuestDept(depts[0]);
                            }}
                            required
                            placeholder="Select Employer…"
                            options={employers.map(e => ({ value: e, label: e }))}
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3">
                        {/* Hosting Department Dropdown */}
                        <CustomSelect
                          id="guest-dept"
                          label="Hosting Department (Cost Center)"
                          value={guestDept}
                          onChange={setGuestDept}
                          required
                          placeholder="Select Department…"
                          options={getDepartmentsForEmployer(guestEmployer).map(d => ({ value: d, label: d }))}
                        />

                        {/* Optional Delegation Note */}
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700">Visitor / Delegation Note (Optional)</label>
                          <input
                            type="text"
                            value={guestNote}
                            onChange={(e) => setGuestNote(e.target.value)}
                            placeholder="e.g. Auditors from KPMG"
                            className="w-full h-9 px-3 text-xs rounded-xl border border-slate-200 bg-white placeholder:text-slate-400"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 pt-1">
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700">Visitor Count</label>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setGuestCount(c => Math.max(1, c - 1))}
                              className="size-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                            >
                              <Minus className="size-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-black">{guestCount}</span>
                            <button
                              type="button"
                              onClick={() => setGuestCount(c => Math.min(20, c + 1))}
                              className="size-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                            >
                              <Plus className="size-3" />
                            </button>
                          </div>
                        </div>

                        {/* Optional Guest Name */}
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700">Visitor Name(s) (Optional)</label>
                          <input
                            type="text"
                            value={guestNote}
                            onChange={(e) => setGuestNote(e.target.value)}
                            placeholder="e.g. Contractor John"
                            className="w-full h-9 px-3 text-xs rounded-xl border border-slate-200 bg-white placeholder:text-slate-400"
                          />
                        </div>
                      </div>

                      {/* Sponsoring Host Staff Member Live Search */}
                      <div className="space-y-1.5 pt-1">
                        <label className="text-[11px] font-bold text-slate-700 block">
                          Sponsoring Host Staff Member <span className="text-rose-500">*</span>
                        </label>
                        
                        {!guestHost ? (
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                            <input
                              type="text"
                              value={hostSearch}
                              onChange={(e) => setHostSearch(e.target.value)}
                              placeholder="Search host by payroll ID (e.g. 01711) or name…"
                              className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 shadow-sm"
                            />
                            {searchingHost && <Clock className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 animate-spin" />}

                            {/* Dropdown Results */}
                            {hostSearchResults.length > 0 && (
                              <div className="absolute z-[250] top-full mt-1 w-full rounded-xl border border-slate-200 bg-white shadow-2xl divide-y divide-slate-100 max-h-56 overflow-y-auto">
                                {hostSearchResults.map((emp) => (
                                  <button
                                    key={emp.employee_payroll_id || emp.name}
                                    type="button"
                                    onClick={() => {
                                      setGuestHost(emp);
                                      setHostSearch("");
                                      setHostSearchResults([]);
                                    }}
                                    className="w-full flex items-center gap-3 px-3.5 py-2.5 text-left hover:bg-emerald-50/50 transition-colors group cursor-pointer"
                                  >
                                    <div className="size-8 rounded-lg bg-slate-100 text-slate-800 group-hover:bg-emerald-600 group-hover:text-white font-black text-xs flex items-center justify-center shrink-0">
                                      {initials(emp.customer_name)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">
                                        {emp.customer_name}
                                      </p>
                                      <p className="text-[10px] text-slate-500">
                                        {emp.employee_payroll_id} · {emp.department} · {getEmployerName(emp)}
                                      </p>
                                    </div>
                                    <ChevronRight className="size-4 text-slate-400 group-hover:text-emerald-600 shrink-0" />
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/60 flex items-center gap-3">
                            <div className="size-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-xs shrink-0">
                              {initials(guestHost.customer_name)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className="text-xs font-black text-slate-900">{guestHost.customer_name}</p>
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 uppercase">
                                  Host Sponsor
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-600 mt-0.5">
                                {guestHost.employee_payroll_id} · {guestHost.department} · {getEmployerName(guestHost)}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setGuestHost(null)}
                              className="size-7 rounded-lg hover:bg-rose-100 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                            >
                              <X className="size-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Dynamic Meal Selection Grid ──────────────────────────────── */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Select Meal Package</p>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {mealTypes.length} Available Packages
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-2.5">
              {mealTypes.map((m) => {
                const isSelected = selectedMeal.meal_name === m.meal_name;
                const isTraining = Boolean(m.is_training);
                const price = Number(m.meal_base_price) || 0;
                const subsidy = Number(m.subsidy_amount) || 0;
                const deduct = Number(m.employee_contribution) || 0;
                const extra = Number(m.extra_on_spot) || 0;

                return (
                  <button
                    key={m.meal_name}
                    type="button"
                    onClick={() => setSelectedMealName(m.meal_name)}
                    className={`p-3.5 rounded-xl border-2 text-left transition-all relative ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50/50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className={`text-xs font-black ${isSelected ? "text-emerald-900" : "text-slate-900"}`}>
                            {m.meal_name}
                          </p>
                          {isTraining && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900">
                              Training
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] font-mono text-emerald-700 font-bold mt-0.5">
                          KES {price.toLocaleString("en-KE")}
                        </p>
                      </div>

                      {isSelected && (
                        <div className="size-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                          <Check className="size-3" />
                        </div>
                      )}
                    </div>

                    <div className="mt-2 text-[10px] text-slate-500 font-medium flex items-center gap-2">
                      <span>HR: KES {subsidy}</span>
                      <span>·</span>
                      <span>Staff: KES {deduct}</span>
                      {extra > 0 && (
                        <>
                          <span>·</span>
                          <span className="text-amber-800 font-bold">+KES {extra} Extra</span>
                        </>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Special Meal Surcharge Switcher ────────────────────────────── */}
          {extraSurcharge > 0 && !isGuestMode && !isTrainingMeal && (
            <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 text-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-900 flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-amber-600" />
                  <span>Special Meal Surcharge (KES {extraSurcharge}):</span>
                </span>
                <span className="text-[10px] font-bold text-amber-800">Choose Settlement Method</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSurchargeMode("payroll")}
                  className={`p-2.5 rounded-xl border font-bold text-left transition-all ${
                    surchargeMode === "payroll"
                      ? "bg-white border-amber-500 text-amber-950 shadow-sm"
                      : "bg-amber-100/50 border-amber-200 text-amber-800"
                  }`}
                >
                  <p className="text-xs">Add to Monthly Payroll</p>
                  <p className="text-[10px] text-amber-700 font-normal mt-0.5">
                    Deducts KES {contribUnit + extraSurcharge} at cycle end
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setSurchargeMode("spot")}
                  className={`p-2.5 rounded-xl border font-bold text-left transition-all ${
                    surchargeMode === "spot"
                      ? "bg-white border-amber-500 text-amber-950 shadow-sm"
                      : "bg-amber-100/50 border-amber-200 text-amber-800"
                  }`}
                >
                  <p className="text-xs">Pay KES {extraSurcharge} On Spot</p>
                  <p className="text-[10px] text-amber-700 font-normal mt-0.5">
                    Cash or M-Pesa at counter now
                  </p>
                </button>
              </div>

              {surchargeMode === "spot" && (
                <div className="grid sm:grid-cols-2 gap-2 pt-1">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setSpotChannel("Cash")}
                      className={`flex-1 py-1.5 rounded-lg font-bold text-xs border ${
                        spotChannel === "Cash" ? "bg-amber-600 text-white border-amber-600" : "bg-white text-slate-700 border-slate-200"
                      }`}
                    >
                      Cash
                    </button>
                    <button
                      type="button"
                      onClick={() => setSpotChannel("M-Pesa")}
                      className={`flex-1 py-1.5 rounded-lg font-bold text-xs border ${
                        spotChannel === "M-Pesa" ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-slate-700 border-slate-200"
                      }`}
                    >
                      M-Pesa
                    </button>
                  </div>

                  {spotChannel === "M-Pesa" && (
                    <input
                      type="text"
                      value={mpesaRef}
                      onChange={(e) => setMpesaRef(e.target.value.toUpperCase())}
                      placeholder="M-Pesa Code (e.g. QK8912J)"
                      className="h-8 px-3 rounded-lg border border-slate-200 bg-white text-xs font-mono font-bold"
                    />
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── Training Session Sponsoring Options ────────────────────────── */}
          {isTrainingMeal && (
            <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 text-xs space-y-2.5">
              <div className="flex items-center gap-1.5 font-bold text-blue-900">
                <BookOpen className="size-4 text-blue-600" />
                <span>Training Session Attribution</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-blue-800">Workshop / Training Title</label>
                  <input
                    type="text"
                    value={trainingTitle}
                    onChange={(e) => setTrainingTitle(e.target.value)}
                    placeholder="e.g. ISO Safety Compliance Q2"
                    className="w-full h-8 px-3 rounded-lg border border-blue-200 bg-white text-xs"
                  />
                </div>
                <CustomSelect
                  id="sponsoring-employer"
                  label="Host Employer (If paying for all)"
                  value={sponsoringEmployer}
                  onChange={setSponsoringEmployer}
                  placeholder="Default: Diner's Employer"
                  options={employers.map(e => ({ value: e, label: e }))}
                />
              </div>
            </div>
          )}

          {/* ── Serving Mode & Quick Action ───────────────────────────────── */}
          <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2">
              <Layers className="size-4 text-slate-500" />
              <span className="text-xs font-bold text-slate-700">Serving Mode:</span>
              <div className="flex gap-1 ml-2">
                <button
                  type="button"
                  onClick={() => setServingMode("Counter Dine")}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                    servingMode === "Counter Dine" ? "bg-emerald-100 text-emerald-800" : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  Counter Dine
                </button>
                <button
                  type="button"
                  onClick={() => setServingMode("Packed Office Delivery")}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                    servingMode === "Packed Office Delivery" ? "bg-emerald-100 text-emerald-800" : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  Office Packed
                </button>
              </div>
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            type="button"
            disabled={(!selected && (!isGuestMode || (guestBilling === "Employee Sponsored" && !guestHost))) || submitting}
            onClick={handleLogMeal}
            className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
          >
            <Send className="size-4" />
            <span>
              {submitting
                ? "Submitting Meal Record…"
                : isGuestMode
                ? `Confirm ${guestCount} Visitor Meal${guestCount > 1 ? "s" : ""} (${guestBilling === "Company Sponsored" ? guestEmployer.split(" ")[0] : (guestHost ? guestHost.customer_name.split(" ")[0] : "Select Host")})`
                : `Confirm Meal for ${selected ? selected.customer_name.split(" ")[0] : "Diner"}`}
            </span>
          </button>
        </div>

        {/* ── Right Column: Live Session Queue & Receipt ──────────────────── */}
        <div className="space-y-4 sticky top-20">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-200 bg-slate-50/75">
              <div>
                <p className="text-xs font-black text-slate-900 leading-tight">Live Session Queue</p>
                <p className="text-[10px] text-slate-500">{session.length} meal transactions in this run</p>
              </div>
              {session.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSession([])}
                  className="text-[11px] font-bold text-rose-600 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="size-3" /> Clear
                </button>
              )}
            </div>

            {session.length === 0 ? (
              <div className="p-12 text-center space-y-2">
                <Clock className="size-8 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-700">Queue is empty</p>
                <p className="text-[11px] text-slate-400">Search and mark employee lunches to begin</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                {session.map((entry) => (
                  <div key={entry.id} className="p-3.5 hover:bg-slate-50 transition-colors space-y-1.5 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-slate-900">{entry.customerName}</p>
                          <span className="font-mono text-[9px] bg-slate-100 text-slate-600 px-1 rounded">
                            {entry.payrollId}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium">
                          {entry.department} · {getEmployerName(entry.employer)}
                        </p>
                      </div>
                      <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {entry.transactionCode}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100 text-slate-600">
                      <span className="font-bold text-slate-800">{entry.mealName}</span>
                      <div className="flex items-center gap-2">
                        <span>HR: KES {entry.employerBillable}</span>
                        <span>·</span>
                        <span>Deduct: KES {entry.employeeDeduction}</span>
                        {entry.amountPaidOnSpot > 0 && (
                          <>
                            <span>·</span>
                            <span className="font-bold text-amber-800">Spot: KES {entry.amountPaidOnSpot}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
