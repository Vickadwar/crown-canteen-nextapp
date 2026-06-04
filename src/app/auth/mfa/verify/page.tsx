"use client";

import React from "react";
import { ShieldCheck, ArrowRight, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function MFAVerifyPage() {
   const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
      if (e.target.value.length === 1) {
         const nextInput = document.getElementById(`mfa-input-${index + 1}`);
         if (nextInput) {
            (nextInput as HTMLInputElement).focus();
         }
      }
   };

   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
      if (e.key === 'Backspace' && !e.currentTarget.value) {
         const prevInput = document.getElementById(`mfa-input-${index - 1}`);
         if (prevInput) {
            (prevInput as HTMLInputElement).focus();
         }
      }
   };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 font-sans relative overflow-hidden selection:bg-primary selection:text-white">
      {/* Background Orbs for Deep Immersion */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] size-[400px] bg-primary/20 blur-[100px] rounded-full mix-blend-multiply opacity-50 animate-pulse" />
        <div className="absolute top-[40%] right-[-10%] size-[500px] bg-secondary/15 blur-[100px] rounded-full mix-blend-multiply opacity-40" />
        <div className="absolute bottom-[-20%] left-[20%] size-[600px] bg-accent/20 blur-[100px] rounded-full mix-blend-multiply opacity-30 animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="max-w-md w-full animate-in zoom-in duration-500 relative z-10">
         <div className="text-center mb-8">
            <div className="size-20 bg-background/50 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/20 shadow-xl">
               <ShieldCheck className="h-10 w-10 text-primary drop-shadow-md" />
            </div>
            <h1 className="text-4xl font-black text-secondary mb-2 tracking-tighter">Identity Check</h1>
            <p className="text-muted-foreground text-sm font-medium">Enter the 6-digit code from your authenticator.</p>
         </div>

         <div className="bg-background/60 backdrop-blur-xl border border-white/20 p-8 md:p-10 rounded-[2rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 size-48 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[60px] -z-10" />
            
            <form className="space-y-8 relative z-10">
               <div className="flex justify-between gap-2 md:gap-3">
                  {[1,2,3,4,5,6].map(i => (
                    <Input 
                       key={i}
                       id={`mfa-input-${i}`}
                       type="text"
                       maxLength={1}
                       className="w-full h-12 md:h-14 text-center text-2xl font-black rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm focus:bg-white/10 focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all text-foreground shadow-inner"
                       onChange={(e) => handleChange(e, i)}
                       onKeyDown={(e) => handleKeyDown(e, i)}
                    />
                  ))}
               </div>

               <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-black text-sm shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-3 group hover:-translate-y-0.5">
                  VERIFY ACCESS <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
               </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/10 text-center">
               <button className="text-[10px] font-black text-muted-foreground hover:text-primary uppercase tracking-widest transition-colors flex items-center justify-center mx-auto gap-2 group">
                  <Fingerprint className="h-4 w-4 group-hover:scale-110 transition-transform" /> Try Biometric Login
               </button>
            </div>
         </div>

         <p className="mt-8 text-center text-muted-foreground/50 text-[9px] font-black uppercase tracking-[0.3em]">
            Secure Session • Encrypted End-to-End
         </p>
      </div>
    </div>
  );
}
