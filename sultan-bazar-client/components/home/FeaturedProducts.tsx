"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Variant = { label: string; price: number; originalPrice?: number };

type Product = {
    id: number;
    name: string;
    image: string;
    emoji: string;
    rating: number;
    reviews: number;
    inStock: boolean;
    variants: Variant[];
    tag?: string;
};

const products: Product[] = [
    {
        id: 1, name: "Sultan Mustard Oil", emoji: "🫒", image: "/hero-spices.png",
        rating: 4.8, reviews: 234, inStock: true, tag: "Best Seller",
        variants: [
            { label: "250ml", price: 85, originalPrice: 100 },
            { label: "500ml", price: 160, originalPrice: 190 },
            { label: "1L", price: 300, originalPrice: 360 },
        ],
    },
    {
        id: 2, name: "Sultan Biriyani Masala", emoji: "🥘", image: "/hero-spices.png",
        rating: 4.9, reviews: 189, inStock: true, tag: "Popular",
        variants: [{ label: "75g", price: 65, originalPrice: 80 }],
    },
    {
        id: 3, name: "Sultan Premium Beef Masala", emoji: "🥩", image: "/hero-spices.png",
        rating: 4.7, reviews: 142, inStock: true,
        variants: [{ label: "50g", price: 55, originalPrice: 70 }],
    },
    {
        id: 4, name: "Sultan Premium Chicken Masala", emoji: "🍗", image: "/hero-spices.png",
        rating: 4.7, reviews: 118, inStock: true,
        variants: [{ label: "50g", price: 55, originalPrice: 70 }],
    },
    {
        id: 5, name: "Isphahani Mirzapore Tea", emoji: "🍵", image: "/hero-spices.png",
        rating: 4.6, reviews: 312, inStock: true, tag: "Premium",
        variants: [
            { label: "200g", price: 185, originalPrice: 210 },
            { label: "400g", price: 360, originalPrice: 420 },
        ],
    },
    {
        id: 6, name: "Isobgoli — Psyllium Husk", emoji: "🌿", image: "/hero-spices.png",
        rating: 4.5, reviews: 76, inStock: true, tag: "Natural",
        variants: [{ label: "200g", price: 120, originalPrice: 150 }],
    },
    {
        id: 7, name: "Chia Seeds", emoji: "🫘", image: "/hero-spices.png",
        rating: 4.6, reviews: 93, inStock: true,
        variants: [{ label: "100g", price: 95, originalPrice: 120 }],
    },
    {
        id: 8, name: "Esha Aromatic Rice", emoji: "🌾", image: "/hero-spices.png",
        rating: 4.8, reviews: 201, inStock: true, tag: "Export Quality",
        variants: [
            { label: "1kg", price: 110, originalPrice: 130 },
            { label: "5kg", price: 520, originalPrice: 620 },
        ],
    },
];

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

