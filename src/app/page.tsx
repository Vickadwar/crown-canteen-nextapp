"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Utensils,
  Fingerprint,
  Users,
  ChefHat,
  Receipt,
  Layers,
  Flame,
  CheckCircle2,
  Salad,
  Fish,
  Beef,
  Drumstick,
  Wheat,
  Clock3,
  HeartPulse,
  Scale,
  Zap,
  Activity,
  Check,
  Clock,
  Cpu,
  Database,
  QrCode,
  Scan,
  Timer,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/ui/logo";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeStage, setActiveStage] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 25);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const stats = [
    { label: "Biometric Uptime", value: "99.98%", sub: "Zero shift-delay queuing" },
    { label: "Tap-to-Plate Speed", value: "< 3.5s", sub: "Rapid RFID & fingerprint scan" },
    { label: "Monthly Meals", value: "18,500+", sub: "Crown Paints Kenya PLC workforce" },
    { label: "Ledger Accuracy", value: "100%", sub: "Automated real-time reconciliation" },
  ];

  // 4 Interactive Shift Lifecycle Stages (Innovative Canteen OS Pipeline)
  const shiftStages = [
    {
      id: "stage-biometric",
      number: "01",
      title: "Biometric Entitlement Scan",
      icon: <Fingerprint className="size-5" />,
      badge: "Edge Kiosk POS",
      badgeColor: "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/25",
      headline: "High-speed tap-to-plate validation at plant entry",
      description:
        "Factory floor workers validate meal eligibility via high-speed optical fingerprint or RFID employee badges. The edge kiosk confirms company subsidy entitlement in under 1.8 seconds, eliminating bottleneck congestion during shift handovers.",
      metrics: [
        { label: "Validation Speed", value: "< 1.8s", detail: "Zero shift queuing choke" },
        { label: "Subsidy Allocation", value: "100%", detail: "Company-backed lunch quota" },
        { label: "Offline Tolerance", value: "Local SQLite", detail: "Syncs when network resumes" },
      ],
      terminalSim: {
        title: "BIOMETRIC TERMINAL #02 (FACTORY GATE A)",
        status: "VERIFIED & ISSUED",
        statusColor: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
        employee: "Kipchoge Maina (Payroll #CP-4091)",
        department: "Industrial Paint Production",
        mealType: "Subsidized Shift Lunch (Standard)",
        subsidyDebit: "KES 200.00 (Crown Paints Subsidy)",
        payrollDebit: "KES 50.00 (Payslip Balance Deduction)",
        auditHash: "SHA256: 8f9b...a102c",
        timestamp: "12:14:08 EAT",
      },
    },
    {
      id: "stage-kitchen",
      number: "02",
      title: "Chef Yield & Batch Pacing",
      icon: <ChefHat className="size-5" />,
      badge: "Culinary Telemetry",
      badgeColor: "bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/25",
      headline: "Live turnout prediction and zero food-waste forecasting",
      description:
        "Executive chefs receive real-time headcount projections from the factory turnstiles. Automated batch yield algorithms calculate exact ingredient quantities, track warming pan replenishment schedules, and prevent costly institutional food waste.",
      metrics: [
        { label: "Turnout Forecast", value: "98.8%", detail: "Real-time biometric attendance" },
        { label: "Waste Reduction", value: "-28%", detail: "Precision batch sizing" },
        { label: "Macro Balance", value: "Optimal", detail: "Calorie & protein verified" },
      ],
      terminalSim: {
        title: "CENTRAL KITCHEN DISPATCH CONSOLE",
        status: "BATCH PRODUCTION ACTIVE",
        statusColor: "text-amber-400 bg-amber-500/15 border-amber-500/30",
        employee: "Chef Omwamba (Head of Culinary Ops)",
        department: "Nairobi Plant Central Canteen",
        mealType: "Batch #B-882: Prime Beef & Pilau (450 Pax)",
        subsidyDebit: "Portions Dispensed: 312 / 450",
        payrollDebit: "Buffer Remaining: 138 Portions",
        auditHash: "HEAT-LINE: 72°C Compliant",
        timestamp: "12:15:22 EAT",
      },
    },
    {
      id: "stage-guest",
      number: "03",
      title: "Contractor & Guest Provisioning",
      icon: <Users className="size-5" />,
      badge: "Instant Sponsorship",
      badgeColor: "bg-teal-500/10 text-teal-800 dark:text-teal-300 border-teal-500/25",
      headline: "Flexible departmental billing without administrative red tape",
      description:
        "Visiting auditors, supply drivers, and technical contractors receive digital guest vouchers authorized by department heads. Meal costs route straight to specific cost centers (e.g. Quality Assurance, Fleet Ops, HR) with zero paperwork.",
      metrics: [
        { label: "Cost Center Routing", value: "Automated", detail: "Direct GL department debit" },
        { label: "Voucher Dispatch", value: "Instant QR", detail: "SMS & digital token receipt" },
        { label: "Audit Readiness", value: "100%", detail: "Itemized host sponsorship logs" },
      ],
      terminalSim: {
        title: "GUEST AUTHORIZATION DISPATCH",
        status: "GUEST MEAL AUTHORIZED",
        statusColor: "text-teal-400 bg-teal-500/15 border-teal-500/30",
        employee: "SGS Quality Assurance Auditor (Visiting)",
        department: "Sponsor: QA Dept (Cost Center #402)",
        mealType: "Executive Hot Lunch + Beverage",
        subsidyDebit: "Billing Target: Corporate Host Account",
        payrollDebit: "On-Spot Extra: KES 0.00 (Self-Contained)",
        auditHash: "AUTH-TOKEN: GUEST-99042",
        timestamp: "12:16:45 EAT",
      },
    },
    {
      id: "stage-ledger",
      number: "04",
      title: "Enterprise ERP Ledger Sync",
      icon: <Receipt className="size-5" />,
      badge: "Financial Engine",
      badgeColor: "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/25",
      headline: "Immutable general ledger reconciliation with 3-way matching",
      description:
        "Every meal served is posted to the enterprise financial database in real time. Automatic double-entry journal vouchers reconcile inventory consumption, subsidy allocations, and payroll deductions with zero end-of-month manual tallying.",
      metrics: [
        { label: "Ledger Speed", value: "< 35ms", detail: "Instant ERP posting" },
        { label: "Reconciliation", value: "100%", detail: "Zero discrepancy audit trail" },
        { label: "Payroll Sync", value: "Automated", detail: "End-of-month payslip export" },
      ],
      terminalSim: {
        title: "FRAPPE GENERAL LEDGER SYNCHRONIZER",
        status: "GL JOURNAL POSTED",
        statusColor: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
        employee: "Automated Corporate Finance Daemon",
        department: "Finance & Accounting Division",
        mealType: "Daily Shift Batch Reconciliation",
        subsidyDebit: "Debit: Staff Welfare Subsidies (KES 122,400)",
        payrollDebit: "Credit: Inventory Raw Goods (KES 122,400)",
        auditHash: "LEDGER REF: JV-2026-0910-891",
        timestamp: "12:17:00 EAT",
      },
    },
  ];

  const pillars = [
    {
      icon: <Fingerprint className="size-6 text-emerald-600 dark:text-emerald-400" />,
      title: "Biometric Self-Checkout",
      description: "Touch-and-go validation via optical fingerprint and RFID NFC badges. Prevents queue choke points during high-volume plant shift transitions.",
      badge: "Kiosk Terminal",
    },
    {
      icon: <ChefHat className="size-6 text-emerald-600 dark:text-emerald-400" />,
      title: "Chef Meal Planning & Yields",
      description: "Automated rotation cycles planned by executive chefs with macro-nutrient targets, calorie indexing, and automatic batch yield forecasting.",
      badge: "Culinary Ops",
    },
    {
      icon: <Receipt className="size-6 text-emerald-600 dark:text-emerald-400" />,
      title: "Corporate Billing & Payroll Sync",
      description: "Instant transaction matching for automatic employee payroll deductions, department billing quotas, and transparent monthly ledger exports.",
      badge: "Financial Engine",
    },
    {
      icon: <Layers className="size-6 text-emerald-600 dark:text-emerald-400" />,
      title: "Warehouse & Goods Receipt",
      description: "Track dry store perishables, automate Minimum Order Quantities (MOQ), and issue real-time goods receipt notes (GRN) with barcode verification.",
      badge: "Procurement",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-white antialiased overflow-x-clip">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-15%] left-[-10%] size-[550px] bg-emerald-500/15 blur-[120px] rounded-full mix-blend-multiply opacity-70 animate-pulse" />
        <div className="absolute top-[35%] right-[-10%] size-[500px] bg-teal-500/10 blur-[130px] rounded-full mix-blend-multiply opacity-60" />
        <div
          className="absolute bottom-[-10%] left-[25%] size-[600px] bg-emerald-600/10 blur-[140px] rounded-full mix-blend-multiply opacity-50 animate-pulse"
          style={{ animationDelay: "3s" }}
        />
      </div>

      {/* ── Sticky Full-Width Header Navigation ───────────────────────────── */}
      <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/95 backdrop-blur-xl shadow-xs transition-colors">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Logo href="/" iconSize="sm" subtitle="Canteen OS" />
            <nav className="hidden md:flex items-center gap-1 bg-muted/60 p-1 rounded-full border border-border/50 text-xs font-semibold text-muted-foreground">
              <a
                href="#overview"
                className="px-4 py-1.5 rounded-full hover:text-foreground hover:bg-background/90 transition-all"
              >
                Overview
              </a>
              <a
                href="#pillars"
                className="px-4 py-1.5 rounded-full hover:text-foreground hover:bg-background/90 transition-all"
              >
                Capabilities
              </a>
              <a
                href="#shift-pipeline"
                className="px-4 py-1.5 rounded-full hover:text-foreground hover:bg-background/90 transition-all"
              >
                Shift Pipeline
              </a>
              <a
                href="#operations"
                className="px-4 py-1.5 rounded-full hover:text-foreground hover:bg-background/90 transition-all"
              >
                Financial Engine
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/auth/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs font-bold hover:bg-primary/10 hover:text-primary rounded-xl px-3.5 h-9"
              >
                Staff Portal
              </Button>
            </Link>
            <Link href="/kiosk">
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-black px-4 h-9 text-xs rounded-xl shadow-md shadow-primary/20 hover:-translate-y-0.5 transition-all flex items-center gap-1.5"
              >
                <span className="relative flex size-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full size-2 bg-white"></span>
                </span>
                Launch Kiosk
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 pt-4">
        {/* ── Hero Section ─────────────────────────────────────────────────── */}
        <section id="overview" className="container mx-auto px-4 lg:px-8 pt-4 pb-12 lg:pb-16">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4 text-left">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-800 dark:text-emerald-300">
                <span className="relative flex size-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full size-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.16em]">
                  Crown Canteen OS · Enterprise Dining & Catering Infrastructure
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-[1.08]">
                Smart Nutrition. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400">
                  Biometric Precision.
                </span>{" "}
                <br />
                Zero Queue Delay.
              </h1>

              <p className="text-sm sm:text-base text-muted-foreground font-medium max-w-xl leading-relaxed">
                The unified dining operating system bridging factory floor biometric POS terminals,
                executive chef meal cycles, and automated enterprise financial reconciliation for corporate clients like Crown Paints Kenya PLC.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <Link href="/auth/login">
                  <Button
                    size="default"
                    className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-black px-6 h-10 rounded-xl text-xs sm:text-sm shadow-lg shadow-primary/25 group hover:-translate-y-0.5 transition-all"
                  >
                    Enter Management Console
                    <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/kiosk">
                  <Button
                    size="default"
                    variant="outline"
                    className="w-full sm:w-auto border-border/80 bg-card/60 backdrop-blur-md hover:bg-muted/80 text-foreground font-bold px-5 h-10 rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
                  >
                    <Fingerprint className="size-4 text-emerald-600 dark:text-emerald-400" />
                    Open Kiosk Mode
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Interactive Mockup Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative z-10 bg-card/80 backdrop-blur-xl border border-border/80 rounded-3xl p-6 shadow-2xl shadow-emerald-950/10 space-y-5 overflow-hidden">
                <div className="flex items-center justify-between border-b border-border/60 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-black">
                      <Utensils className="size-5" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-wider text-primary">Live Terminal</p>
                      <p className="text-sm font-bold text-foreground">Nairobi Plant Main Canteen</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-[10px] font-black uppercase tracking-wider">
                    Online 24/7
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-muted/40 border border-border/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-full bg-primary/15 text-primary flex items-center justify-center font-black text-xs">
                        JM
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">John Mwangi (CP-8841)</p>
                        <p className="text-[10px] text-muted-foreground">Production Dept · Lunch Entitlement</p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                      VERIFIED
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-card border border-border/60 space-y-1">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Today's Meals</p>
                      <p className="text-xl font-black text-foreground">1,248 <span className="text-xs text-emerald-600 font-bold">+6.2%</span></p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-card border border-border/60 space-y-1">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Avg Service Speed</p>
                      <p className="text-xl font-black text-foreground">3.2 sec <span className="text-xs text-emerald-600 font-bold">Fast</span></p>
                    </div>
                  </div>
                </div>

                <Link href="/overview" className="block">
                  <Button variant="outline" className="w-full h-10 rounded-xl text-xs font-black border-border hover:bg-primary/5 hover:text-primary transition-all flex items-center justify-center gap-1.5">
                    View Live Analytics Dashboard <ChevronRight className="size-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Key Metrics Ribbon ────────────────────────────────────────────── */}
        <section className="border-y border-border/60 bg-muted/30 py-10">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="space-y-1 text-center sm:text-left">
                  <p className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-xs font-bold text-foreground">{stat.label}</p>
                  <p className="text-[11px] text-muted-foreground font-medium">{stat.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Core Capabilities Bento Grid ─────────────────────────────────── */}
        <section id="pillars" className="py-14 lg:py-16 container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <Badge className="bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/20 font-bold px-3 py-1 text-[10px] tracking-widest uppercase">
              Operational Backbone
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
              Engineered for seamless cafeteria operations.
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground font-medium">
              Everything required to manage high-volume institutional dining from kitchen procurement to executive ledger reporting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {pillars.map((p, i) => (
              <div
                key={i}
                className="group relative p-6 rounded-2xl bg-card/70 backdrop-blur-md border border-border/70 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="size-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {p.icon}
                    </div>
                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">
                      {p.badge}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-foreground tracking-tight group-hover:text-primary transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-2 leading-relaxed">
                      {p.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-border/40">
                  <span className="text-[11px] font-bold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Learn more <ChevronRight className="size-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Innovative Section: Real-Time Shift Pipeline & Telemetry Matrix ── */}
        <section id="shift-pipeline" className="py-14 lg:py-16 bg-muted/30 border-y border-border/60 relative overflow-hidden">
          {/* Subtle decorative glow */}
          <div className="absolute top-1/2 -left-20 size-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 right-10 size-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-800 dark:text-emerald-300">
                  <Activity className="size-3.5 text-emerald-600 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Real-Time Operational Lifecycle
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                  The Automated Shift Dining Pipeline
                </h2>
                <p className="text-sm text-muted-foreground font-medium max-w-2xl">
                  Follow a plate from factory turnstile verification to kitchen production batching, guest sponsorship, and final enterprise general ledger posting.
                </p>
              </div>

              {/* Stage Selector Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-card/60 p-1.5 rounded-2xl border border-border/80 shadow-sm shrink-0">
                {shiftStages.map((stage, idx) => (
                  <button
                    key={stage.id}
                    onClick={() => setActiveStage(idx)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeStage === idx
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                    }`}
                  >
                    <span className="text-[10px] font-mono font-black opacity-60">
                      {stage.number}
                    </span>
                    <span className="truncate">{stage.title.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Stage Deep Dive Showcase */}
            {(() => {
              const cur = shiftStages[activeStage];
              return (
                <div className="grid lg:grid-cols-12 gap-8 items-center bg-card/80 backdrop-blur-xl border border-border/80 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl shadow-black/5 animate-in fade-in zoom-in-95 duration-200">
                  {/* Left Deep-Dive Explainer */}
                  <div className="lg:col-span-6 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="size-11 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary font-black">
                        {cur.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-black text-primary">PHASE {cur.number}</span>
                          <span className="text-border text-xs">•</span>
                          <Badge variant="outline" className={`text-[10px] font-bold ${cur.badgeColor}`}>
                            {cur.badge}
                          </Badge>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight mt-0.5">
                          {cur.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-sm sm:text-base font-semibold text-foreground leading-snug">
                      {cur.headline}
                    </p>

                    <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
                      {cur.description}
                    </p>

                    {/* Key Metrics Grid for this Stage */}
                    <div className="grid grid-cols-3 gap-3 pt-2">
                      {cur.metrics.map((m, mIdx) => (
                        <div key={mIdx} className="p-3 rounded-xl bg-muted/50 border border-border/60 space-y-1">
                          <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
                            {m.label}
                          </p>
                          <p className="text-base sm:text-lg font-black text-foreground tabular-nums">
                            {m.value}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-medium">
                            {m.detail}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Stage Navigation Action */}
                    <div className="flex items-center gap-3 pt-2">
                      <Button
                        size="sm"
                        onClick={() => setActiveStage((prev) => (prev + 1) % shiftStages.length)}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs h-9 px-4 rounded-xl gap-1.5 cursor-pointer shadow-sm"
                      >
                        <span>Advance to Phase 0{((activeStage + 1) % shiftStages.length) + 1}</span>
                        <ChevronRight className="size-3.5" />
                      </Button>
                      <Link href="/kiosk">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs font-bold h-9 px-4 rounded-xl border-border hover:bg-muted"
                        >
                          Launch Live Simulation
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Right Live Simulated Terminal Console */}
                  <div className="lg:col-span-6">
                    <div className="rounded-2xl bg-slate-950 text-slate-100 border border-slate-800 p-5 sm:p-6 shadow-2xl relative overflow-hidden font-mono space-y-4">
                      {/* Terminal Glow Line */}
                      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />

                      {/* Header bar inside terminal */}
                      <div className="flex items-center justify-between border-b border-slate-800/90 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="size-2.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-xs font-bold text-slate-300 tracking-wider">
                            {cur.terminalSim.title}
                          </span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${cur.terminalSim.statusColor}`}>
                          {cur.terminalSim.status}
                        </span>
                      </div>

                      {/* Terminal Content Body */}
                      <div className="space-y-2.5 text-xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 gap-1">
                          <span className="text-slate-400 font-sans text-[11px] font-medium">Entity / Actor:</span>
                          <span className="text-slate-100 font-bold">{cur.terminalSim.employee}</span>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 gap-1">
                          <span className="text-slate-400 font-sans text-[11px] font-medium">Operational Unit:</span>
                          <span className="text-emerald-400 font-semibold">{cur.terminalSim.department}</span>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 gap-1">
                          <span className="text-slate-400 font-sans text-[11px] font-medium">Meal / Package:</span>
                          <span className="text-slate-200 font-bold">{cur.terminalSim.mealType}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40">
                            <span className="text-[10px] text-emerald-400 uppercase tracking-wider block">Primary Allocation</span>
                            <span className="text-xs font-bold text-emerald-200 mt-0.5 block truncate">
                              {cur.terminalSim.subsidyDebit}
                            </span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Secondary Allocation</span>
                            <span className="text-xs font-bold text-slate-200 mt-0.5 block truncate">
                              {cur.terminalSim.payrollDebit}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Terminal Footer Bar */}
                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="size-3 text-emerald-500" />
                          <span>{cur.terminalSim.auditHash}</span>
                        </span>
                        <span className="tabular-nums font-mono">{cur.terminalSim.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </section>

        {/* ── Enterprise Financial Operations Section (No External Brand Mentions) ── */}
        <section id="operations" className="py-14 lg:py-16 container mx-auto px-4 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-secondary via-secondary/95 to-slate-900 text-secondary-foreground p-8 md:p-14 relative overflow-hidden shadow-2xl">
            {/* Background pattern */}
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                backgroundSize: "24px 24px",
              }}
            />

            <div className="grid lg:grid-cols-12 gap-10 items-center relative z-10">
              <div className="lg:col-span-7 space-y-6">
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px] font-black uppercase tracking-widest">
                  Integrated Financial Engine
                </Badge>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
                  Enterprise accounting. <br />
                  <span className="text-emerald-400">Zero duplicate entries.</span>
                </h2>
                <p className="text-white/70 text-sm sm:text-base leading-relaxed max-w-xl font-medium">
                  Every meal entitlement scan, supplier purchase order, and dry store goods receipt note is instantly posted to your General Ledger with automated three-way matching and immutable audit trails.
                </p>

                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  {[
                    { title: "Direct Payroll Deductions", desc: "Automated staff meal plan balance billing." },
                    { title: "Corporate Subsidies", desc: "Department-level meal quota allocations." },
                    { title: "Automated LPO & GRN", desc: "Real-time three-way inventory reconciliation." },
                    { title: "Immutable Audit Trails", desc: "Zero discrepancy per-shift transaction logging." },
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-white">{feat.title}</p>
                        <p className="text-[11px] text-white/60 font-medium">{feat.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 space-y-4">
                <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-400">Ledger Automation Engine</span>
                    <Badge className="bg-emerald-500 text-white border-none text-[10px] font-black uppercase">Live Active</Badge>
                  </div>

                  <div className="space-y-2 text-xs font-mono text-white/80">
                    <div className="flex justify-between p-2.5 rounded-lg bg-black/20">
                      <span>Core Reconciliation</span>
                      <span className="text-emerald-300 font-bold">100% Automated</span>
                    </div>
                    <div className="flex justify-between p-2.5 rounded-lg bg-black/20">
                      <span>Security & Encryption</span>
                      <span className="text-emerald-300">Enterprise Role RBAC</span>
                    </div>
                    <div className="flex justify-between p-2.5 rounded-lg bg-black/20">
                      <span>POS Sync Speed</span>
                      <span className="text-emerald-300">&lt; 35ms</span>
                    </div>
                  </div>

                  <Link href="/auth/login" className="block pt-2">
                    <Button className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl h-10 shadow-lg shadow-emerald-500/20">
                      Open Management Portal
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Ready to Start CTA Banner ────────────────────────────────────── */}
        <section className="py-16 container mx-auto px-4 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
              Ready to streamline corporate dining?
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground font-medium max-w-2xl mx-auto">
              Sign in with your institutional credentials to access your administrative dashboard, review inventory, or run the point of sale.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link href="/auth/login">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-black px-8 h-12 rounded-xl text-sm shadow-xl shadow-primary/25">
                  Sign In to Management Portal
                </Button>
              </Link>
              <Link href="/kiosk">
                <Button size="lg" variant="outline" className="border-border font-bold px-8 h-12 rounded-xl text-sm">
                  Launch Self-Service Kiosk
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-border/80 bg-card/60 backdrop-blur-md pt-14 pb-8">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12">
            <div className="md:col-span-5 space-y-4">
              <Logo href="/" iconSize="md" subtitle="Smart Dining OS" />
              <p className="text-xs text-muted-foreground font-medium max-w-sm leading-relaxed">
                Independent enterprise dining management and biometric cafeteria operating system powering premier corporate clients, including Crown Paints Kenya PLC.
              </p>
            </div>

            <div className="md:col-span-2 md:col-start-7 space-y-3">
              <p className="text-xs font-black uppercase tracking-widest text-foreground">Navigation</p>
              <ul className="space-y-2 text-xs font-semibold text-muted-foreground">
                <li><a href="#overview" className="hover:text-primary transition-colors">Overview</a></li>
                <li><a href="#pillars" className="hover:text-primary transition-colors">Capabilities</a></li>
                <li><a href="#shift-pipeline" className="hover:text-primary transition-colors">Shift Pipeline</a></li>
                <li><a href="#operations" className="hover:text-primary transition-colors">Operations</a></li>
              </ul>
            </div>

            <div className="md:col-span-2 space-y-3">
              <p className="text-xs font-black uppercase tracking-widest text-foreground">Modules</p>
              <ul className="space-y-2 text-xs font-semibold text-muted-foreground">
                <li><Link href="/overview" className="hover:text-primary transition-colors">Dashboard</Link></li>
                <li><Link href="/menu" className="hover:text-primary transition-colors">Meal Planning</Link></li>
                <li><Link href="/pos" className="hover:text-primary transition-colors">Manual POS</Link></li>
                <li><Link href="/billing" className="hover:text-primary transition-colors">Billing & Ledgers</Link></li>
              </ul>
            </div>

            <div className="md:col-span-2 space-y-3">
              <p className="text-xs font-black uppercase tracking-widest text-foreground">Terminals</p>
              <ul className="space-y-2 text-xs font-semibold text-muted-foreground">
                <li><Link href="/kiosk" className="hover:text-primary transition-colors flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Kiosk Terminal</Link></li>
                <li><Link href="/pos/snacks" className="hover:text-primary transition-colors">Snacks POS</Link></li>
                <li><Link href="/suppliers" className="hover:text-primary transition-colors">Supplier Portal</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/50 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] font-bold text-muted-foreground">
            <p>© {new Date().getFullYear()} Crown Canteen OS. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span>Engineered by ODUK TECH LIMITED</span>
              <span>•</span>
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <span>•</span>
              <a href="#" className="hover:text-primary transition-colors">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}