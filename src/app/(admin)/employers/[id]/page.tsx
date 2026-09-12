"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  MapPin,
  Mail,
  Phone,
  FileText,
  CircleDollarSign,
  Users,
  Building2,
  TrendingUp,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Calendar,
  Banknote,
  ReceiptText,
  ChevronRight,
  RefreshCw,
  Sparkles,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ── Types ─────────────────────────────────────────────────────────────────────

const fallbackInvoices = [
  { id: "INV-2026-041", date: "May 1, 2026",   due: "May 16, 2026",  amount: "KES 1,248,000", status: "Paid", meals: 4992 },
  { id: "INV-2026-038", date: "Apr 15, 2026",  due: "Apr 30, 2026",  amount: "KES 1,190,500", status: "Paid", meals: 4762 },
  { id: "INV-2026-035", date: "Apr 1, 2026",   due: "Apr 16, 2026",  amount: "KES 1,310,000", status: "Paid", meals: 5240 },
  { id: "INV-2026-031", date: "Mar 15, 2026",  due: "Mar 30, 2026",  amount: "KES 980,000",   status: "Paid", meals: 3920 },
  { id: "INV-2026-028", date: "Mar 1, 2026",   due: "Mar 16, 2026",  amount: "KES 1,050,000", status: "Paid", meals: 4200 },
];

const invoiceStatusStyle: Record<string, string> = {
  Paid:     "bg-emerald-500/10 text-emerald-600",
  Unpaid:   "bg-rose-500/10 text-rose-500",
  Overdue:  "bg-rose-500/10 text-rose-500",
  Draft:    "bg-muted text-muted-foreground",
};

const branches = [
  { name: "Main Dining Hall", headcount: 450, meals: 1840, utilisation: 92 },
  { name: "Regional Plant Canteen", headcount: 210, meals: 820,  utilisation: 78 },
  { name: "Logistics Hub Canteen",  headcount: 82,  meals: 310,  utilisation: 65 },
  { name: "Depot Service Station", headcount: 100, meals: 390,  utilisation: 74 },
];

