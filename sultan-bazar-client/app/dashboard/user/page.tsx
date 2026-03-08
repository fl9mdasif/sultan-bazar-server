"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUserInfo } from "@/services/auth.services";
import { useGetMyOrdersQuery } from "@/redux/api/orderApi";
import {
    ShoppingCart, Clock, CheckCircle, XCircle, Bell,
    ChevronRight, Package, Settings, Truck, Star
} from "lucide-react";
import { TOrder } from "@/types/common";

const quickLinks = [
    { label: "My Orders", href: "/dashboard/user/orders", icon: ShoppingCart, desc: "View & track all orders" },
    { label: "Account Settings", href: "/dashboard/user/settings", icon: Settings, desc: "Update your profile & address" },
    { label: "Shop Products", href: "/products", icon: Package, desc: "Browse our latest products" },
];

export default function UserDashboard() {
    const router = useRouter();
    const [userName, setUserName] = useState("");

    const { data: myOrdersData, isLoading: ordersLoading } = useGetMyOrdersQuery({});

    const orders: TOrder[] = Array.isArray(myOrdersData)
        ? myOrdersData
        : Array.isArray(myOrdersData?.data)
            ? myOrdersData.data
            : Array.isArray(myOrdersData?.data?.data)
                ? myOrdersData.data.data
                : [];

    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.orderStatus === "pending" || o.orderStatus === "confirmed" || o.orderStatus === "processing").length,
        shipped: orders.filter(o => o.orderStatus === "shipped").length,
        delivered: orders.filter(o => o.orderStatus === "delivered").length,
        cancelled: orders.filter(o => o.orderStatus === "cancelled").length,
    };

    useEffect(() => {
        const user = getUserInfo();
        if (!user) { router.replace("/login"); return; }
        if (user.role !== "user") { router.replace(`/dashboard/${user.role}`); return; }
        setUserName(user.name || user.username || "there");
    }, [router]);

    const statCards = [
        { label: "Total Orders", value: stats.total, icon: ShoppingCart, color: "#B5451B", bg: "#B5451B15" },
        { label: "In Progress", value: stats.pending, icon: Clock, color: "#D4860A", bg: "#D4860A15" },
        { label: "Shipped", value: stats.shipped, icon: Truck, color: "#2563eb", bg: "#2563eb15" },
        { label: "Completed", value: stats.delivered, icon: CheckCircle, color: "#16a34a", bg: "#16a34a15" },
        { label: "Cancelled", value: stats.cancelled, icon: XCircle, color: "#dc2626", bg: "#dc262615" },
    ];

    // Recent orders (last 3)
    const recentOrders = [...orders]
        .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
        .slice(0, 3);

    return (
        <div className="p-6 lg:p-8 max-w-5xl mx-auto">
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

            {/* Summary stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
                {statCards.map((c) => (
                    <div key={c.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{ background: c.bg }}>
                                <c.icon className="w-4 h-4" style={{ color: c.color }} />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{ordersLoading ? "—" : c.value}</p>
                        <p className="text-xs font-medium text-gray-500 mt-1">{c.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Links */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Quick Actions</h2>
                        <div className="space-y-2">
                            {quickLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-[#B5451B] hover:bg-orange-50 transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center group-hover:bg-white transition-colors flex-shrink-0">
                                            <link.icon className="w-4 h-4" style={{ color: "#B5451B" }} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">{link.label}</p>
                                            <p className="text-xs text-gray-400">{link.desc}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#B5451B] transition-colors" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Recent Orders</h2>
                            <Link href="/dashboard/user/orders" className="text-xs font-semibold text-[#B5451B] hover:underline">
                                View all →
                            </Link>
                        </div>
                        {ordersLoading ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
                                ))}
                            </div>
                        ) : recentOrders.length === 0 ? (
                            <div className="flex flex-col items-center py-10 text-center">
                                <Package className="w-10 h-10 text-gray-200 mb-3" />
                                <p className="text-sm text-gray-500 font-medium">No orders yet</p>
                                <Link href="/products" className="mt-3 px-5 py-2 bg-[#B5451B] text-white text-xs font-semibold rounded-xl hover:bg-[#9a3915] transition-colors">
                                    Start Shopping
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentOrders.map(order => {
                                    const statusColor =
                                        order.orderStatus === "delivered" ? "text-green-700 bg-green-50 border-green-200" :
                                            order.orderStatus === "cancelled" ? "text-red-700 bg-red-50 border-red-200" :
                                                order.orderStatus === "shipped" ? "text-blue-700 bg-blue-50 border-blue-200" :
                                                    "text-orange-700 bg-orange-50 border-orange-200";
                                    return (
                                        <div key={order._id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">#{order.orderNumber}</p>
                                                <p className="text-xs text-gray-400 mt-0.5">
                                                    {new Date(order.createdAt!).toLocaleDateString()} · {order.items.length} item(s)
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-bold text-gray-900">৳{order.totalAmount.toLocaleString()}</span>
                                                <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold uppercase border ${statusColor}`}>
                                                    {order.orderStatus}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
