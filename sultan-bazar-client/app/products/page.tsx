"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X, ChevronDown, ChevronUp, ShoppingCart, Heart, Star, Filter, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { useGetAllProductsQuery } from "@/redux/api/productApi";
import { useGetAllCategoriesQuery } from "@/redux/api/categoryApi";
import { TProduct, TCategory } from "@/types/common";
import Link from "next/link";
import Image from "next/image";
import { useAddToCartMutation } from "@/redux/api/cartApi";
import { toast } from "sonner";

const SORT_OPTIONS = [
    { label: "Newest", value: "-createdAt" },
    { label: "Price: Low to High", value: "variants.price" },
    { label: "Price: High to Low", value: "-variants.price" },
    { label: "Best Rating", value: "-rating" },
    { label: "Most Reviews", value: "-reviewCount" },
];

const ITEMS_PER_PAGE = 12;

function Stars({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-px">
            {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-3.5 h-3.5"
                    fill={i <= Math.round(rating) ? "#D4860A" : "none"}
                    stroke={i <= Math.round(rating) ? "#D4860A" : "#ccc"} />
            ))}
        </div>
    );
}

// ── Single product card ───────────────────────────────────────────────────────
function ProductCard({ p }: { p: TProduct }) {
    const [wished, setWished] = useState(false);
    const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();

    const variant = p.variants?.[0];
    if (!variant) return null;

    const price = variant.discountPrice ?? variant.price;
    const originalPrice = variant.price;
    const hasDiscount = !!variant.discountPrice;
    const discount = hasDiscount
        ? Math.round(((originalPrice - (variant.discountPrice ?? 0)) / originalPrice) * 100)
        : 0;

    const inStock = (variant.isAvailable ?? true) && variant.stock > 0;

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await addToCart({
                productId: p._id,
                variantId: variant._id,
                quantity: 1
            }).unwrap();
            toast.success(`${p.name} added to cart!`);
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to add to cart");
        }
    };

    return (
        <Link href={`/products/${p._id}`}>
            <div className="hover-lift bg-white rounded-2xl overflow-hidden border flex flex-col group h-full cursor-pointer"
                style={{ border: "1.5px solid #F0E6D3" }}>
                {/* Image */}
                <div className="relative aspect-square bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center overflow-hidden">
                    {p.thumbnail ? (
                        <Image
                            src={p.thumbnail}
                            alt={p.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                    ) : (
                        <span className="text-6xl md:text-7xl transition-transform duration-300 group-hover:scale-110">
                            📦
                        </span>
                    )}

                    {/* Wishlist */}
                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setWished(!wished); }}
                        className="absolute top-2 right-2 z-10 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
                        <Heart className="w-3.5 h-3.5" fill={wished ? "#B5451B" : "none"} stroke={wished ? "#B5451B" : "#9ca3af"} />
                    </button>
                    {p.isFeatured && (
                        <span className="absolute top-2 left-2 z-10 text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                            style={{ background: "#B5451B" }}>Featured</span>
                    )}
                    {discount > 0 && (
                        <span className="absolute bottom-2 left-2 z-10 text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500 text-white">
                            -{discount}%
                        </span>
                    )}
                    {!inStock && (
                        <div className="absolute inset-0 z-20 bg-white/70 flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Out of Stock</span>
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="p-3 flex flex-col flex-1">
                    <p className="font-semibold text-gray-800 text-sm leading-tight mb-1 line-clamp-2 hover:text-[#B5451B] transition-colors">
                        {p.name}
                    </p>
                    <div className="flex items-center gap-1.5 mb-2">
                        <Stars rating={p.rating ?? 0} />
                        <span className="text-[11px] text-gray-400">({p.reviewCount ?? 0})</span>
                    </div>
                    <div className="mt-auto">
                        <div className="flex items-center gap-1.5 mb-2">
                            <span className="font-bold text-base" style={{ color: "#B5451B" }}>৳{price}</span>
                            {hasDiscount && (
                                <span className="text-xs text-gray-400 line-through">৳{originalPrice}</span>
                            )}
                        </div>
                        <Button
                            onClick={handleAddToCart}
                            className="w-full cursor-pointer text-white text-xs font-semibold rounded-full py-1.5 h-auto transition-all hover:opacity-90 active:scale-95"
                            style={{ background: "#B5451B" }}
                            disabled={!inStock || isAdding}
                        >
                            {isAdding ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                            )}
                            {isAdding ? "Adding..." : "Add to Cart"}
                        </Button>
                    </div>
                </div>
            </div>
        </Link>
    );
}

