"use client";

import { useState } from "react";

import { Package, Star, Clock, CheckCircle, Truck, PackageOpen, XCircle, Loader2, Ban } from "lucide-react";
import Image from "next/image";
import { ReviewModal } from "@/components/dashboard/ReviewModal";
import Link from "next/link";
import { TOrder, TOrderItem } from "@/types/common";
import { useCancelOrderMutation } from "@/redux/api/orderApi";
import { toast } from "sonner";

// ── Order status tracker ──────────────────────────────────────────────────────
const ORDER_STEPS = [
    { key: "pending", label: "Placed" },
    { key: "confirmed", label: "Confirmed" },
    { key: "processing", label: "Processing" },
    { key: "shipped", label: "Shipped" },
    { key: "delivered", label: "Delivered" },
];

function OrderStatusTracker({ status }: { status: string }) {
    if (status === "cancelled" || status === "returned") {
        return (
            <div className="flex items-center gap-2 my-4 px-4 py-2.5 bg-red-50 border border-red-100 rounded-xl">
                <Ban className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span className="text-sm font-semibold text-red-600 capitalize">Order {status}</span>
            </div>
        );
    }

    const currentIdx = ORDER_STEPS.findIndex(s => s.key === status);

    return (
        <div className="my-4">
            <div className="flex items-center w-full">
                {ORDER_STEPS.map((step, idx) => {
                    // When status is "delivered" (last step), mark ALL steps as done (green)
                    const isDelivered = status === "delivered";
                    const isDone = isDelivered ? idx <= currentIdx : idx < currentIdx;
                    const isCurrent = !isDelivered && idx === currentIdx;

                    return (
                        <div key={step.key} className="flex items-center flex-1 last:flex-none">
                            {/* Circle */}
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all flex-shrink-0
                                        ${isDone
                                            ? "bg-green-500 border-green-500"
                                            : isCurrent
                                                ? "bg-[#B5451B] border-[#B5451B] ring-2 ring-orange-200 animate-pulse"
                                                : "bg-white border-gray-200"
                                        }`}
                                >
                                    {isDone && (
                                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                                <span className={`text-[9px] font-semibold mt-1 whitespace-nowrap
                                    ${isDone ? "text-green-600" : isCurrent ? "text-[#B5451B]" : "text-gray-400"}`}>
                                    {step.label}
                                </span>
                            </div>
                            {/* Connector line */}
                            {idx < ORDER_STEPS.length - 1 && (
                                <div className={`h-0.5 flex-1 mx-1 rounded-full transition-all
                                    ${isDone ? "bg-green-400" : "bg-gray-200"}`}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

const TABS = [
    { id: "all", label: "All Orders", icon: Package },
    { id: "pending", label: "Pendings", icon: Clock },
    { id: "confirmed", label: "To Ship", icon: CheckCircle },
    { id: "shipped", label: "To Receive", icon: Truck },
    { id: "delivered", label: "To Review", icon: Star },
    { id: "completed", label: "Completed", icon: CheckCircle },
];

interface OrdersListProps {
    orders: TOrder[];
    title?: string;
    description?: string;
    showTabs?: boolean;
}

export function OrdersList({ orders, title, description, showTabs = true }: OrdersListProps) {
    const [activeTab, setActiveTab] = useState("all");

    // Modal state
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [reviewProduct, setReviewProduct] = useState<{ id: string; name: string; orderId: string; variantId: string } | null>(null);

    const openReviewModal = (productId: string, productName: string, orderId: string, variantId: string) => {
        setReviewProduct({ id: productId, name: productName, orderId, variantId });
        setIsReviewOpen(true);
    };

    // Cancellation state
    const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
    const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

    const handleCancelOrder = async (orderId: string) => {
        try {
            await cancelOrder({ id: orderId, data: { reason: "Cancelled by user" } }).unwrap();
            toast.success("Order cancelled successfully");
            setCancellingOrderId(null);
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to cancel order");
        }
    };

    // Filter orders based on active tab
    const filteredOrders = orders.filter((order) => {
        if (activeTab === "all") return true;

        if (activeTab === "pending" && order.orderStatus === "pending") return true;
        if (activeTab === "confirmed" && (order.orderStatus === "confirmed" || order.orderStatus === "processing")) return true;
        if (activeTab === "shipped" && order.orderStatus === "shipped") return true;

        // "To Review" tab: only show if at least one item is NOT reviewed
        if (activeTab === "delivered") {
            return order.orderStatus === "delivered" && order.items.some(item => !item.isReviewed);
        }

        // "Completed" tab: show ALL delivered orders
        if (activeTab === "completed") return order.orderStatus === "delivered";

        return false;
    });

    return (
        <div className="w-full">
            {/* Header */}
            {(title || description) && (
                <div className="mb-8 border-b border-gray-100 pb-5">
                    {title && <h1 className="text-2xl font-bold text-gray-900">{title}</h1>}
                    {description && <p className="text-gray-500 text-sm mt-1">{description}</p>}
                </div>
            )}

            {/* Tabs Navigation */}
            {showTabs && (
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
            )}

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
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 mb-1 gap-4">
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
                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider whitespace-nowrap
                                            ${order.orderStatus === 'delivered' ? 'bg-green-50 text-green-700 border border-green-200' :
                                                order.orderStatus === 'pending' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                                                    order.orderStatus === 'cancelled' ? 'bg-red-50 text-red-700 border border-red-200' :
                                                        'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                                            {order.orderStatus}
                                        </span>
                                        {/* Cancel Button - shown only for pending/confirmed and if not currently confirming this specific order */}
                                        {(order.orderStatus === 'pending' || order.orderStatus === 'confirmed') && (
                                            <div className="flex items-center gap-2">
                                                {cancellingOrderId === order._id ? (
                                                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-300">
                                                        <button
                                                            disabled={isCancelling}
                                                            onClick={() => handleCancelOrder(order._id)}
                                                            className="text-[10px] font-bold text-red-600 bg-red-500 text-white hover:bg-red-600 flex items-center gap-1 px-2 py-1 rounded-md transition-colors"
                                                        >
                                                            {isCancelling ? <Loader2 className="w-3 h-3 animate-spin" /> : "Confirm"}
                                                        </button>
                                                        <button
                                                            disabled={isCancelling}
                                                            onClick={() => setCancellingOrderId(null)}
                                                            className="text-[10px] font-bold bg-green-500 text-white hover:bg-green-600 px-2 py-1 rounded-md"
                                                        >
                                                            No, I changed my mind
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setCancellingOrderId(order._id)}
                                                        className="text-[10px] font-bold text-gray-400 hover:text-red-500 flex items-center gap-1 px-2 py-1 hover:bg-red-50 rounded-md transition-all group"
                                                    >
                                                        <XCircle className="w-3 h-3 group-hover:scale-110 transition-transform" /> Cancel
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* ── Order Status Tracker ── */}
                            <OrderStatusTracker status={order.orderStatus} />

                            {/* Order Items */}
                            <div className="space-y-4">
                                {order.items.map((item: TOrderItem, index: number) => {
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
                                                        src={productImage || "/placeholder.png"}
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
                                                            ৳{item.variant?.discountPrice || item.variant?.price || 0}
                                                            <span className="text-gray-400 font-medium text-sm ml-1">x {item.quantity}</span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Button: Show Review ONLY if delivered and NOT reviewed */}
                                            {order.orderStatus === 'delivered' && (
                                                item.isReviewed ? (
                                                    <span className="flex items-center gap-1.5 text-green-600 bg-green-50 px-3 py-1.5 rounded-xl text-xs font-bold border border-green-100 italic">
                                                        <CheckCircle className="w-3.5 h-3.5" /> Reviewed
                                                    </span>
                                                ) : (
                                                    <button
                                                        onClick={() => openReviewModal(productIdent, productName, order._id, item.variant?.variantId)}
                                                        className="w-full sm:w-auto mt-4 sm:mt-0 px-4 py-2.5 bg-orange-50 text-[#B5451B] border border-orange-100 hover:bg-[#B5451B] hover:text-white transition-all rounded-xl text-sm font-semibold flex items-center justify-center gap-2 flex-shrink-0 shadow-sm cursor-pointer"
                                                    >
                                                        <Star className="w-4 h-4" />
                                                        Add Review
                                                    </button>
                                                )
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
                orderId={reviewProduct?.orderId}
                variantId={reviewProduct?.variantId}
            />
        </div>
    );
}
