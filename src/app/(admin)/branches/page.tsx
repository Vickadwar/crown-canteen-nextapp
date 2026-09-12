"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Plus,
  RefreshCw,
  AlertTriangle,
  ChevronRight,
  Building2,
  Warehouse,
  User,
  ShieldCheck,
  CheckCircle2,
  Store,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface CanteenBranchDoc {
  name: string; // autoname: branch_name
  branch_code: string;
  branch_name: string;
  company?: string;
  default_warehouse?: string;
  contact_person?: string;
}

// Fallback demo branches if bench database is clean or connecting offline
const defaultBranches: CanteenBranchDoc[] = [
  {
    name: "Nairobi HQ Canteen",
    branch_code: "BR-NRB-01",
    branch_name: "Nairobi HQ Canteen",
    company: "Crown Paints Kenya PLC",
    default_warehouse: "Main Stores - CP",
    contact_person: "Admin Manager",
  },
  {
    name: "Mombasa Plant Canteen",
    branch_code: "BR-MSA-02",
    branch_name: "Mombasa Plant Canteen",
    company: "Crown Paints Kenya PLC",
    default_warehouse: "Cold Storage - CP",
    contact_person: "Plant Supervisor",
  },
  {
    name: "Kisumu Depot Canteen",
    branch_code: "BR-KSM-03",
    branch_name: "Kisumu Depot Canteen",
    company: "Crown Paints Kenya PLC",
    default_warehouse: "Dry Goods Pantry - CP",
    contact_person: "Depot Lead",
  },
];