// ── Filter Sidebar (shared between desktop + mobile Sheet) ───────────────────
function FilterPanel({
    search, setSearch,
    selectedCategory, setSelectedCategory,
    priceRange, setPriceRange,
    inStockOnly, setInStockOnly,
    categories,
    onClose,
}: {
    search: string; setSearch: (v: string) => void;
    selectedCategory: string; setSelectedCategory: (v: string) => void;
    priceRange: number[]; setPriceRange: (v: number[]) => void;
    inStockOnly: boolean; setInStockOnly: (v: boolean) => void;
    categories: TCategory[];
    onClose?: () => void;
}) {
    const [catOpen, setCatOpen] = useState(true);
    const [priceOpen, setPriceOpen] = useState(true);

    const clearAll = () => {
        setSearch("");
        setSelectedCategory("All");
        setPriceRange([0, 1000]);
        setInStockOnly(false);
    };

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-800 text-base flex items-center gap-2">
                    <Filter className="w-4 h-4" style={{ color: "#B5451B" }} /> Filters
                </h3>
                <button onClick={clearAll} className="text-xs text-gray-400 hover:text-[#B5451B] transition-colors cursor-pointer">
                    Clear all
                </button>
            </div>

            {/* Search */}
            <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                    Search
                </label>
                <div className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-gray-50 focus-within:border-[#B5451B] transition-colors">
                    <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search products..."
                        className="bg-transparent text-sm outline-none w-full placeholder:text-gray-400"
                    />
                    {search && (
                        <button onClick={() => setSearch("")} className="cursor-pointer">
                            <X className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
                        </button>
                    )}
                </div>
            </div>

            <div className="border-t" style={{ borderColor: "#F0E6D3" }} />

            {/* Category */}
            <div>
                <button
                    onClick={() => setCatOpen(!catOpen)}
                    className="w-full flex items-center justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"
                >
                    Category
                    {catOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                {catOpen && (
                    <div className="space-y-1">
                        <button
                            onClick={() => { setSelectedCategory("All"); onClose?.(); }}
                            className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-all ${selectedCategory === "All"
                                ? "font-semibold text-white"
                                : "text-gray-600 hover:bg-orange-50 hover:text-[#B5451B]"
                                }`}
                            style={selectedCategory === "All" ? { background: "#B5451B" } : {}}
                        >
                            All Categories
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat._id}
                                onClick={() => { setSelectedCategory(cat._id); onClose?.(); }}
                                className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-all ${selectedCategory === cat._id
                                    ? "font-semibold text-white"
                                    : "text-gray-600 hover:bg-orange-50 hover:text-[#B5451B]"
                                    }`}
                                style={selectedCategory === cat._id ? { background: "#B5451B" } : {}}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="border-t" style={{ borderColor: "#F0E6D3" }} />

            {/* Price range */}
            <div>
                <button
                    onClick={() => setPriceOpen(!priceOpen)}
                    className="w-full flex items-center justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3"
                >
                    Price Range
                    {priceOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                {priceOpen && (
                    <div>
                        <Slider
                            min={0} max={1000} step={10}
                            value={priceRange}
                            onValueChange={setPriceRange}
                            className="mb-3"
                        />
                        <div className="flex items-center justify-between text-sm font-semibold" style={{ color: "#B5451B" }}>
                            <span>৳{priceRange[0]}</span>
                            <span>৳{priceRange[1]}</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="border-t" style={{ borderColor: "#F0E6D3" }} />

            {/* In Stock only */}
            <label className="flex items-center gap-3 cursor-pointer group">
                <div
                    onClick={() => setInStockOnly(!inStockOnly)}
                    className={`w-10 h-5 rounded-full transition-all flex-shrink-0 relative ${inStockOnly ? "" : "bg-gray-200"}`}
                    style={inStockOnly ? { background: "#B5451B" } : {}}
                >
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${inStockOnly ? "left-[22px]" : "left-0.5"}`} />
                </div>
                <span className="text-sm text-gray-700 group-hover:text-gray-900">In Stock Only</span>
            </label>
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ProductsPage() {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [inStockOnly, setInStockOnly] = useState(false);
    const [sort, setSort] = useState("-createdAt");
    const [page, setPage] = useState(1);

    // Fetch Categories
    const { data: categoryData } = useGetAllCategoriesQuery({});
    const categories: TCategory[] = categoryData || [];

    // Fetch Products with real filters
    const { data: productsData, isLoading, isError } = useGetAllProductsQuery({
        search: search || undefined,
        category: selectedCategory !== "All" ? selectedCategory : undefined,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        sort,
        page,
        limit: ITEMS_PER_PAGE,
        // Since the server doesn't explicitly filter by 'isAvailable' boolean in getAllProducts currently, 
        // we might do client-side filtering or assume API handles relevant query if added.
    });

    const products = productsData?.data || [];
    const meta = productsData?.meta;
    const totalPages = meta?.totalPages || 1;

    // Reset page if filters change
    const handleFilterChange = (setter: any) => (v: any) => {
        setter(v);
        setPage(1);
    };

    const activeFilterCount = [
        search.trim() !== "",
        selectedCategory !== "All",
        priceRange[0] > 0 || priceRange[1] < 1000,
        inStockOnly,
    ].filter(Boolean).length;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-[#B5451B]" />
                    <p className="text-gray-500 font-medium">Loading premium products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ background: "#FAFAF8" }}>
            {/* ── Page Header ── */}
            <div style={{ background: "linear-gradient(135deg, #FDF6EC, #FEF3CD)" }} className="py-6 lg:py-8 border-b border-orange-100">
                <div className="container mx-auto px-4 lg:px-8 text-center">
                    <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#D4860A" }}>
                        Our Store
                    </p>
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-1">
                        All <span style={{ color: "#B5451B" }}>Products</span>
                    </h1>
                    <p className="text-gray-500 text-sm">
                        {meta?.total || 0} products found{selectedCategory !== "All" ? ` in ${categories.find(c => c._id === selectedCategory)?.name || ''}` : ""}
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 lg:px-8 py-6 lg:py-8">
                <div className="flex gap-6 lg:gap-8">

                    {/* ── Desktop Sidebar ── */}
                    <aside className="hidden lg:block w-60 xl:w-64 flex-shrink-0">
                        <div className="sticky top-20 bg-white rounded-2xl p-5 border shadow-sm" style={{ border: "1.5px solid #F0E6D3" }}>
                            <FilterPanel
                                search={search} setSearch={handleFilterChange(setSearch)}
                                selectedCategory={selectedCategory} setSelectedCategory={handleFilterChange(setSelectedCategory)}
                                priceRange={priceRange} setPriceRange={handleFilterChange(setPriceRange)}
                                inStockOnly={inStockOnly} setInStockOnly={handleFilterChange(setInStockOnly)}
                                categories={categories}
                            />
                        </div>
                    </aside>

                    {/* ── Right Content ── */}
                    <div className="flex-1 min-w-0">
                        {/* Toolbar */}
                        <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
                            {/* Mobile filter trigger */}
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline" size="sm" className="lg:hidden flex items-center gap-2 rounded-full font-medium cursor-pointer"
                                        style={{ borderColor: "#B5451B", color: "#B5451B" }}>
                                        <SlidersHorizontal className="w-4 h-4" />
                                        Filters
                                        {activeFilterCount > 0 && (
                                            <Badge className="w-5 h-5 p-0 flex items-center justify-center text-[10px] text-white rounded-full"
                                                style={{ background: "#B5451B" }}>
                                                {activeFilterCount}
                                            </Badge>
                                        )}
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-72 p-5 overflow-y-auto">
                                    <div className="mb-4 flex items-center justify-between">
                                        <span className="font-bold text-gray-800">Filters</span>
                                        <SheetClose asChild>
                                            <button className="text-gray-400 hover:text-gray-600 cursor-pointer"><X className="w-5 h-5" /></button>
                                        </SheetClose>
                                    </div>
                                    <FilterPanel
                                        search={search} setSearch={handleFilterChange(setSearch)}
                                        selectedCategory={selectedCategory} setSelectedCategory={handleFilterChange(setSelectedCategory)}
                                        priceRange={priceRange} setPriceRange={handleFilterChange(setPriceRange)}
                                        inStockOnly={inStockOnly} setInStockOnly={handleFilterChange(setInStockOnly)}
                                        categories={categories}
                                    />
                                </SheetContent>
                            </Sheet>

                            {/* Active filter chips */}
                            <div className="flex flex-wrap gap-2 flex-1">
                                {selectedCategory !== "All" && (
                                    <span className="flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full cursor-pointer"
                                        style={{ background: "#B5451B15", color: "#B5451B" }}
                                        onClick={() => { setSelectedCategory("All"); setPage(1); }}>
                                        {categories.find(c => c._id === selectedCategory)?.name} <X className="w-3 h-3" />
                                    </span>
                                )}
                                {inStockOnly && (
                                    <span className="flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full cursor-pointer"
                                        style={{ background: "#B5451B15", color: "#B5451B" }}
                                        onClick={() => { setInStockOnly(false); setPage(1); }}>
                                        In Stock <X className="w-3 h-3" />
                                    </span>
                                )}
                            </div>

                            {/* Sort */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <label className="text-xs text-gray-500 hidden sm:block">Sort:</label>
                                <select
                                    value={sort}
                                    onChange={(e) => { setSort(e.target.value); setPage(1); }}
                                    className="text-sm border rounded-xl px-3 py-1.5 bg-white outline-none cursor-pointer focus:border-[#B5451B] transition-colors"
                                    style={{ borderColor: "#E0C9B0" }}
                                >
                                    {SORT_OPTIONS.map((o) => (
                                        <option key={o.value} value={o.value}>{o.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Product grid */}
                        {isError ? (
                            <div className="text-center py-24 text-red-500">
                                Failed to fetch products. Please try again later.
                            </div>
                        ) : products.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                                {products.map((p: TProduct) => <ProductCard key={p._id} p={p} />)}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-24 text-center">
                                <span className="text-5xl mb-4">🧐</span>
                                <p className="font-bold text-gray-700 text-lg mb-1">No products found</p>
                                <p className="text-gray-400 text-sm mb-5">Try adjusting your search or filters</p>
                                <Button variant="outline" size="sm" className="rounded-full cursor-pointer"
                                    style={{ borderColor: "#B5451B", color: "#B5451B" }}
                                    onClick={() => { setSearch(""); setSelectedCategory("All"); setPriceRange([0, 1000]); setInStockOnly(false); }}>
                                    Clear Filters
                                </Button>
                            </div>
                        )}

                        {/* ── Pagination ── */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between mt-8 flex-wrap gap-4">
                                <p className="text-sm text-gray-500">
                                    Showing{" "}
                                    <span className="font-semibold text-gray-700">
                                        {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, meta?.total || 0)}
                                    </span>{" "}
                                    of <span className="font-semibold text-gray-700">{meta?.total}</span> products
                                </p>

                                <div className="flex items-center gap-1.5">
                                    <button
                                        onClick={() => setPage(page - 1)}
                                        disabled={page === 1}
                                        className="w-8 h-8 rounded-full border flex items-center justify-center text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#B5451B] hover:text-[#B5451B]"
                                        style={{ borderColor: "#E0C9B0" }}
                                    >
                                        ‹
                                    </button>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => {
                                        const show = n === 1 || n === totalPages || Math.abs(n - page) <= 1;
                                        if (!show) return null;
                                        return (
                                            <button
                                                key={n}
                                                onClick={() => setPage(n)}
                                                className="w-8 h-8 rounded-full border text-sm font-medium transition-all"
                                                style={
                                                    n === page
                                                        ? { background: "#B5451B", color: "white", borderColor: "#B5451B" }
                                                        : { borderColor: "#E0C9B0", color: "#555" }
                                                }
                                            >
                                                {n}
                                            </button>
                                        );
                                    })}

                                    <button
                                        onClick={() => setPage(page + 1)}
                                        disabled={page === totalPages}
                                        className="w-8 h-8 rounded-full border flex items-center justify-center text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#B5451B] hover:text-[#B5451B]"
                                        style={{ borderColor: "#E0C9B0" }}
                                    >
                                        ›
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
