"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Building2,
  CheckCircle2,
  XCircle,
  ChevronRight,
  RefreshCw,
  Users,
  ShieldCheck,
  MapPin,
  Mail,
  Phone,
  AlertTriangle,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface CustomerDoc {
  name: string;
  customer_name?: string;
  customer_type?: string;
  customer_group?: string;
  territory?: string;
  mobile_no?: string;
  email_id?: string;
  payment_terms?: string;
  disabled?: number;
  tax_id?: string;
}

export default function EmployersPage() {
  const [customers, setCustomers] = useState<CustomerDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterGroup, setFilterGroup] = useState<string>("All");
  const [isLiveSync, setIsLiveSync] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch live Customer doctype from backend
  const fetchLiveCustomers = async () => {
    setRefreshing(true);
    setErrorMsg(null);
    try {
      const params = new URLSearchParams({
        fields: JSON.stringify([
          "name",
          "customer_name",
          "customer_type",
          "customer_group",
          "territory",
          "mobile_no",
          "email_id",
          "payment_terms",
          "disabled",
          "tax_id",
        ]),
        limit_page_length: "100",
      });

      let res = await fetch(`/api/resource/Customer?${params.toString()}`, {
        credentials: "include",
      });

      if (!res.ok && res.status !== 403 && res.status !== 401) {
        const fallbackParams = new URLSearchParams({
          fields: JSON.stringify(["*"]),
          limit_page_length: "100",
        });
        res = await fetch(`/api/resource/Customer?${fallbackParams.toString()}`, {
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
        setErrorMsg("Session expired or permission required for Customer Doctype. Please sign in.");
      } else {
        const errJson = await res.json().catch(() => ({}));
        setIsLiveSync(false);
        setErrorMsg(errJson.message || `Server returned status ${res.status}`);
      }
    } catch (err: any) {
      setIsLiveSync(false);
      setErrorMsg(err.message || "Failed to reach Frappe API");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLiveCustomers();
  }, []);

  // Dynamically extract unique customer groups from live records
  const dynamicGroups = React.useMemo(() => {
    const groups = Array.from(
      new Set(
        customers
          .map((c) => c.customer_group?.trim())
          .filter((g): g is string => Boolean(g))
      )
    ).sort();
    return ["All", ...groups];
  }, [customers]);

  // Filter list
  const filtered = customers.filter((c) => {
    const name = (c.customer_name || c.name || "").toLowerCase();
    const group = (c.customer_group || "").toLowerCase();
    const territory = (c.territory || "").toLowerCase();
    const q = search.toLowerCase();

    const matchesSearch =
      name.includes(q) ||
      group.includes(q) ||
      territory.includes(q) ||
      (c.name || "").toLowerCase().includes(q);

    const matchesGroup =
      filterGroup === "All" || (c.customer_group || "").trim() === filterGroup;

    return matchesSearch && matchesGroup;
  });

  const totalCount = customers.length;
  const activeCount = customers.filter((c) => !c.disabled).length;
  const totalGroups = dynamicGroups.length > 1 ? dynamicGroups.length - 1 : 0;

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">
              Employer Accounts (Customers)
            </h1>
            {isLiveSync ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
                <span className="size-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Live Customer Doctype ({customers.length} records)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold">
                <AlertTriangle className="size-3 text-amber-600" />
                Disconnected
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Direct real-time synchronization with Frappe Customer Doctype for corporate meal agreements.
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
          { label: "Total Employers", value: totalCount.toString(), icon: Building2, color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
          { label: "Active Agreements", value: activeCount.toString(), icon: CheckCircle2, color: "text-teal-700 bg-teal-50 border-teal-200" },
          { label: "Customer Groups", value: totalGroups.toString(), icon: Users, color: "text-slate-700 bg-slate-100 border-slate-200" },
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
            placeholder="Search by employer name, ID, or territory…"
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

      {/* ── High-Density Employer / Customer List Table ───────────────────── */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center space-y-2">
            <RefreshCw className="size-6 text-emerald-600 animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-600">Connecting to Frappe Customer Doctype…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Building2 className="size-8 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">
              {customers.length === 0
                ? "No employer (Customer) records found in the Frappe database."
                : "No employer accounts match your active search filter."}
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Customers created on the ERP side will automatically appear here upon synchronization.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => { setSearch(""); setFilterGroup("All"); fetchLiveCustomers(); }}
              suppressHydrationWarning
              className="text-xs font-bold h-8 cursor-pointer"
            >
              <RefreshCw className="size-3.5 mr-1" /> Reload From Server
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3.5">Employer / Institution</th>
                  <th className="py-2.5 px-3.5">Customer Group</th>
                  <th className="py-2.5 px-3.5">Territory / Location</th>
                  <th className="py-2.5 px-3.5">Billing Terms</th>
                  <th className="py-2.5 px-3.5">Contact Details</th>
                  <th className="py-2.5 px-3.5">Status</th>
                  <th className="py-2.5 px-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filtered.map((c) => {
                  const displayName = c.customer_name || c.name;
                  const initials = displayName
                    .split(" ")
                    .map((s) => s[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase();
                  const isActive = !c.disabled;

                  return (
                    <tr
                      key={c.name}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Name + ID */}
                      <td className="py-2.5 px-3.5">
                        <Link
                          href={`/employers/${encodeURIComponent(c.name)}`}
                          className="flex items-center gap-2.5 group-hover:text-emerald-700 transition-colors"
                        >
                          <div className="size-8 rounded-lg bg-slate-100 text-slate-700 group-hover:bg-emerald-100 group-hover:text-emerald-800 font-black text-xs flex items-center justify-center shrink-0 border border-slate-200 transition-colors">
                            {initials}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 leading-tight">
                              {displayName}
                            </p>
                            <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                              {c.name} {c.tax_id ? `· PIN: ${c.tax_id}` : ""}
                            </p>
                          </div>
                        </Link>
                      </td>

                      {/* Dynamic Customer Group */}
                      <td className="py-2.5 px-3.5">
                        <Badge
                          variant="outline"
                          className="text-[10px] font-bold uppercase tracking-wider bg-slate-50 border-slate-200"
                        >
                          {c.customer_group || "General Customer"}
                        </Badge>
                      </td>

                      {/* Territory */}
                      <td className="py-2.5 px-3.5">
                        <span className="flex items-center gap-1 text-slate-600 text-[11px]">
                          <MapPin className="size-3 text-slate-400" />
                          {c.territory || "Kenya"}
                        </span>
                      </td>

                      {/* Payment Terms */}
                      <td className="py-2.5 px-3.5">
                        <span className="font-semibold text-slate-700 text-[11px]">
                          {c.payment_terms || "Standard Terms"}
                        </span>
                      </td>

                      {/* Contact */}
                      <td className="py-2.5 px-3.5 text-slate-500 text-[11px]">
                        <div className="space-y-0.5">
                          {c.email_id ? (
                            <p className="flex items-center gap-1">
                              <Mail className="size-3 text-slate-400" />
                              <span className="truncate max-w-[140px]">{c.email_id}</span>
                            </p>
                          ) : c.mobile_no ? (
                            <p className="flex items-center gap-1 text-[10px]">
                              <Phone className="size-3 text-slate-400" />
                              <span>{c.mobile_no}</span>
                            </p>
                          ) : (
                            <span className="text-slate-400 text-[10px] italic">No contact set</span>
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
                            Disabled
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-2.5 px-3.5 text-right">
                        <Link href={`/employers/${encodeURIComponent(c.name)}`}>
                          <Button
                            size="sm"
                            variant="ghost"
                            suppressHydrationWarning
                            className="h-7 px-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50 rounded-md"
                          >
                            <span>Manage</span>
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
            <strong className="text-slate-800">{totalCount}</strong> employer customer records
          </p>
          <p className="text-[11px]">Direct integration with Frappe Customer Doctype</p>
        </div>
      </div>
    </div>
  );
}
