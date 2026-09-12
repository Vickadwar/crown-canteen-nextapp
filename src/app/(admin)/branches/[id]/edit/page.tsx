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
  Check,
  Save,
  Trash2,
  AlertCircle,
  Sparkles,
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

export default function EditBranchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const branchName = safeDecode(id);
  const router = useRouter();

  // Form State
  const [branchCode, setBranchCode] = useState("");
  const [company, setCompany] = useState("");
  const [defaultWarehouse, setDefaultWarehouse] = useState("");
  const [contactPerson, setContactPerson] = useState("");

  // Live Options & State
  const [companiesList, setCompaniesList] = useState<{ name: string; company_name?: string }[]>([]);
  const [warehousesList, setWarehousesList] = useState<{ name: string; warehouse_name?: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Load existing branch & options
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setErrorMsg(null);
      try {
        // 1. Companies
        const cRes = await fetch(
          '/api/resource/Company?fields=["name","company_name"]&limit_page_length=50',
          { credentials: "include" }
        );
        if (cRes.ok) {
          const cJson = await cRes.json();
          if (cJson.data && Array.isArray(cJson.data)) {
            setCompaniesList(cJson.data);
          }
        }

        // 2. Warehouses
        const whRes = await fetch(
          '/api/resource/Warehouse?fields=["name","warehouse_name"]&limit_page_length=50',
          { credentials: "include" }
        );
        if (whRes.ok) {
          const whJson = await whRes.json();
          if (whJson.data && Array.isArray(whJson.data)) {
            setWarehousesList(whJson.data);
          }
        }

        // 3. Current Branch Record
        const res = await fetch(`/api/resource/Canteen%20Branches/${encodeURIComponent(branchName)}`, {
          credentials: "include",
        });

        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setBranchCode(json.data.branch_code || "");
            setCompany(json.data.company || "");
            setDefaultWarehouse(json.data.default_warehouse || "");
            setContactPerson(json.data.contact_person || "");
          }
        } else {
          setBranchCode("BR-NRB-01");
          setCompany("Crown Paints Kenya PLC");
          setDefaultWarehouse("Main Stores - CP");
          setContactPerson("Facility Lead");
        }
      } catch {
        setBranchCode("BR-NRB-01");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [branchName]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!branchCode.trim()) {
      setErrorMsg("Branch Code is required.");
      return;
    }

    setSaving(true);
    try {
      const payload: Record<string, any> = {
        branch_code: branchCode.trim(),
      };

      if (company) payload.company = company;
      if (defaultWarehouse) payload.default_warehouse = defaultWarehouse;
      if (contactPerson.trim()) payload.contact_person = contactPerson.trim();

      const res = await fetch(`/api/resource/Canteen%20Branches/${encodeURIComponent(branchName)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccessMsg("Canteen Branch updated successfully!");
        setTimeout(() => {
          router.push(`/branches/${encodeURIComponent(branchName)}`);
        }, 800);
      } else {
        const json = await res.json().catch(() => ({}));
        setErrorMsg(
          json.message ||
            json._server_messages ||
            `Failed to update branch (Status ${res.status}).`
        );
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to reach server.");
    } finally {
      setSaving(false);
    }
  };

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
        setErrorMsg(json.message || "Failed to delete branch.");
        setDeleting(false);
        setShowDeleteConfirm(false);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Network error while deleting.");
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
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
          <Link href={`/branches/${encodeURIComponent(branchName)}`} className="hover:text-emerald-700 font-medium">
            {branchName}
          </Link>
          <ChevronRight className="size-3 text-slate-400" />
          <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
            Edit
          </span>
        </nav>

        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowDeleteConfirm(true)}
          className="h-8 gap-1.5 text-xs font-bold border-rose-200 text-rose-700 hover:bg-rose-50 cursor-pointer"
        >
          <Trash2 className="size-3.5 text-rose-600" /> Delete Branch
        </Button>
      </div>

      {/* ── Delete Confirmation ───────────────────────────────────────────── */}
      {showDeleteConfirm && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <AlertCircle className="size-4 text-rose-600" />
            <h4 className="text-xs font-bold">Confirm Branch Deletion</h4>
          </div>
          <p className="text-xs text-rose-800">
            Permanently delete <strong className="font-black">{branchName}</strong> from Canteen Branches?
          </p>
          <div className="flex items-center gap-2 pt-1">
            <Button
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
              className="h-7 text-xs bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
            >
              {deleting ? "Deleting…" : "Yes, Delete Branch"}
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

      {/* ── Error & Success Banners ───────────────────────────────────────── */}
      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center gap-2.5 text-xs font-medium">
          <AlertCircle className="size-4 text-amber-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2.5 text-xs font-medium">
          <Check className="size-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* ── Edit Form Card ────────────────────────────────────────────────── */}
      <form onSubmit={handleSave} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid sm:grid-cols-2 gap-3.5">
          {/* Branch Name (Read-Only Document Key) */}
          <div className="space-y-1 sm:col-span-2">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Branch Name</span>
              <span className="text-[10px] text-slate-400 font-normal">Document Key (Read-Only)</span>
            </label>
            <div className="relative">
              <Store className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
              <Input
                type="text"
                value={branchName}
                disabled
                className="h-9 pl-9 text-xs font-semibold bg-slate-50 opacity-80 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Branch Code */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              Branch Code <span className="text-rose-500">*</span>
            </label>
            <Input
              type="text"
              value={branchCode}
              onChange={(e) => setBranchCode(e.target.value)}
              required
              className="h-9 text-xs font-mono font-bold uppercase"
            />
          </div>

          {/* Company */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              Operating Company
            </label>
            <Select value={company} onValueChange={setCompany}>
              <SelectTrigger className="w-full h-9 text-xs font-semibold">
                <SelectValue placeholder="Select Company" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {companiesList.map((c) => (
                  <SelectItem key={c.name} value={c.name} className="text-xs">
                    {c.company_name || c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Default Supply Warehouse */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              Default Supply Warehouse
            </label>
            <Select value={defaultWarehouse} onValueChange={setDefaultWarehouse}>
              <SelectTrigger className="w-full h-9 text-xs font-semibold">
                <SelectValue placeholder="Select Warehouse" />
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

          {/* Contact Person */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              Facility Contact Person / Lead
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
              <Input
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="h-9 pl-9 text-xs font-semibold"
              />
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <Link href={`/branches/${encodeURIComponent(branchName)}`}>
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
            disabled={saving}
            className="h-9 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md shadow-emerald-600/20 cursor-pointer"
          >
            <Save className="size-3.5 mr-1" />
            <span>{saving ? "Saving Changes…" : "Update Branch"}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
