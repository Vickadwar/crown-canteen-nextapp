import React from "react";
import Link from "next/link";
import { QrCode, ShieldCheck, ArrowRight, Copy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function MFASetupPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-hidden flex items-center justify-center p-4 selection:bg-primary selection:text-white">
      {/* Background Orbs for Deep Immersion */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] size-[400px] bg-primary/20 blur-[100px] rounded-full mix-blend-multiply opacity-50 animate-pulse" />
        <div className="absolute top-[40%] right-[-10%] size-[500px] bg-secondary/15 blur-[100px] rounded-full mix-blend-multiply opacity-40" />
        <div className="absolute bottom-[-20%] left-[20%] size-[600px] bg-accent/20 blur-[100px] rounded-full mix-blend-multiply opacity-30 animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="w-full max-w-5xl relative z-10 grid lg:grid-cols-2 gap-4 lg:gap-8 animate-in fade-in zoom-in-95 duration-700">
         {/* --- Left Side: Info Panel --- */}
         <div className="flex flex-col justify-between h-full bg-background/50 backdrop-blur-xl border border-white/20 p-8 md:p-10 rounded-[2rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute -top-32 -left-32 size-64 bg-accent/20 blur-[60px] rounded-full" />
            
            <div className="relative z-10">
               <Badge className="bg-primary/20 text-primary border border-primary/30 mb-6 px-3 py-1 font-black uppercase tracking-widest text-[10px]">Security Protocol</Badge>
               <h1 className="text-4xl lg:text-5xl font-black text-secondary mb-4 tracking-tighter leading-none">
                  Setup <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent drop-shadow-sm">Multi-Factor.</span>
               </h1>
               <p className="text-muted-foreground text-sm font-medium leading-relaxed mb-8 max-w-sm">
                  To protect the CrownCanteen ecosystem, we require MFA for all administrative and institutional accounts.
               </p>
               
               <div className="space-y-4">
                  {[
                    { step: "01", text: "Download an authenticator app (e.g., Google Authenticator, Authy)." },
                    { step: "02", text: "Scan the securely generated QR code on the right." },
                    { step: "03", text: "Enter the verification code to finalize your setup." }
                  ].map((s, i) => (
                    <div key={i} className="flex gap-4 items-center p-3 bg-white/5 rounded-xl border border-white/10">
                       <span className="text-primary font-black text-xl tracking-tighter bg-primary/10 size-8 flex items-center justify-center rounded-lg">{s.step}</span>
                       <span className="text-muted-foreground font-medium text-sm leading-tight">{s.text}</span>
                    </div>
                  ))}
               </div>
            </div>
            
            <div className="relative z-10 text-[10px] font-black uppercase text-muted-foreground tracking-widest mt-10 flex items-center gap-2">
               <ShieldCheck size={14} className="text-primary" /> End-to-End Encrypted
            </div>
         </div>

         {/* --- Right Side: QR Code Card --- */}
         <div className="flex flex-col h-full">
            <div className="bg-background/60 backdrop-blur-xl border border-white/20 p-8 md:p-10 rounded-[2rem] shadow-2xl relative overflow-hidden text-center flex flex-col items-center flex-1 justify-center">
               <div className="absolute top-0 right-0 size-64 bg-primary/10 blur-[80px] rounded-full -z-10" />
               
               <div className="aspect-square w-full max-w-[240px] bg-white rounded-3xl mb-8 flex items-center justify-center p-6 relative group overflow-hidden shadow-inner border-4 border-white/5">
                  <QrCode className="w-full h-full text-secondary opacity-90 group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
               </div>
               
               <div className="w-full mb-8 text-left">
                  <p className="text-[11px] font-black text-secondary/60 mb-2 ml-1">Manual Secret Key</p>
                  <div className="h-12 bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 flex items-center justify-between px-4 shadow-inner">
                     <code className="font-black text-foreground tracking-widest text-sm">XJ42-9KLS-PR71</code>
                     <Button variant="ghost" size="icon" className="text-primary hover:bg-white/10 h-8 w-8 rounded-lg">
                        <Copy className="h-4 w-4" />
                     </Button>
                  </div>
               </div>

               <Link href="/auth/mfa/verify" className="w-full">
                  <Button className="w-full h-12 bg-secondary hover:bg-secondary/90 text-primary-foreground rounded-xl font-black text-sm shadow-lg shadow-secondary/20 transition-all flex items-center justify-center gap-3 group hover:-translate-y-0.5">
                     CONTINUE <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
               </Link>
            </div>
         </div>
      </div>
    </div>
  );
}
