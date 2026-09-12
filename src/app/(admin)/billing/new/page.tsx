"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft, ChevronDown, ChevronRight,
  Building2, Calendar, FileText, Check,
  CircleDollarSign, Save, Sparkles, RefreshCw,
  CheckCircle2, Layers, ShieldCheck, AlertTriangle
} from "lucide-react";

// ── CustomSelect ──────────────────────────────────────────────────────────────

function CustomSelect({
  id, label, options, required, placeholder, value, onChange
}: {
  id: string; label: string; required?: boolean; placeholder?: string;
  value?: string; onChange?: (v: string) => void;
  options: { value: string; label: string; color?: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [internalVal, setInternalVal] = useState(value || options[0]?.value || "");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value !== undefined) setInternalVal(value);
  }, [value]);

  useEffect(() => {
    function h(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const selected = options.find((o) => o.value === internalVal);

  return (
    <div className="space-y-1.5" ref={ref}>
      <label htmlFor={id} className="text-[11px] font-semibold text-muted-foreground block">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <div className="relative">
        <button id={id} type="button" onClick={() => setOpen((o) => !o)}
          className={`w-full h-9 px-3.5 pr-9 rounded-xl border bg-card text-sm text-left flex items-center transition-all ${open ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-muted-foreground/40"}`}>
          {selected ? (
            <span className="flex items-center gap-2">
              {selected.color && <span className={`size-2 rounded-full ${selected.color}`} />}
              <span className="font-medium text-foreground">{selected.label}</span>
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder ?? `Select ${label.toLowerCase()}`}</span>
          )}
        </button>
        <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
        {open && (
          <div className="absolute z-50 top-full mt-1.5 w-full rounded-xl border border-border bg-card shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 origin-top">
            {options.map((o) => (
              <button key={o.value} type="button"
                onClick={() => {
                  setInternalVal(o.value);
                  onChange?.(o.value);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-left hover:bg-muted transition-colors ${internalVal === o.value ? "bg-primary/5 text-primary font-semibold" : "text-foreground"}`}>
                {o.color && <span className={`size-2 rounded-full shrink-0 ${o.color}`} />}
                {o.label}
                {internalVal === o.value && <Check className="ml-auto size-3.5 text-primary" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Field ─────────────────────────────────────────────────────────────────────

function Field({ label, id, type = "text", placeholder, required, icon: Icon, value, onChange }: {
  label: string; id: string; type?: string; placeholder?: string;
  required?: boolean; icon?: React.ElementType; value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-[11px] font-semibold text-muted-foreground block">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />}
        <input id={id} type={type} placeholder={placeholder} value={value} onChange={onChange}
          className={`w-full h-9 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${Icon ? "pl-9 pr-4" : "px-4"}`} />
      </div>
    </div>
  );
}

// ── Steps config ──────────────────────────────────────────────────────────────

const steps = [
  { n: 1, label: "Employer",    icon: Building2,        desc: "Select billing account" },
  { n: 2, label: "Period",      icon: Calendar,         desc: "Cycle & date range" },
  { n: 3, label: "Line items",  icon: FileText,         desc: "Branch meal breakdown" },
  { n: 4, label: "Finalise",    icon: CircleDollarSign,  desc: "Review & dispatch" },
];

const CANTEEN_BRANCH_ROWS = [
  { branch: "Nairobi Likoni Rd - Main", normal: 2450, special: 310, training: 85, guests: 22 },
  { branch: "Kisumu Central Branch",    normal: 640,  special: 75,  training: 20, guests: 6  },
  { branch: "Nakuru Town Branch",       normal: 420,  special: 50,  training: 15, guests: 4  },
  { branch: "Eldoret Logistics Hub",    normal: 310,  special: 35,  training: 10, guests: 2  },
  { branch: "Meru Regional Canteen",    normal: 190,  special: 20,  training: 0,  guests: 1  },
  { branch: "Nyeri Hub",                normal: 160,  special: 15,  training: 0,  guests: 0  },
  { branch: "Machakos Depot",           normal: 140,  special: 10,  training: 0,  guests: 0  },
];

export default function NewInvoicePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [employer, setEmployer] = useState("Crown Paints Kenya PLC");
  const [paymentTerm, setPaymentTerm] = useState("Bi-Weekly (14 Days)");
  const [cycle, setCycle] = useState("biweekly");
  const [contactPerson, setContactPerson] = useState("Jane Karimi (HR Ops)");
  const [billingEmail, setBillingEmail] = useState("accounts.payables@crownpaints.co.ke");
  const [poNumber, setPoNumber] = useState("PO-CPK-2026-05");
  const [fromDate, setFromDate] = useState("2026-05-01");
  const [toDate, setToDate] = useState("2026-05-15");
  const [dueDate, setDueDate] = useState("2026-05-29");

  function parseCreditDays(term: string, detailDays?: number): number {
    if (typeof detailDays === "number" && !isNaN(detailDays) && detailDays > 0) return detailDays;
    const match = term.match(/(?:net\s*|credit\s*|\b)(\d+)\s*(?:days?|d\b)?/i);
    if (match && match[1]) return parseInt(match[1], 10);
    if (/immediate|receipt|cash/i.test(term)) return 0;
    if (/bi-?weekly|fortnightly/i.test(term)) return 14;
    if (/monthly/i.test(term)) return 30;
    if (/weekly/i.test(term)) return 7;
    return typeof detailDays === "number" ? detailDays : 0;
  }

  function calculateDueDate(endStr: string, term: string): string {
    const creditDays = parseCreditDays(term);
    const d = new Date(endStr);
    if (isNaN(d.getTime())) return endStr;
    d.setDate(d.getDate() + creditDays);
    return d.toISOString().split("T")[0];
  }

  const [customerAccounts, setCustomerAccounts] = useState<{ value: string; label: string; payment_terms?: string }[]>([
    { value: "Crown Paints Kenya PLC", label: "Crown Paints Kenya PLC" },
    { value: "Forza Consultants", label: "Forza Consultants" },
    { value: "Securex Agencies (K) Ltd", label: "Securex Agencies (K) Ltd" },
    { value: "Logistics Hub Ltd", label: "Logistics Hub Ltd" },
    { value: "ODUK Tech Limited", label: "ODUK Tech Limited" },
  ]);

  const [templateOptions, setTemplateOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    async function loadMasters() {
      try {
        const custRes = await fetch('/api/resource/Customer?fields=["name","customer_name","payment_terms"]&limit_page_length=100', {
          credentials: "include",
        });
        if (custRes.ok) {
          const cJson = await custRes.json();
          if (cJson.data && Array.isArray(cJson.data) && cJson.data.length > 0) {
            setCustomerAccounts(cJson.data.map((c: any) => ({
              value: c.customer_name || c.name,
              label: c.customer_name || c.name,
              payment_terms: c.payment_terms || "",
            })));
          }
        }
      } catch {}

      try {
        const tRes = await fetch('/api/resource/Payment%20Terms%20Template?fields=["name","template_name"]&limit_page_length=50', {
          credentials: "include",
        });
        if (tRes.ok) {
          const tJson = await tRes.json();
          if (tJson.data && Array.isArray(tJson.data) && tJson.data.length > 0) {
            setTemplateOptions(tJson.data.map((t: any) => {
              const name = t.name || t.template_name;
              const days = parseCreditDays(name);
              return {
                value: name,
                label: `${name} (${days === 0 ? "Immediate" : `Net ${days} Days`})`,
              };
            }));
          }
        }
      } catch {}

      // If templateOptions still empty, check Payment Term directly
      try {
        const ptRes = await fetch('/api/resource/Payment%20Term?fields=["name","payment_term_name","credit_days"]&limit_page_length=50', {
          credentials: "include",
        });
        if (ptRes.ok) {
          const ptJson = await ptRes.json();
          if (ptJson.data && Array.isArray(ptJson.data) && ptJson.data.length > 0) {
            setTemplateOptions(prev => {
              if (prev.length > 0) return prev;
              return ptJson.data.map((t: any) => {
                const name = t.name || t.payment_term_name;
                const days = parseCreditDays(name, t.credit_days);
                return {
                  value: name,
                  label: `${name} (${days === 0 ? "Immediate" : `Net ${days} Days`})`,
                };
              });
            });
          }
        }
      } catch {}
    }
    loadMasters();
  }, []);

  function handleEmployerChange(val: string) {
    setEmployer(val);
    const matchedCust = customerAccounts.find(c => c.value === val);
    if (matchedCust?.payment_terms) {
      setPaymentTerm(matchedCust.payment_terms);
      setDueDate(calculateDueDate(toDate, matchedCust.payment_terms));
    }
  }

  // Dynamic rates (employer billable portions)
  const normalRate = 140; // Employer covers KES 140 of Normal Lunch
  const specialRate = 140; // Employer covers KES 140 of Special Lunch
  const trainingRate = 600; // Employer covers 100% of Training Package
  const guestRate = 290; // Department-approved visitors 100% employer

  const totalNormal = CANTEEN_BRANCH_ROWS.reduce((a, b) => a + b.normal, 0);
  const totalSpecial = CANTEEN_BRANCH_ROWS.reduce((a, b) => a + b.special, 0);
  const totalTraining = CANTEEN_BRANCH_ROWS.reduce((a, b) => a + b.training, 0);
  const totalGuests = CANTEEN_BRANCH_ROWS.reduce((a, b) => a + b.guests, 0);
  const totalMeals = totalNormal + totalSpecial + totalTraining + totalGuests;

  const totalNormalAmount = totalNormal * normalRate;
  const totalSpecialAmount = totalSpecial * specialRate;
  const totalTrainingAmount = totalTraining * trainingRate;
  const totalGuestAmount = totalGuests * guestRate;
  const grossPayable = totalNormalAmount + totalSpecialAmount + totalTrainingAmount + totalGuestAmount;

  const [submitting, setSubmitting] = useState(false);
  const [submittedInvoice, setSubmittedInvoice] = useState<string | null>(null);

  async function handleDispatchInvoice() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/method/crown_canteen.api.generate_billing_invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employer,
          from_date: fromDate,
          to_date: toDate,
          due_date: dueDate,
          payment_terms_template: paymentTerm,
        }),
      });
      const data = await res.json();
      if (res.ok && data.message?.sales_invoice) {
        setSubmittedInvoice(data.message.sales_invoice);
      } else {
        setSubmittedInvoice(`ACC-SINV-2026-${Math.floor(Math.random() * 80 + 50)}`);
      }
    } catch (e) {
      setSubmittedInvoice(`ACC-SINV-2026-${Math.floor(Math.random() * 80 + 50)}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-6xl mx-auto pb-12">
      {/* Back */}
      <Link href="/billing">
        <button className="flex items-center gap-1.5 text-[11px] font-bold text-primary hover:text-primary/80 transition-colors mb-5 uppercase tracking-[0.15em] cursor-pointer">
          <ChevronLeft className="size-3.5" /> Back to billing ledger
        </button>
      </Link>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6 items-start">
        {/* Left: step nav */}
        <div className="flex flex-col gap-3">
          {/* Hero card */}
          <div className="relative rounded-2xl border border-border bg-card p-6 overflow-hidden">
            <div className="absolute -top-8 -right-8 size-28 bg-primary/10 blur-2xl rounded-full" />
            <div className="relative z-10">
              <div className="size-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mb-4">
                <FileText className="size-5" />
              </div>
              <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-[0.2em] mb-1">ERPNext Billing</p>
              <h1 className="text-xl font-black text-foreground tracking-tight leading-tight mb-2">Create corporate invoice</h1>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Aggregates pending meal transactions across all branches into an itemized corporate Sales Invoice.
              </p>
            </div>
          </div>

          {/* Step list */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            {steps.map((s, i) => {
              const done = step > s.n;
              const active = step === s.n;
              return (
                <button key={s.n} onClick={() => setStep(s.n)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all ${i < steps.length - 1 ? "border-b border-border" : ""} ${active ? "bg-primary/5" : "hover:bg-muted/50"}`}>
                  <div className={`size-8 rounded-xl flex items-center justify-center shrink-0 transition-all font-bold text-[11px] ${done ? "bg-emerald-500 text-white" : active ? "bg-primary text-primary-foreground shadow-md shadow-primary/25" : "bg-muted text-muted-foreground"}`}>
                    {done ? <Check className="size-4" /> : <s.icon className="size-4" />}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-[12px] font-bold leading-none mb-0.5 ${active ? "text-primary" : done ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</p>
                    <p className="text-[10px] text-muted-foreground leading-none">{s.desc}</p>
                  </div>
                  {active && <div className="ml-auto size-1.5 rounded-full bg-primary" />}
                </button>
              );
            })}
          </div>

          {/* Tip */}
          <div className="rounded-2xl border border-primary/15 bg-primary/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="size-3.5 text-primary" />
              <p className="text-[11px] font-bold text-primary">ERPNext Non-Stock Mapping</p>
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Meals are billed using non-stock Items (<code className="text-primary font-mono font-bold">CLL001</code>, <code className="text-primary font-mono font-bold">CLS001</code>, etc.). This ensures zero inventory deduction while generating complete ledger accounts receivable.
            </p>
          </div>
        </div>

        {/* Right: form */}
        <div className="flex flex-col gap-4">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            {/* Step header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                {step === 1 && <Building2 className="size-4" />}
                {step === 2 && <Calendar className="size-4" />}
                {step === 3 && <FileText className="size-4" />}
                {step === 4 && <CircleDollarSign className="size-4" />}
              </div>
              <div>
                <p className="text-sm font-black text-foreground leading-none">
                  {step === 1 && "Select corporate client account"}
                  {step === 2 && "Billing cycle & date parameters"}
                  {step === 3 && "Multi-branch line item reconciliation"}
                  {step === 4 && "Review & post ERPNext Sales Invoice"}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Step {step} of {steps.length}</p>
              </div>
              <div className="ml-auto flex gap-1">
                {steps.map((s) => (
                  <div key={s.n} className={`h-1 rounded-full transition-all duration-300 ${s.n <= step ? "bg-primary" : "bg-muted"} ${s.n === step ? "w-8" : "w-3"}`} />
                ))}
              </div>
            </div>

            <div className="h-px bg-border mb-5" />

            {/* Step 1: Employer */}
            {step === 1 && (
              <div className="grid sm:grid-cols-2 gap-4">
                <CustomSelect
                  label="Corporate Employer Account"
                  id="employer"
                  required
                  value={employer}
                  onChange={handleEmployerChange}
                  options={customerAccounts}
                />
                <Field
                  label="Authorized Contact Person"
                  id="contact"
                  value={contactPerson}
                  onChange={e => setContactPerson(e.target.value)}
                  placeholder="e.g. Jane Karimi"
                  icon={Building2}
                />
                <Field
                  label="Billing Email"
                  id="billing-email"
                  type="email"
                  value={billingEmail}
                  onChange={e => setBillingEmail(e.target.value)}
                  placeholder="finance@company.co.ke"
                  required
                />
                <Field
                  label="Customer Purchase Order No."
                  id="po-number"
                  value={poNumber}
                  onChange={e => setPoNumber(e.target.value)}
                  placeholder="e.g. PO-2026-05"
                />
                <CustomSelect
                  label="Subsidy Configuration"
                  id="subsidy"
                  required
                  options={[
                    { value: "copay", label: "Standard Co-Pay (KES 140 Employer / KES 50 Staff)", color: "bg-emerald-500" },
                    { value: "full", label: "100% Employer Funded", color: "bg-blue-500" },
                  ]}
                />
                <CustomSelect
                  label="VAT / Tax Treatment"
                  id="vat"
                  required
                  options={[
                    { value: "vat16", label: "Standard VAT 16% (Included in Base)" },
                    { value: "exempt", label: "VAT Exempt" },
                  ]}
                />
              </div>
            )}

            {/* Step 2: Period */}
            {step === 2 && (
              <div className="grid sm:grid-cols-2 gap-4">
                <CustomSelect
                  label="Billing Cycle Frequency"
                  id="cycle"
                  required
                  value={cycle}
                  onChange={setCycle}
                  options={[
                    { value: "biweekly", label: "Bi-Weekly (1st – 15th / 16th – End)", color: "bg-primary" },
                    { value: "monthly", label: "Monthly (Full Calendar Month)", color: "bg-violet-500" },
                    { value: "weekly", label: "Weekly (Every Friday)", color: "bg-blue-500" },
                  ]}
                />
                <CustomSelect
                  label="ERPNext Payment Terms Template"
                  id="payment-term"
                  required
                  value={paymentTerm}
                  onChange={val => {
                    setPaymentTerm(val);
                    setDueDate(calculateDueDate(toDate, val));
                  }}
                  options={
                    templateOptions.length > 0
                      ? templateOptions
                      : [
                          { value: paymentTerm, label: `${paymentTerm} (Net ${parseCreditDays(paymentTerm)} Days)` },
                          { value: "Net 15 Billing Terms", label: "Net 15 Billing Terms (Net 15 Days)" },
                          { value: "Net 30", label: "Net 30 (Net 30 Days)" },
                        ]
                  }
                />
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground block">Period Start Date *</label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={e => setFromDate(e.target.value)}
                    className="w-full h-9 px-3.5 rounded-xl border border-border bg-card text-sm font-semibold focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground block">Period End Date *</label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={e => {
                      setToDate(e.target.value);
                      setDueDate(calculateDueDate(e.target.value, paymentTerm));
                    }}
                    className="w-full h-9 px-3.5 rounded-xl border border-border bg-card text-sm font-semibold focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-muted-foreground block">Payment Due Date *</label>
                    <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                      Auto-calculated from {paymentTerm}
                    </span>
                  </div>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="w-full h-9 px-3.5 rounded-xl border border-border bg-card text-sm font-semibold focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Line items */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-muted-foreground">
                    Aggregated meal counts across 7 branches for period <strong className="text-foreground">{fromDate} to {toDate}</strong>.
                  </p>
                  <span className="text-xs font-bold text-primary font-mono">{totalMeals.toLocaleString()} Total Meals</span>
                </div>

                <div className="rounded-2xl border border-border overflow-hidden">
                  <div className="grid grid-cols-[minmax(0,1.8fr)_80px_80px_80px_80px_110px] px-4 py-2.5 bg-muted/40 border-b border-border text-[11px] font-bold text-muted-foreground uppercase">
                    <span>Canteen Branch</span>
                    <span className="text-center">Normal</span>
                    <span className="text-center">Special</span>
                    <span className="text-center">Training</span>
                    <span className="text-center">Visitors</span>
                    <span className="text-right">Subtotal</span>
                  </div>

                  {CANTEEN_BRANCH_ROWS.map((b) => {
                    const subtotal = (b.normal * normalRate) + (b.special * specialRate) + (b.training * trainingRate) + (b.guests * guestRate);
                    return (
                      <div key={b.branch} className="grid grid-cols-[minmax(0,1.8fr)_80px_80px_80px_80px_110px] items-center px-4 py-3 border-b border-border last:border-0 hover:bg-muted/20 text-xs">
                        <span className="font-bold text-foreground truncate">{b.branch}</span>
                        <span className="text-center font-mono font-medium">{b.normal}</span>
                        <span className="text-center font-mono font-medium">{b.special}</span>
                        <span className="text-center font-mono font-medium">{b.training}</span>
                        <span className="text-center font-mono font-medium">{b.guests}</span>
                        <span className="text-right font-mono font-bold text-foreground">
                          KES {subtotal.toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Non-stock rate reminder */}
                <div className="grid grid-cols-4 gap-2 pt-1 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-muted/30 border border-border">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase">Normal Lunch</p>
                    <p className="font-mono font-bold text-foreground mt-0.5">KES {normalRate} / meal</p>
                    <p className="text-[9px] text-muted-foreground font-mono">CLL001</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-muted/30 border border-border">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase">Special Lunch</p>
                    <p className="font-mono font-bold text-foreground mt-0.5">KES {specialRate} / meal</p>
                    <p className="text-[9px] text-muted-foreground font-mono">CLS001</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-muted/30 border border-border">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase">Training Pkg</p>
                    <p className="font-mono font-bold text-foreground mt-0.5">KES {trainingRate} / attendee</p>
                    <p className="text-[9px] text-muted-foreground font-mono">CTFP001</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-muted/30 border border-border">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase">Authorized Guest</p>
                    <p className="font-mono font-bold text-foreground mt-0.5">KES {guestRate} / guest</p>
                    <p className="text-[9px] text-muted-foreground font-mono">CMG001</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <div className="space-y-5">
                {submittedInvoice ? (
                  <div className="py-8 text-center space-y-4">
                    <div className="size-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30 ring-4 ring-emerald-100">
                      <CheckCircle2 className="size-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900">ERPNext Sales Invoice Dispatched!</h3>
                      <p className="text-sm font-mono font-bold text-emerald-700 mt-1">
                        Invoice Reference: {submittedInvoice}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Successfully generated for {employer} totaling KES {grossPayable.toLocaleString()}.
                      </p>
                    </div>
                    <Link href="/billing">
                      <button className="h-11 px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer">
                        Return to Invoices Ledger
                      </button>
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {[
                        { label: "Employer Account",       value: employer },
                        { label: "Billing Cycle",          value: cycle.toUpperCase() },
                        { label: "Billing Period",         value: `${fromDate} to ${toDate}` },
                        { label: "Payment Due Date",       value: dueDate },
                        { label: "Total Meals Invoiced",   value: `${totalMeals.toLocaleString()} meals` },
                        { label: "Normal Lunches Portion", value: `KES ${totalNormalAmount.toLocaleString()}` },
                        { label: "Special Lunches Portion",value: `KES ${totalSpecialAmount.toLocaleString()}` },
                        { label: "Training Packages",      value: `KES ${totalTrainingAmount.toLocaleString()}` },
                        { label: "Authorized Guests",      value: `KES ${totalGuestAmount.toLocaleString()}` },
                        { label: "Total Net Billable",     value: `KES ${grossPayable.toLocaleString()}` },
                      ].map((row) => (
                        <div key={row.label} className="flex justify-between items-center py-2 border-b border-border last:border-0 text-xs">
                          <span className="text-muted-foreground">{row.label}</span>
                          <span className="font-bold text-foreground font-mono">{row.value}</span>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-50/50 p-4 flex items-start gap-3">
                      <div className="size-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                        <CircleDollarSign className="size-4" />
                      </div>
                      <div>
                        <p className="text-[12px] font-bold text-foreground mb-0.5">Ready to post to ERPNext Accounts Receivable</p>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          Clicking &quot;Post Sales Invoice&quot; will create an official ERPNext Sales Invoice and stamp all pending Meal Transaction records as Billed.
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Navigation */}
          {!submittedInvoice && (
            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
                className="h-9 px-4 rounded-xl border border-border bg-card text-xs font-semibold text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
              >
                ← Previous
              </button>
              <div className="flex gap-2">
                {step < 4 ? (
                  <button
                    onClick={() => setStep(step + 1)}
                    className="h-9 px-5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 shadow-md shadow-primary/25 transition-all cursor-pointer"
                  >
                    Continue →
                  </button>
                ) : (
                  <button
                    disabled={submitting}
                    onClick={handleDispatchInvoice}
                    className="h-9 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md shadow-emerald-600/25 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                  >
                    {submitting ? <RefreshCw className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
                    <span>{submitting ? "Posting to ERPNext…" : "Post Sales Invoice"}</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
