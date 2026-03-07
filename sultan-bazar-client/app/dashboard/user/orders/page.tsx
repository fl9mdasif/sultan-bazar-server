"use client";

import { useState } from "react";
import { useGetMyOrdersQuery } from "@/redux/api/orderApi";
import { Package, Star, Clock, CheckCircle, Truck, PackageOpen } from "lucide-react";
import Image from "next/image";
import { ReviewModal } from "@/components/dashboard/ReviewModal";
import Link from "next/link";
import { TOrder, TOrderItem } from "@/types/common";

const TABS = [
    { id: "all", label: "All Orders", icon: Package },
    { id: "pending", label: "Pendings", icon: Clock },
    { id: "confirmed", label: "To Ship", icon: CheckCircle }, // Wait for seller action
    { id: "shipped", label: "To Receive", icon: Truck },      // Courier has it
    { id: "delivered", label: "To Review", icon: Star },      // Received
];

export default function UserOrdersPage() {
    const { data: myOrdersData, isLoading, refetch } = useGetMyOrdersQuery({});

    const orders: TOrder[] = Array.isArray(myOrdersData)
        ? myOrdersData
        : Array.isArray(myOrdersData?.data)
            ? myOrdersData.data
            : Array.isArray(myOrdersData?.data?.data)
                ? myOrdersData.data.data
                : [];

    const [activeTab, setActiveTab] = useState("all");

    // Modal state
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [reviewProduct, setReviewProduct] = useState<{ id: string; name: string } | null>(null);

    const openReviewModal = (productId: string, productName: string) => {
        setReviewProduct({ id: productId, name: productName });
        setIsReviewOpen(true);
        refetch()

    };

    // Filter orders based on active tab
    const filteredOrders = orders.filter((order) => {
        if (activeTab === "all") return true;

        // Match specific statuses to tabs based on the user's flow
        if (activeTab === "pending" && order.orderStatus === "pending") return true;
        if (activeTab === "confirmed" && (order.orderStatus === "confirmed" || order.orderStatus === "processing")) return true;
        if (activeTab === "shipped" && order.orderStatus === "shipped") return true;
        if (activeTab === "delivered" && order.orderStatus === "delivered") return true;

        return false;
    });

    if (isLoading) {
        return (
            <div className="p-6 lg:p-8 flex items-center justify-center min-h-[500px]">
                <div className="text-gray-500 animate-pulse">Loading your orders...</div>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8 border-b border-gray-100 pb-5">
                <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
                <p className="text-gray-500 text-sm mt-1">Track your deliveries and leave reviews for products you've received.</p>
            </div>

            {/* Tabs Navigation */}
            <div className="flex overflow-x-auto hide-scrollbar border-b border-gray-200 mb-6 gap-4 sm:gap-8 relative">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 pb-3 px-1 whitespace-nowrap transition-colors relative font-medium text-sm
                            ${activeTab === tab.id ? "text-[#B5451B]" : "text-gray-500 hover:text-[#B5451B]"}`}
                    >
                        <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-[#B5451B]" : "text-gray-400"}`} />
                        {tab.label}
                        {activeTab === tab.id && (
                            <span className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-[#B5451B] rounded-t-lg" />
                        )}
                    </button>
                ))}
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 flex flex-col items-center justify-center text-center">
                    <PackageOpen className="w-16 h-16 text-gray-200 mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No orders found</h3>
                    <p className="text-gray-500 max-w-sm">
                        You don't have any orders in this category yet.
                    </p>
                    <Link href="/products" className="mt-6 px-6 py-2.5 bg-[#B5451B] text-white font-medium rounded-xl hover:bg-[#9a3915] transition-colors">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {filteredOrders.map((order) => (
                        <div key={order._id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">

                            {/* Order Header info */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 mb-4 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Order <span className="font-semibold text-gray-900">#{order.orderNumber}</span>
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">Placed on {new Date(order.createdAt!).toLocaleDateString()}</p>
                                </div>
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold capitalize border border-gray-200">
                                        {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}
                                    </span>
                                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider whitespace-nowrap
                                        ${order.orderStatus === 'delivered' ? 'bg-green-50 text-green-700 border border-green-200' :
                                            order.orderStatus === 'pending' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                                                order.orderStatus === 'cancelled' ? 'bg-red-50 text-red-700 border border-red-200' :
                                                    'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                                        {order.orderStatus}
                                    </span>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="space-y-4">
                                {order.items.map((item: TOrderItem, index: number) => {
                                    // Extract variant info, fallback if missing
                                    const variantName = item.variant?.name || "Standard";
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    const productObj = item.product as any;
                                    const productName = productObj?.name || "Unknown Product";
                                    const productImage = productObj?.thumbnail
                                    const productIdent = productObj?._id || "unknown";

                                    return (
                                        <div key={index} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between group py-3 border-b border-gray-50 last:border-0 last:pb-0">
                                            {/* Product Identity */}
                                            <div className="flex gap-4 items-center flex-1 w-full max-w-lg">
                                                <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0 relative">
                                                    <Image
                                                        src={productImage}
                                                        alt={productName}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-900 line-clamp-2 md:line-clamp-1">{productName}</p>
                                                    <div className="flex items-center gap-3 mt-1.5">
                                                        <span className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600 font-medium">Vol: {variantName}</span>
                                                        <span className="text-sm font-semibold text-gray-900 border-l border-gray-200 pl-3">
                                                            ৳{item.variant?.price || 0}
                                                            <span className="text-gray-400 font-medium text-sm ml-1">x {item.quantity}</span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Button: Show Review ONLY if delivered */}
                                            {(order.orderStatus === 'delivered' || activeTab === 'delivered') && (
                                                <button
                                                    onClick={() => openReviewModal(productIdent, productName)}
                                                    className="w-full sm:w-auto mt-4 sm:mt-0 px-4 py-2.5 bg-orange-50 text-[#B5451B] border border-orange-100 hover:bg-[#B5451B] hover:text-white transition-all rounded-xl text-sm font-semibold flex items-center justify-center gap-2 flex-shrink-0 shadow-sm"
                                                >
                                                    <Star className="w-4 h-4" />
                                                    Add Review
                                                </button>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Order Total Footer */}
                            <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/50 p-4 rounded-xl">
                                <p className="text-xs text-gray-500 font-medium tracking-wide invisible sm:visible">PAID VIA <span className="uppercase">{order.paymentMethod}</span></p>
                                <p className="text-sm font-semibold text-gray-600">
                                    Total Amount
                                    <span className="text-xl font-bold text-[#B5451B] ml-3 font-sans relative top-[1px]">৳{order.totalAmount.toLocaleString()}</span>
                                </p>
                            </div>

                        </div>
                    ))}
                </div>
            )}

            {/* Render the Review Modal isolated at the root level */}
            <ReviewModal
                isOpen={isReviewOpen}
                onClose={() => setIsReviewOpen(false)}
                productId={reviewProduct?.id || ""}
                productName={reviewProduct?.name || ""}
            />
        </div>
    );
}