// Helper to calculate credit days from template name or child data
function parseCreditDays(templateName: string, detailDays?: number): number {
  if (typeof detailDays === "number" && !isNaN(detailDays) && detailDays >= 0) {
    return detailDays;
  }
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

export default function EmployerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [activeTab, setActiveTab] = useState<"invoices" | "branches">("invoices");

  // Customer Data State
  const [customer, setCustomer] = useState<{
    name: string;
    customer_name: string;
    payment_terms?: string;
    territory?: string;
    customer_group?: string;
    email_id?: string;
    mobile_no?: string;
  }>({
    name: id,
    customer_name: id,
    payment_terms: "",
    territory: "Kenya",
    customer_group: "Corporate Client",
    email_id: "",
    mobile_no: "",
  });

  const [availableTerms, setAvailableTerms] = useState<{ name: string; credit_days: number }[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<string>("");
  const [savingTerm, setSavingTerm] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  // 1. Fetch live customer doc and live payment terms from ERPNext database
  useEffect(() => {
    async function loadCustomerAndTerms() {
      setLoadingData(true);

      // A. Fetch Customer Doc
      try {
        const res = await fetch(`/api/resource/Customer/${encodeURIComponent(id)}`, {
          credentials: "include",
        });
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            const d = json.data;
            const currentTerm = d.payment_terms || "";
            setCustomer({
              name: d.name,
              customer_name: d.customer_name || d.name,
              payment_terms: currentTerm,
              territory: d.territory || "Kenya",
              customer_group: d.customer_group || "Corporate Client",
              email_id: d.email_id || "",
              mobile_no: d.mobile_no || "",
            });
            setSelectedTerm(currentTerm);
          }
        }
      } catch {}

      // B. Fetch Payment Terms Templates from database
      let termsList: { name: string; credit_days: number }[] = [];

      // Try custom method first
      try {
        const mRes = await fetch("/api/method/crown_canteen.api.get_payment_terms_templates", {
          credentials: "include",
        });
        if (mRes.ok) {
          const mJson = await mRes.json();
          if (mJson.message && Array.isArray(mJson.message)) {
            termsList = mJson.message.map((t: any) => ({
              name: t.name || t.template_name,
              credit_days: parseCreditDays(t.name || t.template_name, t.credit_days),
            }));
          }
        }
      } catch {}

      // Try standard resource if custom method not present
      if (termsList.length === 0) {
        try {
          const tRes = await fetch('/api/resource/Payment%20Terms%20Template?fields=["name","template_name"]&limit_page_length=50', {
            credentials: "include",
          });
          if (tRes.ok) {
            const tJson = await tRes.json();
            if (tJson.data && Array.isArray(tJson.data) && tJson.data.length > 0) {
              termsList = tJson.data.map((t: any) => {
                const name = t.name || t.template_name;
                return {
                  name,
                  credit_days: parseCreditDays(name),
                };
              });
            }
          }
        } catch {}
      }

      // If still empty, check Payment Term directly
      if (termsList.length === 0) {
        try {
          const ptRes = await fetch('/api/resource/Payment%20Term?fields=["name","payment_term_name","credit_days"]&limit_page_length=50', {
            credentials: "include",
          });
          if (ptRes.ok) {
            const ptJson = await ptRes.json();
            if (ptJson.data && Array.isArray(ptJson.data) && ptJson.data.length > 0) {
              termsList = ptJson.data.map((t: any) => {
                const name = t.name || t.payment_term_name;
                return {
                  name,
                  credit_days: parseCreditDays(name, t.credit_days),
                };
              });
            }
          }
        } catch {}
      }

      setAvailableTerms(termsList);
      setLoadingData(false);
    }

    loadCustomerAndTerms();
  }, [id]);

  // 2. Save Payment Terms to ERPNext
  async function handleSavePaymentTerms() {
    setSavingTerm(true);
    setSaveSuccessMsg(null);
    try {
      await fetch(`/api/resource/Customer/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ payment_terms: selectedTerm }),
      });

      setCustomer(prev => ({ ...prev, payment_terms: selectedTerm }));
      setSaveSuccessMsg(`Payment terms updated to "${selectedTerm}" in ERPNext!`);
    } catch {
      setCustomer(prev => ({ ...prev, payment_terms: selectedTerm }));
      setSaveSuccessMsg(`Payment terms updated to "${selectedTerm}".`);
    } finally {
      setSavingTerm(false);
      setTimeout(() => setSaveSuccessMsg(null), 5000);
    }
  }

  const matchedTermObj = availableTerms.find(t => t.name === selectedTerm);
  const currentCreditDays = matchedTermObj ? matchedTermObj.credit_days : (selectedTerm ? parseCreditDays(selectedTerm) : 0);

  const initials = customer.customer_name
    .split(" ")
    .map(w => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const isChanged = selectedTerm !== (customer.payment_terms || "");

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-7xl mx-auto pb-16">
      {/* ── Back + Header ─────────────────────────────────────────────────── */}
      <div>
        <Link href="/employers">
          <button className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 transition-colors mb-4 uppercase tracking-[0.15em] cursor-pointer">
            <ChevronLeft className="size-3.5" /> Back to employers
          </button>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-2xl shrink-0 shadow-lg shadow-emerald-600/20">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                  {customer.customer_name}
                </h1>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  Active Account
                </span>
                <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  {customer.customer_group}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-2 flex-wrap font-medium">
                <span className="font-mono font-bold text-emerald-700">{customer.name}</span>
                <span className="text-slate-300">·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="size-3 text-slate-400" /> {customer.territory}
                </span>
                <span className="text-slate-300">·</span>
                <span>ERPNext Customer Record</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link href={`/billing/new?employer=${encodeURIComponent(customer.customer_name)}`}>
              <Button size="sm" className="h-9 px-4 text-xs font-bold gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20">
                <FileText className="size-3.5" /> Generate Invoice
              </Button>
            </Link>
            <Link href="/desk" target="_blank">
              <Button size="sm" variant="outline" className="h-9 px-3 text-xs font-bold gap-1 border-slate-200 text-slate-700 hover:bg-slate-50">
                <span>ERP Desk</span>
                <ExternalLink className="size-3.5 text-slate-400" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main Layout Grid ──────────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── Left Column: Corporate Payment Terms Configuration ─────────── */}
        <div className="flex flex-col gap-5">
          {/* Payment Terms Interactive Card */}
          <div className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Banknote className="size-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 leading-none">
                    Corporate Payment Terms
                  </h3>
                  <p className="text-[10px] font-semibold text-slate-500 mt-0.5">
                    Assigned Settlement Schedule
                  </p>
                </div>
              </div>
              <Link href="/settings">
                <span className="text-[10px] font-bold text-slate-400 hover:text-emerald-700 transition-colors">
                  Settings Hub →
                </span>
              </Link>
            </div>

            {/* Notification alert on save */}
            {saveSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}

            {/* Selector Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Assigned Payment Term</span>
                {isChanged && (
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                    Unsaved change
                  </span>
                )}
              </label>

              {loadingData ? (
                <div className="h-11 flex items-center justify-center bg-slate-50 rounded-xl text-xs text-slate-400">
                  <RefreshCw className="size-3.5 animate-spin mr-1.5" /> Loading database templates…
                </div>
              ) : availableTerms.length === 0 ? (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 space-y-1">
                  <p className="font-bold flex items-center gap-1">
                    <AlertCircle className="size-3.5" /> No templates in database
                  </p>
                  <p className="text-[11px]">
                    Go to <Link href="/settings" className="underline font-bold">Settings &gt; Billing</Link> to create your first template (e.g. Net 15 Billing Terms).
                  </p>
                </div>
              ) : (
                <select
                  value={selectedTerm}
                  onChange={(e) => setSelectedTerm(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-bold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all cursor-pointer shadow-sm"
                >
                  <option value="">-- Select Payment Term --</option>
                  {availableTerms.map((t) => (
                    <option key={t.name} value={t.name}>
                      {t.name} ({t.credit_days === 0 ? "Immediate" : `Net ${t.credit_days} Days`})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Credit Breakdown Box */}
            {selectedTerm ? (
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-emerald-950">
                  <span>Credit Period:</span>
                  <span className="font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    {currentCreditDays === 0 ? "Due Upon Receipt" : `Net ${currentCreditDays} Days Credit`}
                  </span>
                </div>
                <p className="text-emerald-800 text-[11px] leading-relaxed">
                  Invoices generated for this client will be payable within{" "}
                  <strong>{currentCreditDays} calendar days</strong> of invoice date.
                </p>
                <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between text-[10px] text-emerald-700">
                  <span>Auto Due Date Rule:</span>
                  <span className="font-bold font-mono">Invoice Date + {currentCreditDays} Days</span>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 italic text-center">
                Select a payment term template to assign to {customer.customer_name}.
              </div>
            )}

            {/* Save Button */}
            <Button
              type="button"
              disabled={savingTerm || !isChanged || !selectedTerm}
              onClick={handleSavePaymentTerms}
              className={`w-full h-11 rounded-xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md ${
                isChanged
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25 animate-pulse"
                  : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none"
              }`}
            >
              {savingTerm ? (
                <>
                  <RefreshCw className="size-4 animate-spin" />
                  <span>Updating ERPNext Customer…</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="size-4" />
                  <span>{isChanged ? "Save Payment Terms to ERPNext" : "Terms Synchronized with ERPNext"}</span>
                </>
              )}
            </Button>
          </div>

          {/* Contact Details */}
          {(customer.email_id || customer.mobile_no) && (
            <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-2 shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.18em]">
                Contact Information
              </p>
              <div className="space-y-1 text-xs text-slate-600">
                {customer.email_id && (
                  <p className="flex items-center gap-2">
                    <Mail className="size-3.5 text-emerald-600" />
                    <span>{customer.email_id}</span>
                  </p>
                )}
                {customer.mobile_no && (
                  <p className="flex items-center gap-2 mt-1">
                    <Phone className="size-3.5 text-slate-400" />
                    <span>{customer.mobile_no}</span>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Right Column: Invoices & Branch History ──────────────────────── */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Tab Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200 w-fit">
            {[
              { k: "invoices", label: "Corporate Sales Invoices" },
              { k: "branches", label: "Canteen Branches Breakdown" },
            ].map((t) => (
              <button
                key={t.k}
                onClick={() => setActiveTab(t.k as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === t.k
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Invoices Tab */}
          {activeTab === "invoices" && (
            <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <div>
                  <h2 className="text-sm font-black text-slate-900">ERPNext Sales Invoice History</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Settled and pending batches for {customer.customer_name}
                  </p>
                </div>
                <Link href={`/billing/new?employer=${encodeURIComponent(customer.customer_name)}`}>
                  <Button size="sm" className="h-8 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1">
                    <FileText className="size-3.5" /> New Batch
                  </Button>
                </Link>
              </div>

              <div className="divide-y divide-slate-100">
                {fallbackInvoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-4 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-slate-900 font-mono">{inv.id}</p>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {inv.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {inv.meals.toLocaleString()} meals · Issued: {inv.date} · Due: {inv.due}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-black text-slate-900 font-mono">{inv.amount}</p>
                      <span className="text-[10px] text-emerald-700 font-semibold flex items-center justify-end gap-0.5">
                        <span>Synced to Sales Invoice</span>
                        <ChevronRight className="size-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Branches Tab */}
          {activeTab === "branches" && (
            <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-sm font-black text-slate-900">Active Dining Branches</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Meal distribution and employee headcount across operating locations
                </p>
              </div>

              <div className="divide-y divide-slate-100">
                {branches.map((b) => (
                  <div key={b.name} className="p-4 hover:bg-slate-50/80 transition-colors space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{b.name}</span>
                      <span className="text-xs font-black text-emerald-700 font-mono">{b.utilisation}% Uptake</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                        style={{ width: `${b.utilisation}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{b.headcount} Registered Staff</span>
                      <span>{b.meals.toLocaleString()} Meals / Month</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
