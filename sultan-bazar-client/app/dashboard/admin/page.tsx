"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUserInfo } from "@/services/auth.services";
import { Package, ShoppingCart, Users, TrendingUp, Star, Bell, ChevronRight } from "lucide-react";

const quickLinks = [
    { label: "Manage Products", href: "/dashboard/admin/products", icon: Package },
    { label: "View Orders", href: "/dashboard/admin/orders", icon: ShoppingCart },
    { label: "Manage Users", href: "/dashboard/admin/users", icon: Users },
    { label: "Analytics", href: "/dashboard/admin/analytics", icon: TrendingUp },
];

const statCards = [
    { label: "Total Products", value: "—", icon: Package, color: "#B5451B" },
    { label: "Total Orders", value: "—", icon: ShoppingCart, color: "#D4860A" },
    { label: "Total Users", value: "—", icon: Users, color: "#16a34a" },
    { label: "Revenue", value: "—", icon: TrendingUp, color: "#7c3aed" },
];

export default function AdminDashboard() {
    const router = useRouter();
    const [userName, setUserName] = useState("");

    useEffect(() => {
        const user = getUserInfo();
        if (!user) { router.replace("/login"); return; }
        if (user.role !== "admin") { router.replace(`/dashboard/${user.role}`); return; }
        setUserName(user.name || user.username || "Admin");
    }, [router]);

    return (
        <div className="p-6 lg:p-8">
            {/* Page header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Welcome back, {userName} 👋</h1>
                    <p className="text-gray-500 text-sm mt-1">Here&apos;s what&apos;s happening with Sultan Bazar today.</p>
                </div>
                <button className="p-2 rounded-xl hover:bg-white text-gray-500 hover:text-gray-700 transition-colors">
                    <Bell className="w-5 h-5" />
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                {statCards.map((s) => (
                    <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-medium text-gray-500">{s.label}</p>
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                                style={{ background: s.color + "15" }}>
                                <s.icon className="w-4 h-4" style={{ color: s.color }} />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Quick links */}
            {/* <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                <h2 className="text-base font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {quickLinks.map((link) => (
                        <Link key={link.href} href={link.href}
                            className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-[#B5451B] hover:bg-orange-50 transition-all group">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center group-hover:bg-white transition-colors">
                                    <link.icon className="w-4 h-4" style={{ color: "#B5451B" }} />
                                </div>
                                <span className="text-sm font-medium text-gray-700">{link.label}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#B5451B] transition-colors" />
                        </Link>
                    ))}
                </div>
            </div> */}

            {/* Recent reviews placeholder */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-3">
                    <Star className="w-4 h-4" style={{ color: "#D4860A" }} />
                    <h2 className="text-base font-semibold text-gray-900">Recent Reviews</h2>
                </div>
                <p className="text-sm text-gray-400">No recent reviews to display.</p>
            </div>
        </div>
    );
}
