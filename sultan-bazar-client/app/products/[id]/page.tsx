"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    ShoppingCart, Heart, Star, ChevronRight, Minus, Plus,
    Truck, Shield, RotateCcw, Share2, CheckCircle, Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ── Types matching server TVariant / TProduct interfaces ─────────────────────
interface TVariant {
    name: string;           // "500ml", "1L"
    sku: string;
    price: number;
    discountPrice?: number;
    stock: number;
    weight?: number;        // grams
    images?: string[];
    isAvailable?: boolean;
    attributes?: Record<string, string>;
}

interface TProduct {
    _id: string;
    name: string;
    slug: string;
    description: string;
    category: string;
    tags?: string[];
    thumbnail: string;
    gallery?: string[];
    variants: TVariant[];
    rating?: number;
    reviewCount?: number;
    isFeatured?: boolean;
}

// ── Mock product (replace with API fetch) ─────────────────────────────────────
const PRODUCT: TProduct = {
    _id: "1",
    name: "Sultan Mustard Oil",
    slug: "sultan-mustard-oil",
    description:
        "Sultan Mustard Oil is cold-pressed from the finest quality mustard seeds sourced directly from farms across Bangladesh. Rich in omega-3 fatty acids and antioxidants, it adds an authentic, bold flavour to your everyday cooking. Ideal for frying, pickling, and traditional Bangladeshi recipes. No artificial additives, no preservatives — just pure, natural goodness.",
    category: "Oils",
    tags: ["Natural", "Cold Pressed", "No Preservatives", "BSTI Certified"],
    thumbnail: "/images/jar_opening.png",
    gallery: [
        "/images/jar_opening.png",
        "/images/mosla_page.png",
        "/images/all-products.png",
        "/images/Dipping-Sauces-cover.png",
    ],
    variants: [
        { name: "250ml", sku: "MUSTARD-OIL-250ML", price: 100, discountPrice: 85, stock: 42, weight: 270, isAvailable: true },
        { name: "500ml", sku: "MUSTARD-OIL-500ML", price: 190, discountPrice: 160, stock: 28, weight: 530, isAvailable: true },
        { name: "1 Litre", sku: "MUSTARD-OIL-1L", price: 360, discountPrice: 300, stock: 15, weight: 1050, isAvailable: true },
        { name: "2 Litre", sku: "MUSTARD-OIL-2L", price: 680, discountPrice: 580, stock: 0, isAvailable: false },
    ],
    rating: 4.8,
    reviewCount: 234,
    isFeatured: true,
};

const RELATED = [
    { id: 2, name: "Sultan Biriyani Masala 75g", price: 65, originalPrice: 80, emoji: "🥘", rating: 4.9 },
    { id: 3, name: "Isphahani Tea 200g", price: 185, originalPrice: 210, emoji: "🍵", rating: 4.6 },
    { id: 4, name: "Turmeric Powder 200g", price: 45, originalPrice: 55, emoji: "🟡", rating: 4.5 },
    { id: 5, name: "Esha Aromatic Rice 1kg", price: 110, originalPrice: 130, emoji: "🌾", rating: 4.8 },
];

function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
    const s = size === "sm" ? "w-3.5 h-3.5" : "w-5 h-5";
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className={s}
                    fill={i <= Math.round(rating) ? "#D4860A" : "none"}
                    stroke={i <= Math.round(rating) ? "#D4860A" : "#d1d5db"} />
            ))}
        </div>
    );
}

