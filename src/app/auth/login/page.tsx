"use client";

import React from "react";
import Link from "next/link";
import { Lock, Mail, ArrowRight, ShieldCheck, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-hidden flex items-center justify-center p-4 selection:bg-primary selection:text-white">
      {/* Background Orbs for Deep Immersion - Matches Landing Page */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] size-[400px] bg-primary/20 blur-[100px] rounded-full mix-blend-multiply opacity-50 animate-pulse" />
        <div className="absolute top-[40%] right-[-10%] size-[500px] bg-secondary/15 blur-[100px] rounded-full mix-blend-multiply opacity-40" />
        <div className="absolute bottom-[-20%] left-[20%] size-[600px] bg-accent/20 blur-[100px] rounded-full mix-blend-multiply opacity-30 animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="w-full max-w-5xl relative z-10 grid lg:grid-cols-2 gap-4 lg:gap-8 animate-in fade-in zoom-in-95 duration-700">
         {/* --- Left Side: Glassmorphic Branding Panel --- */}
         <div className="hidden lg:flex flex-col justify-between bg-background/50 backdrop-blur-xl border border-white/20 p-10 rounded-[2rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute -top-32 -left-32 size-64 bg-primary/20 blur-[60px] rounded-full" />
            
            <div className="relative z-10">
               <Link href="/" className="flex items-center gap-2 mb-12">
                  <div className="size-8 bg-gradient-to-tr from-primary to-primary/60 rounded-lg flex items-center justify-center text-primary-foreground font-black shadow-md shadow-primary/30">
                     C
                  </div>
                  <span className="font-black text-xl tracking-tighter text-secondary">Crown<span className="opacity-70">Canteen</span></span>
               </Link>
               
               <h1 className="text-4xl lg:text-5xl font-black text-secondary mb-4 tracking-tighter leading-none">
                  SmartCanteen <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent drop-shadow-sm">Ecosystem.</span>
               </h1>
               <p className="text-muted-foreground text-sm font-medium leading-relaxed mb-10 max-w-sm">
                  Centralized portal for Employees, Suppliers, and Administrators. Powered by biometric-secure, multi-tenant architecture.
               </p>
               
               <div className="space-y-4">
                  {[
                    { title: "Secure MFA", desc: "Multi-factor authentication for sensitive operations.", icon: <ShieldCheck className="h-5 w-5 text-primary" /> },
                    { title: "Real-time Audits", desc: "Every transaction and check-in is strictly logged.", icon: <Fingerprint className="h-5 w-5 text-accent" /> }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 items-start p-4 bg-white/5 rounded-2xl border border-white/10 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                       <div className="h-10 w-10 bg-background/80 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner">
                          {item.icon}
                       </div>
                       <div>
                          <h4 className="text-secondary font-black text-sm mb-0.5">{item.title}</h4>
                          <p className="text-muted-foreground font-medium text-xs leading-tight">{item.desc}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
            
            <div className="relative z-10 text-[10px] font-black uppercase text-muted-foreground tracking-widest mt-12 border-t border-border/50 pt-6">
               Developed by ODUK TECH LIMITED
            </div>
         </div>

         {/* --- Right Side: Compact Glass Login Form --- */}
         <div className="flex flex-col justify-center">
            <div className="bg-background/60 backdrop-blur-xl border border-white/20 p-8 md:p-10 rounded-[2rem] shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 size-64 bg-accent/10 blur-[80px] rounded-full -z-10" />
               
               <div className="mb-8 text-center lg:text-left">
                  <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
                     <div className="size-8 bg-gradient-to-tr from-primary to-primary/60 rounded-lg flex items-center justify-center text-primary-foreground font-black shadow-md shadow-primary/30">
                        C
                     </div>
                     <span className="font-black text-xl tracking-tighter text-secondary">Crown<span className="opacity-70">Canteen</span></span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-secondary tracking-tighter mb-2">Welcome Back</h2>
                  <p className="text-muted-foreground text-sm font-medium">Please sign in to your institutional account.</p>
               </div>

               <form className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-[11px] font-black text-secondary/60 ml-1">Email Address</label>
                     <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input 
                           type="email" 
                           placeholder="name@company.com" 
                           className="h-12 pl-12 rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm focus:bg-white/10 focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all text-sm font-bold text-foreground placeholder:text-muted-foreground/50 shadow-inner"
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <div className="flex justify-between items-center px-1">
                        <label className="text-[11px] font-black text-secondary/60">Password</label>
                        <Link href="#" className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline">Forgot?</Link>
                     </div>
                     <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input 
                           type="password" 
                           placeholder="••••••••" 
                           className="h-12 pl-12 rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm focus:bg-white/10 focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all text-sm font-bold text-foreground placeholder:text-muted-foreground/50 shadow-inner"
                        />
                     </div>
                  </div>

                  <Button className="w-full h-12 mt-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-black text-sm shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-3 group hover:-translate-y-0.5">
                     SIGN IN <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
               </form>

               <div className="mt-8 pt-6 border-t border-white/10 flex flex-col items-center gap-4">
                  <p className="text-muted-foreground font-bold text-[11px]">Need institutional access?</p>
                  <Button variant="outline" className="w-full h-10 rounded-xl border border-white/20 bg-transparent font-black text-secondary hover:bg-white/5 transition-all text-xs">
                     CONTACT ADMINISTRATOR
                  </Button>
               </div>

               <div className="mt-8 flex justify-center gap-6 text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                  <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
                  <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
                  <Link href="#" className="hover:text-primary transition-colors">Security</Link>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
