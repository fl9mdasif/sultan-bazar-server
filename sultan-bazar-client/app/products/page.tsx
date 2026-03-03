"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X, ChevronDown, ChevronUp, ShoppingCart, Heart, Star, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";

// ── All products data ────────────────────────────────────────────────────────
const ALL_PRODUCTS = [
    { id: 1, name: "Sultan Mustard Oil 250ml", category: "Oils", price: 85, originalPrice: 100, rating: 4.8, reviews: 234, inStock: true, emoji: "🫒", tag: "Best Seller" },
    { id: 2, name: "Sultan Mustard Oil 500ml", category: "Oils", price: 160, originalPrice: 190, rating: 4.8, reviews: 198, inStock: true, emoji: "🫒", tag: "Best Seller" },
    { id: 3, name: "Sultan Mustard Oil 1L", category: "Oils", price: 300, originalPrice: 360, rating: 4.8, reviews: 156, inStock: true, emoji: "🫒" },
    { id: 4, name: "Sultan Biriyani Masala 75g", category: "Masala Mixes", price: 65, originalPrice: 80, rating: 4.9, reviews: 189, inStock: true, emoji: "🥘", tag: "Popular" },
    { id: 5, name: "Sultan Beef Masala 50g", category: "Masala Mixes", price: 55, originalPrice: 70, rating: 4.7, reviews: 142, inStock: true, emoji: "🥩" },
    { id: 6, name: "Sultan Chicken Masala 50g", category: "Masala Mixes", price: 55, originalPrice: 70, rating: 4.7, reviews: 118, inStock: true, emoji: "🍗" },
    { id: 7, name: "Sultan Haleem Mix 100g", category: "Masala Mixes", price: 75, originalPrice: 90, rating: 4.6, reviews: 87, inStock: true, emoji: "🍲" },
    { id: 8, name: "Sultan Kala Bhuna Masala 70g", category: "Masala Mixes", price: 60, originalPrice: 75, rating: 4.5, reviews: 63, inStock: false, emoji: "🌑" },
    { id: 9, name: "Isphahani Tea 200g", category: "Tea", price: 185, originalPrice: 210, rating: 4.6, reviews: 312, inStock: true, emoji: "🍵", tag: "Premium" },
    { id: 10, name: "Isphahani Tea 400g", category: "Tea", price: 360, originalPrice: 420, rating: 4.6, reviews: 238, inStock: true, emoji: "🍵", tag: "Premium" },
    { id: 11, name: "Lipton Yellow Label 200g", category: "Tea", price: 160, originalPrice: 180, rating: 4.4, reviews: 94, inStock: true, emoji: "🍃" },
    { id: 12, name: "Turmeric Powder 200g", category: "Spice Powders", price: 45, originalPrice: 55, rating: 4.5, reviews: 201, inStock: true, emoji: "🟡" },
    { id: 13, name: "Chili Powder 200g", category: "Spice Powders", price: 50, originalPrice: 60, rating: 4.6, reviews: 178, inStock: true, emoji: "🌶️" },
    { id: 14, name: "Coriander Powder 200g", category: "Spice Powders", price: 40, originalPrice: 50, rating: 4.4, reviews: 132, inStock: true, emoji: "🫛" },
    { id: 15, name: "Cumin Powder 150g", category: "Spice Powders", price: 55, originalPrice: 65, rating: 4.5, reviews: 109, inStock: true, emoji: "🟤" },
    { id: 16, name: "Isobgoli Psyllium Husk 200g", category: "Pulses & Seeds", price: 120, originalPrice: 150, rating: 4.5, reviews: 76, inStock: true, emoji: "🌿", tag: "Natural" },
    { id: 17, name: "Chia Seeds 100g", category: "Pulses & Seeds", price: 95, originalPrice: 120, rating: 4.6, reviews: 93, inStock: true, emoji: "🫘" },
    { id: 18, name: "Basil Seeds / Takma 100g", category: "Pulses & Seeds", price: 80, originalPrice: 100, rating: 4.4, reviews: 58, inStock: true, emoji: "💧" },
    { id: 19, name: "Esha Aromatic Rice 1kg", category: "Rice & Grains", price: 110, originalPrice: 130, rating: 4.8, reviews: 201, inStock: true, emoji: "🌾", tag: "Export" },
    { id: 20, name: "Esha Aromatic Rice 5kg", category: "Rice & Grains", price: 520, originalPrice: 620, rating: 4.8, reviews: 134, inStock: true, emoji: "🌾" },
    { id: 21, name: "Puffed Rice 500g", category: "Rice & Grains", price: 40, originalPrice: 50, rating: 4.2, reviews: 42, inStock: true, emoji: "☁️" },
    { id: 22, name: "Chili Whole 100g", category: "Whole Spices", price: 35, originalPrice: 45, rating: 4.3, reviews: 67, inStock: true, emoji: "🌶️" },
    { id: 23, name: "Tejpata Bay Leaf 50g", category: "Whole Spices", price: 30, originalPrice: 40, rating: 4.2, reviews: 48, inStock: false, emoji: "🍃" },
    { id: 24, name: "Semai Vermicelli 200g", category: "Dry Foods", price: 35, originalPrice: 45, rating: 4.1, reviews: 38, inStock: true, emoji: "🍜" },
];

