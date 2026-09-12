"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Loader2,
  Eye,
  EyeOff,
  AlertCircle,
  Laptop,
  CheckCircle2,
  Utensils,
  ArrowUpRight,
  Building2,
  Sparkles,
  Fingerprint,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/ui/logo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [roleTab, setRoleTab] = useState<"operator" | "client">("operator");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/method/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usr: email.trim(), pwd: password }),
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.verification) {
          if (data.tmp_id) {
            sessionStorage.setItem("mfa_tmp_id", data.tmp_id);
          }
          router.push("/auth/mfa/verify");
          return;
        }
        window.location.href = "/overview";
      } else {
        const data = await res.json().catch(() => ({}));
        let errMsg = data.message;
        if (!errMsg && data._server_messages) {
          try {
            const msgs = JSON.parse(data._server_messages);
            if (Array.isArray(msgs) && msgs.length > 0) {
              const parsed = typeof msgs[0] === "string" ? JSON.parse(msgs[0]) : msgs[0];
              errMsg = parsed.message || parsed;
            }
          } catch {}
        }
        setError(
          errMsg ||
            "Authentication failed. Please verify your credentials and try again."
        );
      }
    } catch {
      setError(
        "Network connection error. Please ensure you are connected to the corporate network."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:grid lg:grid-cols-12 bg-slate-50/70 text-slate-900 font-sans selection:bg-emerald-600 selection:text-white antialiased">
      {/* ── Left Side: Clean Porcelain / White Architectural Showcase (6 Cols) ── */}
      <div className="hidden lg:flex lg:col-span-6 relative flex-col justify-between p-10 xl:p-14 bg-white border-r border-slate-200 shadow-sm overflow-hidden">
        {/* Subtle geometric dot matrix */}
        <div
          className="absolute inset-0 opacity-[0.35] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #cbd5e1 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Ambient subtle light glows */}
        <div className="absolute -top-24 -left-24 size-[400px] bg-emerald-500/5 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 size-[400px] bg-teal-500/5 blur-3xl rounded-full pointer-events-none" />

        {/* Top Header: Logo + Version Tag */}
        <div className="relative z-10 flex items-center justify-between">
          <Logo href="/" iconSize="sm" subtitle="Canteen OS" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-mono font-bold tracking-wider uppercase">
            <span className="size-1.5 rounded-full bg-emerald-600 animate-pulse" />
            <span>v2.4 Enterprise</span>
          </div>
        </div>

        {/* Center: Showcase & Live Client Telemetry */}
        <div className="relative z-10 my-auto max-w-lg space-y-6 py-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[11px] font-bold">
              <Sparkles className="size-3 text-emerald-600" />
              <span>Independent Dining & Catering Operating System</span>
            </div>

            <h1 className="text-3xl xl:text-4xl font-black tracking-tight text-slate-900 leading-[1.15]">
              Modern Cafeteria OS & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700">
                Biometric Dining Control.
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-md">
              Powering rapid biometric entitlement checkouts, automated recipe batch yields, and three-way enterprise ledger reconciliation for corporate clients including Crown Paints Kenya PLC.
            </p>
          </div>

          {/* Clean White Live Client & Operations Card */}
          <div className="rounded-2xl bg-white border border-slate-200/90 p-5 space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-sm">
                  <Utensils className="size-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-none">Crown Canteen Core</p>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5 flex items-center gap-1">
                    <Building2 className="size-2.5 text-emerald-600" />
                    <span>Active Client: Crown Paints Kenya PLC (Main Factory)</span>
                  </p>
                </div>
              </div>
              <span className="text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Connected
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Tap Speed</p>
                <p className="text-sm font-black text-slate-900 mt-0.5">&lt; 1.8s</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Workforce</p>
                <p className="text-sm font-black text-emerald-700 mt-0.5">18,500+ Meals</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Ledger Sync</p>
                <p className="text-sm font-black text-slate-900 mt-0.5">100% Auto</p>
              </div>
            </div>
          </div>

          {/* Clean White Architectural Feature Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { title: "Biometric Touch-and-Go", sub: "RFID & optical scan validation" },
              { title: "Corporate Subsidies", sub: "Automated client quota billing" },
              { title: "General Ledger Sync", sub: "3-way inventory deduction" },
              { title: "Dry Store GRN Intake", sub: "Perishable inventory control" },
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 leading-tight">{f.title}</p>
                  <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{f.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Micro Footer */}
        <div className="relative z-10 pt-4 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} Crown Canteen OS</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-emerald-700 transition-colors flex items-center gap-1 font-semibold">
              <span>Public Portal</span>
              <ArrowUpRight className="size-3" />
            </Link>
            <Link href="/kiosk" className="hover:text-emerald-700 transition-colors flex items-center gap-1 font-semibold">
              <span>Kiosk Terminal</span>
              <ArrowUpRight className="size-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Right Side: Ultra-Modern Elevated Form Panel (6 Cols) ─────────── */}
      <div className="lg:col-span-6 flex flex-col justify-between p-6 sm:p-10 xl:p-14 relative overflow-y-auto">
        {/* Mobile Header (Shown on Small Screens) */}
        <div className="lg:hidden flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <Logo href="/" iconSize="sm" subtitle="Canteen OS" />
          <Link href="/kiosk">
            <Button size="sm" variant="outline" className="text-xs font-bold gap-1 rounded-xl h-8 px-3">
              <Laptop className="size-3.5 text-emerald-600" /> Kiosk Mode
            </Button>
          </Link>
        </div>

        {/* Elevated Ultra-Modern Form Card */}
        <div className="my-auto max-w-md w-full mx-auto space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-9 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.07)] space-y-6">
            {/* Top Workspace Role Selector Tabs */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/80 text-xs font-bold">
              <button
                type="button"
                onClick={() => setRoleTab("operator")}
                className={`flex-1 py-1.5 rounded-lg transition-all text-center cursor-pointer ${
                  roleTab === "operator"
                    ? "bg-white text-slate-900 shadow-xs font-black"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Canteen Operations
              </button>
              <button
                type="button"
                onClick={() => setRoleTab("client")}
                className={`flex-1 py-1.5 rounded-lg transition-all text-center cursor-pointer ${
                  roleTab === "client"
                    ? "bg-white text-slate-900 shadow-xs font-black"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Corporate Client HR
              </button>
            </div>

            {/* Header */}
            <div className="space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Sign In to Console
              </h2>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                {roleTab === "operator"
                  ? "Access kitchen yield rosters, manual POS consoles, inventory, and ledger reconciliation."
                  : "Review company meal subsidies, staff attendance rosters, and monthly department billing."}
              </p>
            </div>

            {/* ── Login Form ────────────────────────────────────────────── */}
            <form onSubmit={handleLogin} className="space-y-4 pt-1">
              {/* Error Notification */}
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2.5 animate-in fade-in duration-150">
                  <AlertCircle className="size-4 shrink-0 mt-0.5 text-rose-600" />
                  <span className="flex-1 leading-snug">{error}</span>
                </div>
              )}

              {/* Username / Email Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Username or Work Email</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {roleTab === "operator" ? "e.g. Administrator" : "e.g. hr@crownpaints.co.ke"}
                  </span>
                </label>
                <div className="relative group">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                    {roleTab === "operator" ? <Mail className="size-4" /> : <Building2 className="size-4" />}
                  </div>
                  <Input
                    type="text"
                    name="email"
                    autoComplete="username"
                    placeholder={
                      roleTab === "operator"
                        ? "admin@crowncanteen.co.ke or username"
                        : "corporate.hr@crownpaints.co.ke"
                    }
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11 pl-10 pr-3 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 text-xs font-semibold transition-all shadow-xs"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Password</label>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Please contact Canteen System IT Support to reset your institutional credentials.");
                    }}
                    className="text-[11px] font-bold text-emerald-700 hover:underline"
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="current-password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 pl-10 pr-10 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 text-xs font-semibold transition-all shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Security Status */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="size-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500/20 cursor-pointer accent-emerald-600"
                  />
                  <span>Remember this terminal</span>
                </label>
                <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
                  <ShieldCheck className="size-3 text-emerald-600" /> SSL 256-bit
                </span>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 mt-2 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white rounded-xl font-black text-xs sm:text-sm shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>AUTHENTICATING…</span>
                  </>
                ) : (
                  <>
                    <span>SIGN IN TO WORKSPACE</span>
                    <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Terminal Switcher Footnote */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
              <Link href="/kiosk" className="text-slate-600 hover:text-emerald-700 flex items-center gap-1.5 transition-colors">
                <Laptop className="size-4 text-emerald-600" />
                <span>Launch Touch Kiosk</span>
              </Link>
              <Link href="/" className="text-emerald-700 hover:underline">
                ← Public Portal
              </Link>
            </div>
          </div>

          {/* Clean Subtle Footer */}
          <p className="text-center text-[11px] text-slate-400 font-medium">
            Crown Canteen OS · Enterprise Multi-Tenant Dining Infrastructure
          </p>
        </div>

        {/* Outer Padding Spacer */}
        <div className="hidden lg:block h-2" />
      </div>
    </div>
  );
}