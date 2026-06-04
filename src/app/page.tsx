"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
   ArrowRight, Sparkles, Heart, Globe, Zap,
   TrendingUp, ShieldCheck, ChevronRight,
   UtensilsCrossed, Settings, Activity, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
   const [scrolled, setScrolled] = useState(false);

   useEffect(() => {
      const handleScroll = () => setScrolled(window.scrollY > 30);
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
   }, []);

   const clients = [
      { name: "Crown Paints Kenya PLC" },
      { name: "Forza Consultants" }
   ];

   const services = [
      { title: "Special Meals", desc: "Executive meeting & VIP catering.", icon: <Sparkles className="text-primary" /> },
      { title: "Vegetarian", desc: "Daily plant-based delights.", icon: <Heart className="text-accent" /> },
      { title: "Outdoor Events", desc: "Company retreats & field days.", icon: <Globe className="text-primary" /> },
      { title: "Training Sessions", desc: "Energy-boosting snacks.", icon: <Zap className="text-secondary" /> }
   ];

   const menuItems = [
      {
         name: "Ugali & Beef Stew",
         desc: "Slow-cooked beef stew and steamed cabbage.",
         tag: "Popular",
         img: "/images/ugali_beef.png",
         cal: "650 kcal",
         accent: "group-hover:border-primary"
      },
      {
         name: "Fish & Matoke",
         desc: "Fried Tilapia with steamed green bananas.",
         tag: "Chef's Choice",
         img: "/images/fish_matoke.png",
         cal: "580 kcal",
         accent: "group-hover:border-accent"
      },
      {
         name: "Rice & Fried Chicken",
         desc: "Basmati rice with crispy golden chicken.",
         tag: "Classic",
         img: "/images/rice_chicken.png",
         cal: "720 kcal",
         accent: "group-hover:border-primary"
      },
      {
         name: "Pilau & Kachumbari",
         desc: "Spiced rice with fresh tomato salsa.",
         tag: "Weekend Special",
         img: "/images/rice_chicken.png", // reusing image placeholder
         cal: "600 kcal",
         accent: "group-hover:border-accent"
      }
   ];

   return (
      <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden selection:bg-primary selection:text-white text-sm md:text-base">
         
         {/* Background Orbs for Deep Immersion - Scaled down for compactness */}
         <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] size-[400px] bg-primary/20 blur-[100px] rounded-full mix-blend-multiply opacity-50 animate-pulse" />
            <div className="absolute top-[40%] right-[-10%] size-[500px] bg-secondary/15 blur-[100px] rounded-full mix-blend-multiply opacity-40" />
            <div className="absolute bottom-[-20%] left-[20%] size-[600px] bg-accent/20 blur-[100px] rounded-full mix-blend-multiply opacity-30 animate-pulse" style={{ animationDelay: "2s" }} />
         </div>

         {/* --- Floating Glassmorphic Navigation --- */}
         <div className="fixed top-4 inset-x-0 z-50 flex justify-center px-4">
            <nav className={`transition-all duration-300 rounded-[1.5rem] border border-white/10 ${scrolled ? 'bg-background/80 backdrop-blur-xl shadow-xl shadow-black/10 py-2 px-4 w-full max-w-4xl' : 'bg-transparent py-3 px-2 w-full max-w-6xl'}`}>
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                     <Link href="/" className="flex items-center gap-2 group">
                        <div className="size-8 bg-gradient-to-tr from-primary to-primary/60 rounded-xl flex items-center justify-center text-primary-foreground font-black shadow-md shadow-primary/30 group-hover:scale-105 transition-transform">
                           C
                        </div>
                        <span className="font-black text-xl tracking-tighter text-secondary group-hover:text-primary transition-colors">Crown<span className="opacity-70">Canteen</span></span>
                     </Link>
                     <div className="hidden md:flex items-center gap-1 bg-muted/50 p-1 rounded-full border border-border/50">
                        <Link href="#services" className="px-4 py-1.5 rounded-full text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-background/80 transition-all">Services</Link>
                        <Link href="#menu" className="px-4 py-1.5 rounded-full text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-background/80 transition-all">Menu</Link>
                        <Link href="#ecosystem" className="px-4 py-1.5 rounded-full text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-background/80 transition-all">Ecosystem</Link>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <Link href="/auth/login" className="hidden sm:block">
                        <Button variant="ghost" className="text-xs font-bold hover:bg-secondary/10 rounded-full px-4 h-8">Portal Login</Button>
                     </Link>
                     <Link href="/kiosk">
                        <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full font-black px-4 h-8 text-xs shadow-lg shadow-secondary/20 hover:-translate-y-0.5 transition-all">
                           Kiosk Mode
                        </Button>
                     </Link>
                  </div>
               </div>
            </nav>
         </div>

         <main className="relative z-10">
            {/* --- Hero: Ultra-Modern Full Width --- */}
            <section className="relative min-h-[85vh] flex flex-col justify-center pt-24 pb-12 container mx-auto px-4 lg:px-8">
               <div className="grid lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-6">
                     <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-background/40 backdrop-blur-md border border-accent/30 rounded-full shadow-sm">
                        <span className="relative flex size-2.5">
                           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                           <span className="relative inline-flex rounded-full size-2.5 bg-accent"></span>
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Next-Gen Dining OS</span>
                     </div>
                     <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-secondary leading-[0.9] tracking-tighter">
                        Elevate <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent drop-shadow-sm">
                           Corporate
                        </span> <br />
                        Dining.
                     </h1>
                     <p className="text-base text-muted-foreground font-medium max-w-md leading-relaxed">
                        Biometric-powered, data-driven, and deliciously reliable. The unified platform that bridges factory floor operations and executive boardrooms.
                     </p>
                     <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 h-12 font-black text-base shadow-xl shadow-primary/30 group hover:-translate-y-0.5 transition-all duration-300">
                           Onboard Today <ArrowRight className="ml-2 size-5 group-hover:translate-x-1.5 transition-transform" />
                        </Button>
                        <div className="flex items-center gap-3 px-5 py-2 rounded-full bg-background/50 backdrop-blur-md border border-border shrink-0">
                           <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground border-r border-border pr-3">Trusted By</p>
                           <div className="flex flex-col gap-1">
                              {clients.map(c => <span key={c.name} className="font-bold text-secondary text-xs leading-none">{c.name}</span>)}
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="lg:col-span-5 relative perspective-1000 mt-8 lg:mt-0">
                     {/* 3D Floating Hero Card */}
                     <div className="relative z-10 bg-background/60 backdrop-blur-xl border border-white/20 p-5 rounded-[2rem] shadow-xl transform rotate-y-[-5deg] rotate-x-[2deg] hover:rotate-0 transition-transform duration-700">
                        <div className="absolute -top-4 -right-4 bg-accent text-accent-foreground size-16 rounded-full flex items-center justify-center font-black text-lg shadow-lg shadow-accent/40 z-20 animate-bounce-slow">
                           99%
                        </div>
                        <div className="aspect-[4/3] rounded-[1.5rem] overflow-hidden relative">
                           <img src="/images/hero_employees.png" alt="Happy Workers" className="object-cover w-full h-full scale-105" />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                           <div className="absolute bottom-0 left-0 right-0 p-5">
                              <p className="text-white/80 font-bold uppercase tracking-wider text-[10px] mb-1">Live Efficiency</p>
                              <p className="text-white font-black text-2xl tracking-tighter mb-3">+12% Output</p>
                              <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                                 <div className="bg-primary h-full w-[88%] rounded-full relative">
                                    <div className="absolute inset-0 bg-white/30 animate-pulse" />
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                     {/* Decorative background cards */}
                     <div className="absolute top-6 -right-6 w-full h-full bg-secondary/10 rounded-[2rem] -z-10 blur-xl" />
                     <div className="absolute -bottom-6 -left-6 w-full h-full bg-primary/10 rounded-[2rem] -z-20 blur-xl" />
                  </div>
               </div>
            </section>

            {/* --- Services: Dynamic Glass Bento --- */}
            <section id="services" className="py-20 relative">
               <div className="container mx-auto px-4 lg:px-8">
                  <div className="flex flex-col items-center text-center mb-12">
                     <Badge className="bg-accent/10 text-accent border-accent/20 mb-4 font-bold px-3 py-1 rounded-full text-[10px] tracking-widest uppercase">Versatility</Badge>
                     <h2 className="text-4xl md:text-5xl font-black text-secondary tracking-tighter mb-4">Catering to every <br/><span className="text-primary">workforce need.</span></h2>
                  </div>
                  
                  {/* COMPACT CREATIVE LAYOUT - Equal width grid avoiding white space */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
                     {services.map((s, i) => (
                        <div
                           key={i}
                           className="group relative p-6 rounded-[1.5rem] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-background/50 backdrop-blur-lg border border-white/20 hover:border-primary/30 flex flex-col"
                        >
                           <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                           <div className="relative z-10 flex flex-col h-full gap-6">
                              <div className="size-12 rounded-xl bg-background shadow-inner flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shrink-0">
                                 {React.cloneElement(s.icon as React.ReactElement<any>, { size: 20 })}
                              </div>
                              <div className="flex-1">
                                 <h4 className="text-xl font-black mb-2 tracking-tight text-secondary group-hover:text-primary transition-colors">{s.title}</h4>
                                 <p className="text-sm font-medium text-muted-foreground leading-relaxed">{s.desc}</p>
                              </div>
                           </div>
                           <div className="absolute right-[-20%] bottom-[-20%] size-32 bg-primary/5 rounded-full blur-[30px] group-hover:bg-primary/10 transition-colors" />
                        </div>
                     ))}
                  </div>
               </div>
            </section>

            {/* --- Menu: Interactive Showcase (FULL SCREEN WIDTH) --- */}
            <section id="menu" className="py-20 bg-secondary text-secondary-foreground relative overflow-hidden">
               {/* Background pattern */}
               <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
               
               <div className="container mx-auto px-4 lg:px-8 relative z-10 mb-12">
                  <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                     <div className="space-y-3">
                        <Badge className="bg-primary text-primary-foreground border-none font-bold tracking-widest uppercase px-3 py-1 text-[10px]">Culinary Excellence</Badge>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight">The Weekly <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Selection.</span></h2>
                     </div>
                     <Button variant="outline" className="border-white/20 text-foreground bg-white/5 hover:bg-white/10 rounded-full h-10 px-6 font-black text-sm gap-2 backdrop-blur-md">
                        Explore Menu <ChevronRight size={16} />
                     </Button>
                  </div>
               </div>

               {/* Full Screen Bleed Wrapper */}
               <div className="w-full px-4 sm:px-6 relative z-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                     {menuItems.map((item, i) => (
                        <div key={i} className={`group relative rounded-[2rem] bg-white/5 border border-white/10 overflow-hidden backdrop-blur-md transition-all duration-300 hover:-translate-y-2 ${item.accent} flex flex-col`}>
                           <div className="aspect-[4/3] relative overflow-hidden p-4 pb-0">
                              <div className="absolute top-4 left-4 z-20">
                                 <Badge className="bg-background text-foreground font-black shadow-md uppercase tracking-wider text-[10px] px-2 py-1">{item.tag}</Badge>
                              </div>
                              <img src={item.img} alt={item.name} className="w-full h-full object-contain object-bottom drop-shadow-xl group-hover:scale-105 group-hover:rotate-2 transition-transform duration-500 relative z-10" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-0" />
                           </div>
                           <div className="p-6 relative z-20 bg-background/5 border-t border-white/10 flex flex-col flex-1">
                              <div className="flex justify-between items-start mb-3 gap-2">
                                 <h4 className="text-xl font-black text-white leading-tight">{item.name}</h4>
                                 <span className="text-[9px] font-black bg-primary/20 text-primary-foreground px-2 py-1 rounded-full tracking-widest uppercase border border-primary/30 shrink-0">{item.cal}</span>
                              </div>
                              <p className="text-white/60 font-medium mb-6 text-sm flex-1">{item.desc}</p>
                              <Button className="w-full bg-white text-secondary hover:bg-primary hover:text-white rounded-xl h-10 font-black text-sm transition-colors mt-auto">
                                 Subscribe
                              </Button>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </section>

            {/* --- Ecosystem: Animated Visual --- */}
            <section id="ecosystem" className="py-20 container mx-auto px-4 lg:px-8">
               <div className="bg-background/40 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-8 md:p-12 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 size-64 bg-accent/20 blur-[80px] rounded-full" />
                  <div className="absolute bottom-0 left-0 size-64 bg-primary/20 blur-[80px] rounded-full" />
                  
                  <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
                     <div className="space-y-8">
                        <div>
                           <Badge className="bg-secondary/10 text-secondary border-none font-bold uppercase tracking-widest text-[10px] mb-3">Ecosystem 2.0</Badge>
                           <h2 className="text-4xl md:text-5xl font-black text-secondary tracking-tighter leading-tight">Syncing suppliers, <br /> HR & employees.</h2>
                        </div>
                        
                        <div className="space-y-6">
                           {[
                              { icon: <Activity />, title: "Live Tracking", desc: "Real-time consumption and attendance metrics." },
                              { icon: <Settings />, title: "Automated Ledger", desc: "Digital invoicing and instant payment reconciliation." },
                              { icon: <ShieldCheck />, title: "Biometric Security", desc: "100% accurate identity verification at the point of sale." }
                           ].map((f, i) => (
                              <div key={i} className="flex gap-4 group cursor-pointer">
                                 <div className="size-12 rounded-2xl bg-background border border-border shadow-md flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300 text-secondary">
                                    {React.cloneElement(f.icon as React.ReactElement<any>, { size: 20 })}
                                 </div>
                                 <div className="flex flex-col justify-center">
                                    <h5 className="text-lg font-black text-secondary group-hover:text-primary transition-colors">{f.title}</h5>
                                    <p className="text-xs text-muted-foreground font-medium">{f.desc}</p>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>

                     <div className="relative aspect-square max-w-[400px] mx-auto w-full">
                        {/* Abstract Ecosystem Visualization */}
                        <div className="absolute inset-0 flex items-center justify-center scale-90">
                           <div className="absolute size-full border-[1px] border-dashed border-primary/20 rounded-full animate-[spin_60s_linear_infinite]" />
                           <div className="absolute size-3/4 border-[1px] border-dashed border-secondary/20 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
                           <div className="absolute size-1/2 border-[1px] border-dashed border-accent/20 rounded-full animate-[spin_20s_linear_infinite]" />
                           
                           {/* Center Node */}
                           <div className="relative size-24 bg-background border border-primary rounded-[1.5rem] shadow-xl shadow-primary/20 flex flex-col items-center justify-center z-20">
                              <UtensilsCrossed size={28} className="text-primary mb-1" />
                              <span className="text-[9px] font-black uppercase tracking-widest text-secondary">Core OS</span>
                           </div>

                           {/* Orbiting Nodes */}
                           <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 size-14 bg-secondary rounded-xl flex items-center justify-center shadow-lg z-20 text-white animate-bounce-slow">
                              <ShieldCheck size={20} />
                           </div>
                           <div className="absolute bottom-1/4 right-0 translate-x-1/2 size-14 bg-accent rounded-xl flex items-center justify-center shadow-lg z-20 text-white animate-bounce-slow" style={{animationDelay: '1s'}}>
                              <Clock size={20} />
                           </div>
                           <div className="absolute bottom-1/4 left-0 -translate-x-1/2 size-14 bg-primary rounded-xl flex items-center justify-center shadow-lg z-20 text-white animate-bounce-slow" style={{animationDelay: '2s'}}>
                              <Activity size={20} />
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </section>
         </main>

         <footer className="relative pt-16 pb-8 overflow-hidden border-t border-white/10 bg-background">
            <div className="absolute inset-0 bg-secondary/5" />
            <div className="container mx-auto px-4 lg:px-8 relative z-10 grid md:grid-cols-12 gap-10 md:gap-6">
               <div className="md:col-span-5 space-y-6">
                  <div className="flex items-center gap-2">
                     <div className="size-6 bg-gradient-to-tr from-primary to-primary/60 rounded flex items-center justify-center text-primary-foreground font-black shadow-sm text-xs">C</div>
                     <span className="font-black text-xl tracking-tighter text-secondary">Crown<span className="opacity-70">Canteen</span></span>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium max-w-sm leading-relaxed">
                     Empowering the workforce through nutrition and smart technology.
                  </p>
                  <div className="flex gap-3">
                     {/* Social place holders */}
                     {['X', 'In', 'Fb'].map((social, i) => (
                        <div key={i} className="size-8 rounded-full bg-secondary/10 flex items-center justify-center font-bold text-secondary text-xs hover:bg-primary hover:text-white transition-colors cursor-pointer">
                           {social}
                        </div>
                     ))}
                  </div>
               </div>
               
               <div className="md:col-span-2 md:col-start-8 space-y-4">
                  <h6 className="font-black text-secondary uppercase text-[10px] tracking-widest">Platform</h6>
                  <nav className="flex flex-col gap-3 text-xs font-bold text-muted-foreground">
                     <Link href="#services" className="hover:text-primary transition-colors">Services</Link>
                     <Link href="#menu" className="hover:text-primary transition-colors">Menu</Link>
                     <Link href="#ecosystem" className="hover:text-primary transition-colors">Ecosystem</Link>
                  </nav>
               </div>
               
               <div className="md:col-span-3 space-y-4">
                  <h6 className="font-black text-secondary uppercase text-[10px] tracking-widest">Access Portals</h6>
                  <nav className="flex flex-col gap-3 text-xs font-bold text-muted-foreground">
                     <Link href="/suppliers" className="hover:text-primary transition-colors">Supplier Portal</Link>
                     <Link href="/overview" className="hover:text-primary transition-colors">HR Administration</Link>
                     <Link href="/kiosk" className="hover:text-primary transition-colors flex items-center gap-2">
                        Point of Sale <span className="size-1.5 bg-accent rounded-full animate-pulse" />
                     </Link>
                  </nav>
               </div>
            </div>
            
            <div className="container mx-auto px-4 lg:px-8 relative z-10 pt-10 mt-10 border-t border-border flex flex-col md:flex-row justify-between items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
               <p>© {new Date().getFullYear()} ODUK TECH LIMITED</p>
               <div className="flex items-center gap-4">
                  <Link href="#" className="hover:text-primary">Privacy</Link>
                  <Link href="#" className="hover:text-primary">Terms</Link>
               </div>
               <p>Designed for Efficiency</p>
            </div>
         </footer>
      </div>
   );
}