export default function ProductDetailPage() {
    const p = PRODUCT;
    const [selectedVariant, setSelectedVariant] = useState<TVariant>(
        p.variants.find((v) => v.isAvailable) ?? p.variants[0]
    );
    const [activeImage, setActiveImage] = useState(0);
    const [qty, setQty] = useState(1);
    const [wished, setWished] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);

    const price = selectedVariant.discountPrice ?? selectedVariant.price;
    const original = selectedVariant.price;
    const discount = selectedVariant.discountPrice
        ? Math.round(((original - selectedVariant.discountPrice) / original) * 100)
        : 0;
    const inStock = (selectedVariant.isAvailable ?? true) && selectedVariant.stock > 0;

    const handleAddToCart = () => {
        if (!inStock) return;
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    const gallery = p.gallery?.length ? p.gallery : [p.thumbnail];

    return (
        <div className="min-h-screen" style={{ background: "#FAFAF8" }}>

            {/* ── Breadcrumb ── */}
            <div className="border-b border-orange-100 bg-white">
                <div className="container mx-auto px-4 lg:px-8 py-3 flex items-center gap-1.5 text-xs text-gray-500">
                    <Link href="/" className="hover:text-[#B5451B] transition-colors">Home</Link>
                    <ChevronRight className="w-3 h-3" />
                    <Link href="/products" className="hover:text-[#B5451B] transition-colors">Products</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="font-medium text-gray-700 truncate max-w-[180px]">{p.name}</span>
                </div>
            </div>

            <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-10">

                {/* ── Main Product Layout ── */}
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 mb-14">

                    {/* ── Left: Image Gallery ── */}
                    <div className="space-y-3">
                        {/* Main image */}
                        <div className="relative rounded-3xl overflow-hidden aspect-square bg-gradient-to-br from-amber-50 to-orange-50 shadow-sm"
                            style={{ border: "1.5px solid #F0E6D3" }}>
                            <Image
                                src={gallery[activeImage]}
                                alt={p.name}
                                fill
                                className="object-cover transition-all duration-300"
                                priority
                            />
                            {discount > 0 && (
                                <span className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                    -{discount}% OFF
                                </span>
                            )}
                            {p.isFeatured && (
                                <span className="absolute top-4 right-4 text-white text-xs font-bold px-3 py-1 rounded-full"
                                    style={{ background: "#B5451B" }}>Featured</span>
                            )}
                            {/* Wishlist */}
                            <button
                                onClick={() => setWished(!wished)}
                                className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform"
                            >
                                <Heart className="w-5 h-5" fill={wished ? "#B5451B" : "none"} stroke={wished ? "#B5451B" : "#9ca3af"} />
                            </button>
                        </div>

                        {/* Thumbnail strip */}
                        {gallery.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-1">
                                {gallery.map((img, i) => (
                                    <button key={i} onClick={() => setActiveImage(i)}
                                        className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${activeImage === i ? "border-[#B5451B]" : "border-transparent hover:border-orange-200"}`}>
                                        <Image src={img} alt="" width={64} height={64} className="object-cover w-full h-full" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Right: Product Info ── */}
                    <div className="space-y-5">
                        {/* Head */}
                        <div>
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#D4860A" }}>
                                    {p.category}
                                </span>
                                {p.tags?.map((t) => (
                                    <span key={t} className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                                        style={{ background: "#B5451B15", color: "#B5451B" }}>
                                        {t}
                                    </span>
                                ))}
                            </div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-snug mb-2">{p.name}</h1>
                            <div className="flex items-center gap-3 flex-wrap">
                                <Stars rating={p.rating ?? 0} size="md" />
                                <span className="text-sm text-gray-500 font-medium">{p.rating} ({p.reviewCount} reviews)</span>
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${inStock ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                                    {inStock ? `✓ In Stock (${selectedVariant.stock} left)` : "✗ Out of Stock"}
                                </span>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-end gap-3">
                            <span className="text-4xl font-bold" style={{ color: "#B5451B" }}>৳{price}</span>
                            {selectedVariant.discountPrice && (
                                <span className="text-xl text-gray-400 line-through mb-0.5">৳{original}</span>
                            )}
                            {discount > 0 && (
                                <span className="mb-1 text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                    Save ৳{original - price}
                                </span>
                            )}
                        </div>

                        {/* Variant selector */}
                        {p.variants.length > 1 && (
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2.5">
                                    Size / Variant
                                    <span className="ml-2 normal-case font-normal text-gray-400">
                                        — Selected: <strong className="text-gray-700">{selectedVariant.name}</strong>
                                        {selectedVariant.weight && ` (${selectedVariant.weight}g)`}
                                    </span>
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {p.variants.map((v) => {
                                        const available = (v.isAvailable ?? true) && v.stock > 0;
                                        const active = v.sku === selectedVariant.sku;
                                        return (
                                            <button
                                                key={v.sku}
                                                disabled={!available}
                                                onClick={() => { setSelectedVariant(v); setQty(1); }}
                                                className={`relative px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all
                                                    ${active ? "border-[#B5451B] text-white" : ""}
                                                    ${!available ? "opacity-40 cursor-not-allowed line-through" : "hover:border-[#B5451B] hover:text-[#B5451B]"}
                                                    ${!active ? "border-gray-200 text-gray-700 bg-white" : ""}
                                                `}
                                                style={active ? { background: "#B5451B" } : {}}
                                            >
                                                {v.name}
                                                {v.discountPrice && (
                                                    <span className="block text-[10px] font-normal" style={{ color: active ? "#ffd6c8" : "#B5451B" }}>
                                                        ৳{v.discountPrice}
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2.5">Quantity</p>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border-2 rounded-xl overflow-hidden" style={{ borderColor: "#F0E6D3" }}>
                                    <button onClick={() => setQty(Math.max(1, qty - 1))}
                                        className="w-10 h-10 flex items-center justify-center hover:bg-orange-50 transition-colors text-gray-600">
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-12 text-center font-bold text-gray-900">{qty}</span>
                                    <button onClick={() => setQty(Math.min(selectedVariant.stock, qty + 1))}
                                        disabled={qty >= selectedVariant.stock}
                                        className="w-10 h-10 flex items-center justify-center hover:bg-orange-50 transition-colors text-gray-600 disabled:opacity-40">
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                <span className="text-xs text-gray-400">{selectedVariant.stock} available</span>
                            </div>
                        </div>

                        {/* SKU */}
                        <p className="text-xs text-gray-400 flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5" /> SKU: <span className="font-mono font-medium text-gray-600">{selectedVariant.sku}</span>
                        </p>

                        {/* Actions */}
                        <div className="flex gap-3 flex-wrap">
                            <Button
                                onClick={handleAddToCart}
                                disabled={!inStock}
                                className="flex-1 min-w-[180px] text-white font-bold rounded-xl py-3 h-auto text-base flex items-center justify-center gap-2 transition-all"
                                style={{ background: addedToCart ? "#22c55e" : inStock ? "#B5451B" : "#d1d5db" }}
                            >
                                {addedToCart ? (
                                    <><CheckCircle className="w-5 h-5" /> Added!</>
                                ) : (
                                    <><ShoppingCart className="w-5 h-5" /> Add to Cart — ৳{price * qty}</>
                                )}
                            </Button>
                            <button
                                onClick={() => setWished(!wished)}
                                className="w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all hover:border-[#B5451B]"
                                style={{ borderColor: wished ? "#B5451B" : "#F0E6D3", background: wished ? "#FFF0EB" : "white" }}
                            >
                                <Heart className="w-5 h-5" fill={wished ? "#B5451B" : "none"} stroke={wished ? "#B5451B" : "#9ca3af"} />
                            </button>
                            <button className="w-12 h-12 rounded-xl border-2 flex items-center justify-center hover:border-[#B5451B] transition-all"
                                style={{ borderColor: "#F0E6D3", background: "white" }}>
                                <Share2 className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        {/* Trust badges */}
                        <div className="grid grid-cols-3 gap-3 pt-2">
                            {[
                                { icon: <Truck className="w-4 h-4" />, title: "Fast Delivery", sub: "2–4 days" },
                                { icon: <Shield className="w-4 h-4" />, title: "100% Authentic", sub: "BSTI certified" },
                                { icon: <RotateCcw className="w-4 h-4" />, title: "Easy Returns", sub: "7 day policy" },
                            ].map((b) => (
                                <div key={b.title} className="bg-white rounded-xl p-3 text-center shadow-sm"
                                    style={{ border: "1.5px solid #F0E6D3" }}>
                                    <div className="flex justify-center mb-1 text-[#B5451B]">{b.icon}</div>
                                    <p className="text-[11px] font-bold text-gray-800">{b.title}</p>
                                    <p className="text-[10px] text-gray-400">{b.sub}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Description & Details Tabs ── */}
                <div className="bg-white rounded-3xl p-6 lg:p-8 mb-10 shadow-sm" style={{ border: "1.5px solid #F0E6D3" }}>
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-1 h-5 rounded-full inline-block" style={{ background: "#B5451B" }} />
                        Product Description
                    </h2>
                    <p className="text-gray-600 leading-relaxed text-sm lg:text-base">{p.description}</p>

                    {/* Variant details table */}
                    {p.variants.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-sm font-bold text-gray-800 mb-3">Available Sizes</h3>
                            <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "#F0E6D3" }}>
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr style={{ background: "#FDF6EC" }}>
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Size</th>
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">SKU</th>
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Weight</th>
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Price</th>
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Stock</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {p.variants.map((v, i) => (
                                            <tr key={v.sku}
                                                className={`cursor-pointer transition-colors ${v.sku === selectedVariant.sku ? "bg-orange-50" : "hover:bg-gray-50"} ${i !== p.variants.length - 1 ? "border-b" : ""}`}
                                                style={{ borderColor: "#F0E6D3" }}
                                                onClick={() => v.isAvailable && v.stock > 0 && setSelectedVariant(v)}
                                            >
                                                <td className="px-4 py-3 font-semibold text-gray-800">{v.name}</td>
                                                <td className="px-4 py-3 font-mono text-xs text-gray-500">{v.sku}</td>
                                                <td className="px-4 py-3 text-gray-600">{v.weight ? `${v.weight}g` : "—"}</td>
                                                <td className="px-4 py-3">
                                                    <span className="font-bold" style={{ color: "#B5451B" }}>৳{v.discountPrice ?? v.price}</span>
                                                    {v.discountPrice && <span className="ml-2 text-xs text-gray-400 line-through">৳{v.price}</span>}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {v.stock > 0 && v.isAvailable ? (
                                                        <span className="text-green-700 font-medium">{v.stock} in stock</span>
                                                    ) : (
                                                        <span className="text-gray-400">Out of stock</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Related Products ── */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">
                            You May Also <span style={{ color: "#B5451B" }}>Like</span>
                        </h2>
                        <Link href="/products" className="text-sm font-semibold hover:underline" style={{ color: "#B5451B" }}>
                            View all →
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {RELATED.map((r) => (
                            <Link key={r.id} href={`/products/${r.id}`}
                                className="hover-lift bg-white rounded-2xl overflow-hidden shadow-sm group"
                                style={{ border: "1.5px solid #F0E6D3" }}>
                                <div className="aspect-square bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center text-5xl group-hover:scale-105 transition-transform">
                                    {r.emoji}
                                </div>
                                <div className="p-3">
                                    <p className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1">{r.name}</p>
                                    <div className="flex items-center gap-1 mb-1">
                                        <Stars rating={r.rating} />
                                        <span className="text-[11px] text-gray-400">{r.rating}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-sm" style={{ color: "#B5451B" }}>৳{r.price}</span>
                                        <span className="text-xs text-gray-400 line-through">৳{r.originalPrice}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
}
