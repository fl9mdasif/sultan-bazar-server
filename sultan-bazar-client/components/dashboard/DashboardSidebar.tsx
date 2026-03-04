"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getUserInfo, removeUser } from "@/services/auth.services";
import {
    LayoutDashboard, Package, ShoppingCart, Users, Settings,
    LogOut, Heart, MapPin, Menu, X, ChevronRight, Shield,
} from "lucide-react";

// ─── Nav config per role ──────────────────────────────────────────────────────
const navByRole: Record<string, { label: string; href: string; icon: React.ElementType }[]> = {
    admin: [
        { label: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
        { label: "Products", href: "/dashboard/admin/products", icon: Package },
        { label: "Orders", href: "/dashboard/admin/orders", icon: ShoppingCart },
        { label: "Users", href: "/dashboard/admin/users", icon: Users },
        { label: "Settings", href: "/dashboard/admin/settings", icon: Settings },
    ],
    superadmin: [
        { label: "Dashboard", href: "/dashboard/superadmin", icon: LayoutDashboard },
        { label: "Products", href: "/dashboard/superadmin/products", icon: Package },
        { label: "Orders", href: "/dashboard/superadmin/orders", icon: ShoppingCart },
        { label: "Users", href: "/dashboard/superadmin/users", icon: Users },
        { label: "Roles", href: "/dashboard/superadmin/roles", icon: Shield },
        { label: "Settings", href: "/dashboard/superadmin/settings", icon: Settings },
    ],
    user: [
        { label: "Dashboard", href: "/dashboard/user", icon: LayoutDashboard },
        { label: "My Orders", href: "/dashboard/user/orders", icon: ShoppingCart },
        { label: "Wishlist", href: "/wishlist", icon: Heart },
        { label: "Addresses", href: "/dashboard/user/addresses", icon: MapPin },
        { label: "Settings", href: "/dashboard/user/settings", icon: Settings },
    ],
};

const roleLabels: Record<string, { label: string; color: string }> = {
    admin: { label: "Admin", color: "#B5451B" },
    superadmin: { label: "Super Admin", color: "#7c3aed" },
    user: { label: "Customer", color: "#16a34a" },
};

export default function DashboardSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [userInitial, setUserInitial] = useState("U");
    const [userName, setUserName] = useState("");
    const [role, setRole] = useState("user");
    const [mobileOpen, setMobileOpen] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const user = getUserInfo();
        if (user) {
            const r = (user.role || "user").toLowerCase();
            setRole(r);
            const name = user.name || user.username || user.email || "U";
            setUserName(name);
            setUserInitial(name.charAt(0).toUpperCase());
        }
    }, []);

    // Close mobile sidebar on route change
    useEffect(() => { setMobileOpen(false); }, [pathname]);

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
                setMobileOpen(false);
            }
        };
        if (mobileOpen) document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [mobileOpen]);

    const handleLogout = () => {
        removeUser();
        router.push("/login");
    };

    const navItems = navByRole[role] ?? navByRole.user;
    const roleInfo = roleLabels[role] ?? roleLabels.user;

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Brand */}
            <div className="px-5 py-5 border-b border-gray-100">
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-xl">🪔</span>
                    <span className="font-extrabold text-base" style={{ color: "#B5451B" }}>Sultan Bazar</span>
                </Link>
            </div>

            {/* User card */}
            <div className="px-4 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3 bg-orange-50 rounded-xl p-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, #B5451B, #D4860A)" }}>
                        {userInitial}
                    </div>
                    <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">{userName}</p>
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full text-white"
                            style={{ background: roleInfo.color }}>
                            {roleInfo.label}
                        </span>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                {navItems.map((item) => {
                    const active = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${active
                                ? "text-white shadow-sm"
                                : "text-gray-600 hover:bg-orange-50 hover:text-[#B5451B]"
                                }`}
                            style={active ? { background: "linear-gradient(135deg, #B5451B, #D4860A)" } : {}}
                        >
                            <item.icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-white" : "text-gray-400 group-hover:text-[#B5451B]"}`} />
                            <span className="flex-1">{item.label}</span>
                            {active && <ChevronRight className="w-3.5 h-3.5 text-white/70" />}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="px-3 pb-5 border-t border-gray-100 pt-3">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop sidebar */}
            <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-gray-100 h-screen sticky top-0 flex-shrink-0">
                <SidebarContent />
            </aside>

            {/* Mobile: top bar + slide-in drawer */}
            <div className="lg:hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-30">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-xl">🪔</span>
                        <span className="font-extrabold text-sm" style={{ color: "#B5451B" }}>Sultan Bazar</span>
                    </Link>
                    <button onClick={() => setMobileOpen(true)} className="p-2 text-gray-600 hover:text-[#B5451B]">
                        <Menu className="w-5 h-5" />
                    </button>
                </div>

                {/* Overlay */}
                {mobileOpen && (
                    <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
                )}

                {/* Drawer */}
                <div
                    ref={sidebarRef}
                    className={`fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-2xl transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
                >
                    <div className="absolute top-3 right-3">
                        <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <SidebarContent />
                </div>
            </div>
        </>
    );
}
