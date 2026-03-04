"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUserInfo } from "@/services/auth.services";
import { ShoppingCart, Heart, MapPin, Bell, ChevronRight, Clock, Package } from "lucide-react";

const quickLinks = [
    { label: "My Orders", href: "/dashboard/user/orders", icon: ShoppingCart },
    { label: "Wishlist", href: "/wishlist", icon: Heart },
    { label: "Track Package", href: "/dashboard/user/tracking", icon: Package },
    { label: "Saved Addresses", href: "/dashboard/user/addresses", icon: MapPin },
];

export default function UserDashboard() {
    const router = useRouter();
    const [userName, setUserName] = useState("");

    useEffect(() => {
        const user = getUserInfo();
        if (!user) { router.replace("/login"); return; }
        if (user.role !== "user") { router.replace(`/dashboard/${user.role}`); return; }
        setUserName(user.name || user.username || "there");
    }, [router]);

    return (
        <div className="p-6 lg:p-8">
            {/* Page header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Hello, {userName} 👋</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your orders and account details here.</p>
                </div>
                <button className="p-2 rounded-xl hover:bg-white text-gray-500 hover:text-gray-700 transition-colors">
                    <Bell className="w-5 h-5" />
                </button>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {[
                    { label: "Total Orders", value: "—", icon: ShoppingCart, color: "#B5451B" },
                    { label: "Pending Delivery", value: "—", icon: Clock, color: "#D4860A" },
                    { label: "Wishlist Items", value: "—", icon: Heart, color: "#e11d48" },
                ].map((c) => (
                    <div key={c.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-medium text-gray-500">{c.label}</p>
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                                style={{ background: c.color + "15" }}>
                                <c.icon className="w-4 h-4" style={{ color: c.color }} />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{c.value}</p>
                    </div>
                ))}
            </div>

            {/* Quick links */}
            {/* <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                <h2 className="text-base font-semibold text-gray-900 mb-4">Quick Access</h2>
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

            {/* Recent orders placeholder */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base font-semibold text-gray-900">Recent Orders</h2>
                    <Link href="/dashboard/user/orders" className="text-xs font-medium hover:underline" style={{ color: "#B5451B" }}>
                        View all
                    </Link>
                </div>
                <p className="text-sm text-gray-400">You haven&apos;t placed any orders yet.</p>
                <Link href="/products" className="mt-3 inline-block text-sm font-semibold hover:underline" style={{ color: "#B5451B" }}>
                    Start Shopping →
                </Link>
            </div>
        </div>
    );
}