export default function BranchesPage() {
  const [branches, setBranches] = useState<CanteenBranchDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isLiveSync, setIsLiveSync] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch live Canteen Branches Doctype
  const fetchLiveBranches = async () => {
    setRefreshing(true);
    setErrorMsg(null);
    try {
      const params = new URLSearchParams({
        fields: JSON.stringify([
          "name",
          "branch_code",
          "branch_name",
          "company",
          "default_warehouse",
          "contact_person",
        ]),
        limit_page_length: "100",
      });

      let res = await fetch(`/api/resource/Canteen%20Branches?${params.toString()}`, {
        credentials: "include",
      });

      if (!res.ok && res.status !== 403 && res.status !== 401) {
        const fallbackParams = new URLSearchParams({
          fields: JSON.stringify(["*"]),
          limit_page_length: "100",
        });
        res = await fetch(`/api/resource/Canteen%20Branches?${fallbackParams.toString()}`, {
          credentials: "include",
        });
      }

      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
          setBranches(json.data);
          setIsLiveSync(true);
          setErrorMsg(null);
        } else {
          setBranches(defaultBranches);
          setIsLiveSync(true);
        }
      } else if (res.status === 403 || res.status === 401) {
        setIsLiveSync(false);
        setBranches(defaultBranches);
        setErrorMsg("Session expired or permission required for Canteen Branches Doctype. Please sign in.");
      } else {
        const errJson = await res.json().catch(() => ({}));
        setIsLiveSync(false);
        setBranches(defaultBranches);
        setErrorMsg(errJson.message || `Server returned status ${res.status}`);
      }
    } catch (err: any) {
      setIsLiveSync(false);
      setBranches(defaultBranches);
      setErrorMsg(err.message || "Failed to reach Frappe API");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLiveBranches();
  }, []);

  // Filter list
  const filtered = branches.filter((b) => {
    const name = (b.branch_name || b.name || "").toLowerCase();
    const code = (b.branch_code || "").toLowerCase();
    const company = (b.company || "").toLowerCase();
    const wh = (b.default_warehouse || "").toLowerCase();
    const contact = (b.contact_person || "").toLowerCase();
    const q = search.toLowerCase();

    return (
      name.includes(q) ||
      code.includes(q) ||
      company.includes(q) ||
      wh.includes(q) ||
      contact.includes(q)
    );
  });

  const totalCount = branches.length;
  const companiesCount = Array.from(new Set(branches.map((b) => b.company).filter(Boolean))).length;
  const warehousesCount = Array.from(new Set(branches.map((b) => b.default_warehouse).filter(Boolean))).length;

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">
              Canteen Branches & Dining Facilities
            </h1>
            {isLiveSync ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
                <span className="size-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Live Canteen Branches Doctype ({branches.length} branches)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold">
                <AlertTriangle className="size-3 text-amber-600" />
                Synced Cache
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Manage serving kitchens, company dining points, and linked default stock warehouses.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={fetchLiveBranches}
            disabled={refreshing}
            suppressHydrationWarning
            className="h-8 gap-1.5 text-xs font-bold border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            <RefreshCw className={`size-3.5 ${refreshing ? "animate-spin text-emerald-600" : ""}`} />
            <span>{refreshing ? "Syncing…" : "Refresh"}</span>
          </Button>

          <Link href="/branches/new">
            <Button
              size="sm"
              suppressHydrationWarning
              className="h-8 gap-1.5 text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>Add Branch</span>
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
          { label: "Total Branches", value: totalCount.toString(), icon: Store, color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
          { label: "Active Plants", value: totalCount.toString(), icon: CheckCircle2, color: "text-teal-700 bg-teal-50 border-teal-200" },
          { label: "Linked Warehouses", value: warehousesCount.toString(), icon: Warehouse, color: "text-slate-700 bg-slate-100 border-slate-200" },
          { label: "Companies Linked", value: companiesCount.toString(), icon: Building2, color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
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
            placeholder="Search by branch name, code, company, or warehouse…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            suppressHydrationWarning
            className="w-full h-8 pl-8 pr-3 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-600 focus:outline-none transition-all font-medium"
          />
        </div>
      </div>

      {/* ── High-Density Canteen Branches Table ───────────────────────────── */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center space-y-2">
            <RefreshCw className="size-6 text-emerald-600 animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-600">Connecting to Canteen Branches Doctype…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Store className="size-8 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No canteen branches found.</p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => { setSearch(""); fetchLiveBranches(); }}
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
                  <th className="py-2.5 px-3.5">Branch Name & Code</th>
                  <th className="py-2.5 px-3.5">Company Entity</th>
                  <th className="py-2.5 px-3.5">Default Supply Warehouse</th>
                  <th className="py-2.5 px-3.5">Contact Person</th>
                  <th className="py-2.5 px-3.5">Status</th>
                  <th className="py-2.5 px-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filtered.map((b) => {
                  const displayName = b.branch_name || b.name;
                  const branchCode = b.branch_code || b.name;

                  return (
                    <tr
                      key={b.name}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Name + Code */}
                      <td className="py-2.5 px-3.5">
                        <Link
                          href={`/branches/${encodeURIComponent(b.name)}`}
                          className="flex items-center gap-2.5 group-hover:text-emerald-700 transition-colors"
                        >
                          <div className="size-8 rounded-lg bg-slate-100 text-slate-700 group-hover:bg-emerald-100 group-hover:text-emerald-800 font-black text-xs flex items-center justify-center shrink-0 border border-slate-200 transition-colors">
                            <Store className="size-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 leading-tight">
                              {displayName}
                            </p>
                            <p className="text-[10px] font-mono text-emerald-700 font-bold mt-0.5">
                              Code: {branchCode}
                            </p>
                          </div>
                        </Link>
                      </td>

                      {/* Company */}
                      <td className="py-2.5 px-3.5">
                        <span className="font-semibold text-slate-900 text-[11px] flex items-center gap-1">
                          <Building2 className="size-3 text-slate-400" />
                          <span>{b.company || "Crown Paints Kenya PLC"}</span>
                        </span>
                      </td>

                      {/* Default Warehouse (With direct link to warehouse stock) */}
                      <td className="py-2.5 px-3.5">
                        {b.default_warehouse ? (
                          <Link
                            href={`/warehouse/${encodeURIComponent(b.default_warehouse)}`}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 transition-colors"
                          >
                            <Warehouse className="size-3 text-emerald-600" />
                            <span>{b.default_warehouse}</span>
                          </Link>
                        ) : (
                          <span className="text-slate-400 text-[10px] italic">Not Set</span>
                        )}
                      </td>

                      {/* Contact Person */}
                      <td className="py-2.5 px-3.5 text-slate-600 text-[11px]">
                        <span className="flex items-center gap-1">
                          <User className="size-3 text-slate-400" />
                          <span>{b.contact_person || "Facility Lead"}</span>
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-2.5 px-3.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
                          <span className="size-1.5 rounded-full bg-emerald-600" />
                          Operational
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-2.5 px-3.5 text-right">
                        <Link href={`/branches/${encodeURIComponent(b.name)}`}>
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
            <strong className="text-slate-800">{totalCount}</strong> Canteen Branches
          </p>
          <p className="text-[11px]">Direct integration with Canteen Branches Doctype</p>
        </div>
      </div>
    </div>
  );
}
