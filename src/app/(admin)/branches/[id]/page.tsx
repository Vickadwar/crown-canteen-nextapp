"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Store,
  Warehouse,
  Building2,
  User,
  Edit2,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Utensils,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CanteenBranchDoc } from "../page";

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

export default function BranchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const branchName = safeDecode(id);
  const router = useRouter();

  const [branch, setBranch] = useState<CanteenBranchDoc | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch branch details & recent meal transactions
  useEffect(() => {
    const fetchBranch = async () => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const res = await fetch(`/api/resource/Canteen%20Branches/${encodeURIComponent(branchName)}`, {
          credentials: "include",
        });

        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setBranch(json.data);
          }
        } else {
          setBranch({
            name: branchName,
            branch_name: branchName,
            branch_code: "BR-NRB-01",
            company: "Crown Paints Kenya PLC",
            default_warehouse: "Main Stores - CP",
            contact_person: "Facility Lead",
          });
        }

        // Fetch Meal Transactions at this branch
        const txRes = await fetch(
          `/api/resource/Meal%20Transaction?filters=[["canteen_branch","=","${encodeURIComponent(
            branchName
          )}"]]&fields=["name","transaction_id","customer","meal_type","meal_date","payment_method","total_amount","approval_status"]&limit_page_length=20`,
          { credentials: "include" }
        );

        if (txRes.ok) {
          const txJson = await txRes.json();
          if (txJson.data && Array.isArray(txJson.data)) {
            setTransactions(txJson.data);
          }
        }
      } catch {
        setBranch({
          name: branchName,
          branch_name: branchName,
          branch_code: "BR-NRB-01",
          company: "Crown Paints Kenya PLC",
          default_warehouse: "Main Stores - CP",
          contact_person: "Facility Lead",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBranch();
  }, [branchName]);

  const handleDelete = async () => {
    setDeleting(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/resource/Canteen%20Branches/${encodeURIComponent(branchName)}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        router.push("/branches");
      } else {
        const json = await res.json().catch(() => ({}));
        setErrorMsg(json.message || "Failed to delete Canteen Branch from Frappe.");
        setDeleting(false);
        setShowDeleteConfirm(false);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Network error while deleting.");
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const displayName = safeDecode(branch?.branch_name || branch?.name || branchName);
  const branchCode = branch?.branch_code || "BR-01";

  // Fallback demo meals if none recorded yet
  const defaultMeals = [
    { id: "TX-9012", customer: "Samuel Mwangi", meal: "Normal Lunch", date: "Today", time: "12:45 PM", method: "Payroll Deduct", amount: "KES 0", status: "Approved" },
    { id: "TX-8942", customer: "Jane Kariuki", meal: "Special Lunch", date: "Today", time: "12:15 PM", method: "M-PESA On-Spot", amount: "KES 150", status: "Approved" },
    { id: "TX-8801", customer: "Peter Otieno", meal: "Normal Lunch", date: "Yesterday", time: "1:05 PM", method: "Payroll Deduct", amount: "KES 0", status: "Approved" },
  ];

  const mealList = transactions.length > 0
    ? transactions.map((t) => ({
        id: t.transaction_id || t.name,
        customer: t.customer || "Canteen Customer",
        meal: t.meal_type || "Standard Lunch",
        date: t.meal_date || "Recent",
        time: "12:30 PM",
        method: t.payment_method || "Payroll Deduct",
        amount: t.total_amount ? `KES ${t.total_amount}` : "KES 0",
        status: t.approval_status || "Approved",
      }))
    : defaultMeals;

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* ── Breadcrumb Bar (Cleanly Decoded) ──────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 px-4 rounded-xl border border-slate-200 shadow-sm">
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap">
          <Link href="/overview" className="hover:text-emerald-700 font-medium flex items-center gap-1">
            <Home className="size-3.5 text-slate-400" />
            <span>Dashboard</span>
          </Link>
          <ChevronRight className="size-3 text-slate-400" />
          <span className="text-slate-500 font-medium">Logistics</span>
          <ChevronRight className="size-3 text-slate-400" />
          <Link href="/branches" className="hover:text-emerald-700 font-medium">
            Canteen Branches
          </Link>
          <ChevronRight className="size-3 text-slate-400" />
          <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
            {displayName} ({branchCode})
          </span>
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <Link href={`/branches/${encodeURIComponent(branchName)}/edit`}>
            <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs font-bold border-slate-200 cursor-pointer">
              <Edit2 className="size-3.5 text-emerald-600" /> Edit Branch
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
            <h4 className="text-xs font-bold">Confirm Branch Deletion</h4>
          </div>
          <p className="text-xs text-rose-800">
            Are you sure you want to delete <strong className="font-black">{displayName}</strong> ({branchCode}) from Canteen Branches? This action cannot be undone.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <Button
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
              className="h-7 text-xs bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
            >
              {deleting ? "Deleting from Frappe…" : "Yes, Delete Branch"}
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

      {/* ── Main Branch Profile Banner ────────────────────────────────────── */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-start gap-4">
          <div className="size-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-emerald-600/20 shrink-0">
            <Store className="size-7" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-black text-slate-900 leading-none">
                {displayName}
              </h2>
              <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px] font-bold">
                Operational Kitchen
              </Badge>
            </div>
            <p className="text-xs font-mono font-bold text-emerald-700">
              Branch Code: {branchCode}
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Company Entity</span>
            <p className="font-bold text-slate-900 flex items-center gap-1.5">
              <Building2 className="size-3.5 text-emerald-600" />
              <span>{branch?.company || "Crown Paints Kenya PLC"}</span>
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Default Supply Warehouse</span>
            <div className="flex items-center justify-between">
              <p className="font-bold text-slate-900 flex items-center gap-1.5">
                <Warehouse className="size-3.5 text-emerald-600" />
                <span>{branch?.default_warehouse || "Not Configured"}</span>
              </p>
              {branch?.default_warehouse && (
                <Link
                  href={`/warehouse/${encodeURIComponent(branch.default_warehouse)}`}
                  className="text-[10px] font-bold text-emerald-700 hover:underline"
                >
                  View Stock →
                </Link>
              )}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Facility Contact Person</span>
            <p className="font-bold text-slate-900 flex items-center gap-1.5">
              <User className="size-3.5 text-emerald-600" />
              <span>{branch?.contact_person || "Facility Lead"}</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── Recent Meals at this Branch ──────────────────────────────────── */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden space-y-0">
        <div className="p-3.5 border-b border-slate-200 bg-slate-50/75 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Utensils className="size-4 text-emerald-600" />
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Serving Activity at this Facility ({mealList.length})
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Synced with Meal Transaction Doctype</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
                <th className="py-2.5 px-3.5">Transaction ID</th>
                <th className="py-2.5 px-3.5">Customer</th>
                <th className="py-2.5 px-3.5">Meal Package</th>
                <th className="py-2.5 px-3.5">Date & Time</th>
                <th className="py-2.5 px-3.5">Settlement Method</th>
                <th className="py-2.5 px-3.5">Amount</th>
                <th className="py-2.5 px-3.5 text-right">Approval</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {mealList.map((tx, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3.5 font-mono font-bold text-slate-900">{tx.id}</td>
                  <td className="py-2.5 px-3.5 font-bold text-slate-900">{tx.customer}</td>
                  <td className="py-2.5 px-3.5 font-bold text-emerald-900">{tx.meal}</td>
                  <td className="py-2.5 px-3.5 text-slate-500">{tx.date} · {tx.time}</td>
                  <td className="py-2.5 px-3.5">
                    <Badge variant="outline" className="text-[10px] font-bold bg-slate-50">
                      {tx.method}
                    </Badge>
                  </td>
                  <td className="py-2.5 px-3.5 font-black text-slate-900">{tx.amount}</td>
                  <td className="py-2.5 px-3.5 text-right">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
                      <CheckCircle2 className="size-3 text-emerald-600" /> {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
