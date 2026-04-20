"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import {
    useGetAddressesQuery,
    useAddAddressMutation,
    useGetMyProfileQuery,
    useGuestCheckoutMutation,
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
    Building2,
    User,
    Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetSingleProductQuery } from "@/redux/api/productApi";
import { TProduct, TVariant } from "@/types/common";
import { AddressModal } from "@/components/dashboard/AddressModal";
import { isLoggedIn, storeUserInfo } from "@/services/auth.services";

// Redux local cart
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearLocalCart, LocalCartItem } from "@/redux/features/localCartSlice";
import { useAddToCartMutation } from "@/redux/api/cartApi";

// ── Address Card ─────────────────────────────────────────────────────────────
function AddressCard({
    address,
    selected,
    onSelect,
}: {
    address: TSavedAddress;
    selected: boolean;
    onSelect: () => void;
}) {
    const Icon =
        address.label === "Home"
            ? Home
            : address.label === "Office"
                ? Briefcase
                : Building2;

    return (
        <div
            onClick={onSelect}
            className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${selected
                ? "border-[#B5451B] bg-orange-50/30 ring-4 ring-[#B5451B]/5"
                : "border-orange-100 bg-white hover:border-orange-200"
                }`}
        >
            <div className="flex items-start gap-4">
                <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${selected
                        ? "bg-[#B5451B] text-white"
                        : "bg-orange-50 text-[#B5451B]"
                        }`}
                >
                    <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-gray-900">
                            {address.fullName}
                        </span>
                        {address.isDefault && (
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#D4860A] bg-orange-100 px-2 py-0.5 rounded-full">
                                Default
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{address.phone}</p>
                    <p className="text-sm text-gray-500 line-clamp-2">
                        {address.address}, {address.city}, {address.district}
                    </p>
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

// ── Guest Checkout Form ──────────────────────────────────────────────────────
interface GuestShippingForm {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    postalCode: string;
}

function GuestShippingSection({
    form,
    onChange,
    errors,
}: {
    form: GuestShippingForm;
    onChange: (f: GuestShippingForm) => void;
    errors: Record<string, string>;
}) {
    const inputCls =
        "w-full rounded-xl border border-orange-100 bg-gray-50/50 px-4 py-3 text-sm font-semibold outline-none focus:border-[#B5451B] focus:bg-white transition-all shadow-sm";
    const errorInputCls =
        "w-full rounded-xl border border-red-300 bg-red-50/5 px-4 py-3 text-sm font-semibold outline-none focus:border-red-500 transition-all shadow-sm";
    const labelCls =
        "text-[10px] font-black text-gray-400 uppercase tracking-widest block px-1 mb-1.5";
    const errorLabelCls =
        "text-[10px] font-black text-red-500 uppercase tracking-widest block px-1 mb-1.5";

    return (
        <section className="bg-white rounded-[2.5rem] p-8 border border-orange-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 opacity-20 rounded-full blur-2xl -mr-16 -mt-16" />
            <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3 mb-8 tracking-tight">
                <div className="w-10 h-10 bg-[#B5451B] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#B5451B]/20">
                    <Truck className="w-5 h-5" />
                </div>
                Shipping Information
            </h3>

            <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label className={errors.fullName ? errorLabelCls : labelCls}>Full Name *</label>
                        <input
                            type="text"
                            className={errors.fullName ? errorInputCls : inputCls}
                            placeholder="e.g. Asif Ahmed"
                            value={form.fullName}
                            onChange={(e) =>
                                onChange({ ...form, fullName: e.target.value })
                            }
                        />
                        {errors.fullName && <p className="text-[10px] font-bold text-red-500 mt-1 uppercase px-1">{errors.fullName}</p>}
                    </div>
                    <div>
                        <label className={errors.email ? errorLabelCls : labelCls}>Email *</label>
                        <input
                            type="email"
                            className={errors.email ? errorInputCls : inputCls}
                            placeholder="your@email.com"
                            value={form.email}
                            onChange={(e) =>
                                onChange({ ...form, email: e.target.value })
                            }
                        />
                        {errors.email && <p className="text-[10px] font-bold text-red-500 mt-1 uppercase px-1">{errors.email}</p>}
                    </div>
                </div>

                <div>
                    <label className={errors.phone ? errorLabelCls : labelCls}>Phone Number *</label>
                    <input
                        type="tel"
                        className={errors.phone ? errorInputCls : inputCls}
                        placeholder="017XXXXXXXX"
                        value={form.phone}
                        onChange={(e) =>
                            onChange({ ...form, phone: e.target.value })
                        }
                    />
                    {errors.phone && <p className="text-[10px] font-bold text-red-500 mt-1 uppercase px-1">{errors.phone}</p>}
                </div>

                <div>
                    <label className={errors.address ? errorLabelCls : labelCls}>Street Address *</label>
                    <textarea
                        rows={2}
                        className={`${errors.address ? errorInputCls : inputCls} resize-none`}
                        placeholder="House, Road, Area..."
                        value={form.address}
                        onChange={(e) =>
                            onChange({ ...form, address: e.target.value })
                        }
                    />
                    {errors.address && <p className="text-[10px] font-bold text-red-500 mt-1 uppercase px-1">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                        <label className={errors.city ? errorLabelCls : labelCls}>City *</label>
                        <input
                            type="text"
                            className={errors.city ? errorInputCls : inputCls}
                            placeholder="e.g. Dhaka"
                            value={form.city}
                            onChange={(e) =>
                                onChange({ ...form, city: e.target.value })
                            }
                        />
                        {errors.city && <p className="text-[10px] font-bold text-red-500 mt-1 uppercase px-1">{errors.city}</p>}
                    </div>
                    <div>
                        <label className={errors.district ? errorLabelCls : labelCls}>District *</label>
                        <input
                            type="text"
                            className={errors.district ? errorInputCls : inputCls}
                            placeholder="e.g. Dhaka"
                            value={form.district}
                            onChange={(e) =>
                                onChange({ ...form, district: e.target.value })
                            }
                        />
                        {errors.district && <p className="text-[10px] font-bold text-red-500 mt-1 uppercase px-1">{errors.district}</p>}
                    </div>
                    <div>
                        <label className={labelCls}>Postal Code</label>
                        <input
                            type="text"
                            className={inputCls}
                            placeholder="e.g. 1200"
                            value={form.postalCode}
                            onChange={(e) =>
                                onChange({ ...form, postalCode: e.target.value })
                            }
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

// ── Main Checkout Content ────────────────────────────────────────────────────
function CheckoutPageContent() {
    // ... (rest of search/dispatch code)
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();
    const productIdParam = searchParams.get("productId");
    const variantIdParam = searchParams.get("variantId");
    const qtyParam = searchParams.get("qty");

    const isDirectBuy = !!(productIdParam && variantIdParam && qtyParam);
    const userLoggedIn = isLoggedIn();

    // ── Remote data (only when logged in) ─────────────────────────────
    const { data: cartData, refetch: refetchCart, isLoading: cartLoading } = useGetCartQuery(
        {},
        { skip: isDirectBuy || !userLoggedIn }
    );
    const { data: singleProductData, isLoading: singleProductLoading } = useGetSingleProductQuery(
        productIdParam as string,
        { skip: !isDirectBuy }
    );
    const { data: addressData, isLoading: addressesLoading } = useGetAddressesQuery(
        {},
        { skip: !userLoggedIn }
    );
    const { data: profileData } = useGetMyProfileQuery(
        {},
        { skip: !userLoggedIn }
    );
    const [placeOrder, { isLoading: isPlacing }] = usePlaceOrderMutation();
    const [addAddress, { isLoading: isAddingAddress }] = useAddAddressMutation();
    const [guestCheckout, { isLoading: isGuestLoading }] = useGuestCheckoutMutation();
    const [addToCart] = useAddToCartMutation();

    // ── Local guest cart ───────────────────────────────────────────────
    const localCartItems = useAppSelector((state) => state.localCart.items);

    const cart = cartData as TCart | undefined;
    const addresses = (addressData as TSavedAddress[]) || [];

    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [addressToEdit, setAddressToEdit] = useState<TSavedAddress | undefined>(undefined);

    // Guest shipping form state
    const [guestForm, setGuestForm] = useState<GuestShippingForm>({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        district: "",
        postalCode: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateGuestForm = () => {
        const newErrors: Record<string, string> = {};
        if (!guestForm.fullName.trim()) newErrors.fullName = "Full name is required";
        if (!guestForm.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(guestForm.email)) {
            newErrors.email = "Invalid email format";
        }
        if (!guestForm.phone.trim()) newErrors.phone = "Phone number is required";
        if (!guestForm.address.trim()) newErrors.address = "Street address is required";
        if (!guestForm.city.trim()) newErrors.city = "City is required";
        if (!guestForm.district.trim()) newErrors.district = "District is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleGuestFormChange = (f: GuestShippingForm) => {
        setGuestForm(f);
        // Clear errors as user types
        setErrors({});
    };

    useEffect(() => {
        if (addresses.length > 0) {
            const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
            setSelectedAddressId(defaultAddr._id!);
        }
    }, [addresses]);

    const directBuyItem = useMemo(() => {
        if (!isDirectBuy || !singleProductData) return null;
        const p = singleProductData as TProduct;
        const variant = p.variants.find(
            (v) => v._id === variantIdParam || v.sku === variantIdParam
        );
        if (!variant) return null;
        return {
            product: p,
            variantId: variant._id,
            quantity: Number(qtyParam) || 1,
            _id: "direct-buy",
        };
    }, [isDirectBuy, singleProductData, variantIdParam, qtyParam]);

    // Build checkout items list
    const checkoutItems = useMemo(() => {
        if (isDirectBuy) return directBuyItem ? [directBuyItem] : [];
        if (userLoggedIn) return cart?.items || [];
        // Guest: use local cart
        return localCartItems.map((item) => ({
            product: item.product,
            variantId: item.variantId,
            quantity: item.quantity,
            _id: `${item.productId}-${item.variantId}`,
        }));
    }, [isDirectBuy, directBuyItem, userLoggedIn, cart?.items, localCartItems]);

    const SHIPPING_CHARGE = 60;
    const FREE_SHIPPING_THRESHOLD = 10000;

    const subtotal = useMemo(() => {
        return checkoutItems.reduce((acc, item) => {
            const product = item.product;
            const variant = product.variants.find(
                (v: TVariant) => v._id === item.variantId || v.sku === item.variantId
            );
            const price = variant?.discountPrice ?? variant?.price ?? 0;
            return acc + price * item.quantity;
        }, 0);
    }, [checkoutItems]);

    const shippingCharge =
        subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD ? SHIPPING_CHARGE : 0;
    const total = subtotal + shippingCharge;

    // ── Place order (logged-in user) ──────────────────────────────────
    const handlePlaceOrderLoggedIn = async () => {
        const selectedAddress = addresses.find((a) => a._id === selectedAddressId);
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
                    country: selectedAddress.country || "Bangladesh",
                },
                paymentMethod: "cod",
                paymentStatus: "pending",
                items: checkoutItems.map((item) => ({
                    productId: item.product._id,
                    variantId: item.variantId,
                    quantity: item.quantity,
                })),
                note: "",
            };

            await placeOrder(orderData).unwrap();
            toast.success("Order placed successfully!");
            if (!isDirectBuy) refetchCart();
            router.push("/dashboard/user/orders");
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to place order");
        }
    };

    // ── Place order (guest) ───────────────────────────────────────────
    const handlePlaceOrderGuest = async () => {
        if (!validateGuestForm()) {
            toast.error("Please correct the errors in the shipping form");
            return;
        }
        if (checkoutItems.length === 0) {
            toast.error("Your cart is empty");
            return;
        }

        try {
            const { fullName, email, phone, address, city, district } = guestForm;
            // 1. Auto-register / login ghost user
            toast.loading("Setting up your account...", { id: "guest-checkout" });
            const res = await guestCheckout({ email, fullName, phone }).unwrap();

            // Handle both { data: { accessToken } } and direct { accessToken } formats
            const accessToken = res?.data?.accessToken || (res as any)?.accessToken;

            if (!accessToken) {
                throw new Error("Failed to authenticate your session");
            }

            // 2. Store token so subsequent API calls are authenticated
            storeUserInfo({ accessToken });
            toast.loading("Syncing your cart...", { id: "guest-checkout" });

            // 3. Sync local cart items to backend
            for (const item of localCartItems) {
                try {
                    await addToCart({
                        productId: item.productId,
                        variantId: item.variantId,
                        quantity: item.quantity,
                    }).unwrap();
                } catch (err) {
                    // individual item failures are non-fatal
                }
            }

            // 4. Place the order
            toast.loading("Placing your order...", { id: "guest-checkout" });
            const orderData = {
                shippingAddress: {
                    fullName,
                    phone,
                    address,
                    city,
                    district,
                    postalCode: guestForm.postalCode || "0000",
                    country: "Bangladesh",
                },
                paymentMethod: "cod",
                items: checkoutItems.map((item) => ({
                    productId: item.product._id,
                    variantId: item.variantId,
                    quantity: item.quantity,
                })),
                note: "",
            };

            await placeOrder(orderData).unwrap();
            // console.log(res1);

            // 5. Clear local cart
            dispatch(clearLocalCart());

            toast.success("Order placed successfully! 🎉", { id: "guest-checkout" });
            router.push("/products");
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to place order", {
                id: "guest-checkout",
            });
        }
    };

    // ── Redirect if cart is empty (logged-in) ─────────────────────────
    useEffect(() => {
        if (
            !cartLoading &&
            !isDirectBuy &&
            userLoggedIn &&
            (!cart?.items || cart.items.length === 0)
        ) {
            router.push("/dashboard/user/orders");
        }
    }, [cartLoading, isDirectBuy, userLoggedIn, cart?.items, router]);

    // ── Loading guard ──────────────────────────────────────────────────
    if (
        (userLoggedIn && (cartLoading || addressesLoading)) ||
        singleProductLoading
    ) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
                <Loader2 className="w-10 h-10 animate-spin text-[#B5451B]" />
            </div>
        );
    }

    if (!isDirectBuy && userLoggedIn && (!cart?.items || cart.items.length === 0)) {
        return null;
    }

    if (!isDirectBuy && !userLoggedIn && localCartItems.length === 0) {
        return (
            <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center p-4">
                <p className="text-gray-500 font-bold mb-4">Your cart is empty.</p>
                <Link href="/products">
                    <Button style={{ background: "#B5451B" }}>Start Shopping</Button>
                </Link>
            </div>
        );
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

    const isProcessing = isPlacing || isGuestLoading;

    return (
        <div className="min-h-screen bg-[#FAFAF8] py-12 lg:py-20">
            <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
                {/* Header */}
                <div className="mb-10">
                    <Link
                        href={isDirectBuy ? `/products/${productIdParam}` : "/cart"}
                        className="inline-flex items-center text-sm font-semibold text-[#B5451B] hover:gap-2 transition-all gap-1 mb-4"
                    >
                        <ChevronLeft className="w-4 h-4" /> Back to{" "}
                        {isDirectBuy ? "Product" : "Cart"}
                    </Link>
                    <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
                        Secure <span style={{ color: "#B5451B" }}>Checkout</span>
                    </h1>
                    <p className="text-gray-500 font-medium tracking-wide">
                        {isDirectBuy
                            ? "Complete your direct purchase"
                            : "Finalize your cart and get it delivered to your doorstep"}
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-10 items-start">
                    {/* Left: Forms */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* ── Shipping Address ── */}
                        {userLoggedIn ? (
                            <section className="bg-white rounded-[2.5rem] p-8 border border-orange-100 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 opacity-20 rounded-full blur-2xl -mr-16 -mt-16" />
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#B5451B] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#B5451B]/20">
                                            <Truck className="w-5 h-5" />
                                        </div>
                                        Shipping Information
                                    </h3>
                                    <Button
                                        onClick={() => {
                                            setAddressToEdit(undefined);
                                            setIsAddressModalOpen(true);
                                        }}
                                        variant="outline"
                                        className="rounded-full border-orange-100 text-[#B5451B] hover:bg-orange-50 font-bold cursor-pointer"
                                    >
                                        <Plus className="w-4 h-4 mr-2" /> Add New
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {addresses.map((addr: TSavedAddress) => (
                                        <div key={addr._id} className="relative group">
                                            <AddressCard
                                                address={addr}
                                                selected={selectedAddressId === addr._id}
                                                onSelect={() => setSelectedAddressId(addr._id!)}
                                            />
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setAddressToEdit(addr);
                                                    setIsAddressModalOpen(true);
                                                }}
                                                className="absolute top-4 right-12 p-1.5 rounded-lg bg-white/80 backdrop-blur-sm border border-orange-100 text-[#B5451B] opacity-0 group-hover:opacity-100 transition-all hover:bg-[#B5451B] hover:text-white"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                                            </button>
                                        </div>
                                    ))}
                                    {addresses.length === 0 && (
                                        <div className="col-span-full py-12 text-center bg-orange-50/20 border-2 border-dashed border-orange-100 rounded-[2rem]">
                                            <MapPin className="w-12 h-12 text-[#B5451B] opacity-20 mx-auto mb-4" />
                                            <p className="font-bold text-gray-400">No saved addresses found</p>
                                            <Button
                                                onClick={() => {
                                                    setAddressToEdit(undefined);
                                                    setIsAddressModalOpen(true);
                                                }}
                                                variant="link"
                                                className="text-[#B5451B] mt-2 font-bold cursor-pointer"
                                            >
                                                Add your first address
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </section>
                        ) : (
                            /* Guest shipping form */
                            <GuestShippingSection
                                form={guestForm}
                                onChange={handleGuestFormChange}
                                errors={errors}
                            />
                        )}

                        {/* ── Payment Method ── */}
                        <section className="bg-white rounded-[2.5rem] p-8 border border-orange-100 shadow-sm">
                            <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3 mb-8 tracking-tight">
                                <div className="w-10 h-10 bg-[#B5451B] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#B5451B]/20">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                                Payment Selection
                            </h3>

                            <div className="grid sm:grid-cols-2 gap-6">
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
                                    <p className="mt-4 text-xs text-gray-500 font-medium leading-relaxed">
                                        Pay conveniently with cash when your sultan treasures arrive at your door.
                                    </p>
                                </div>

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
                                        const variant = product.variants.find(
                                            (v: TVariant) => v._id === item.variantId || v.sku === item.variantId
                                        );
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
                                    <span>SUBTOTAL</span><span className="text-gray-900">৳{subtotal}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                                    <span>SHIPPING</span><span className="text-gray-900">৳{shippingCharge}</span>
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
                                    onClick={userLoggedIn ? handlePlaceOrderLoggedIn : handlePlaceOrderGuest}
                                    disabled={isProcessing || checkoutItems.length === 0}
                                    className="w-full py-8 rounded-[1.5rem] text-xl font-black shadow-2xl hover:shadow-[#B5451B]/20 transition-all active:scale-[0.98] group flex items-center justify-center gap-3 cursor-pointer"
                                    style={{
                                        background: "linear-gradient(135deg, #B5451B, #D4860A)",
                                        color: "white",
                                    }}
                                >
                                    {isProcessing ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        <>
                                            PLACE ORDER{" "}
                                            <CheckCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                        </>
                                    )}
                                </Button>

                                {!userLoggedIn && (
                                    <p className="mt-4 text-center text-xs text-gray-400 font-medium">
                                        Already have an account?{" "}
                                        <Link href="/login" className="text-[#B5451B] font-bold hover:underline">
                                            Login here
                                        </Link>
                                    </p>
                                )}

                                <div className="mt-8 flex items-center justify-center gap-3">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map((i) => (
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
            {userLoggedIn && (
                <AddressModal
                    isOpen={isAddressModalOpen}
                    onClose={() => setIsAddressModalOpen(false)}
                    addressToEdit={addressToEdit}
                />
            )}
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
                    <Loader2 className="w-10 h-10 animate-spin text-[#B5451B]" />
                </div>
            }
        >
            <CheckoutPageContent />
        </Suspense>
    );
}
