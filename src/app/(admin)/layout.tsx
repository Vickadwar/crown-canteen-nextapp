"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  UtensilsCrossed,
  CalendarDays,
  Truck,
  Wallet,
  Package,
  Warehouse,
  MapPin,
  CircleDollarSign,
  Bell,
  Search,
  LogOut,
  Menu,
  X,
  Clock,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Activity,
  Command,
  ShoppingCart,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// ── Menu groups (note the ERPNext Backend now goes to /desk) ──────────
const menuGroups: {
  title: string;
  items: {
    icon: any;
    label: string;
    href: string;
    target?: string;
  }[];
}[] = [
  {
    title: "Operational",
    items: [
      { icon: LayoutDashboard, label: "Overview",    href: "/overview" },
      { icon: UtensilsCrossed, label: "Manual POS",  href: "/pos" },
      { icon: CalendarDays,    label: "Meal Planning",href: "/menu" },
    ],
  },
  {
    title: "Entities",
    items: [
      { icon: Users,    label: "Employees", href: "/employees" },
      { icon: Building2,label: "Employers", href: "/employers" },
      { icon: Truck,    label: "Suppliers", href: "/suppliers" },
    ],
  },
  {
    title: "Finance & Logistics",
    items: [
      { icon: CircleDollarSign, label: "Billing",    href: "/billing" },
      { icon: Wallet,           label: "Petty Cash",  href: "/finance" },
      { icon: Package,          label: "Inventory",  href: "/inventory" },
      { icon: Warehouse,        label: "Warehouse",   href: "/warehouse" },
      { icon: ShoppingCart,     label: "Procurement", href: "/procurement" },
      { icon: MapPin,           label: "Branches",    href: "/branches" },
    ],
  },
  {
    title: "Backend",
    items: [
      { icon: ExternalLink, label: "ERPNext Backend", href: "/desk", target: "_blank" },
    ],
  },
];

const notifications = [
  { id: 1, title: "Low Stock Alert",   desc: "Rice (Basmati) 50 kg is below threshold.",  time: "2 min ago",  type: "warning", icon: AlertTriangle },
  { id: 2, title: "Payment Received",  desc: "Crown Paints settled Inv #89021.",           time: "15 min ago", type: "success", icon: CheckCircle2 },
  { id: 3, title: "Menu Updated",      desc: "Chef Maina updated next week's menu.",       time: "1 hr ago",   type: "info",    icon: Sparkles },
  { id: 4, title: "Biometric Sync",    desc: "All terminals synced successfully.",         time: "2 hr ago",   type: "info",    icon: Activity },
];

// ── Sidebar nav item ──────────────────────────────────────────────────
function NavItem({ icon: Icon, label, href, target, active }: {
  icon: any;
  label: string;
  href: string;
  target?: string;
  active: boolean;
}) {
  if (target === "_blank") {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        <div className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group text-muted-foreground hover:text-foreground hover:bg-white/5">
          <Icon className="size-4 shrink-0" />
          <span className="truncate">{label}</span>
        </div>
      </a>
    );
  }

  return (
    <Link href={href}>
      <div
        className={`
          relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group
          ${active
            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
            : "text-muted-foreground hover:text-foreground hover:bg-white/5"
          }
        `}
      >
        {active && (
          <span className="absolute inset-0 rounded-xl ring-1 ring-primary/40" />
        )}
        <Icon className="size-4 shrink-0" />
        <span className="truncate">{label}</span>
        {active && <ChevronRight className="ml-auto size-3 opacity-60" />}
      </div>
    </Link>
  );
}

