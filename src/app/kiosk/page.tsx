"use client";

import React, { useState, useEffect } from "react";
import { 
  Camera, 
  CheckCircle2, 
  ShieldCheck, 
  UserCheck, 
  Clock, 
  MapPin,
  RefreshCw,
  Users,
  Utensils,
  ChevronRight,
  ArrowLeft,
  Briefcase,
  Building2,
  AlertCircle,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type KioskStep = "idle" | "meal_selection" | "visitor_check" | "visitor_details" | "scanning" | "success";

export default function KioskPage() {
  const [step, setStep] = useState<KioskStep>("idle");
  const [mealType, setMealType] = useState<"Normal" | "Special">("Normal");
  const [hasVisitor, setHasVisitor] = useState(false);
  const [visitorType, setVisitorType] = useState<"Self" | "Company">("Self");
  const [visitorCompany, setVisitorCompany] = useState("");
  const [visitorDept, setVisitorDept] = useState("");
  const [lastScanned, setLastScanned] = useState<{name: string, time: string, branch: string, meal: string, visitor?: string} | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (step === "scanning") {
       const timer = setTimeout(handleScan, 3000);
       return () => clearTimeout(timer);
    }
  }, [step]);

  const companies = ["Crown Paints", "Forza Consultants", "Other Partner"];
  const departments = ["Production", "Logistics", "HR", "Sales", "Finance"];

  const resetKiosk = () => {
    setStep("idle");
    setMealType("Normal");
    setHasVisitor(false);
    setVisitorType("Self");
    setVisitorCompany("");
    setVisitorDept("");
  };

  const handleStart = () => setStep("meal_selection");
  
  const handleMealSelection = (type: "Normal" | "Special") => {
    setMealType(type);
    setStep("visitor_check");
  };

  const handleVisitorCheck = (answer: boolean) => {
    if (answer) {
      setHasVisitor(true);
      setStep("visitor_details");
    } else {
      setHasVisitor(false);
      setStep("scanning");
    }
  };

  const handleScan = () => {
    setStep("scanning");
    setTimeout(() => {
      setStep("success");
      setLastScanned({
        name: "Samuel Mandela",
        time: new Date().toLocaleTimeString(),
        branch: "Nairobi HQ",
        meal: mealType,
        visitor: hasVisitor ? `${visitorType} (${visitorCompany || "N/A"})` : undefined
      });
      setTimeout(resetKiosk, 4000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-secondary flex flex-col items-center justify-center p-6 font-sans overflow-hidden">
      {/* --- Kiosk Header --- */}
      <div className="absolute top-0 w-full p-8 flex justify-between items-center bg-black/20 backdrop-blur-md z-50">
        <div className="flex items-center gap-4">
          <img src="/logo.svg" alt="CrownCanteen" className="h-10 w-auto brightness-0 invert" />
          <div className="h-8 w-px bg-white/20" />
          <div className="text-white">
            <p className="text-xs font-black uppercase tracking-widest text-primary">Biometric Terminal</p>
            <p className="text-lg font-bold">Nairobi HQ Plant</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
            <div className="text-right text-white min-w-[120px]">
              {mounted ? (
                <>
                  <p className="text-2xl font-black">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  <p className="text-xs font-bold opacity-60 uppercase">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                </>
              ) : (
                <div className="h-12 w-full animate-pulse bg-white/5 rounded-lg" />
              )}
            </div>
            <div className="bg-primary/20 p-3 rounded-2xl border border-primary/20">
               <Clock className="h-6 w-6 text-primary" />
            </div>
        </div>
      </div>

      {/* --- Progress Indicator --- */}
      {step !== "idle" && step !== "success" && (
         <div className="absolute top-28 flex gap-2 z-40">
            {["meal_selection", "visitor_check", "visitor_details", "scanning"].map((s, i) => (
               <div key={i} className={`h-1.5 w-16 rounded-full transition-all duration-500 ${step === s ? "bg-primary w-24" : "bg-white/20"}`} />
            ))}
         </div>
      )}

      {/* --- Main Content Area --- */}
      <div className="relative w-full max-w-5xl flex flex-col items-center">
        
        {step === "idle" && (
          <div className="text-center animate-in zoom-in duration-700">
             <div className="w-48 h-48 bg-white/5 rounded-[60px] flex items-center justify-center mx-auto mb-12 border-4 border-dashed border-white/20">
                <Camera className="h-20 w-20 text-white/20" />
             </div>
             <h1 className="text-7xl font-black text-white mb-8 tracking-tighter">Ready for lunch?</h1>
             <Button 
                onClick={handleStart}
                className="h-24 px-16 bg-primary text-white hover:bg-white hover:text-primary rounded-full font-black text-4xl shadow-2xl transition-all hover:scale-105 active:scale-95"
             >
                TAP TO START
             </Button>
          </div>
        )}

        {step === "meal_selection" && (
          <div className="w-full text-center animate-in slide-in-from-right duration-500">
             <h2 className="text-5xl font-black text-white mb-12 tracking-tight">Select Your Meal Type</h2>
             <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
                <button 
                  onClick={() => handleMealSelection("Normal")}
                  className="group bg-white/5 p-12 rounded-[60px] border-4 border-white/10 hover:border-primary hover:bg-primary transition-all text-left"
                >
                   <Utensils className="h-16 w-16 text-primary group-hover:text-white mb-8" />
                   <h3 className="text-4xl font-black text-white mb-4">Normal Lunch</h3>
                   <p className="text-white/40 group-hover:text-white/80 font-bold">Standard daily menu covered by subsidy.</p>
                </button>
                <button 
                   onClick={() => handleMealSelection("Special")}
                   className="group bg-white/5 p-12 rounded-[60px] border-4 border-white/10 hover:border-accent hover:bg-accent transition-all text-left"
                >
                   <Sparkles className="h-16 w-16 text-accent group-hover:text-white mb-8" />
                   <h3 className="text-4xl font-black text-white mb-4">Special Lunch</h3>
                   <p className="text-white/40 group-hover:text-white/80 font-bold">Chef's special or guest menu options.</p>
                </button>
             </div>
          </div>
        )}

        {step === "visitor_check" && (
          <div className="w-full text-center animate-in slide-in-from-right duration-500">
             <h2 className="text-5xl font-black text-white mb-12 tracking-tight">Are you with a Visitor?</h2>
             <div className="flex gap-8 justify-center">
                <button 
                  onClick={() => handleVisitorCheck(false)}
                  className="h-32 px-16 bg-white/5 border-4 border-white/10 rounded-[40px] text-3xl font-black text-white hover:bg-primary hover:border-primary transition-all"
                >
                   Just Me
                </button>
                <button 
                  onClick={() => handleVisitorCheck(true)}
                  className="h-32 px-16 bg-white/5 border-4 border-white/10 rounded-[40px] text-3xl font-black text-white hover:bg-accent hover:border-accent transition-all flex items-center gap-4"
                >
                   <Users className="h-8 w-8" /> I Have a Visitor
                </button>
             </div>
             <Button variant="ghost" onClick={() => setStep("meal_selection")} className="mt-12 text-white/40 hover:text-white font-bold uppercase gap-2">
                <ArrowLeft className="h-4 w-4" /> Back to Meals
             </Button>
          </div>
        )}

        {step === "visitor_details" && (
          <div className="w-full max-w-4xl text-center animate-in slide-in-from-right duration-500">
             <h2 className="text-5xl font-black text-white mb-12 tracking-tight">Visitor Details</h2>
             <div className="bg-white/5 p-12 rounded-[60px] border-4 border-white/10 text-left space-y-10">
                <div>
                   <label className="text-white/40 font-black uppercase text-xs tracking-widest block mb-4">Billing Category</label>
                   <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => setVisitorType("Self")}
                        className={`h-14 rounded-2xl border-2 font-black text-lg transition-all ${visitorType === "Self" ? "bg-primary border-primary text-white" : "border-white/10 text-white/40"}`}
                      >
                         Self (On Employee)
                      </button>
                      <button 
                         onClick={() => setVisitorType("Company")}
                         className={`h-14 rounded-2xl border-2 font-black text-lg transition-all ${visitorType === "Company" ? "bg-accent border-accent text-white" : "border-white/10 text-white/40"}`}
                      >
                         Company / HR
                      </button>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                   <div>
                      <label className="text-white/40 font-black uppercase text-[10px] tracking-widest block mb-4">Visitor Company</label>
                      <select 
                        className="w-full h-14 bg-white/5 border-2 border-white/10 rounded-2xl px-6 text-white font-black text-lg appearance-none"
                        onChange={(e) => setVisitorCompany(e.target.value)}
                      >
                         <option value="">Select Company</option>
                         {companies.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                   </div>
                   <div>
                      <label className="text-white/40 font-black uppercase text-[10px] tracking-widest block mb-4">Department</label>
                      <select 
                        className="w-full h-14 bg-white/5 border-2 border-white/10 rounded-2xl px-6 text-white font-black text-lg appearance-none"
                        onChange={(e) => setVisitorDept(e.target.value)}
                      >
                         <option value="">Select Dept</option>
                         {departments.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                   </div>
                </div>

                 <Button 
                    onClick={() => setStep("scanning")}
                    className="w-full h-16 bg-white text-secondary rounded-2xl font-black text-2xl hover:bg-primary hover:text-white transition-all"
                 >
                    CONTINUE TO SCAN
                 </Button>
             </div>
          </div>
        )}

        {step === "scanning" && (
          <div className="relative w-full aspect-video md:aspect-[16/9] bg-black rounded-[60px] border-[12px] border-white/10 overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-slate-900">
               {/* Scanning Line Animation */}
               <div className="absolute top-0 left-0 w-full h-1 bg-primary shadow-[0_0_20px_rgba(227,30,36,0.8)] animate-scan-line" />
               {/* Face Frame */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-80 border-2 border-primary rounded-[40px] flex flex-col items-center justify-center">
                  <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
                  <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />
                  <RefreshCw className="h-12 w-12 text-primary animate-spin mb-4" />
                  <p className="text-primary font-black uppercase text-xs tracking-widest">Identifying...</p>
               </div>
            </div>
            
            {/* Context Badge */}
            <div className="absolute top-10 left-10 flex gap-4">
               <Badge className="bg-black/60 backdrop-blur-md text-white border-none py-2 px-4 rounded-full font-bold">
                  {mealType} Lunch
               </Badge>
               {hasVisitor && (
                 <Badge className="bg-accent/80 backdrop-blur-md text-white border-none py-2 px-4 rounded-full font-bold">
                    + Visitor ({visitorType})
                 </Badge>
               )}
            </div>

            {/* Auto-trigger simulation is now handled at top level */}
          </div>
        )}

        {step === "success" && lastScanned && (
          <div className="w-full text-center animate-in zoom-in duration-500">
             <div className="w-40 h-40 bg-primary rounded-full flex items-center justify-center mx-auto mb-10 shadow-[0_0_50px_rgba(227,30,36,0.5)]">
                <CheckCircle2 className="h-24 w-24 text-white" />
             </div>
             <h2 className="text-7xl font-black text-white mb-4 tracking-tighter">Verified!</h2>
             <p className="text-white/60 text-2xl font-bold uppercase tracking-widest mb-12">Enjoy your meal, {lastScanned.name.split(' ')[0]}</p>
             
             <Card className="bg-white/5 border-2 border-white/10 p-10 rounded-[50px] max-w-2xl mx-auto flex items-center gap-10 text-left">
                <div className="h-32 w-32 rounded-[35px] bg-white overflow-hidden flex-shrink-0 border-4 border-primary/20">
                   <img src="https://i.pravatar.cc/150?u=samuel" alt="Employee" className="w-full h-full object-cover" />
                </div>
                <div>
                   <h4 className="text-3xl font-black text-white mb-2">{lastScanned.name}</h4>
                   <div className="grid grid-cols-2 gap-6 mt-4">
                      <div>
                         <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Location</p>
                         <p className="text-white font-bold">{lastScanned.branch}</p>
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Meal Plan</p>
                         <p className="text-primary font-black uppercase text-sm">{lastScanned.meal} Lunch</p>
                      </div>
                      {hasVisitor && (
                         <div className="col-span-2">
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Visitor Logged</p>
                            <p className="text-accent font-black">{lastScanned.visitor}</p>
                         </div>
                      )}
                   </div>
                </div>
             </Card>
             <p className="mt-12 text-white/20 font-black uppercase text-sm tracking-[0.4em]">System Resetting in 4s...</p>
          </div>
        )}

      </div>

      {/* --- Side Stats --- */}
      <div className="absolute left-10 bottom-10 hidden xl:block">
         <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[40px] border border-white/10 w-72">
               <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-4">Meal Stats</p>
               <div className="space-y-4">
                  <div className="flex justify-between items-center">
                     <span className="text-white/60 font-bold text-xs uppercase">Normal</span>
                     <span className="text-white font-black">742</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-white/60 font-bold text-xs uppercase">Special</span>
                     <span className="text-white font-black text-primary">82</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-white/60 font-bold text-xs uppercase">Visitors</span>
                     <span className="text-white font-black text-accent">18</span>
                  </div>
               </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl p-6 rounded-[30px] border border-white/10 w-72">
               <div className="flex items-center gap-3">
                  <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse" />
                  <p className="text-white font-black uppercase text-xs tracking-widest">Core Engine Online</p>
               </div>
            </div>
         </div>
      </div>

      {/* --- Emergency/Admin --- */}
      <div className="absolute right-10 bottom-10">
         <Button variant="ghost" className="h-16 w-16 rounded-full bg-white/5 text-white/20 hover:bg-red-500 hover:text-white transition-all">
            <AlertCircle className="h-8 w-8" />
         </Button>
      </div>
    </div>
  );
}
