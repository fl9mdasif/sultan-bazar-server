"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import {
    useGetAddressesQuery,
    useAddAddressMutation,
    useGetMyProfileQuery
} from "@/redux/api/userApi";
import { useGetCartQuery } from "@/redux/api/cartApi";
import { usePlaceOrderMutation } from "@/redux/api/orderApi";
import { TCart, TSavedAddress, TUser } from "@/types/common";
import {
    MapPin,
    Truck,
    CreditCard,
    CheckCircle,
    Plus,
    ChevronLeft,
    Loader2,
    ShieldCheck,
    Home,
    Briefcase,
    Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetSingleProductQuery } from "@/redux/api/productApi";
import { TProduct, TVariant } from "@/types/common";

// ── Address Card ─────────────────────────────────────────────────────────────
function AddressCard({
    address,
    selected,
    onSelect
}: {
    address: TSavedAddress;
    selected: boolean;
    onSelect: () => void;
}) {
    const Icon = address.label === "Home" ? Home : address.label === "Office" ? Briefcase : Building2;

    return (
        <div
            onClick={onSelect}
            className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${selected
                ? "border-[#B5451B] bg-orange-50/30 ring-4 ring-[#B5451B]/5"
                : "border-orange-100 bg-white hover:border-orange-200"
                }`}
        >
            <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${selected ? "bg-[#B5451B] text-white" : "bg-orange-50 text-[#B5451B]"
                    }`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-gray-900">{address.fullName}</span>
                        {address.isDefault && (
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#D4860A] bg-orange-100 px-2 py-0.5 rounded-full">Default</span>
                        )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{address.phone}</p>
                    <p className="text-sm text-gray-500 line-clamp-2">{address.address}, {address.city}, {address.district}</p>
                </div>
            </div>
            {selected && (
                <div className="absolute top-4 right-4 text-[#B5451B]">
                    <CheckCircle className="w-5 h-5 fill-[#B5451B] text-white" />
                </div>
            )}
        </div>
    );
}

// ── Main Page ────────────────────────────────────────────────────────────────
function CheckoutPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const productIdParam = searchParams.get("productId");
    const variantIdParam = searchParams.get("variantId");
    const qtyParam = searchParams.get("qty");

    const isDirectBuy = !!(productIdParam && variantIdParam && qtyParam);

    const { data: cartData, refetch, isLoading: cartLoading } = useGetCartQuery({}, { skip: isDirectBuy });
    const { data: singleProductData, isLoading: singleProductLoading } = useGetSingleProductQuery(productIdParam as string, { skip: !isDirectBuy });
    const { data: addressData, isLoading: addressesLoading } = useGetAddressesQuery({});
    const { data: profileData } = useGetMyProfileQuery({});
    const [placeOrder, { isLoading: isPlacing }] = usePlaceOrderMutation();
    const [addAddress, { isLoading: isAddingAddress }] = useAddAddressMutation();

    const cart = cartData as TCart | undefined;
    const addresses = addressData as TSavedAddress[] || [];
    const user = profileData as TUser | undefined;

    // console.log('checkout', user);

    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [showNewAddressForm, setShowNewAddressForm] = useState(false);
    const [newAddress, setNewAddress] = useState<Partial<TSavedAddress>>({
        fullName: "",
        phone: "",
        address: "",
        city: "",
        district: "",
        label: "Home"
    });

    useEffect(() => {
        if (addresses.length > 0) {
            const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
            setSelectedAddressId(defaultAddr._id!);
        }
    }, [addresses]);

    const directBuyItem = useMemo(() => {
        if (!isDirectBuy || !singleProductData) return null;
        const p = singleProductData as TProduct;
        const variant = p.variants.find(v => v._id === variantIdParam || v.sku === variantIdParam);
        if (!variant) return null;

        return {
            product: p,
            variantId: variant._id,
            quantity: Number(qtyParam) || 1,
            _id: "direct-buy"
        };
    }, [isDirectBuy, singleProductData, variantIdParam, qtyParam]);

    const checkoutItems = useMemo(() => {
        if (isDirectBuy) {
            return directBuyItem ? [directBuyItem] : [];
        }
        return cart?.items || [];
    }, [isDirectBuy, directBuyItem, cart?.items]);

    const subtotal = useMemo(() => {
        return checkoutItems.reduce((acc, item) => {
            const product = item.product;
            const variant = product.variants.find(v => v._id === item.variantId || v.sku === item.variantId);
            const price = variant?.discountPrice ?? variant?.price ?? 0;
            return acc + (price * item.quantity);
        }, 0);
    }, [checkoutItems]);

    const shippingCharge = subtotal > 0 ? 60 : 0;
    const total = subtotal + shippingCharge;

    const handlePlaceOrder = async () => {
        const selectedAddress = addresses.find(a => a._id === selectedAddressId);
        if (!selectedAddress) {
            toast.error("Please select a shipping address");
            return;
        }

        try {
            const orderData = {
                shippingAddress: {
                    fullName: selectedAddress.fullName,
                    phone: selectedAddress.phone,
                    address: selectedAddress.address,
                    city: selectedAddress.city,
                    district: selectedAddress.district,
                    postalCode: selectedAddress.postalCode || "0000",
                    country: selectedAddress.country || "Bangladesh"
                },
                paymentMethod: "cod", // Cash On Delivery is the only active option
                paymentStatus: "pending",
                items: checkoutItems.map(item => {
                    const product = item.product;
                    const variant = product.variants.find(v => v._id === item.variantId || v.sku === item.variantId);
                    return {
                        productId: product._id,
                        variantId: item.variantId,
                        quantity: item.quantity,
                        price: variant?.discountPrice ?? variant?.price ?? 0
                    };
                }),
                subtotal,
                shippingCharge,
                totalAmount: total
            };

            await placeOrder(orderData).unwrap();
            toast.success("Order placed successfully!");

            // Only refetch cart if we actually purchased from the cart
            if (!isDirectBuy) {
                refetch();
            }

            router.push(`/dashboard/user/orders`);
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to place order");
        }
    };

    const handleAddNewAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addAddress(newAddress as TSavedAddress).unwrap();
            toast.success("Address added!");
            setShowNewAddressForm(false);
            setNewAddress({
                fullName: "",
                phone: "",
                address: "",
                city: "",
                district: "",
                label: "Home"
            });
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to add address");
        }
    };

    if (cartLoading || addressesLoading || singleProductLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
                <Loader2 className="w-10 h-10 animate-spin text-[#B5451B]" />
            </div>
        );
    }

    if (!isDirectBuy && (!cart?.items || cart.items.length === 0)) {
        router.push("/dashboard/user/orders");
        return null;
    }

    if (isDirectBuy && !directBuyItem) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
                <div className="text-center">
                    <p className="text-red-500 font-bold mb-4">Product details not found.</p>
                    <Link href="/products">
                        <Button style={{ background: "#B5451B" }}>Back to Shop</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAF8] py-12 lg:py-20">
            <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
                {/* Header */}
                <div className="mb-10">
                    <Link href={isDirectBuy ? `/products/${productIdParam}` : "/cart"} className="inline-flex items-center text-sm font-semibold text-[#B5451B] hover:gap-2 transition-all gap-1 mb-4">
                        <ChevronLeft className="w-4 h-4" /> Back to {isDirectBuy ? "Product" : "Cart"}
                    </Link>
                    <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
                        Secure <span style={{ color: "#B5451B" }}>Checkout</span>
                    </h1>
                    <p className="text-gray-500 font-medium tracking-wide">
                        {isDirectBuy ? "Complete your direct purchase" : "Finalize your cart and get it delivered to your doorstep"}
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-10 items-start">
                    {/* Left: Forms */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* 1. Shipping Address */}
                        <section className="bg-white rounded-[2.5rem] p-8 border border-orange-100 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 opacity-20 rounded-full blur-2xl -mr-16 -mt-16" />

                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#B5451B] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#B5451B]/20">
                                        <Truck className="w-5 h-5" />
                                    </div>
                                    Shipping Information
                                </h3>
                                {!showNewAddressForm && (
                                    <Button
                                        onClick={() => setShowNewAddressForm(true)}
                                        variant="outline"
                                        className="rounded-full border-orange-100 text-[#B5451B] hover:bg-orange-50 font-bold cursor-pointer"
                                    >
                                        <Plus className="w-4 h-4 mr-2" /> Add New
                                    </Button>
                                )}
                            </div>

                            {showNewAddressForm ? (
                                <form onSubmit={handleAddNewAddress} className="space-y-6 bg-orange-50/30 p-8 rounded-3xl border border-orange-100">
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-gray-500">Full Name</label>
                                            <input
                                                required
                                                value={newAddress.fullName}
                                                onChange={e => setNewAddress({ ...newAddress, fullName: e.target.value })}
                                                className="w-full bg-white border border-orange-100 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B5451B] transition-all"
                                                placeholder="Recipient name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-gray-500">Phone Number</label>
                                            <input
                                                required
                                                value={newAddress.phone}
                                                onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })}
                                                className="w-full bg-white border border-orange-100 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B5451B] transition-all"
                                                placeholder="Active mobile number"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-500">Detailed Address</label>
                                        <textarea
                                            required
                                            value={newAddress.address}
                                            onChange={e => setNewAddress({ ...newAddress, address: e.target.value })}
                                            className="w-full bg-white border border-orange-100 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B5451B] transition-all min-h-[100px]"
                                            placeholder="House no, Street name, Area..."
                                        />
                                    </div>
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-gray-500">City</label>
                                            <input
                                                required
                                                value={newAddress.city}
                                                onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                                                className="w-full bg-white border border-orange-100 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B5451B] transition-all"
                                                placeholder="City name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-gray-500">District</label>
                                            <input
                                                required
                                                value={newAddress.district}
                                                onChange={e => setNewAddress({ ...newAddress, district: e.target.value })}
                                                className="w-full bg-white border border-orange-100 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B5451B] transition-all"
                                                placeholder="District"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-4 pt-4">
                                        <Button type="submit" disabled={isAddingAddress} className="bg-[#B5451B] hover:bg-[#8B3515] rounded-xl px-8 py-6 h-auto font-bold flex-1 cursor-pointer">
                                            {isAddingAddress ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Address"}
                                        </Button>
                                        <Button type="button" variant="ghost" onClick={() => setShowNewAddressForm(false)} className="rounded-xl px-8 h-auto font-bold text-gray-500 cursor-pointer">Cancel</Button>
                                    </div>
                                </form>
                            ) : (
                                <div className="grid sm:grid-cols-2 gap-6">
                                    {addresses.map(addr => (
                                        <AddressCard
                                            key={addr._id}
                                            address={addr}
                                            selected={selectedAddressId === addr._id}
                                            onSelect={() => setSelectedAddressId(addr._id!)}
                                        />
                                    ))}
                                    {addresses.length === 0 && (
                                        <div className="col-span-full py-12 text-center bg-orange-50/20 border-2 border-dashed border-orange-100 rounded-[2rem]">
                                            <MapPin className="w-12 h-12 text-[#B5451B] opacity-20 mx-auto mb-4" />
                                            <p className="font-bold text-gray-400">No saved addresses found</p>
                                            <Button onClick={() => setShowNewAddressForm(true)} variant="link" className="text-[#B5451B] mt-2 font-bold cursor-pointer">Add your first address</Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </section>

                        {/* 2. Payment Method */}
                        <section className="bg-white rounded-[2.5rem] p-8 border border-orange-100 shadow-sm">
                            <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3 mb-8 tracking-tight">
                                <div className="w-10 h-10 bg-[#B5451B] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#B5451B]/20">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                                Payment Selection
                            </h3>

                            <div className="grid sm:grid-cols-2 gap-6">
                                {/* COD - Active */}
                                <div className="relative p-6 rounded-3xl border-2 border-[#B5451B] bg-orange-50/30 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-[#B5451B] text-white rounded-2xl flex items-center justify-center shadow-lg">
                                            <CheckCircle className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-900 tracking-tight">Cash On Delivery</p>
                                            <p className="text-xs text-[#B5451B] font-bold uppercase tracking-widest mt-1">Recommended</p>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-xs text-gray-500 font-medium leading-relaxed">Pay conveniently with cash when your sultan treasures arrive at your door.</p>
                                </div>

                                {/* Disabled Options */}
                                <div className="relative p-6 rounded-3xl border-2 border-gray-100 bg-gray-50 opacity-40 cursor-not-allowed overflow-hidden">
                                    <div className="absolute inset-0 bg-white/40 z-10 flex items-center justify-center">
                                        <span className="bg-gray-900 text-white text-[9px] font-black px-4 py-1 rounded-full uppercase tracking-tighter">Coming Soon</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-200 text-gray-400 rounded-2xl flex items-center justify-center">
                                            <CreditCard className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-500">Digital Payment</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">bKash, Nagad, Cards</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right: Order Summary */}
                    <aside className="lg:col-span-4 sticky top-24">
                        <div className="bg-white rounded-[2.5rem] border border-orange-100 shadow-xl overflow-hidden">
                            <div className="p-8 border-b border-orange-100 bg-orange-50/20">
                                <h3 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">Order Summary</h3>

                                <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                                    {checkoutItems.map((item, idx) => {
                                        const product = item.product;
                                        const variant = product.variants.find(v => v._id === item.variantId || v.sku === item.variantId);
                                        const price = variant?.discountPrice ?? variant?.price ?? 0;
                                        return (
                                            <div key={idx} className="flex gap-4">
                                                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-orange-100 bg-white flex-shrink-0">
                                                    <Image src={product.thumbnail} alt="" fill className="object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-gray-900 leading-tight mb-1 truncate">{product.name}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{variant?.name} × {item.quantity}</p>
                                                    <p className="text-sm font-black text-[#B5451B]">৳{price * item.quantity}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="p-8 space-y-4 border-b border-orange-100">
                                <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                                    <span>SUBTOTAL</span>
                                    <span className="text-gray-900">৳{subtotal}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                                    <span>SHIPPING</span>
                                    <span className="text-gray-900">৳{shippingCharge}</span>
                                </div>
                            </div>

                            <div className="p-8 bg-white">
                                <div className="flex justify-between items-end mb-8">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 font-sans">Total to Pay</p>
                                        <p className="text-4xl font-black" style={{ color: "#B5451B" }}>৳{total}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest flex items-center justify-end gap-1">
                                            <ShieldCheck className="w-3 h-3" /> Secure
                                        </p>
                                    </div>
                                </div>

                                <Button
                                    onClick={handlePlaceOrder}
                                    disabled={isPlacing || checkoutItems.length === 0}
                                    className="w-full py-8 rounded-[1.5rem] text-xl font-black shadow-2xl hover:shadow-[#B5451B]/20 transition-all active:scale-[0.98] group flex items-center justify-center gap-3 cursor-pointer"
                                    style={{ background: "linear-gradient(135deg, #B5451B, #D4860A)", color: "white" }}
                                >
                                    {isPlacing ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        <>PLACE ORDER <CheckCircle className="w-6 h-6 group-hover:scale-110 transition-transform" /></>
                                    )}
                                </Button>

                                <div className="mt-8 flex items-center justify-center gap-3">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center overflow-hidden">
                                                <div className="w-full h-full bg-gray-200" />
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        Trusted by 10k+ Sultans
                                    </p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>


    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
                <Loader2 className="w-10 h-10 animate-spin text-[#B5451B]" />
            </div>
        }>
            <CheckoutPageContent />
        </Suspense>
    );
}
