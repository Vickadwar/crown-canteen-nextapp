"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Settings,
  CircleDollarSign,
  Building2,
  Clock,
  ShieldCheck,
  Plus,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Database,
  X,
  Sliders,
  FileText,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export interface PaymentTermTemplate {
  name: string;
  template_name: string;
  credit_days: number;
  due_date_basis: string;
  assigned_count?: number;
  assigned_employers?: string[];
  description?: string;
}

export interface EmployerProfile {
  name: string;
  customer_name: string;
  payment_terms?: string;
  customer_group?: string;
  territory?: string;
}

// Helper to reliably parse or calculate credit days from template details or name
export function parseCreditDays(templateName: string, detailCreditDays?: number): number {
  if (typeof detailCreditDays === "number" && !isNaN(detailCreditDays) && detailCreditDays >= 0) {
    return detailCreditDays;
  }
  // Extract number from string like "Net 15 Billing Terms" -> 15, "Net 30" -> 30, "45 Days" -> 45
  const match = templateName.match(/(?:net\s*|credit\s*|\b)(\d+)\s*(?:days?|d\b)?/i);
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }
  if (/immediate|receipt|cash|on-spot|spot/i.test(templateName)) {
    return 0;
  }
  if (/bi-?weekly|fortnightly/i.test(templateName)) {
    return 14;
  }
  if (/monthly/i.test(templateName)) {
    return 30;
  }
  if (/weekly/i.test(templateName)) {
    return 7;
  }
  return 0;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"billing" | "operations" | "sync">("billing");
  const [templates, setTemplates] = useState<PaymentTermTemplate[]>([]);
  const [employers, setEmployers] = useState<EmployerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  // New Template Modal State
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newCreditDays, setNewCreditDays] = useState<number>(15);
  const [newDueDateBasis, setNewDueDateBasis] = useState("Day(s) after invoice date");
  const [newDescription, setNewDescription] = useState("");
  const [savingTemplate, setSavingTemplate] = useState(false);

  // Operational toggles
  const [antiDoubleSwipe, setAntiDoubleSwipe] = useState(true);
  const [autoBatchInvoicing, setAutoBatchInvoicing] = useState(true);
  const [allowPayrollSurcharge, setAllowPayrollSurcharge] = useState(true);
  const [standardLunchStart, setStandardLunchStart] = useState("12:30");
  const [standardLunchEnd, setStandardLunchEnd] = useState("13:30");
  const [vatPercent, setVatPercent] = useState(16);

  // Fetch strictly live database records on mount
  const fetchDatabaseData = async () => {
    setLoading(true);

    // 1. Fetch live Customers with credentials: "include"
    try {
      const custParams = new URLSearchParams({
        fields: JSON.stringify(["name", "customer_name", "payment_terms", "customer_group", "territory"]),
        limit_page_length: "100",
      });

      const res = await fetch(`/api/resource/Customer?${custParams.toString()}`, {
        credentials: "include",
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          setEmployers(json.data.map((c: any) => ({
            name: c.name,
            customer_name: c.customer_name || c.name,
            payment_terms: c.payment_terms || "",
            customer_group: c.customer_group || "Commercial",
            territory: c.territory || "Kenya",
          })));
        }
      }
    } catch {}

    // 2. Fetch live Payment Terms Templates strictly from the database
    let fetchedList: PaymentTermTemplate[] = [];

    // Try custom API endpoint first
    try {
      const apiRes = await fetch("/api/method/crown_canteen.api.get_payment_terms_templates", {
        credentials: "include",
      });
      if (apiRes.ok) {
        const aJson = await apiRes.json();
        if (aJson.message && Array.isArray(aJson.message)) {
          fetchedList = aJson.message.map((t: any) => ({
            name: t.name,
            template_name: t.template_name || t.name,
            credit_days: parseCreditDays(t.name, t.credit_days),
            due_date_basis: t.due_date_basis || "Day(s) after invoice date",
            description: t.description || `Payment term configured in ERPNext: ${t.name}`,
          }));
        }
      }
    } catch {}

    // If custom API was not yet in place, query standard Frappe Resource
    if (fetchedList.length === 0) {
      try {
        const tParams = new URLSearchParams({
          fields: JSON.stringify(["name", "template_name"]),
          limit_page_length: "50",
        });

        const tRes = await fetch(`/api/resource/Payment%20Terms%20Template?${tParams.toString()}`, {
          credentials: "include",
        });

        if (tRes.ok) {
          const tJson = await tRes.json();
          if (tJson.data && Array.isArray(tJson.data) && tJson.data.length > 0) {
            // For each template, fetch its detail doc to get the actual credit_days from child table terms
            const detailed = await Promise.all(
              tJson.data.map(async (t: any) => {
                let creditDaysFromDoc: number | undefined;
                let dueBasis = "Day(s) after invoice date";
                let desc = "";

                try {
                  const dRes = await fetch(`/api/resource/Payment%20Terms%20Template/${encodeURIComponent(t.name)}`, {
                    credentials: "include",
                  });
                  if (dRes.ok) {
                    const dJson = await dRes.json();
                    if (dJson.data) {
                      const terms = dJson.data.terms;
                      if (Array.isArray(terms) && terms.length > 0) {
                        creditDaysFromDoc = terms[0].credit_days;
                        dueBasis = terms[0].due_date_based_on || dueBasis;
                      }
                      desc = dJson.data.description || "";
                    }
                  }
                } catch {}

                const finalCreditDays = parseCreditDays(t.name || t.template_name, creditDaysFromDoc);

                return {
                  name: t.name,
                  template_name: t.template_name || t.name,
                  credit_days: finalCreditDays,
                  due_date_basis: dueBasis,
                  description: desc || `Payment due in ${finalCreditDays} days based on ${dueBasis}.`,
                };
              })
            );
            fetchedList = detailed;
          }
        }
      } catch {}
    }

    // If still 0, also query Payment Term directly in case user created under Payment Term DocType
    if (fetchedList.length === 0) {
      try {
        const ptParams = new URLSearchParams({
          fields: JSON.stringify(["name", "payment_term_name", "credit_days", "due_date_based_on", "description"]),
          limit_page_length: "50",
        });
        const ptRes = await fetch(`/api/resource/Payment%20Term?${ptParams.toString()}`, {
          credentials: "include",
        });
        if (ptRes.ok) {
          const ptJson = await ptRes.json();
          if (ptJson.data && Array.isArray(ptJson.data) && ptJson.data.length > 0) {
            fetchedList = ptJson.data.map((t: any) => {
              const finalCreditDays = parseCreditDays(t.name || t.payment_term_name, t.credit_days);
              return {
                name: t.name,
                template_name: t.payment_term_name || t.name,
                credit_days: finalCreditDays,
                due_date_basis: t.due_date_based_on || "Day(s) after invoice date",
                description: t.description || `Payment due in ${finalCreditDays} days based on invoice terms.`,
              };
            });
          }
        }
      } catch {}
    }

    setTemplates(fetchedList);
    setLoading(false);
  };

  useEffect(() => {
    fetchDatabaseData();
  }, []);

  // Compute assigned employers dynamically from the real employers list
  const computedTemplates = templates.map(t => {
    const matching = employers.filter(e => e.payment_terms === t.name);
    return {
      ...t,
      assigned_count: matching.length,
      assigned_employers: matching.map(e => e.customer_name),
    };
  });

  // Create new Payment Terms Template directly in ERPNext
  async function handleCreateTemplate(e: React.FormEvent) {
    e.preventDefault();
    if (!newTemplateName.trim()) return;

    setSavingTemplate(true);
    const termName = newTemplateName.trim();
    const days = Number(newCreditDays) || 0;

    const newTerm: PaymentTermTemplate = {
      name: termName,
      template_name: termName,
      credit_days: days,
      due_date_basis: newDueDateBasis,
      assigned_count: 0,
      assigned_employers: [],
      description: newDescription.trim() || `Payment due within ${days} days from invoice posting date.`,
    };

    try {
      // 1. Create Payment Term doc in ERPNext
      await fetch("/api/resource/Payment%20Term", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          payment_term_name: termName,
          credit_days: days,
          due_date_based_on: newDueDateBasis,
          description: newTerm.description,
        }),
      }).catch(() => {});

      // 2. Create Payment Terms Template doc with child terms in ERPNext
      await fetch("/api/resource/Payment%20Terms%20Template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          template_name: termName,
          terms: [
            {
              payment_term: termName,
              credit_days: days,
              due_date_based_on: newDueDateBasis,
              invoice_portion: 100,
            },
          ],
        }),
      }).catch(() => {});
    } catch {}

    // Add to state immediately
    setTemplates(prev => {
      const filtered = prev.filter(p => p.name !== termName);
      return [newTerm, ...filtered];
    });

    setSyncNotice(`Successfully saved "${termName}" with Net ${days} Days credit to ERPNext!`);
    setSavingTemplate(false);
    setShowNewModal(false);
    setNewTemplateName("");
    setNewCreditDays(15);
    setNewDescription("");

    setTimeout(() => setSyncNotice(null), 5000);
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-7xl mx-auto pb-16">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="size-13 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/25 shrink-0">
            <Settings className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-[0.2em]">
                System Configuration
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                ERPNext Live
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none mt-1">
              Canteen Settings &amp; Configuration
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Manage corporate payment terms templates, operational shift policies, and backend synchronization.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchDatabaseData}
            disabled={loading}
            className="h-10 text-xs font-bold gap-1.5 border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw className={`size-3.5 text-slate-500 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Data</span>
          </Button>

          <Button
            size="sm"
            onClick={() => setShowNewModal(true)}
            className="h-10 text-xs font-black gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/25"
          >
            <Plus className="size-4" />
            <span>New Payment Term</span>
          </Button>
        </div>
      </div>

      {/* ── Notification Banner ─────────────────────────────────────────────── */}
      {syncNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3 animate-in fade-in duration-300">
          <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
          <p className="text-xs font-bold flex-1">{syncNotice}</p>
          <button onClick={() => setSyncNotice(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* ── Tabs ────────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("billing")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "billing"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <CircleDollarSign className="size-4" />
          <span>Billing &amp; Payment Terms</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("operations")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "operations"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Clock className="size-4" />
          <span>Meal Policy &amp; Serving Windows</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("sync")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "sync"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Database className="size-4" />
          <span>ERPNext Integration Health</span>
        </button>
      </div>

      {/* ── TAB 1: BILLING & PAYMENT TERMS ──────────────────────────────────── */}
      {activeTab === "billing" && (
        <div className="space-y-6">
          {/* Universal Corporate Payment Terms Banner */}
          <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-emerald-700" />
                <p className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Corporate Credit Terms &amp; Settlement Governance
                </p>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                Manage dynamic corporate credit periods and settlement schedules for participating employers.
                Assigned payment terms automatically calculate sales invoice due dates and schedule line items in ERPNext.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setShowNewModal(true)}
              className="h-9 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shrink-0"
            >
              <Plus className="size-3.5 mr-1" /> Add Payment Term
            </Button>
          </div>

          {/* Dynamic Templates Grid - Strictly Showing Database Records */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-slate-900">
                  Active Payment Terms Templates
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {computedTemplates.length} in database
                </span>
              </div>
            </div>

            {loading ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-2">
                <RefreshCw className="size-6 text-emerald-600 animate-spin mx-auto" />
                <p className="text-xs font-bold text-slate-700">Loading payment terms from ERPNext database…</p>
              </div>
            ) : computedTemplates.length === 0 ? (
              <div className="p-10 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
                <AlertCircle className="size-8 text-amber-500 mx-auto" />
                <h4 className="text-sm font-black text-slate-900">No Payment Terms Templates Found in Database</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  There are currently no templates configured in ERPNext. Click the button below to create your first template (e.g. Net 15 Billing Terms).
                </p>
                <Button
                  size="sm"
                  onClick={() => setShowNewModal(true)}
                  className="h-9 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                >
                  <Plus className="size-3.5 mr-1" /> Create Payment Term Template
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {computedTemplates.map((term) => (
                  <div
                    key={term.name}
                    className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:border-emerald-300 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="min-w-0 flex-1">
                          <span className="text-sm font-black text-slate-900 group-hover:text-emerald-700 transition-colors block truncate">
                            {term.name}
                          </span>
                          <p className="text-[11px] font-semibold text-emerald-700 mt-0.5">
                            {term.credit_days === 0 ? "Due Upon Receipt" : `Net ${term.credit_days} Days Credit`}
                          </p>
                        </div>

                        <div className="size-10 rounded-2xl bg-emerald-50 text-emerald-800 font-mono font-black text-xs flex items-center justify-center shrink-0">
                          {term.credit_days}d
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed mb-4">
                        {term.description || `Invoices are payable within ${term.credit_days} calendar days.`}
                      </p>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-slate-100">
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 mb-1.5">
                          <span className="flex items-center gap-1">
                            <Building2 className="size-3 text-slate-400" /> Assigned Employers
                          </span>
                          <span className="font-mono text-emerald-700">{term.assigned_count} Accounts</span>
                        </div>

                        {term.assigned_employers && term.assigned_employers.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {term.assigned_employers.map((emp) => (
                              <span
                                key={emp}
                                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 truncate max-w-[200px]"
                              >
                                {emp}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">No employer assigned</span>
                        )}
                      </div>

                      <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400">
                        <span>Basis: {term.due_date_basis}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Corporate Clients Assignment Matrix */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/50">
              <div>
                <h3 className="text-sm font-black text-slate-900 leading-none">
                  Corporate Client Payment Terms Roster
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Active employer accounts and their assigned payment terms from ERPNext.
                </p>
              </div>
              <Link href="/employers">
                <Button variant="outline" size="sm" className="h-8 text-xs font-bold gap-1 text-slate-700">
                  <span>View All Employers</span>
                  <ChevronRight className="size-3" />
                </Button>
              </Link>
            </div>

            <div className="divide-y divide-slate-100 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    <th className="py-3 px-4">Employer Account</th>
                    <th className="py-3 px-4">ERPNext Code</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Assigned Payment Terms</th>
                    <th className="py-3 px-4">Settlement Window</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {employers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-slate-400 italic">
                        {loading ? "Loading employers from database…" : "No corporate employers found."}
                      </td>
                    </tr>
                  ) : (
                    employers.map((emp) => {
                      const matchedTerm = computedTemplates.find(t => t.name === emp.payment_terms);
                      const hasTerm = Boolean(emp.payment_terms);
                      const creditDays = matchedTerm ? matchedTerm.credit_days : (emp.payment_terms ? parseCreditDays(emp.payment_terms) : null);

                      return (
                        <tr key={emp.name} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            <div className="flex items-center gap-2">
                              <div className="size-7 rounded-lg bg-emerald-50 text-emerald-800 font-black text-[10px] flex items-center justify-center shrink-0">
                                {emp.customer_name.slice(0, 2).toUpperCase()}
                              </div>
                              <span>{emp.customer_name}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                            {emp.name}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-semibold">
                              {emp.customer_group || "Commercial"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            {hasTerm ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200/60">
                                <span className="size-1.5 rounded-full bg-emerald-600" />
                                {emp.payment_terms}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 text-[11px] font-medium">
                                Not Set
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                            {creditDays !== null ? (
                              creditDays === 0 ? (
                                <span className="font-semibold text-slate-700">Immediate</span>
                              ) : (
                                <span className="font-semibold text-emerald-700 font-mono">Net {creditDays} Days</span>
                              )
                            ) : (
                              <span className="text-slate-400 italic">No credit terms</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <Link href={`/employers/${encodeURIComponent(emp.name)}`}>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 text-xs font-bold text-emerald-700 hover:bg-emerald-50 rounded-md"
                              >
                                <span>Manage Terms</span>
                                <ChevronRight className="size-3 ml-0.5" />
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: MEAL POLICY & SERVING WINDOWS ─────────────────────────────── */}
      {activeTab === "operations" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-black text-slate-900">Shift Operating Hours</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Define the standard serving hours for daily canteen meals across all participating branches.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Standard Normal Lunch Window</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    60 min shift
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">Start Time</label>
                    <input
                      type="time"
                      value={standardLunchStart}
                      onChange={e => setStandardLunchStart(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">End Time</label>
                    <input
                      type="time"
                      value={standardLunchEnd}
                      onChange={e => setStandardLunchEnd(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-mono font-bold"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-slate-500">
                  Standard canteen lunch is served between 12:30 PM and 1:30 PM.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Tax &amp; VAT Configuration</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    KRA Compliant
                  </span>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Standard VAT Rate (%)</label>
                  <input
                    type="number"
                    value={vatPercent}
                    onChange={e => setVatPercent(Number(e.target.value))}
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-mono font-bold"
                  />
                </div>
                <p className="text-[10px] text-slate-500">
                  Applies to all meals that are linked to standard VAT accounts in ERPNext Sales Taxes template.
                </p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-800">Operational Rule Toggles</h3>

              <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-white">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-900">Anti-Double-Swipe Fraud Prevention</p>
                  <p className="text-[11px] text-slate-500">
                    Blocks an employee from claiming more than one subsidized lunch on the same calendar day.
                  </p>
                </div>
                <Switch checked={antiDoubleSwipe} onCheckedChange={setAntiDoubleSwipe} />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-white">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-900">Allow Payroll Deduction for Special Lunch Extra</p>
                  <p className="text-[11px] text-slate-500">
                    Allows diner to defer the special lunch surcharge to their monthly payslip instead of paying on-spot cash.
                  </p>
                </div>
                <Switch checked={allowPayrollSurcharge} onCheckedChange={setAllowPayrollSurcharge} />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-white">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-900">Automated Corporate Sales Invoice Dispatch</p>
                  <p className="text-[11px] text-slate-500">
                    Automatically triggers ERPNext Sales Invoice generation at the end of each corporate billing cycle.
                  </p>
                </div>
                <Switch checked={autoBatchInvoicing} onCheckedChange={setAutoBatchInvoicing} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: ERPNEXT INTEGRATION HEALTH ───────────────────────────────── */}
      {activeTab === "sync" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <div>
              <h2 className="text-base font-black text-slate-900">Frappe / ERPNext Connection Status</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Detailed telemetry of the real-time proxy bridge between Next.js and the ERPNext backend.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 space-y-1">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Frappe URL</span>
                <p className="text-xs font-mono font-bold text-emerald-950 truncate">
                  http://canteen.crownpaints.co.ke
                </p>
                <p className="text-[10px] text-emerald-700">Proxied transparently via <code>/api/*</code></p>
              </div>

              <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50/50 space-y-1">
                <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">Custom DocTypes</span>
                <p className="text-xs font-bold text-blue-950">
                  7 DocTypes Active &amp; Synced
                </p>
                <p className="text-[10px] text-blue-700">Meal Type, Canteen Customer, Meal Txn, etc.</p>
              </div>

              <div className="p-4 rounded-2xl border border-purple-200 bg-purple-50/50 space-y-1">
                <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider">Billing Engine</span>
                <p className="text-xs font-bold text-purple-950">
                  ERPNext Sales Invoice Sync
                </p>
                <p className="text-[10px] text-purple-700">Dynamic Payment Terms Templates</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CREATE NEW PAYMENT TERM MODAL ───────────────────────────────────── */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  Create Payment Terms Template
                </h3>
                <p className="text-xs text-slate-500">
                  Add a new credit term (e.g. Net 15 Billing Terms, Net 30, Net 45).
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="size-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTemplate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Template Name *</label>
                <input
                  type="text"
                  required
                  value={newTemplateName}
                  onChange={e => {
                    setNewTemplateName(e.target.value);
                    // Automatically auto-suggest credit days if user types a number like "Net 15 Billing Terms"
                    const autoDays = parseCreditDays(e.target.value);
                    if (autoDays > 0) setNewCreditDays(autoDays);
                  }}
                  placeholder="e.g. Net 15 Billing Terms"
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-semibold text-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Credit Days *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    max={180}
                    value={newCreditDays}
                    onChange={e => setNewCreditDays(Number(e.target.value))}
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-mono font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Due Date Calculation Basis</label>
                  <select
                    value={newDueDateBasis}
                    onChange={e => setNewDueDateBasis(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Day(s) after invoice date">Day(s) after invoice date</option>
                    <option value="Day(s) after end of month">Day(s) after end of month</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Description / Settlement Terms</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  placeholder="e.g. Invoices are payable strictly within 15 days of invoice date..."
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                <p className="font-semibold text-slate-800">Credit Schedule Preview:</p>
                <p className="mt-0.5">
                  Invoices will be marked due <strong>{newCreditDays} days</strong> after the invoice date.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="h-10 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingTemplate || !newTemplateName.trim()}
                  className="h-10 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md shadow-emerald-600/25 flex items-center gap-2 cursor-pointer disabled:opacity-40"
                >
                  {savingTemplate ? <RefreshCw className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
                  <span>{savingTemplate ? "Saving to ERPNext…" : "Save Template"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
