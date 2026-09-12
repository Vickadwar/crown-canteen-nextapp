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
  UserPlus,
  ShieldCheck,
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

export default function NewCanteenCustomerPage() {
  const router = useRouter();

  // Form State
  const [customerName, setCustomerName] = useState("");
  const [customerType, setCustomerType] = useState<string>("Employee");
  const [employer, setEmployer] = useState<string>("");
  const [employeePayrollId, setEmployeePayrollId] = useState("");
  const [idCardNumber, setIdCardNumber] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [customerStatus, setCustomerStatus] = useState<string>("Active");
  const [department, setDepartment] = useState<string>("");

  // Live Dropdowns from Backend
  const [employersList, setEmployersList] = useState<{ name: string; customer_name?: string }[]>([]);
  const [departmentsList, setDepartmentsList] = useState<{ name: string; department_name?: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Fetch live Employers (Customer Doctype) & Departments (Employer Department Doctype)
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        // 1. Fetch live Employers
        const custParams = new URLSearchParams({
          fields: JSON.stringify(["name", "customer_name"]),
          limit_page_length: "50",
        });
        const custRes = await fetch(`/api/resource/Customer?${custParams.toString()}`, {
          credentials: "include",
        });
        if (custRes.ok) {
          const json = await custRes.json();
          if (json.data && Array.isArray(json.data) && json.data.length > 0) {
            setEmployersList(json.data);
            setEmployer(json.data[0].name);
          }
        }

        // 2. Fetch live Departments
        const deptParams = new URLSearchParams({
          fields: JSON.stringify(["name", "department_name"]),
          limit_page_length: "50",
        });
        const deptRes = await fetch(`/api/resource/Employer%20Department?${deptParams.toString()}`, {
          credentials: "include",
        });
        if (deptRes.ok) {
          const deptJson = await deptRes.json();
          if (deptJson.data && Array.isArray(deptJson.data) && deptJson.data.length > 0) {
            setDepartmentsList(deptJson.data);
            setDepartment(deptJson.data[0].name);
          }
        }
      } catch {
        // Fallbacks if server is initializing
      }
    };

    fetchOptions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!customerName.trim() || !employeePayrollId.trim()) {
      setErrorMsg("Full Name and Employee Payroll ID are required.");
      return;
    }

    setSubmitting(true);
    try {
      // Clean payload: omit empty optional fields so Frappe Link / Unique validation doesn't choke on ""
      const payload: Record<string, any> = {
        customer_name: customerName.trim(),
        customer_type: customerType,
        employee_payroll_id: employeePayrollId.trim(),
        customer_status: customerStatus,
      };

      if (employer) payload.employer = employer;
      if (department) payload.department = department;
      if (idCardNumber.trim()) payload.id_card_number = idCardNumber.trim();
      if (email.trim()) payload.email = email.trim();
      if (mobileNumber.trim()) payload.mobile_number = mobileNumber.trim();

      const res = await fetch("/api/resource/Canteen%20Customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccessMsg("Canteen Customer created successfully! Redirecting to Face Enrollment…");
        setTimeout(() => {
          router.push(`/employees/${encodeURIComponent(employeePayrollId.trim())}`);
        }, 700);
      } else {
        const json = await res.json().catch(() => ({}));
        let extractedMsg = "Failed to create Canteen Customer.";

        if (json.message) {
          extractedMsg = json.message;
        } else if (json.exception) {
          extractedMsg = json.exception;
        } else if (json._server_messages) {
          try {
            const parsed = JSON.parse(json._server_messages);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const inner = JSON.parse(parsed[0]);
              extractedMsg = inner.message || extractedMsg;
            }
          } catch {
            extractedMsg = json._server_messages;
          }
        }

        setErrorMsg(extractedMsg);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to communicate with Frappe backend.");
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
          <span className="text-slate-500 font-medium">Entities</span>
          <ChevronRight className="size-3 text-slate-400" />
          <Link href="/employees" className="hover:text-emerald-700 font-medium">
            Canteen Customers
          </Link>
          <ChevronRight className="size-3 text-slate-400" />
          <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
            New Customer
          </span>
        </nav>

        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
          <Sparkles className="size-3 text-emerald-600" /> Live Doctype
        </span>
      </div>

      {/* ── Error & Success Banners (Persists on error without fast redirect) ── */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3 text-xs animate-in fade-in duration-150">
          <AlertCircle className="size-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold">Creation Error</p>
            <p className="font-medium leading-relaxed">{errorMsg}</p>
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
          {/* Full Name */}
          <div className="space-y-1 sm:col-span-2">
            <label className="text-xs font-bold text-slate-700">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
              <Input
                type="text"
                placeholder="e.g. Samuel Mwangi"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                className="h-9 pl-9 text-xs font-semibold"
              />
            </div>
          </div>

          {/* Employee Payroll ID */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              Employee Payroll ID <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
              <Input
                type="text"
                placeholder="e.g. CP-8842"
                value={employeePayrollId}
                onChange={(e) => setEmployeePayrollId(e.target.value)}
                required
                className="h-9 pl-9 text-xs font-mono font-bold uppercase"
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
                {employersList.length > 0 ? (
                  employersList.map((emp) => (
                    <SelectItem key={emp.name} value={emp.name} className="text-xs">
                      {emp.customer_name || emp.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="Crown Paints Kenya PLC" className="text-xs">
                    Crown Paints Kenya PLC
                  </SelectItem>
                )}
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
                {departmentsList.length > 0 ? (
                  departmentsList.map((dept) => (
                    <SelectItem key={dept.name} value={dept.name} className="text-xs">
                      {dept.department_name || dept.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="Production & Plant Operations" className="text-xs">
                    Production & Plant Operations
                  </SelectItem>
                )}
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
              placeholder="e.g. 29481029"
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

          {/* Email Address */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              Corporate Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
              <Input
                type="email"
                placeholder="e.g. s.mwangi@crownpaints.co.ke"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-9 pl-9 text-xs"
              />
            </div>
          </div>

          {/* Mobile Number */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              Mobile Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
              <Input
                type="tel"
                placeholder="+254 7XX XXX XXX"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="h-9 pl-9 text-xs"
              />
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <Link href="/employees">
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
            <span>{submitting ? "Saving to ERP…" : "Create Canteen Customer"}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
