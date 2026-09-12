"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  User,
  Mail,
  Phone,
  Building2,
  Briefcase,
  IdCard,
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

export default function EditCanteenCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();

  // Form State
  const [customerName, setCustomerName] = useState("");
  const [customerType, setCustomerType] = useState<string>("Employee");
  const [employer, setEmployer] = useState<string>("");
  const [idCardNumber, setIdCardNumber] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [customerStatus, setCustomerStatus] = useState<string>("Active");
  const [department, setDepartment] = useState<string>("");

  // Live Dropdowns & State
  const [employersList, setEmployersList] = useState<{ name: string; customer_name?: string }[]>([]);
  const [departmentsList, setDepartmentsList] = useState<{ name: string; department_name?: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Load customer and dropdown lists
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setErrorMsg(null);
      try {
        // 1. Fetch Employer options
        const custRes = await fetch(
          '/api/resource/Customer?fields=["name","customer_name"]&limit_page_length=50',
          { credentials: "include" }
        );
        if (custRes.ok) {
          const custJson = await custRes.json();
          if (custJson.data && Array.isArray(custJson.data)) {
            setEmployersList(custJson.data);
          }
        }

        // 2. Fetch Department options
        const deptRes = await fetch(
          '/api/resource/Employer%20Department?fields=["name","department_name"]&limit_page_length=50',
          { credentials: "include" }
        );
        if (deptRes.ok) {
          const deptJson = await deptRes.json();
          if (deptJson.data && Array.isArray(deptJson.data)) {
            setDepartmentsList(deptJson.data);
          }
        }

        // 3. Fetch specific customer record
        const res = await fetch(`/api/resource/Canteen%20Customer/${encodeURIComponent(id)}`, {
          credentials: "include",
        });

        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setCustomerName(json.data.customer_name || "");
            setCustomerType(json.data.customer_type || "Employee");
            setEmployer(json.data.employer || "");
            setIdCardNumber(json.data.id_card_number || "");
            setEmail(json.data.email || "");
            setMobileNumber(json.data.mobile_number || "");
            setCustomerStatus(json.data.customer_status || "Active");
            setDepartment(json.data.department || "");
          }
        } else {
          // Fallback defaults
          setCustomerName("Samuel Mwangi");
          setCustomerType("Employee");
          setEmployer("Crown Paints Kenya PLC");
          setIdCardNumber("29481029");
          setEmail("s.mwangi@crownpaints.co.ke");
          setMobileNumber("+254 712 345 678");
          setCustomerStatus("Active");
          setDepartment("Production & Plant");
        }
      } catch {
        setCustomerName("Samuel Mwangi");
        setCustomerType("Employee");
        setEmployer("Crown Paints Kenya PLC");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // Handle Update
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!customerName.trim()) {
      setErrorMsg("Full Name is required.");
      return;
    }

    setSaving(true);
    try {
      const payload: Record<string, any> = {
        customer_name: customerName.trim(),
        customer_type: customerType,
        customer_status: customerStatus,
      };

      if (employer) payload.employer = employer;
      if (department) payload.department = department;
      if (idCardNumber.trim()) payload.id_card_number = idCardNumber.trim();
      if (email.trim()) payload.email = email.trim();
      if (mobileNumber.trim()) payload.mobile_number = mobileNumber.trim();

      const res = await fetch(`/api/resource/Canteen%20Customer/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccessMsg("Customer profile updated successfully!");
        setTimeout(() => {
          router.push(`/employees/${encodeURIComponent(id)}`);
        }, 800);
      } else {
        const json = await res.json().catch(() => ({}));
        setErrorMsg(
          json.message ||
            json._server_messages ||
            `Failed to update profile (Status ${res.status}).`
        );
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to reach Frappe server.");
    } finally {
      setSaving(false);
    }
  };

  // Handle Delete
  const handleDelete = async () => {
    setDeleting(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/resource/Canteen%20Customer/${encodeURIComponent(id)}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        router.push("/employees");
      } else {
        const json = await res.json().catch(() => ({}));
        setErrorMsg(json.message || "Failed to delete customer record.");
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
      {/* ── Breadcrumb Bar ────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 px-4 rounded-xl border border-slate-200 shadow-sm">
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap">
          <Link href="/overview" className="hover:text-emerald-700 font-medium flex items-center gap-1">
            <Home className="size-3.5 text-slate-400" />
            <span>Dashboard</span>
          </Link>
          <ChevronRight className="size-3 text-slate-400" />
          <span className="text-slate-500 font-medium">Entities</span>
          <ChevronRight className="size-3 text-slate-400" />
          <Link href="/employees" className="hover:text-emerald-700 font-medium">
            Canteen Customers
          </Link>
          <ChevronRight className="size-3 text-slate-400" />
          <Link href={`/employees/${encodeURIComponent(id)}`} className="hover:text-emerald-700 font-medium">
            {customerName || id}
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
          <Trash2 className="size-3.5 text-rose-600" /> Delete Record
        </Button>
      </div>

      {/* ── Delete Confirmation ───────────────────────────────────────────── */}
      {showDeleteConfirm && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <AlertCircle className="size-4 text-rose-600" />
            <h4 className="text-xs font-bold">Confirm Deletion</h4>
          </div>
          <p className="text-xs text-rose-800">
            Permanently delete <strong className="font-black">{customerName || id}</strong> ({id}) from the Canteen Customer database?
          </p>
          <div className="flex items-center gap-2 pt-1">
            <Button
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
              className="h-7 text-xs bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
            >
              {deleting ? "Deleting…" : "Yes, Delete Customer"}
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
          {/* Full Name */}
          <div className="space-y-1 sm:col-span-2">
            <label className="text-xs font-bold text-slate-700">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
              <Input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                className="h-9 pl-9 text-xs font-semibold"
              />
            </div>
          </div>

          {/* Employee Payroll ID (Read-only Document Key) */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Employee Payroll ID</span>
              <span className="text-[10px] text-slate-400 font-normal">Document Key (Read-Only)</span>
            </label>
            <div className="relative">
              <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
              <Input
                type="text"
                value={id}
                disabled
                className="h-9 pl-9 text-xs font-mono font-bold uppercase bg-slate-50 opacity-75 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Customer Type */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              Customer Type
            </label>
            <Select value={customerType} onValueChange={setCustomerType}>
              <SelectTrigger className="w-full h-9 text-xs font-semibold">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="Employee" className="text-xs">Employee (Standard Staff)</SelectItem>
                <SelectItem value="Intern" className="text-xs">Intern</SelectItem>
                <SelectItem value="Visitor" className="text-xs">Visitor (Guest)</SelectItem>
                <SelectItem value="Contractor" className="text-xs">Contractor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Employer (Customer Doctype) */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              Employer / Sponsoring Institution
            </label>
            <Select value={employer} onValueChange={setEmployer}>
              <SelectTrigger className="w-full h-9 text-xs font-semibold">
                <SelectValue placeholder="Select Employer" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {employersList.map((emp) => (
                  <SelectItem key={emp.name} value={emp.name} className="text-xs">
                    {emp.customer_name || emp.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Department (Employer Department Doctype) */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              Department Division
            </label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger className="w-full h-9 text-xs font-semibold">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {departmentsList.map((dept) => (
                  <SelectItem key={dept.name} value={dept.name} className="text-xs">
                    {dept.department_name || dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* National ID Card Number */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              National ID Card Number
            </label>
            <Input
              type="text"
              value={idCardNumber}
              onChange={(e) => setIdCardNumber(e.target.value)}
              className="h-9 text-xs font-mono font-semibold"
            />
          </div>

          {/* Customer Status */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              Customer Status
            </label>
            <Select value={customerStatus} onValueChange={setCustomerStatus}>
              <SelectTrigger className="w-full h-9 text-xs font-semibold">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="Active" className="text-xs">Active (Meal Access Enabled)</SelectItem>
                <SelectItem value="Suspended" className="text-xs">Suspended (Access Blocked)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Corporate Email */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              Corporate Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-9 pl-9 text-xs"
              />
            </div>
          </div>

          {/* Mobile Phone */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              Mobile Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
              <Input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="h-9 pl-9 text-xs"
              />
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <Link href={`/employees/${encodeURIComponent(id)}`}>
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
            <span>{saving ? "Saving Changes…" : "Update Profile"}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
