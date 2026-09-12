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

export default function NewBranchPage() {
  const router = useRouter();

  // Form State
  const [branchCode, setBranchCode] = useState("");
  const [branchName, setBranchName] = useState("");
  const [company, setCompany] = useState("");
  const [defaultWarehouse, setDefaultWarehouse] = useState("");
  const [contactPerson, setContactPerson] = useState("");

  // Live Options
  const [companiesList, setCompaniesList] = useState<{ name: string; company_name?: string }[]>([]);
  const [warehousesList, setWarehousesList] = useState<{ name: string; warehouse_name?: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Load live Companies and Warehouses
  useEffect(() => {
    const loadOptions = async () => {
      try {
        // 1. Companies
        const cRes = await fetch(
          '/api/resource/Company?fields=["name","company_name"]&limit_page_length=50',
          { credentials: "include" }
        );
        if (cRes.ok) {
          const cJson = await cRes.json();
          if (cJson.data && Array.isArray(cJson.data) && cJson.data.length > 0) {
            setCompaniesList(cJson.data);
            setCompany(cJson.data[0].name);
          }
        }

        // 2. Warehouses
        const whRes = await fetch(
          '/api/resource/Warehouse?fields=["name","warehouse_name"]&limit_page_length=50',
          { credentials: "include" }
        );
        if (whRes.ok) {
          const whJson = await whRes.json();
          if (whJson.data && Array.isArray(whJson.data) && whJson.data.length > 0) {
            setWarehousesList(whJson.data);
            setDefaultWarehouse(whJson.data[0].name);
          }
        }
      } catch {
        setCompaniesList([{ name: "Crown Paints Kenya PLC" }]);
        setCompany("Crown Paints Kenya PLC");
        setWarehousesList([{ name: "Main Stores - CP", warehouse_name: "Main Kitchen Stores" }]);
        setDefaultWarehouse("Main Stores - CP");
      }
    };

    loadOptions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!branchCode.trim() || !branchName.trim()) {
      setErrorMsg("Branch Code and Branch Name are required.");
      return;
    }

    setSubmitting(true);
    try {
      const payload: Record<string, any> = {
        branch_code: branchCode.trim(),
        branch_name: branchName.trim(),
      };

      if (company) payload.company = company;
      if (defaultWarehouse) payload.default_warehouse = defaultWarehouse;
      if (contactPerson.trim()) payload.contact_person = contactPerson.trim();

      const res = await fetch("/api/resource/Canteen%20Branches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccessMsg("Canteen Branch created successfully!");
        setTimeout(() => {
          router.push("/branches");
        }, 800);
      } else {
        const json = await res.json().catch(() => ({}));
        setErrorMsg(
          json.message ||
            json._server_messages ||
            `Failed to create Canteen Branch (Status ${res.status}).`
        );
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to communicate with server.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* ── Breadcrumb Bar ────────────────────────────────────────────────── */}
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
            New Branch
          </span>
        </nav>

        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
          <Sparkles className="size-3 text-emerald-600" /> Canteen Branches Doctype
        </span>
      </div>

      {/* ── Error & Success Banners ───────────────────────────────────────── */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3 text-xs animate-in fade-in duration-150">
          <AlertCircle className="size-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold">Branch Creation Error</p>
            <p className="font-medium">{errorMsg}</p>
          </div>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3 text-xs font-bold animate-in fade-in duration-150">
          <Check className="size-4 text-emerald-600 shrink-0" />
          <span>{successMsg} Redirecting to directory…</span>
        </div>
      )}

      {/* ── Form Card ────────────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid sm:grid-cols-2 gap-3.5">
          {/* Branch Name */}
          <div className="space-y-1 sm:col-span-2">
            <label className="text-xs font-bold text-slate-700">
              Branch Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Store className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
              <Input
                type="text"
                placeholder="e.g. Nairobi HQ Main Canteen"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                required
                className="h-9 pl-9 text-xs font-semibold"
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
              placeholder="e.g. BR-NRB-01"
              value={branchCode}
              onChange={(e) => setBranchCode(e.target.value)}
              required
              className="h-9 text-xs font-mono font-bold uppercase"
            />
          </div>

          {/* Company Entity */}
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

          {/* Facility Contact Person */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              Facility Contact Person / Lead
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
              <Input
                type="text"
                placeholder="e.g. Admin / Supervisor"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="h-9 pl-9 text-xs font-semibold"
              />
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <Link href="/branches">
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
            disabled={submitting}
            className="h-9 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md shadow-emerald-600/20 cursor-pointer"
          >
            <Save className="size-3.5 mr-1" />
            <span>{submitting ? "Saving to ERP…" : "Create Canteen Branch"}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
