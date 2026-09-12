"use client";

import React, { useState } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { ShieldCheck, ArrowRight, Copy, Check, Lock, Laptop, KeyRound, CheckCircle2, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

export default function MFASetupPage() {
  const [copied, setCopied] = useState(false);
  const secretKey = "CRWN-8821-XKP9-77QA";
  const otpAuthUrl = `otpauth://totp/CrownCanteen:admin@crownpaints.co.ke?secret=${secretKey.replace(/-/g, "")}&issuer=CrownCanteen`;

  const handleCopy = () => {
    navigator.clipboard.writeText(secretKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:grid lg:grid-cols-12 bg-slate-50/50 text-slate-900 font-sans selection:bg-emerald-600 selection:text-white antialiased">
      {/* ── Left Side: Clean Architectural Context (7 Cols) ──────────────── */}
      <div className="hidden lg:flex lg:col-span-7 relative flex-col justify-between p-8 xl:p-12 bg-white border-r border-slate-200/80 shadow-[inset_-1px_0_0_rgba(0,0,0,0.02)] overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #e2e8f0 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }}
        />

        <div className="relative z-10">
          <Logo href="/" iconSize="sm" subtitle="Security Protocol" />
        </div>

        <div className="relative z-10 my-auto max-w-lg space-y-5 py-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
              <ShieldCheck className="size-3.5" />
              <span>Multi-Factor Authentication</span>
            </div>

            <h1 className="text-2xl xl:text-3xl font-black tracking-tight text-slate-900 leading-snug">
              Secure Account <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                Identity Pairing.
              </span>
            </h1>

            <p className="text-xs sm:text-[13px] text-slate-600 font-medium leading-relaxed">
              MFA ensures that only verified kitchen managers and finance officers can approve supply requisitions, petty cash, and meal billing adjustments.
            </p>
          </div>

          <div className="space-y-2.5 pt-1">
            {[
              { step: "01", title: "Open Authenticator App", desc: "Use Google Authenticator, Microsoft Authenticator, or Authy on your phone." },
              { step: "02", title: "Scan the Dynamic QR", desc: "Point your camera at the real-time generated QR code on the right panel." },
              { step: "03", title: "Verify 6-Digit Passcode", desc: "Enter your rotating 30-second security code to finalize device bonding." },
            ].map((s, idx) => (
              <div key={idx} className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="size-6 rounded-lg bg-emerald-600 text-white font-black text-[11px] flex items-center justify-center shrink-0">
                  {s.step}
                </span>
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-tight">{s.title}</p>
                  <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} Crown Paints Kenya PLC</p>
          <Link href="/auth/login" className="hover:text-emerald-700 transition-colors flex items-center gap-0.5">
            <span>Back to Login</span>
            <ArrowUpRight className="size-3" />
          </Link>
        </div>
      </div>

      {/* ── Right Side: Real QR Code Container & Action (5 Cols) ─────────── */}
      <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 xl:p-10 bg-slate-50/40 relative overflow-y-auto">
        <div className="lg:hidden flex items-center justify-between mb-6 pb-3 border-b border-slate-200">
          <Logo href="/" iconSize="sm" />
          <Link href="/auth/login">
            <Button size="sm" variant="ghost" className="text-xs font-bold h-7">
              Sign In
            </Button>
          </Link>
        </div>

        <div className="my-auto max-w-sm w-full mx-auto space-y-4 text-center">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100/70 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
              <KeyRound className="size-2.5" /> Step 1 of 2
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Scan QR Code
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Scan with your mobile authenticator to generate security tokens.
            </p>
          </div>

          {/* Real High-Resolution QR Card */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col items-center space-y-3.5">
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-inner flex items-center justify-center">
              <QRCodeSVG
                value={otpAuthUrl}
                size={170}
                level="H"
                includeMargin={false}
                className="size-40 sm:size-44"
              />
            </div>

            {/* Secret Key Box */}
            <div className="w-full space-y-1 text-left">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Manual Secret Key:
              </p>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono font-bold">
                <span className="text-slate-800">{secretKey}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCopy}
                  className="h-6 px-2 text-emerald-700 hover:bg-emerald-50 gap-1 text-[11px]"
                >
                  {copied ? <Check className="size-3 text-emerald-600" /> : <Copy className="size-3" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Action Link */}
          <Link href="/auth/mfa/verify" className="block">
            <Button className="w-full h-9 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-black text-xs shadow-sm flex items-center justify-center gap-1.5 cursor-pointer">
              <span>CONTINUE TO VERIFICATION</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </Link>
        </div>

        <div className="pt-4 border-t border-slate-200 text-center text-[11px] text-slate-500 font-medium">
          Having trouble? Contact Canteen IT Support.
        </div>
      </div>
    </div>
  );
}
