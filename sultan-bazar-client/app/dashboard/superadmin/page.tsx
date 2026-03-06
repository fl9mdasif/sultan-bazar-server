"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUserInfo } from "@/services/auth.services";
import { useGetAllProductsQuery } from "@/redux/api/productApi";
import { useGetAllOrdersQuery } from "@/redux/api/orderApi";
import { useGetAllUsersQuery } from "@/redux/api/userApi";
import { Package, ShoppingCart, Users, TrendingUp, Shield, Bell, ChevronRight, Settings } from "lucide-react";

const quickLinks = [
    { label: "Manage Products", href: "/dashboard/superadmin/products", icon: Package },
    { label: "All Orders", href: "/dashboard/superadmin/orders", icon: ShoppingCart },
    { label: "Manage Users", href: "/dashboard/superadmin/users", icon: Users },
    // { label: "Role Management", href: "/dashboard/superadmin/roles", icon: Shield },
    { label: "Analytics", href: "/dashboard/superadmin/analytics", icon: TrendingUp },
    { label: "Site Settings", href: "/dashboard/superadmin/settings", icon: Settings },
];



export default function SuperAdminDashboard() {
    const router = useRouter();
    const [userName, setUserName] = useState("");

    const { data: productsData } = useGetAllProductsQuery({ limit: 1 });
    const { data: ordersData } = useGetAllOrdersQuery(undefined);
    const { data: usersData } = useGetAllUsersQuery({ limit: 1 });

    const totalProducts = productsData?.meta?.total || productsData?.data?.meta?.total || productsData?.data?.total || 0;
    const totalCommands = ordersData?.meta?.total || ordersData?.data?.meta?.total || ordersData?.data?.total || ordersData?.data?.length || ordersData?.length || 0;
    const totalUsers = usersData?.total || 0
    const ordersArray = ordersData?.data?.data || ordersData?.data || ordersData || [];
    const revenue = Array.isArray(ordersArray)
        ? ordersArray.reduce((acc: number, order: any) => acc + (order.totalAmount || 0), 0)
        : 0;

    const statCards = [
        { label: "Total Products", value: totalProducts, icon: Package, color: "#B5451B" },
        { label: "Total Orders", value: totalCommands, icon: ShoppingCart, color: "#D4860A" },
        { label: "Total Users", value: totalUsers, icon: Users, color: "#16a34a" },
        // { label: "Revenue", value: `৳${revenue.toLocaleString()}`, icon: TrendingUp, color: "#7c3aed" },
    ];

    useEffect(() => {
        const user = getUserInfo();
        if (!user) { router.replace("/login"); return; }
        if (user.role !== "superadmin") { router.replace(`/dashboard/${user.role}`); return; }
        setUserName(user.name || user.username || "Super Admin");
    }, [router]);

    return (
        <div className="p-6 lg:p-8">
            {/* Page header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Super Admin Panel 🛡️</h1>
                    <p className="text-gray-500 text-sm mt-1">Welcome, {userName}. Full platform control.</p>
                </div>
                <button className="p-2 rounded-xl hover:bg-white text-gray-500 hover:text-gray-700 transition-colors">
                    <Bell className="w-5 h-5" />
                </button>
            </div>

            {/* Role badge */}
            <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold"
                style={{ background: "linear-gradient(135deg, #7c3aed, #5b21b6)" }}>
                <Shield className="w-4 h-4" />
                Super Admin Access — Full Privileges
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
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-base font-semibold text-gray-900 mb-4">Admin Controls</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {quickLinks.map((link) => (
                        <Link key={link.href} href={link.href}
                            className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-[#7c3aed] hover:bg-purple-50 transition-all group">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center group-hover:bg-white transition-colors">
                                    <link.icon className="w-4 h-4 text-purple-600" />
                                </div>
                                <span className="text-sm font-medium text-gray-700">{link.label}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-purple-500 transition-colors" />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
