"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Star, ShoppingCart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetAllProductsQuery } from "@/redux/api/productApi";
import { TProduct, TVariant } from "@/types/common";
import { useAddToCartMutation } from "@/redux/api/cartApi";
import { toast } from "sonner";
import { isLoggedIn } from "@/services/auth.services";
import Link from "next/link";
import Image from "next/image";
import { useAppDispatch } from "@/redux/hooks";
import { addItemToLocalCart } from "@/redux/features/localCartSlice";

function Stars({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
                <Star
                    key={i}
                    className="w-3.5 h-3.5"
                    fill={i <= Math.round(rating) ? "#D4860A" : "none"}
                    stroke={i <= Math.round(rating) ? "#D4860A" : "#ccc"}
                />
            ))}
        </div>
    );
}

function ProductCard({ product }: { product: TProduct }) {
    const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
    const [wishlisted, setWishlisted] = useState(false);
    const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
    const [localAdding, setLocalAdding] = useState(false);
    const dispatch = useAppDispatch();

    const variant = product.variants[selectedVariantIndex];
    if (!variant) return null;

    const price = variant.discountPrice ?? variant.price;
    const originalPrice = variant.price;
    const hasDiscount = !!variant.discountPrice;
    const discount = hasDiscount
        ? Math.round(((originalPrice - (variant.discountPrice ?? 0)) / originalPrice) * 100)
        : 0;

    const inStock = (variant.isAvailable ?? true) && variant.stock > 0;

    const router = useRouter();

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isLoggedIn()) {
            // Guest: save to localStorage cart
            setLocalAdding(true);
            dispatch(addItemToLocalCart({ product, variant, quantity: 1 }));
            toast.success(`${product.name} added to cart!`);
            setTimeout(() => setLocalAdding(false), 600);
            return;
        }

        try {
            await addToCart({
                productId: product._id,
                variantId: variant._id,
                quantity: 1
            }).unwrap();
            toast.success(`${product.name} added to cart!`);
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to add to cart");
        }
    };

    const adding = isAdding || localAdding;

    return (
        <Link href={`/products/${product._id}`}>
            <div
                className="hover-lift bg-white rounded-2xl overflow-hidden border flex flex-col h-full cursor-pointer group"
                style={{ borderColor: "#F0E6D3" }}
            >
                {/* Image */}
                <div className="relative aspect-square bg-gradient-to-br from-amber-50 to-orange-50 overflow-hidden">
                    {product.thumbnail ? (
                        <Image
                            src={product.thumbnail}
                            alt={product.name}
                            fill

                            className="object-cover transition-transform group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl bg-gray-100 text-gray-400">
                            📦
                        </div>
                    )}

                    {/* Wishlist button */}
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setWishlisted(!wishlisted); }}
                        className="absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center transition-transform hover:scale-110"
                    >
                        <Heart
                            className="w-4 h-4"
                            fill={wishlisted ? "#B5451B" : "none"}
                            stroke={wishlisted ? "#B5451B" : "#9ca3af"}
                        />
                    </button>

                    {/* Tag */}
                    {product.isFeatured && (
                        <span
                            className="absolute top-3 left-3 z-10 text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                            style={{ background: "#B5451B" }}
                        >
                            Featured
                        </span>
                    )}

                    {/* Discount badge */}
                    {discount > 0 && (
                        <span className="absolute bottom-3 left-3 z-10 text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500 text-white">
                            -{discount}%
                        </span>
                    )}
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-gray-800 text-sm leading-tight mb-1 hover:text-[#B5451B] transition-colors line-clamp-2 min-h-[2.5rem]">
                        {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1.5 mb-3">
                        <Stars rating={product.rating ?? 0} />
                        <span className="text-xs text-gray-400">({product.reviewCount ?? 0})</span>
                    </div>

                    {/* Variants */}
                    {product.variants.length > 1 && (
                        <div className="flex gap-1.5 flex-wrap mb-4">
                            {product.variants.map((v, i) => (
                                <button
                                    key={v.sku || i}
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedVariantIndex(i); }}
                                    className="text-[10px] px-2 py-0.5 rounded-full border font-medium transition-all"
                                    style={
                                        i === selectedVariantIndex
                                            ? { background: "#B5451B", color: "white", borderColor: "#B5451B" }
                                            : { borderColor: "#E0C9B0", color: "#666" }
                                    }
                                >
                                    {v.name}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="mt-auto space-y-3">
                        {/* Price */}
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-bold" style={{ color: "#B5451B" }}>
                                ৳{price}
                            </span>
                            {hasDiscount && (
                                <span className="text-sm text-gray-400 line-through">
                                    ৳{originalPrice}
                                </span>
                            )}
                            {/* Stock */}
                            <span
                                className="ml-auto text-[10px] font-medium px-2 py-0.5 rounded-full"
                                style={
                                    inStock
                                        ? { background: "#dcfce7", color: "#16a34a" }
                                        : { background: "#f3f4f6", color: "#9ca3af" }
                                }
                            >
                                {inStock ? "In Stock" : "Out of Stock"}
                            </span>
                        </div>

                        {/* Add to cart */}
                        <Button
                            onClick={handleAddToCart}
                            className="w-full cursor-pointer text-white font-semibold text-xs rounded-full py-1.5 h-9"
                            style={{ background: "#B5451B" }}
                            disabled={!inStock || adding}
                        >
                            {adding ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
                            ) : (
                                <ShoppingCart className="w-3.5 h-3.5 mr-2" />
                            )}
                            {adding ? "Adding..." : "Add to Cart"}
                        </Button>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default function FeaturedProducts() {
    const { data, isLoading, isError } = useGetAllProductsQuery({ isFeatured: true, limit: 8 });

    // console.log('fp', data);
    const products = data?.data || [];

    if (isLoading) {
        return (
            <section className="py-12 lg:py-20 bg-[#FDF6EC]/50">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex flex-col items-center justify-center gap-4 py-20 bg-white/50 rounded-3xl border border-orange-100 shadow-sm">
                        <Loader2 className="w-10 h-10 animate-spin text-[#B5451B]" />
                        <p className="text-gray-500 font-medium">Discovering sultan treasures...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (isError) {
        return (
            <section className="py-12 lg:py-20 bg-red-50/30">
                <div className="container mx-auto px-4 text-center">
                    <div className="py-12 bg-white rounded-3xl border border-red-100 shadow-sm max-w-md mx-auto">
                        <p className="text-red-500 font-medium">Oops! Failed to load products.</p>
                        <Button
                            variant="link"
                            className="mt-2 text-[#B5451B]"
                            onClick={() => window.location.reload()}
                        >
                            Try refreshing
                        </Button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <>
            {/* ── Products Section with bg image ── */}
            <section
                className="py-12 lg:py-20 relative overflow-hidden"
                style={{
                    backgroundImage: "url('/images/product-section-bg-img_1.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundAttachment: "fixed",
                }}
            >
                {/* Light overlay so cards stay readable */}
                <div className="absolute inset-0" style={{ background: "rgba(253,246,236,0.92)" }} />

                <div className="relative z-10 container mx-auto px-4 lg:px-8">
                    {/* Section header */}
                    <div className="text-center mb-12">
                        <p className="text-sm font-bold uppercase tracking-[0.2em] mb-3" style={{ color: "#D4860A" }}>
                            Curated For You
                        </p>
                        <h2 className="text-3xl lg:text-5xl font-black text-gray-900 tracking-tight">
                            Our <span style={{ color: "#B5451B" }}>Best Sellers</span>
                        </h2>
                        <div className="h-1.5 w-24 bg-[#B5451B] mx-auto mt-4 rounded-full" />
                        <p className="text-gray-600 mt-6 max-w-xl mx-auto text-sm lg:text-base leading-relaxed">
                            Experience the authentic taste of Bangladesh with our premium selection of spices, oils, and essentials.
                        </p>
                    </div>

                    {products.length === 0 ? (
                        <div className="text-center py-20 bg-white/40 rounded-3xl border border-orange-100/50 backdrop-blur-sm">
                            <p className="text-gray-500 italic">No featured products available at the moment.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8">
                            {products.map((p: TProduct) => (
                                <ProductCard key={p._id} product={p} />
                            ))}
                        </div>
                    )}

                    <div className="text-center mt-14">
                        <Link href="/products">
                            <Button
                                size="lg"
                                className="rounded-full px-12 font-bold text-white shadow-xl hover:shadow-[#B5451B]/20 transition-all hover:-translate-y-1 py-6 h-auto"
                                style={{ background: "linear-gradient(135deg, #B5451B, #D4860A)" }}
                            >
                                Explore Entire Collection →
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Parallax Banner ── */}
            <div
                className="relative py-20 lg:py-32 text-center"
                style={{
                    backgroundImage: "url('/images/parallax-full-width.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundAttachment: "fixed",
                }}
            >
                <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.6)" }} />
                <div className="relative z-10 container mx-auto px-4">
                    <p className="text-sm font-bold uppercase tracking-[0.4em] mb-4" style={{ color: "#D4860A" }}>Exclusive Celebration</p>
                    <h2 className="text-4xl lg:text-7xl font-black text-white mb-6 drop-shadow-2xl">
                        SAVE <span className="text-[#F5D078]">20%</span> TODAY
                    </h2>
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className="h-0.5 w-12 bg-[#D4860A]/50" />
                        <span className="text-white/70 text-sm font-semibold tracking-widest uppercase">Use Limited Voucher</span>
                        <div className="h-0.5 w-12 bg-[#D4860A]/50" />
                    </div>
                    <div className="inline-block bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-3xl px-12 py-4 mb-10 shadow-2xl">
                        <span className="text-3xl lg:text-4xl font-black tracking-[0.2em] text-white">SULTAN20</span>
                    </div>
                    <div className="block">
                        <Link href="/products"
                            className="inline-flex items-center gap-3 px-12 py-4 rounded-full font-black text-sm lg:text-base hover:scale-105 active:scale-95 transition-all shadow-2xl"
                            style={{ background: "linear-gradient(135deg, #B5451B, #D4860A)", color: "white" }}>
                            Grab the Deal Now →
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
