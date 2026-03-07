"use client";

import { useGetCartQuery, useUpdateQuantityMutation, useRemoveFromCartMutation } from "@/redux/api/cartApi";
import { TCart, TCartItem, TVariant } from "@/types/common";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Loader2, ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useMemo } from "react";

// ── Cart Item Component ──────────────────────────────────────────────────────
function CartItemRow({ item }: { item: TCartItem }) {
    const [updateQuantity, { isLoading: isUpdating }] = useUpdateQuantityMutation();
    const [remove, { isLoading: isRemoving }] = useRemoveFromCartMutation();

    const variant = useMemo(() => {
        return item.product.variants.find(v => v._id === item.variantId || v.sku === item.variantId);
    }, [item.product.variants, item.variantId]);

    if (!variant) return null;

    const price = variant.discountPrice ?? variant.price;
    const subtotal = price * item.quantity;

    const handleUpdateQuantity = async (newQty: number) => {
        if (newQty < 1) return;
        if (newQty > variant.stock) {
            toast.error("Not enough stock available");
            return;
        }
        try {
            await updateQuantity({
                productId: item.product._id,
                variantId: variant._id,
                quantity: newQty
            }).unwrap();
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to update quantity");
        }
    };

    const handleRemove = async () => {
        try {
            await remove({
                productId: item.product._id,
                variantId: variant._id
            }).unwrap();
            toast.success("Item removed from cart");
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to remove item");
        }
    };

    return (
        <div className="group relative flex flex-col sm:flex-row items-center gap-4 py-6 border-b border-orange-100 last:border-0 hover:bg-orange-50/30 transition-colors rounded-xl px-4 -mx-4">
            {/* Product Image */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border border-orange-100 bg-white shadow-sm flex-shrink-0">
                <Image
                    src={item.product.thumbnail || "/placeholder-product.png"}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                />
            </div>

            {/* Content info */}
            <div className="flex-1 min-w-0 text-center sm:text-left">
                <Link href={`/products/${item.product._id}`} className="inline-block group-hover:text-[#B5451B] transition-colors">
                    <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1 truncate max-w-[250px]">
                        {item.product.name}
                    </h3>
                </Link>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
                    Variant: <span className="text-[#B5451B]">{variant.name}</span>
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-3">
                    <span className="font-bold text-[#B5451B]">৳{price}</span>
                    {variant.discountPrice && (
                        <span className="text-xs text-gray-400 line-through">৳{variant.price}</span>
                    )}
                </div>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-3 bg-white border border-orange-100 rounded-full p-1 shadow-sm">
                <button
                    onClick={() => handleUpdateQuantity(item.quantity - 1)}
                    disabled={item.quantity <= 1 || isUpdating}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-orange-50 disabled:opacity-30 transition-colors cursor-pointer"
                >
                    <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-6 text-center font-bold text-gray-900 text-sm">
                    {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto" /> : item.quantity}
                </span>
                <button
                    onClick={() => handleUpdateQuantity(item.quantity + 1)}
                    disabled={isUpdating || item.quantity >= variant.stock}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-orange-50 disabled:opacity-30 transition-colors cursor-pointer"
                >
                    <Plus className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* Total & Remove */}
            <div className="sm:w-32 text-center sm:text-right flex flex-col items-center sm:items-end gap-2">
                <span className="font-bold text-gray-900 text-lg">৳{subtotal}</span>
                <button
                    onClick={handleRemove}
                    disabled={isRemoving}
                    className="text-gray-400 hover:text-red-500 p-2 transition-colors disabled:opacity-50 cursor-pointer"
                    title="Remove item"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

// ── Main Cart Page ───────────────────────────────────────────────────────────
export default function CartPage() {
    const { data: cartData, refetch, isLoading, isError } = useGetCartQuery({});
    const cart = cartData as TCart | undefined;

    // console.log('cart', cartData)
    const subtotal = useMemo(() => {
        if (!cart?.items) return 0;
        return cart.items.reduce((acc, item) => {
            const variant = item.product.variants.find(v => v._id === item.variantId || v.sku === item.variantId);
            const price = variant?.discountPrice ?? variant?.price ?? 0;
            return acc + (price * item.quantity);
        }, 0);
    }, [cart?.items]);

    const shippingCharge = subtotal > 0 ? 60 : 0;
    const total = subtotal + shippingCharge;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-[#B5451B]" />
                    <p className="text-gray-500 font-medium">Preparing your cart...</p>
                </div>
            </div>
        );
    }

    if (isError || !cart?.items || cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center p-4">
                <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="w-12 h-12 text-[#B5451B] opacity-50" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
                <p className="text-gray-500 mb-8 max-w-xs text-center">Looks like you haven't added anything to your cart yet. Let's find something amazing for you!</p>
                <Link href="/products">
                    <Button className="rounded-full px-8 py-6 text-base font-semibold group cursor-pointer" style={{ background: "#B5451B" }}>
                        Start Shopping
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAF8] py-12 lg:py-20">
            <div className="container mx-auto px-4 lg:px-8">
                {/* Header */}
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <Link href="/products" className="inline-flex items-center text-sm font-semibold text-[#B5451B] hover:gap-2 transition-all gap-1 mb-4">
                            <ChevronLeft className="w-4 h-4" /> Back to Products
                        </Link>
                        <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
                            Shopping <span style={{ color: "#B5451B" }}>Cart</span>
                        </h1>
                        <p className="text-gray-500 font-medium">{cart.items.length} items waiting for you</p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-10 items-start">
                    {/* Cart Items List */}
                    <div className="flex-1 w-full bg-white rounded-3xl p-6 sm:p-8 border border-orange-100 shadow-sm">
                        <div className="hidden sm:grid grid-cols-12 gap-4 pb-4 border-b border-orange-100 text-xs font-bold text-gray-400 uppercase tracking-widest">
                            <div className="col-span-6">Product Details</div>
                            <div className="col-span-3 text-center">Quantity</div>
                            <div className="col-span-3 text-right">Subtotal</div>
                        </div>

                        <div className="flex flex-col">
                            {cart.items.map((item, idx) => (
                                <CartItemRow key={`${item.product._id}-${item.variantId}-${idx}`} item={item} />
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <aside className="w-full lg:w-[380px] shrink-0 sticky top-24">
                        <div className="bg-white rounded-3xl border border-orange-100 shadow-sm overflow-hidden">
                            <div className="p-8 border-b border-orange-100 bg-orange-50/20">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>

                                <div className="space-y-4">
                                    <div className="flex justify-between text-gray-600 font-medium">
                                        <span>Subtotal</span>
                                        <span className="text-gray-900 font-bold">৳{subtotal}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 font-medium">
                                        <span>Shipping Charge</span>
                                        <span className="text-gray-900 font-bold">৳{shippingCharge}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 font-medium">
                                        <span>Estimated Tax</span>
                                        <span className="text-gray-900 font-bold">৳0</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 bg-white">
                                <div className="flex justify-between items-center mb-8">
                                    <span className="text-lg font-bold text-gray-900">Total Amount</span>
                                    <span className="text-3xl font-black" style={{ color: "#B5451B" }}>৳{total}</span>
                                </div>

                                <Link href="/checkout">
                                    <Button className="w-full py-7 rounded-2xl text-lg font-bold shadow-xl hover:shadow-2xl transition-all active:scale-[0.98] group cursor-pointer" style={{ background: "#B5451B" }}>
                                        Proceed to Checkout
                                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>

                                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400 font-medium">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                    Secure SSL Encrypted Checkout
                                </div>
                            </div>
                        </div>

                        {/* Promo Code placeholder */}
                        <div className="mt-4 p-6 bg-white rounded-3xl border border-orange-100 shadow-sm">
                            <label className="block text-sm font-bold text-gray-700 mb-3">Optional: Promo Code</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter code"
                                    className="flex-1 bg-gray-50 border border-orange-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#B5451B] transition-colors"
                                />
                                <Button variant="outline" className="rounded-xl border-[#B5451B] text-[#B5451B] font-bold cursor-pointer">Apply</Button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