const CATEGORIES = ["All", "Oils", "Masala Mixes", "Tea", "Spice Powders", "Pulses & Seeds", "Rice & Grains", "Whole Spices", "Dry Foods"];
const SORT_OPTIONS = [
    { label: "Featured", value: "featured" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
    { label: "Best Rating", value: "rating" },
    { label: "Most Reviews", value: "reviews" },
];
const ITEMS_PER_PAGE = 8;

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
function ProductCard({ p }: { p: (typeof ALL_PRODUCTS)[0] }) {
    const [wished, setWished] = useState(false);
    const discount = p.originalPrice
        ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
        : 0;

    return (
        <div className="hover-lift bg-white rounded-2xl overflow-hidden border flex flex-col group"
            style={{ border: "1.5px solid #F0E6D3" }}>
            {/* Image */}
            <div className="relative aspect-square bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center overflow-hidden">
                <span className="text-6xl md:text-7xl transition-transform duration-300 group-hover:scale-110">
                    {p.emoji}
                </span>
                {/* Wishlist */}
                <button onClick={() => setWished(!wished)}
                    className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center hover:scale-110 transition-transform">
                    <Heart className="w-3.5 h-3.5" fill={wished ? "#B5451B" : "none"} stroke={wished ? "#B5451B" : "#9ca3af"} />
                </button>
                {p.tag && (
                    <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                        style={{ background: "#B5451B" }}>{p.tag}</span>
                )}
                {discount > 0 && (
                    <span className="absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500 text-white">
                        -{discount}%
                    </span>
                )}
                {!p.inStock && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Out of Stock</span>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-3 flex flex-col flex-1">
                <p className="font-semibold text-gray-800 text-sm leading-tight mb-1 line-clamp-2">{p.name}</p>
                <div className="flex items-center gap-1.5 mb-2">
                    <Stars rating={p.rating} />
                    <span className="text-[11px] text-gray-400">({p.reviews})</span>
                </div>
                <div className="mt-auto">
                    <div className="flex items-center gap-1.5 mb-2">
                        <span className="font-bold text-base" style={{ color: "#B5451B" }}>৳{p.price}</span>
                        {p.originalPrice && (
                            <span className="text-xs text-gray-400 line-through">৳{p.originalPrice}</span>
                        )}
                    </div>
                    <Button className="w-full text-white text-xs font-semibold rounded-full py-1.5 h-auto"
                        style={{ background: "#B5451B" }} disabled={!p.inStock}>
                        <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                        Add to Cart
                    </Button>
                </div>
            </div>
        </div>
    );
}

// ── Filter Sidebar (shared between desktop + mobile Sheet) ───────────────────
function FilterPanel({
    search, setSearch,
    selectedCategory, setSelectedCategory,
    priceRange, setPriceRange,
    inStockOnly, setInStockOnly,
    onClose,
}: {
    search: string; setSearch: (v: string) => void;
    selectedCategory: string; setSelectedCategory: (v: string) => void;
    priceRange: number[]; setPriceRange: (v: number[]) => void;
    inStockOnly: boolean; setInStockOnly: (v: boolean) => void;
    onClose?: () => void;
}) {
    const [catOpen, setCatOpen] = useState(true);
    const [priceOpen, setPriceOpen] = useState(true);

    const clearAll = () => {
        setSearch("");
        setSelectedCategory("All");
        setPriceRange([0, 700]);
        setInStockOnly(false);
    };

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-800 text-base flex items-center gap-2">
                    <Filter className="w-4 h-4" style={{ color: "#B5451B" }} /> Filters
                </h3>
                <button onClick={clearAll} className="text-xs text-gray-400 hover:text-[#B5451B] transition-colors">
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
                        <button onClick={() => setSearch("")}>
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
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => { setSelectedCategory(cat); onClose?.(); }}
                                className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-all ${selectedCategory === cat
                                    ? "font-semibold text-white"
                                    : "text-gray-600 hover:bg-orange-50 hover:text-[#B5451B]"
                                    }`}
                                style={selectedCategory === cat ? { background: "#B5451B" } : {}}
                            >
                                {cat}
                                <span className="float-right text-xs opacity-60">
                                    {cat === "All"
                                        ? ALL_PRODUCTS.length
                                        : ALL_PRODUCTS.filter((p) => p.category === cat).length}
                                </span>
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
                            min={0} max={700} step={10}
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
    const [priceRange, setPriceRange] = useState([0, 700]);
    const [inStockOnly, setInStockOnly] = useState(false);
    const [sort, setSort] = useState("featured");
    const [page, setPage] = useState(1);

    // Apply filters + sort
    const filtered = useMemo(() => {
        let list = [...ALL_PRODUCTS];
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
        }
        if (selectedCategory !== "All") list = list.filter((p) => p.category === selectedCategory);
        list = list.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
        if (inStockOnly) list = list.filter((p) => p.inStock);
        if (sort === "price_asc") list.sort((a, b) => a.price - b.price);
        else if (sort === "price_desc") list.sort((a, b) => b.price - a.price);
        else if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
        else if (sort === "reviews") list.sort((a, b) => b.reviews - a.reviews);
        return list;
    }, [search, selectedCategory, priceRange, inStockOnly, sort]);

    // Pagination — reset to 1 whenever filters change
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    const handleFilterChange = <T,>(setter: (v: T) => void) => (v: T) => {
        setter(v);
        setPage(1);
    };

    const activeFilterCount = [
        search.trim() !== "",
        selectedCategory !== "All",
        priceRange[0] > 0 || priceRange[1] < 700,
        inStockOnly,
    ].filter(Boolean).length;

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
                        {filtered.length} products found{selectedCategory !== "All" ? ` in ${selectedCategory}` : ""}
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
                                    <Button variant="outline" size="sm" className="lg:hidden flex items-center gap-2 rounded-full font-medium"
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
                                            <button className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                                        </SheetClose>
                                    </div>
                                    <FilterPanel
                                        search={search} setSearch={handleFilterChange(setSearch)}
                                        selectedCategory={selectedCategory} setSelectedCategory={handleFilterChange(setSelectedCategory)}
                                        priceRange={priceRange} setPriceRange={handleFilterChange(setPriceRange)}
                                        inStockOnly={inStockOnly} setInStockOnly={handleFilterChange(setInStockOnly)}
                                    />
                                </SheetContent>
                            </Sheet>

                            {/* Active filter chips */}
                            <div className="flex flex-wrap gap-2 flex-1">
                                {selectedCategory !== "All" && (
                                    <span className="flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full cursor-pointer"
                                        style={{ background: "#B5451B15", color: "#B5451B" }}
                                        onClick={() => { setSelectedCategory("All"); setPage(1); }}>
                                        {selectedCategory} <X className="w-3 h-3" />
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
                        {paginated.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                                {paginated.map((p) => <ProductCard key={p.id} p={p} />)}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-24 text-center">
                                <span className="text-5xl mb-4">🧐</span>
                                <p className="font-bold text-gray-700 text-lg mb-1">No products found</p>
                                <p className="text-gray-400 text-sm mb-5">Try adjusting your search or filters</p>
                                <Button variant="outline" size="sm" className="rounded-full"
                                    style={{ borderColor: "#B5451B", color: "#B5451B" }}
                                    onClick={() => { setSearch(""); setSelectedCategory("All"); setPriceRange([0, 700]); setInStockOnly(false); }}>
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
                                        {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)}
                                    </span>{" "}
                                    of <span className="font-semibold text-gray-700">{filtered.length}</span> products
                                </p>

                                <div className="flex items-center gap-1.5">
                                    {/* Prev */}
                                    <button
                                        onClick={() => setPage(page - 1)}
                                        disabled={page === 1}
                                        className="w-8 h-8 rounded-full border flex items-center justify-center text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#B5451B] hover:text-[#B5451B]"
                                        style={{ borderColor: "#E0C9B0" }}
                                    >
                                        ‹
                                    </button>

                                    {/* Page numbers */}
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => {
                                        const show = n === 1 || n === totalPages || Math.abs(n - page) <= 1;
                                        const ellipsis = (n === 2 && page > 4) || (n === totalPages - 1 && page < totalPages - 3);
                                        if (!show) return null;
                                        if (ellipsis) return <span key={n} className="px-1 text-gray-400 text-sm">…</span>;
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

                                    {/* Next */}
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
