"use client";

import { useState } from "react";
import {
    useGetAllOrdersQuery,
    useUpdateOrderStatusMutation,
    useUpdatePaymentStatusMutation,
} from "@/redux/api/orderApi";
import {
    Search,
    Eye,
    Loader2,
    AlertTriangle,
    Package,
    Calendar,
    CreditCard,
    MapPin,
    X,
    CheckCircle2,
    Clock,
    XCircle,
    Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { TOrder, TOrderStatus, TPaymentStatus } from "@/types/common";
import Image from "next/image";

// ── Helpers ─────────────────────────────────────────────────────────────
const STATUS_COLORS: Record<TOrderStatus, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    processing: "bg-purple-100 text-purple-800",
    shipped: "bg-indigo-100 text-indigo-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    returned: "bg-gray-100 text-gray-800",
};

const PAYMENT_STATUS_COLORS: Record<TPaymentStatus, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    paid: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    refunded: "bg-gray-100 text-gray-800",
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

// ── Order Details Modal ──────────────────────────────────────────────────────
function OrderDetailsModal({
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

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminOrdersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const { data, isLoading, isError } = useGetAllOrdersQuery({});
    const [updateStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();
    const [updatePaymentStatus, { isLoading: isUpdatingPayment }] = useUpdatePaymentStatusMutation();

    const [selectedOrder, setSelectedOrder] = useState<TOrder | null>(null);

    // Extract orders
    const orders: TOrder[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
            ? data.data
            : [];

    // Filter orders
    const filteredOrders = orders.filter(
        (order) =>
            order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.shippingAddress.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.shippingAddress.phone.includes(searchTerm)
    );

    const handleStatusChange = async (orderId: string, currentStatus: string, newStatus: string) => {
        if (currentStatus === newStatus) return;
        try {
            await updateStatus({ id: orderId, data: { status: newStatus } }).unwrap();
            toast.success("Order status updated");
        } catch (err: any) {
            toast.error(err.data?.message || "Failed to update status");
        }
    };

    const handlePaymentStatusChange = async (orderId: string, currentStatus: string, newStatus: string) => {
        if (currentStatus === newStatus) return;
        try {
            await updatePaymentStatus({ id: orderId, data: { paymentStatus: newStatus } }).unwrap();
            toast.success("Payment status updated");
        } catch (err: any) {
            toast.error(err.data?.message || "Failed to update payment status");
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                        Orders
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage and track all customer orders
                    </p>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by order #, name or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B5451B]/20 focus:border-[#B5451B] transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-[#B5451B]">
                        <Loader2 className="w-8 h-8 animate-spin mb-4" />
                        <p className="text-sm font-medium text-gray-600">Loading orders...</p>
                    </div>
                ) : isError ? (
                    <div className="flex flex-col items-center justify-center py-20 text-red-500">
                        <AlertTriangle className="w-10 h-10 mb-4 opacity-80" />
                        <p className="text-base font-medium text-gray-900">
                            Failed to load orders
                        </p>
                        <p className="text-sm text-gray-500 mt-1">Please try again later</p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                            <Package className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-base font-medium text-gray-900">
                            No orders found
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            Either you have no orders or none match your search.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full whitespace-nowrap">
                            <thead className="bg-gray-50/50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Order ID / Date
                                    </th>
                                    <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Product
                                    </th>
                                    <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Payment Status
                                    </th>
                                    <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Order Status
                                    </th>
                                    <th className="text-right px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredOrders.map((order) => (
                                    <tr
                                        key={order._id}
                                        className="hover:bg-gray-50/50 transition-colors"
                                    >
                                        {/* Order ID & Date */}
                                        <td className="px-5 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-gray-900">
                                                    {order.orderNumber}
                                                </span>
                                                <span className="text-xs text-gray-500 mt-0.5">
                                                    {formatDate(order.createdAt || new Date().toISOString())}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Customer */}
                                        <td className="px-5 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900">
                                                    {order.shippingAddress.fullName}
                                                </span>
                                                <span className="text-xs text-gray-500 mt-0.5">
                                                    {order.shippingAddress.phone}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Product Info */}
                                        <td className="px-5 py-4">
                                            <div className="flex flex-col gap-3">
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded border border-gray-100 bg-gray-50 flex-shrink-0 flex items-center justify-center overflow-hidden">
                                                            {(item.product as any)?.thumbnail ? (
                                                                <Image
                                                                    src={(item.product as any).thumbnail}
                                                                    alt={item.variant?.name || "Product"}
                                                                    width={40}
                                                                    height={40}
                                                                    className="object-cover w-full h-full"
                                                                />
                                                            ) : (
                                                                <Package className="w-5 h-5 text-gray-400" />
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col min-w-0">
                                                            <span className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                                                                {(item.product as any)?.name || item.variant?.name || "Unknown Product"}
                                                            </span>
                                                            <span className="text-xs text-gray-500">
                                                                Qty: {item.quantity}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>

                                        {/* Amount */}
                                        <td className="px-5 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900">
                                                    ৳{order.totalAmount}
                                                </span>
                                                <span className="text-xs text-gray-500 mt-0.5">
                                                    {order.items.length} item(s)
                                                </span>
                                            </div>
                                        </td>

                                        {/* Payment Status Dropdown */}
                                        <td className="px-5 py-4">
                                            <select
                                                className={`text-xs font-bold uppercase rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all cursor-pointer ${PAYMENT_STATUS_COLORS[order.paymentStatus || "pending"]
                                                    } ${(isUpdatingPayment || isUpdating) ? "opacity-50 pointer-events-none" : ""}`}
                                                value={order.paymentStatus || "pending"}
                                                onChange={(e) =>
                                                    handlePaymentStatusChange(order._id, order.paymentStatus || "pending", e.target.value)
                                                }
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="paid">Paid</option>
                                                <option value="failed">Failed</option>
                                                <option value="refunded">Refunded</option>
                                            </select>
                                        </td>

                                        {/* Order Status Dropdown */}
                                        <td className="px-5 py-4">
                                            <select
                                                className={`text-xs font-bold uppercase rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all cursor-pointer ${STATUS_COLORS[order.orderStatus]
                                                    } ${(isUpdatingPayment || isUpdating) ? "opacity-50 pointer-events-none" : ""}`}
                                                value={order.orderStatus}
                                                onChange={(e) =>
                                                    handleStatusChange(order._id, order.orderStatus, e.target.value)
                                                }
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="processing">Processing</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancelled</option>
                                                <option value="returned">Returned</option>
                                            </select>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-5 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors rounded-lg"
                                                    type="button"
                                                    onClick={() => setSelectedOrder(order)}
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <OrderDetailsModal
                open={!!selectedOrder}
                onClose={() => setSelectedOrder(null)}
                order={selectedOrder}
            />
        </div>
    );
}
