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
  Settings,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/ui/logo";

// ── Menu groups ───────────────────────────────────────────────────────
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
      { icon: Users,    label: "Canteen Customers", href: "/employees" },
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
    title: "System & Config",
    items: [
      { icon: Settings, label: "Settings", href: "/settings" },
      { icon: ExternalLink, label: "ERP Login", href: "/desk", target: "_blank" },
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
          <ExternalLink className="ml-auto size-3 opacity-40 group-hover:opacity-80" />
        </div>
      </a>
    );
  }

  return (
    <Link href={href}>
      <div
        className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
          active
            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 font-bold"
            : "text-muted-foreground hover:text-foreground hover:bg-white/5"
        }`}
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
  const [mounted,    setMounted]      = useState(false);
  const [userName,   setUserName]     = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const notifRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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
          router.replace("/auth/login");
        }
      } catch {
        router.replace("/auth/login");
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
    } catch (err) {}
    setUserName(null);
    window.location.href = "/auth/login";
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

  const time = mounted ? now.toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" }) : "";
  const date = mounted ? now.toLocaleDateString("en-KE", { weekday: "short", day: "numeric", month: "short" }) : "";

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
    <div className="flex flex-col h-full" suppressHydrationWarning>
      {/* Brand */}
      <div className="px-5 pt-6 pb-5 border-b border-white/8">
        <Logo subtitle="Admin Portal" href="/overview" iconSize="sm" />
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
                  active={pathname === item.href || (item.href !== "/overview" && pathname.startsWith(item.href))}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom user card */}
      <div className="px-3 pb-5 pt-2 border-t border-white/8 space-y-2" suppressHydrationWarning>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/4 border border-white/6">
          <div className="size-8 rounded-lg bg-primary/20 text-primary border border-primary/30 font-black text-xs flex items-center justify-center shrink-0">
            {userInitials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-foreground truncate">
              {userName || "Loading…"}
            </p>
            <p className="text-[10px] text-muted-foreground">Online</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          suppressHydrationWarning
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
        >
          <LogOut className="size-4" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex font-sans" suppressHydrationWarning>
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
              suppressHydrationWarning
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
        <header className="sticky top-0 z-40 h-14 flex items-center px-4 md:px-6 gap-4 bg-background/70 backdrop-blur-xl border-b border-white/10 shadow-sm" suppressHydrationWarning>
          <button
            className="lg:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setMobileOpen(true)}
            suppressHydrationWarning
          >
            <Menu className="size-5" />
          </button>

          <div className="hidden md:flex items-center gap-2 text-muted-foreground text-xs font-semibold">
            <span className="text-foreground font-black text-sm">{pageLabel}</span>
          </div>

          <div className="flex-1" />

          <div className="hidden md:flex flex-col items-end leading-none" suppressHydrationWarning>
            <span className="text-xs font-black text-foreground tabular-nums" suppressHydrationWarning>{time}</span>
            <span className="text-[10px] text-muted-foreground mt-0.5" suppressHydrationWarning>{date}</span>
          </div>

          <button
            onClick={() => { setSearchOpen(true); setTimeout(() => searchRef.current?.focus(), 50); }}
            suppressHydrationWarning
            className="flex items-center gap-2 h-8 px-3 rounded-lg bg-white/5 border border-white/10 text-muted-foreground text-xs hover:bg-white/10 hover:text-foreground transition-all cursor-pointer"
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
              suppressHydrationWarning
              className={`relative size-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${notifOpen ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-white/5"}`}
            >
              <Bell className="size-4" />
              <span className="absolute top-1 right-1 size-2 rounded-full bg-primary ring-2 ring-background" />
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl bg-background/95 backdrop-blur-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right z-50">
                <div className="p-3.5 border-b border-white/10 flex items-center justify-between">
                  <span className="text-xs font-black text-foreground uppercase tracking-wider">Notifications</span>
                  <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20 font-bold">4 new</Badge>
                </div>
                <div className="divide-y divide-white/5 max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-3 hover:bg-white/5 transition-colors flex items-start gap-3">
                      <div className="size-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                        <n.icon className="size-3.5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-foreground truncate">{n.title}</p>
                        <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">{n.desc}</p>
                        <p className="text-[9px] text-muted-foreground/60 mt-1">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 md:p-6" suppressHydrationWarning>
          {children}
        </main>
      </div>
    </div>
  );
}
