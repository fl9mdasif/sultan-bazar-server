"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUserInfo } from "@/services/auth.services";
import { useGetAllProductsQuery } from "@/redux/api/productApi";
import { useGetAllOrdersQuery } from "@/redux/api/orderApi";
import { useGetAllUsersQuery } from "@/redux/api/userApi";
import SalesChart from "@/components/dashboard/SalesChart";
import {
    Package, ShoppingCart, Users, TrendingUp, Bell,
    ChevronRight, CheckCircle, XCircle, Clock, Truck,
    Tags, Settings
} from "lucide-react";

const quickLinks = [
    { label: "Manage Categories", href: "/dashboard/admin/categories", icon: Tags, desc: "Add, edit & delete categories" },
    { label: "Manage Products", href: "/dashboard/admin/products", icon: Package, desc: "Add, edit & delete products" },
    { label: "View Orders", href: "/dashboard/admin/orders", icon: ShoppingCart, desc: "Track & update order statuses" },
    { label: "Manage Users", href: "/dashboard/admin/users", icon: Users, desc: "View & manage customer accounts" },
    { label: "Settings", href: "/dashboard/admin/settings", icon: Settings, desc: "Update store settings" },
];

export default function AdminDashboard() {
    const router = useRouter();
    const [userName, setUserName] = useState("");

    const { data: productsData } = useGetAllProductsQuery({ limit: 1 });
    const { data: ordersData } = useGetAllOrdersQuery(undefined);
    const { data: usersData } = useGetAllUsersQuery({ limit: 1 });

    const totalProducts =
        productsData?.meta?.total ??
        productsData?.data?.meta?.total ??
        productsData?.data?.total ?? 0;

    const totalUsers =
        usersData?.meta?.total ??
        usersData?.data?.meta?.total ??
        usersData?.total ??
        usersData?.data?.total ?? 0;

    // Normalise orders array
    const ordersArray: any[] = Array.isArray(ordersData?.data?.data)
        ? ordersData.data.data
        : Array.isArray(ordersData?.data)
            ? ordersData.data
            : Array.isArray(ordersData)
                ? ordersData
                : [];

    const totalOrders = ordersArray.length;
    const pendingOrders = ordersArray.filter((o: any) => o.orderStatus === "pending" || o.orderStatus === "processing" || o.orderStatus === "confirmed").length;
    const shippedOrders = ordersArray.filter((o: any) => o.orderStatus === "shipped").length;
    const completedOrders = ordersArray.filter((o: any) => o.orderStatus === "delivered").length;
    const cancelledOrders = ordersArray.filter((o: any) => o.orderStatus === "cancelled").length;
    const revenue = ordersArray.reduce((acc: number, o: any) => acc + (o.totalAmount || 0), 0);

    // Recent orders (last 5)
    const recentOrders = [...ordersArray]
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

    const statCards = [
        { label: "Total Products", value: totalProducts, icon: Package, color: "#B5451B", bg: "#B5451B15" },
        { label: "Total Users", value: totalUsers, icon: Users, color: "#7c3aed", bg: "#7c3aed15" },
        { label: "Total Orders", value: totalOrders, icon: ShoppingCart, color: "#D4860A", bg: "#D4860A15" },
        { label: "Pending", value: pendingOrders, icon: Clock, color: "#f59e0b", bg: "#f59e0b15" },
        { label: "Shipped", value: shippedOrders, icon: Truck, color: "#2563eb", bg: "#2563eb15" },
        { label: "Number of sales", value: completedOrders, icon: CheckCircle, color: "#16a34a", bg: "#16a34a15" },
        { label: "Cancelled", value: cancelledOrders, icon: XCircle, color: "#dc2626", bg: "#dc262615" },
        { label: "Revenue", value: `৳${revenue.toLocaleString()}`, icon: TrendingUp, color: "#059669", bg: "#05966915" },
    ];

    const statusColor = (s: string) =>
        s === "delivered" ? "text-green-700 bg-green-50 border-green-200" :
            s === "cancelled" ? "text-red-700 bg-red-50 border-red-200" :
                s === "shipped" ? "text-blue-700 bg-blue-50 border-blue-200" :
                    s === "pending" ? "text-orange-700 bg-orange-50 border-orange-200" :
                        "text-gray-700 bg-gray-50 border-gray-200";

    useEffect(() => {
        const user = getUserInfo();
        if (!user) { router.replace("/login"); return; }
        if (user.role !== "admin") { router.replace(`/dashboard/${user.role}`); return; }
        setUserName(user.name || user.username || "Admin");
    }, [router]);

    return (
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
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

            {/* Stats grid — 4 on desktop, 2 on mobile */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {statCards.map((s) => (
                    <div key={s.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{ background: s.bg }}>
                                <s.icon className="w-4 h-4" style={{ color: s.color }} />
                            </div>
                        </div>
                        <p className="text-xl font-bold text-gray-900">{s.value}</p>
                        <p className="text-xs font-medium text-gray-500 mt-0.5">{s.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
                {/* Sales Chart */}
                <div className="xl:col-span-2">
                    <SalesChart />
                </div>

                {/* Quick Actions */}
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

            {/* Recent Orders Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Recent Orders</h2>
                    <Link href="/dashboard/admin/orders" className="text-xs font-semibold text-[#B5451B] hover:underline">
                        View all →
                    </Link>
                </div>
                {recentOrders.length === 0 ? (
                    <p className="text-sm text-gray-400 py-6 text-center">No orders yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Order #</th>
                                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentOrders.map((order: any) => (
                                    <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3 px-3 font-semibold text-gray-900">{order.orderNumber}</td>
                                        <td className="py-3 px-3 text-gray-600">{order.shippingAddress?.fullName || "—"}</td>
                                        <td className="py-3 px-3 font-bold text-gray-900">৳{(order.totalAmount || 0).toLocaleString()}</td>
                                        <td className="py-3 px-3">
                                            <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold uppercase border ${statusColor(order.orderStatus)}`}>
                                                {order.orderStatus}
                                            </span>
                                        </td>
                                        <td className="py-3 px-3 text-gray-400 text-xs">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