// ── Main layout ───────────────────────────────────────────────────────
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [notifOpen,  setNotifOpen]    = useState(false);
  const [searchOpen, setSearchOpen]   = useState(false);
  const [query,      setQuery]        = useState("");
  const [now,        setNow]          = useState(new Date());
  const [userName,   setUserName]     = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const notifRef  = useRef<HTMLDivElement>(null);

  // Check authentication on mount & route change
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/method/frappe.auth.get_logged_user", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUserName(data.message);
        } else {
          // Not authenticated – redirect to home (login page)
          router.replace("/");
        }
      } catch {
        router.replace("/");
      }
    };
    fetchUser();
  }, [pathname, router]);

  // Logout handler
  const handleLogout = useCallback(async () => {
    try {
      await fetch("/api/method/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      // Even if logout fails, clear local state
    }
    setUserName(null);
    // Force a full page reload to /canteen to clear any cached state
    window.location.href = "/canteen";
  }, []);

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Close notif on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    if (notifOpen) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [notifOpen]);

  // Cmd+K shortcut
  useEffect(() => {
    function handle(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => searchRef.current?.focus(), 50);
      }
      if (e.key === "Escape") { setSearchOpen(false); setNotifOpen(false); }
    }
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, []);

  const time = now.toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" });
  const date = now.toLocaleDateString("en-KE", { weekday: "short", day: "numeric", month: "short" });

  const pageLabel = (() => {
    const seg = pathname.split("/").filter(Boolean).pop() ?? "overview";
    return seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " ");
  })();

  const userInitials = userName
    ? userName
        .split(/[.@ ]/)
        .filter(Boolean)
        .slice(0, 2)
        .map((s) => s[0].toUpperCase())
        .join("")
    : "AU";

  // ── Sidebar ────────────────────────────────────────────────────────
  const sidebar = (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-5 pt-6 pb-5 border-b border-white/8">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black text-base shadow-lg shadow-primary/30">
            CC
          </div>
          <div className="leading-none">
            <p className="text-[13px] font-black text-foreground tracking-tight">CrownCanteen</p>
            <p className="text-[10px] text-primary font-semibold uppercase tracking-widest mt-0.5">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto scrollbar-none">
        {menuGroups.map((group) => (
          <div key={group.title}>
            <p className="px-3 mb-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/50">
              {group.title}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavItem
                  key={item.href}
                  icon={item.icon}
                  label={item.label}
                  href={item.href}
                  target={item.target}
                  active={!item.target && (pathname === item.href || pathname.startsWith(item.href + "/"))}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User + logout */}
      <div className="px-3 pb-5 pt-3 border-t border-white/8 space-y-1">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition cursor-pointer">
          <div className="size-8 rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center font-black text-xs shrink-0">
            {userInitials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-foreground truncate">
              {userName || "Loading…"}
            </p>
            <p className="text-[10px] text-muted-foreground">Online</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="size-4" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex font-sans">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 size-[500px] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 -right-40 size-[400px] bg-secondary/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-40 left-1/3 size-[450px] bg-accent/8 blur-[120px] rounded-full" />
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-60 shrink-0 fixed inset-y-0 left-0 z-30 bg-background/60 backdrop-blur-2xl border-r border-white/8 shadow-2xl">
        {sidebar}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 inset-y-0 w-60 bg-background/90 backdrop-blur-2xl border-r border-white/10 shadow-2xl animate-in slide-in-from-left duration-300">
            <button
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              onClick={() => setMobileOpen(false)}
            >
              <X className="size-5" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 lg:pl-60 relative z-10">
        {/* Top Navbar */}
        <header className="sticky top-0 z-40 h-14 flex items-center px-4 md:px-6 gap-4 bg-background/70 backdrop-blur-xl border-b border-white/10 shadow-sm">
          <button
            className="lg:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="size-5" />
          </button>

          <div className="hidden md:flex items-center gap-2 text-muted-foreground text-xs font-semibold">
            <span className="text-foreground font-black text-sm">{pageLabel}</span>
          </div>

          <div className="flex-1" />

          <div className="hidden md:flex flex-col items-end leading-none">
            <span className="text-xs font-black text-foreground tabular-nums">{time}</span>
            <span className="text-[10px] text-muted-foreground mt-0.5">{date}</span>
          </div>

          <button
            onClick={() => { setSearchOpen(true); setTimeout(() => searchRef.current?.focus(), 50); }}
            className="flex items-center gap-2 h-8 px-3 rounded-lg bg-white/5 border border-white/10 text-muted-foreground text-xs hover:bg-white/10 hover:text-foreground transition-all"
          >
            <Search className="size-3.5" />
            <span className="hidden sm:inline">Search…</span>
            <kbd className="hidden sm:flex items-center gap-0.5 text-[10px] bg-white/5 border border-white/10 px-1 rounded">
              <Command className="size-2.5" />K
            </kbd>
          </button>

          <div ref={notifRef} className="relative">
            <button
              onClick={() => setNotifOpen((o) => !o)}
              className={`relative size-8 flex items-center justify-center rounded-lg transition-colors ${notifOpen ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-white/5"}`}
            >
              <Bell className="size-4" />
              <span className="absolute top-1 right-1 size-2 rounded-full bg-primary ring-2 ring-background" />
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl bg-background/95 backdrop-blur-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right z-50">
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
                  <p className="text-sm font-black text-foreground">Notifications</p>
                  <Badge className="bg-primary/20 text-primary border-0 text-[10px] font-bold px-2 py-0.5">4 new</Badge>
                </div>
                <div className="divide-y divide-white/5 max-h-80 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="flex gap-3 px-5 py-3.5 hover:bg-white/5 cursor-pointer transition-colors group">
                      <div className={`size-8 rounded-xl shrink-0 flex items-center justify-center text-sm
                        ${n.type === "warning" ? "bg-amber-500/15 text-amber-400" :
                          n.type === "success" ? "bg-primary/15 text-primary" :
                          "bg-blue-500/10 text-blue-400"}`}
                      >
                        <n.icon className="size-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">{n.title}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">{n.desc}</p>
                        <p className="text-[10px] text-muted-foreground/50 mt-1 font-medium">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full py-3 text-[11px] font-bold text-primary hover:bg-primary/5 border-t border-white/8 transition-colors">
                  View all activity →
                </button>
              </div>
            )}
          </div>

          <div className="size-8 rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center font-black text-xs cursor-pointer hover:ring-2 hover:ring-primary/40 transition-all">
            {userInitials}
          </div>
        </header>

        <main className="flex-1 px-4 md:px-6 py-6 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Search modal */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setSearchOpen(false); }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-md" />
          <div className="relative w-full max-w-lg rounded-2xl bg-background/95 backdrop-blur-2xl border border-white/15 shadow-[0_30px_80px_rgba(0,0,0,0.6)] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
              <Search className="size-4 text-primary shrink-0" />
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search employees, orders, reports…"
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button onClick={() => setSearchOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="size-4" />
              </button>
            </div>
            <div className="p-3">
              <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-widest px-2 mb-2">Quick Navigate</p>
              <div className="space-y-0.5">
                {menuGroups.flatMap((g) => g.items).map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSearchOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                  >
                    <item.icon className="size-4 group-hover:text-primary transition-colors" />
                    {item.label}
                    <ChevronRight className="ml-auto size-3 opacity-0 group-hover:opacity-60" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}