function ProductCard({ product }: { product: Product }) {
    const [selectedVariant, setSelectedVariant] = useState(0);
    const [wishlisted, setWishlisted] = useState(false);

    const variant = product.variants[selectedVariant];
    const discount = variant.originalPrice
        ? Math.round(((variant.originalPrice - variant.price) / variant.originalPrice) * 100)
        : 0;

    return (
        <div
            className="hover-lift bg-white rounded-2xl overflow-hidden border flex flex-col"
            style={{ borderColor: "#F0E6D3" }}
        >
            {/* Image */}
            <div className="relative aspect-square bg-gradient-to-br from-amber-50 to-orange-50 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-7xl">
                    {product.emoji}
                </div>

                {/* Wishlist button */}
                <button
                    onClick={() => setWishlisted(!wishlisted)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center transition-transform hover:scale-110"
                >
                    <Heart
                        className="w-4 h-4"
                        fill={wishlisted ? "#B5451B" : "none"}
                        stroke={wishlisted ? "#B5451B" : "#9ca3af"}
                    />
                </button>

                {/* Tag */}
                {product.tag && (
                    <span
                        className="absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded-full text-white"
                        style={{ background: "#B5451B" }}
                    >
                        {product.tag}
                    </span>
                )}

                {/* Discount badge */}
                {discount > 0 && (
                    <span className="absolute bottom-3 left-3 text-xs font-bold px-2 py-1 rounded-full bg-green-500 text-white">
                        -{discount}%
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-gray-800 text-sm leading-tight mb-1">
                    {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mb-2">
                    <Stars rating={product.rating} />
                    <span className="text-xs text-gray-400">({product.reviews})</span>
                </div>

                {/* Variants */}
                {product.variants.length > 1 && (
                    <div className="flex gap-1.5 flex-wrap mb-3">
                        {product.variants.map((v, i) => (
                            <button
                                key={v.label}
                                onClick={() => setSelectedVariant(i)}
                                className="text-xs px-2.5 py-1 rounded-full border font-medium transition-all"
                                style={
                                    i === selectedVariant
                                        ? { background: "#B5451B", color: "white", borderColor: "#B5451B" }
                                        : { borderColor: "#E0C9B0", color: "#666" }
                                }
                            >
                                {v.label}
                            </button>
                        ))}
                    </div>
                )}

                <div className="mt-auto space-y-3">
                    {/* Price */}
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold" style={{ color: "#B5451B" }}>
                            ৳{variant.price}
                        </span>
                        {variant.originalPrice && (
                            <span className="text-sm text-gray-400 line-through">
                                ৳{variant.originalPrice}
                            </span>
                        )}
                        {/* Stock */}
                        <span
                            className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full"
                            style={
                                product.inStock
                                    ? { background: "#dcfce7", color: "#16a34a" }
                                    : { background: "#f3f4f6", color: "#9ca3af" }
                            }
                        >
                            {product.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                    </div>

                    {/* Add to cart */}
                    <Button
                        className="w-full text-white font-semibold text-sm rounded-full py-2"
                        style={{ background: "#B5451B" }}
                        disabled={!product.inStock}
                    >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default function FeaturedProducts() {
    return (
        <>
            {/* ── Products Section with bg image ── */}
            <section
                className="py-8 lg:py-12 relative"
                style={{
                    backgroundImage: "url('/images/product-section-bg-img_1.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundAttachment: "fixed",
                }}
            >
                {/* Light overlay so cards stay readable */}
                <div className="absolute inset-0" style={{ background: "rgba(253,246,236,0.93)" }} />

                <div className="relative z-10 container mx-auto px-4 lg:px-8">
                    {/* Section header */}
                    <div className="text-center mb-10">
                        <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "#D4860A" }}>
                            Top Picks
                        </p>
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                            Our <span style={{ color: "#B5451B" }}>Best Sellers</span>
                        </h2>
                        <p className="text-gray-600 mt-2">Loved by thousands of Bangladeshi families</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
                        {products.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>

                    <div className="text-center mt-10">
                        <Link href="/products">
                            <Button
                                size="lg"
                                className="rounded-full px-10 font-semibold text-white"
                                style={{ background: "#B5451B" }}
                            >
                                View All Products →
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Parallax Banner ── */}
            <div
                className="relative py-14 lg:py-20 text-center overflow-hidden"
                style={{
                    backgroundImage: "url('/images/parallax-full-width.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundAttachment: "fixed",
                }}
            >
                <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.58)" }} />
                <div className="relative z-10 container mx-auto px-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] mb-3" style={{ color: "#D4860A" }}>Limited Time Offer</p>
                    <h2 className="text-3xl lg:text-5xl font-bold text-white mb-3 drop-shadow-lg">
                        Get <span style={{ color: "#F5D078" }}>20% OFF</span> Sitewide
                    </h2>
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="h-px w-16" style={{ background: "#D4860A" }} />
                        <span className="text-white/80 text-sm tracking-widest uppercase">Use Coupon</span>
                        <div className="h-px w-16" style={{ background: "#D4860A" }} />
                    </div>
                    <div className="inline-block bg-white/15 backdrop-blur-sm border border-white/30 rounded-2xl px-8 py-3 mb-6">
                        <span className="text-2xl font-bold tracking-[0.25em] text-white">SULTAN20</span>
                    </div>
                    <div className="block">
                        <Link href="/products"
                            className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-sm hover:scale-105 transition-transform"
                            style={{ background: "linear-gradient(135deg, #B5451B, #D4860A)", color: "white" }}>
                            Shop Now →
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
