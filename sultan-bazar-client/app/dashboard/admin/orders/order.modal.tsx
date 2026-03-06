"use client";

import { X, Package, Calendar, MapPin, CreditCard, Clock } from "lucide-react";
import Image from "next/image";
import type { TOrder, TOrderStatus, TPaymentStatus } from "@/types/common";

// ── Helpers ─────────────────────────────────────────────────────────────
export const STATUS_COLORS: Record<TOrderStatus, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    processing: "bg-purple-100 text-purple-800",
    shipped: "bg-indigo-100 text-indigo-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    returned: "bg-gray-100 text-gray-800",
};

export const PAYMENT_STATUS_COLORS: Record<TPaymentStatus, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    paid: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    refunded: "bg-gray-100 text-gray-800",
};

export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

// ── Order Details Modal ──────────────────────────────────────────────────────
export function OrderDetailsModal({
    open,
    onClose,
    order,
}: {
    open: boolean;
    onClose: () => void;
    order: TOrder | null;
}) {
    if (!open || !order) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 border-b gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Order #{order.orderNumber}
                        </h2>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(order.createdAt || new Date().toISOString())}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 self-end sm:self-auto"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto flex-1 p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column: Items */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                                <div className="px-4 py-3 bg-gray-50/50 border-b border-gray-100 font-medium text-gray-700">
                                    Order Items ({order.items.length})
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {order.items.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="p-4 flex items-center gap-4 hover:bg-gray-50/50 transition-colors"
                                        >
                                            <div className="w-16 h-16 rounded-lg bg-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                                                {(item.product as any)?.thumbnail ? (
                                                    <Image
                                                        src={(item.product as any).thumbnail}
                                                        alt={item.variant.name}
                                                        width={64}
                                                        height={64}
                                                        className="object-cover w-full h-full"
                                                    />
                                                ) : (
                                                    <Package className="w-6 h-6 text-gray-400" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-gray-900 truncate">
                                                    {(item.product as any)?.name || item.variant?.name || "Unknown Product"}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {item.variant.name} ({item.variant.sku})
                                                </p>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="font-semibold text-gray-900">
                                                    ৳{item.totalPrice}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Qty: {item.quantity} × ৳{item.variant.price}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Status History */}
                            <div className="bg-white rounded-xl border border-gray-100 p-4">
                                <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    Timeline
                                </h3>
                                <div className="space-y-4">
                                    {order.statusHistory.map((history, idx) => (
                                        <div key={idx} className="flex gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1.5"></div>
                                                {idx !== order.statusHistory.length - 1 && (
                                                    <div className="w-px h-full bg-gray-200 mt-1"></div>
                                                )}
                                            </div>
                                            <div className="pb-4">
                                                <p className="font-medium text-gray-900 uppercase text-sm">
                                                    {history.status}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {formatDate(history.changedAt || new Date().toISOString())}
                                                </p>
                                                {history.note && (
                                                    <p className="text-sm text-gray-600 mt-1 bg-gray-50 p-2 rounded-lg inline-block">
                                                        {history.note}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Details */}
                        <div className="space-y-6">
                            {/* Customer & Shipping */}
                            <div className="bg-white rounded-xl border border-gray-100 p-4">
                                <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    Shipping Details
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <p className="text-gray-500">Customer</p>
                                        <p className="font-medium text-gray-900">
                                            {order.shippingAddress.fullName}
                                        </p>
                                        <p className="text-gray-600">{order.shippingAddress.phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Address</p>
                                        <p className="text-gray-900">
                                            {order.shippingAddress.address}
                                        </p>
                                        <p className="text-gray-900">
                                            {order.shippingAddress.city}, {order.shippingAddress.district}{" "}
                                            {order.shippingAddress.postalCode}
                                        </p>
                                        <p className="text-gray-900">
                                            {order.shippingAddress.country}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Summary */}
                            <div className="bg-white rounded-xl border border-gray-100 p-4">
                                <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-gray-400" />
                                    Payment Summary
                                </h3>
                                <div className="space-y-2 text-sm mb-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Method:</span>
                                        <span className="font-medium text-gray-900 uppercase">
                                            {order.paymentMethod}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Status:</span>
                                        <span
                                            className={`px-2 py-0.5 rounded-full text-xs font-medium uppercase ${PAYMENT_STATUS_COLORS[order.paymentStatus || "pending"]
                                                }`}
                                        >
                                            {order.paymentStatus}
                                        </span>
                                    </div>
                                    {order.transactionId && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">TrxID:</span>
                                            <span className="font-mono text-gray-900 text-xs">
                                                {order.transactionId}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>৳{order.subtotal}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span>৳{order.shippingCharge}</span>
                                    </div>
                                    {order.discount ? (
                                        <div className="flex justify-between text-green-600">
                                            <span>Discount</span>
                                            <span>-৳{order.discount}</span>
                                        </div>
                                    ) : null}
                                    <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-50 text-base">
                                        <span>Total</span>
                                        <span>৳{order.totalAmount}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
