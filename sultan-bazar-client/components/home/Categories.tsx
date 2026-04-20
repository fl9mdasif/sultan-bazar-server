"use client";

import Link from "next/link";
import { useGetAllCategoriesQuery } from "@/redux/api/categoryApi";
import { TCategory } from "@/types/common";
import { Loader2, LayoutGrid } from "lucide-react";
import Image from "next/image";

const CATEGORY_ICONS: Record<string, string> = {
    "spice-powders": "🫙",
    "tea": "🍵",
    "oils": "🫒",
    "rice-grains": "🌾",
    "masala-mixes": "🥘",
    "whole-spices": "🌶️",
    "pulses-seeds": "🫘",
    "dry-foods": "🍜",
};

export default function Categories() {
    const { data: categoryData, isLoading } = useGetAllCategoriesQuery({});
    const categories = categoryData || [];

    if (isLoading) {
        return (
            <section className="py-12 lg:py-20 bg-[#FDF6EC]">
                <div className="container mx-auto px-4 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#B5451B] mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Preparing the spice rack...</p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-12 lg:py-20 relative overflow-hidden" style={{ background: "#FDF6EC" }}>
            {/* Subtle background decoration */}
            <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-orange-100/30 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-orange-100/30 blur-3xl" />

            <div className="relative z-10 container mx-auto px-4 lg:px-8">
                {/* Section header */}
                <div className="text-center mb-14">
                    <div className="inline-flex items-center gap-2 mb-3 px-4 py-1.5 rounded-full bg-white/50 border border-orange-100">
                        <LayoutGrid className="w-4 h-4 text-[#D4860A]" />
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "#D4860A" }}>
                            Explore Diversity
                        </p>
                    </div>
                    <h2 className="text-3xl lg:text-5xl font-black text-gray-900 tracking-tight">
                        Shop by <span style={{ color: "#B5451B" }}>Category</span>
                    </h2>
                    <p className="text-gray-500 mt-6 max-w-lg mx-auto text-sm lg:text-base leading-relaxed">
                        Find everything you need for your authentic kitchen, organized for your convenience.
                    </p>
                </div>

                {/* Cards */}
                {categories.length === 0 ? (
                    <div className="text-center py-10 italic text-gray-400">No categories found.</div>
                ) : (
                    <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8">
                        {categories.map((cat: TCategory) => (
                            <Link
                                key={cat._id}
                                href={`/products?category=${cat.name}`}
                                className="group flex-shrink-0 w-[calc(33.33%-0.75rem)] sm:w-[calc(25%-1rem)] md:w-[calc(20%-1.5rem)] lg:w-[calc(16.66%-2rem)] max-w-[220px]"
                            >
                                <div
                                    className="rounded-2xl sm:rounded-[2rem] p-3 sm:p-6 lg:p-8 text-center cursor-pointer border-2 transition-all duration-300 group-hover:border-[#B5451B] group-hover:bg-white group-hover:shadow-2xl group-hover:-translate-y-2"
                                    style={{
                                        background: "white",
                                        borderColor: "#F0E6D3",
                                    }}
                                >
                                    <div
                                        className="w-12 h-12 xs:w-16 xs:h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl overflow-hidden relative mx-auto mb-3 sm:mb-6 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-orange-900/5 border border-orange-50"
                                        style={{ background: "linear-gradient(135deg, #FEF3CD, #FCE8C3)" }}
                                    >
                                        {cat.thumbnail ? (
                                            <Image
                                                src={cat.thumbnail}
                                                alt={cat.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-4xl">
                                                {CATEGORY_ICONS[cat.slug] || "📦"}
                                            </div>
                                        )}
                                    </div>
                                    <p className="font-black text-gray-900 text-[10px] xs:text-sm sm:text-base lg:text-lg leading-tight mb-1 sm:mb-2 group-hover:text-[#B5451B] transition-colors">
                                        {cat.name}
                                    </p>
                                    <p className="text-gray-400 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity">Explore Items →</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* View all */}
                {/* <div className="text-center mt-14">
                    <Link
                        href="/categories"
                        className="inline-flex items-center gap-2 text-sm font-bold hover:underline transition-colors uppercase tracking-widest"
                        style={{ color: "#B5451B" }}
                    >
                        View All Categories
                        <div className="w-8 h-px bg-[#B5451B]" />
                    </Link>
                </div> */}
            </div>
        </section>
    );
}
