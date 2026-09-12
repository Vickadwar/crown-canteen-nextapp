"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  UserPlus,
  Users,
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  RefreshCw,
  AlertTriangle,
  Mail,
  Phone,
  CreditCard,
  Briefcase,
  ShieldCheck,
  IdCard,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface CanteenCustomerDoc {
  name: string; // autoname: employee_payroll_id
  customer_name?: string;
  customer_type?: "Employee" | "Intern" | "Visitor" | "Contractor" | string;
  employer?: string;
  employee_payroll_id?: string;
  id_card_number?: string;
  email?: string;
  mobile_number?: string;
  customer_status?: "Active" | "Suspended" | string;
  department?: string;
  face_descriptor?: string | number[];
  face_enrolled?: number;
}

const typeBadges: Record<string, { bg: string; text: string; border: string }> = {
  Employee: { bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-200" },
  Intern: { bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200" },
  Visitor: { bg: "bg-teal-50", text: "text-teal-800", border: "border-teal-200" },
  Contractor: { bg: "bg-violet-50", text: "text-violet-800", border: "border-violet-200" },
};

// Fallback demo data if bench database is clean or connecting offline
const defaultCanteenCustomers: CanteenCustomerDoc[] = [
  {
    name: "CP-8842",
    employee_payroll_id: "CP-8842",
    customer_name: "Samuel Mwangi",
    customer_type: "Employee",
    employer: "Crown Paints Kenya PLC",
    id_card_number: "29481029",
    email: "s.mwangi@crownpaints.co.ke",
    mobile_number: "+254 712 345 678",
    customer_status: "Active",
    department: "Production & Plant",
  },
  {
    name: "CP-8843",
    employee_payroll_id: "CP-8843",
    customer_name: "Jane Kariuki",
    customer_type: "Employee",
    employer: "Crown Paints Kenya PLC",
    id_card_number: "30192841",
    email: "j.kariuki@crownpaints.co.ke",
    mobile_number: "+254 722 999 000",
    customer_status: "Active",
    department: "Supply Chain & Warehouse",
  },
  {
    name: "FC-1029",
    employee_payroll_id: "FC-1029",
    customer_name: "Peter Otieno",
    customer_type: "Contractor",
    employer: "Forza Consultants",
    id_card_number: "27819022",
    email: "p.otieno@forza.co.ke",
    mobile_number: "+254 733 111 222",
    customer_status: "Active",
    department: "Quality Assurance",
  },
  {
    name: "CP-8901",
    employee_payroll_id: "CP-8901",
    customer_name: "Alice Chebet",
    customer_type: "Intern",
    employer: "Crown Paints Kenya PLC",
    id_card_number: "34910283",
    email: "a.chebet@crownpaints.co.ke",
    mobile_number: "+254 700 888 777",
    customer_status: "Active",
    department: "Human Resources & Admin",
  },
  {
    name: "VIS-9012",
    employee_payroll_id: "VIS-9012",
    customer_name: "Dr. David Kimani",
    customer_type: "Visitor",
    employer: "ODUK TECH LIMITED",
    id_card_number: "22910394",
    email: "d.kimani@oduktech.co.ke",
    mobile_number: "+254 711 444 555",
    customer_status: "Active",
    department: "Commercial & Sales",
  },
];

export default function CanteenCustomersPage() {
  const [customers, setCustomers] = useState<CanteenCustomerDoc[]>([]);
  const [employerMap, setEmployerMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("All");
  const [isLiveSync, setIsLiveSync] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch live Canteen Customer Doctype & Employer (Customer) Names
  const fetchLiveCustomers = async () => {
    setRefreshing(true);
    setErrorMsg(null);
    try {
      // 1. Fetch Employer / Customer name mapping
      const custParams = new URLSearchParams({
        fields: JSON.stringify(["name", "customer_name"]),
        limit_page_length: "100",
      });
      fetch(`/api/resource/Customer?${custParams.toString()}`, { credentials: "include" })
        .then((r) => r.json())
        .then((json) => {
          if (json.data && Array.isArray(json.data)) {
            const map: Record<string, string> = {};
            json.data.forEach((item: any) => {
              if (item.name) {
                map[item.name] = item.customer_name || item.name;
              }
            });
            setEmployerMap(map);
          }
        })
        .catch(() => {});

      // 2. Fetch Canteen Customer records
      const params = new URLSearchParams({
        fields: JSON.stringify([
          "name",
          "customer_name",
          "customer_type",
          "employer",
          "employee_payroll_id",
          "id_card_number",
          "email",
          "mobile_number",
          "customer_status",
          "department",
        ]),
        limit_page_length: "150",
      });

      let res = await fetch(`/api/resource/Canteen%20Customer?${params.toString()}`, {
        credentials: "include",
      });

      if (!res.ok && res.status !== 403 && res.status !== 401) {
        const fallbackParams = new URLSearchParams({
          fields: JSON.stringify(["*"]),
          limit_page_length: "150",
        });
        res = await fetch(`/api/resource/Canteen%20Customer?${fallbackParams.toString()}`, {
          credentials: "include",
        });
      }

      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          setCustomers(json.data);
          setIsLiveSync(true);
          setErrorMsg(null);
        } else {
          setCustomers([]);
          setIsLiveSync(true);
        }
      } else if (res.status === 403 || res.status === 401) {
        setIsLiveSync(false);
        setCustomers(defaultCanteenCustomers);
        setErrorMsg("Session expired or permission required for Canteen Customer Doctype.");
      } else {
        const errJson = await res.json().catch(() => ({}));
        setIsLiveSync(false);
        setCustomers(defaultCanteenCustomers);
        setErrorMsg(errJson.message || `Server returned status ${res.status}`);
      }
    } catch (err: any) {
      setIsLiveSync(false);
      setCustomers(defaultCanteenCustomers);
      setErrorMsg(err.message || "Failed to reach Frappe API");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLiveCustomers();
  }, []);

  // Helper to resolve human-readable employer name
  const getEmployerDisplayName = (employerCode?: string) => {
    if (!employerCode) return "—";
    return employerMap[employerCode] || employerCode;
  };

  // Dynamically extract unique customer types
  const dynamicTypes = React.useMemo(() => {
    const types = Array.from(
      new Set(
        customers
          .map((c) => c.customer_type?.trim())
          .filter((t): t is string => Boolean(t))
      )
    ).sort();
    return ["All", ...types];
  }, [customers]);

  // Filter list
  const filtered = customers.filter((c) => {
    const name = (c.customer_name || c.name || "").toLowerCase();
    const pid = (c.employee_payroll_id || c.name || "").toLowerCase();
    const idCard = (c.id_card_number || "").toLowerCase();
    const employerName = getEmployerDisplayName(c.employer).toLowerCase();
    const dept = (c.department || "").toLowerCase();
    const q = search.toLowerCase();

    const matchesSearch =
      name.includes(q) ||
      pid.includes(q) ||
      idCard.includes(q) ||
      employerName.includes(q) ||
      dept.includes(q);

    const matchesType =
      filterType === "All" || (c.customer_type || "").trim() === filterType;

    return matchesSearch && matchesType;
  });

  const totalCount = customers.length;
  const activeCount = customers.filter((c) => c.customer_status !== "Suspended").length;
  const employersCount = Array.from(new Set(customers.map((c) => c.employer).filter(Boolean))).length;
  const departmentsCount = Array.from(new Set(customers.map((c) => c.department).filter(Boolean))).length;

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">
              Canteen Customers (Staff & Visitors)
            </h1>
            {isLiveSync ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
                <span className="size-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Live Canteen Customer Doctype ({customers.length} records)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold">
                <AlertTriangle className="size-3 text-amber-600" />
                Synced Cache
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Manage registered dining personnel, payroll IDs, national ID cards, and department meal quotas.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={fetchLiveCustomers}
            disabled={refreshing}
            suppressHydrationWarning
            className="h-8 gap-1.5 text-xs font-bold border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            <RefreshCw className={`size-3.5 ${refreshing ? "animate-spin text-emerald-600" : ""}`} />
            <span>{refreshing ? "Syncing…" : "Refresh"}</span>
          </Button>

          <Link href="/employees/new">
            <Button
              size="sm"
              suppressHydrationWarning
              className="h-8 gap-1.5 text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm cursor-pointer"
            >
              <UserPlus className="size-3.5" />
              <span>Add Customer</span>
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
          { label: "Registered Personnel", value: totalCount.toString(), icon: Users, color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
          { label: "Active Status", value: activeCount.toString(), icon: CheckCircle2, color: "text-teal-700 bg-teal-50 border-teal-200" },
          { label: "Employers Represented", value: employersCount.toString(), icon: Building2, color: "text-slate-700 bg-slate-100 border-slate-200" },
          { label: "Department Divisions", value: departmentsCount.toString(), icon: Briefcase, color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
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
            placeholder="Search by name, Payroll ID, ID Card, employer, or dept…"
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

      {/* ── High-Density Canteen Customer List Table ───────────────────────── */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center space-y-2">
            <RefreshCw className="size-6 text-emerald-600 animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-600">Connecting to Canteen Customer Doctype…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Users className="size-8 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No canteen customer records match your filter.</p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => { setSearch(""); setFilterType("All"); fetchLiveCustomers(); }}
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
                  <th className="py-2.5 px-3.5">Customer Name & Payroll ID</th>
                  <th className="py-2.5 px-3.5">Type</th>
                  <th className="py-2.5 px-3.5">Employer (Company Name)</th>
                  <th className="py-2.5 px-3.5">Department</th>
                  <th className="py-2.5 px-3.5">ID Card No.</th>
                  <th className="py-2.5 px-3.5">Contact Details</th>
                  <th className="py-2.5 px-3.5">Status</th>
                  <th className="py-2.5 px-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filtered.map((c) => {
                  const displayName = c.customer_name || c.name;
                  const payrollId = c.employee_payroll_id || c.name;
                  const employerDisplayName = getEmployerDisplayName(c.employer);
                  const initials = displayName
                    .split(" ")
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase();
                  const isActive = c.customer_status !== "Suspended";
                  const badgeStyle =
                    typeBadges[c.customer_type || "Employee"] || typeBadges.Employee;

                  return (
                    <tr
                      key={payrollId}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Name + Payroll ID */}
                      <td className="py-2.5 px-3.5">
                        <Link
                          href={`/employees/${encodeURIComponent(payrollId)}`}
                          className="flex items-center gap-2.5 group-hover:text-emerald-700 transition-colors"
                        >
                          <div className="size-8 rounded-lg bg-slate-100 text-slate-700 group-hover:bg-emerald-100 group-hover:text-emerald-800 font-black text-xs flex items-center justify-center shrink-0 border border-slate-200 transition-colors">
                            {initials}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 leading-tight">
                              {displayName}
                            </p>
                            <p className="text-[10px] font-mono text-emerald-700 font-bold mt-0.5">
                              ID: {payrollId}
                            </p>
                          </div>
                        </Link>
                      </td>

                      {/* Customer Type Badge */}
                      <td className="py-2.5 px-3.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
                        >
                          {c.customer_type || "Employee"}
                        </span>
                      </td>

                      {/* Employer Resolved Name (Shows Human Name instead of CUST code) */}
                      <td className="py-2.5 px-3.5">
                        <div>
                          <p className="font-bold text-slate-900 text-[11px] leading-tight">
                            {employerDisplayName}
                          </p>
                          {c.employer && c.employer !== employerDisplayName && (
                            <p className="text-[9px] font-mono text-slate-400 mt-0.5">
                              {c.employer}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Department Link */}
                      <td className="py-2.5 px-3.5">
                        <span className="text-slate-600 text-[11px] font-medium flex items-center gap-1">
                          <Briefcase className="size-3 text-slate-400" />
                          {c.department || "General Operations"}
                        </span>
                      </td>

                      {/* ID Card Number */}
                      <td className="py-2.5 px-3.5">
                        <span className="font-mono text-slate-700 text-[11px] bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          {c.id_card_number || "—"}
                        </span>
                      </td>

                      {/* Contact */}
                      <td className="py-2.5 px-3.5 text-slate-500 text-[11px]">
                        <div className="space-y-0.5">
                          {c.email && (
                            <p className="flex items-center gap-1">
                              <Mail className="size-3 text-slate-400" />
                              <span className="truncate max-w-[140px]">{c.email}</span>
                            </p>
                          )}
                          {c.mobile_number && (
                            <p className="flex items-center gap-1 text-[10px]">
                              <Phone className="size-3 text-slate-400" />
                              <span>{c.mobile_number}</span>
                            </p>
                          )}
                        </div>
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
                            Suspended
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-2.5 px-3.5 text-right">
                        <Link href={`/employees/${encodeURIComponent(payrollId)}`}>
                          <Button
                            size="sm"
                            variant="ghost"
                            suppressHydrationWarning
                            className="h-7 px-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50 rounded-md"
                          >
                            <span>Profile</span>
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
            <strong className="text-slate-800">{totalCount}</strong> Canteen Customer profiles
          </p>
          <p className="text-[11px]">Direct integration with Canteen Customer Doctype</p>
        </div>
      </div>
    </div>
  );
}
