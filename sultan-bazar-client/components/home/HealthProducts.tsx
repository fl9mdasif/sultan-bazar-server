"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useGetAllProductsQuery } from "@/redux/api/productApi";
import { TProduct } from "@/types/common";
import { Loader2, Leaf } from "lucide-react";
import { isLoggedIn } from "@/services/auth.services";
import { toast } from "sonner";

export default function HealthProducts() {
    const router = useRouter();
    // We fetch a larger limit to ensure we find enough tagged products locally
    const { data, isLoading, isError } = useGetAllProductsQuery({ limit: 6 });
    const allProducts = data?.data || [];

    // Filter by tag "health" (case-insensitive)
    const products = allProducts.filter((p: TProduct) =>
        p.tags?.some(tag => tag.toLowerCase() === "health")
    );

    if (isLoading) {
        return (
            <section className="py-12 lg:py-20 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#B5451B] mx-auto mb-4" />
                    <p className="text-gray-500">Loading nature's gifts...</p>
                </div>
            </section>
        );
    }

    if (isError || products.length === 0) {
        return null; // Don't show the section if there's an error or no products
    }

    const handleShop = (id: string) => {
        // if (!isLoggedIn()) {
        //     toast.error("Please login to see product details");
        //     router.push(`/login?from=/products/${id}`);
        //     return;
        // }
        router.push(`/products/${id}`);
    };

    return (
        <section className="py-12 lg:py-20 bg-white overflow-hidden">
            <div className="container mx-auto px-4 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 mb-3 px-4 py-1.5 rounded-full bg-[#D4860A]/10 border border-[#D4860A]/20">
                        <Leaf className="w-4 h-4 text-[#D4860A]" />
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "#D4860A" }}>
                            Nature&apos;s Best
                        </p>
                    </div>
                    <h2 className="font-bengali text-3xl lg:text-5xl font-black text-gray-900 tracking-tight">
                        প্রকৃতির <span style={{ color: "#B5451B" }}>সেরা উপহার</span>
                    </h2>
                    <p className="text-gray-500 mt-6 max-w-xl mx-auto text-sm lg:text-base leading-relaxed">
                        Health-focused natural products curated for your holistic wellbeing and daily nourishment.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
                    {products.slice(0, 3).map((p: TProduct, idx: number) => {
                        const variant = p.variants[0];
                        const price = variant?.discountPrice ?? variant?.price ?? 0;
                        const colors = [
                            "from-green-50 to-emerald-50",
                            "from-purple-50 to-violet-50",
                            "from-blue-50 to-cyan-50"
                        ];
                        const accents = ["#16a34a", "#7c3aed", "#0891b2"];

                        return (
                            <div
                                key={p._id}
                                className="group hover-lift rounded-[2.5rem] overflow-hidden border bg-white shadow-sm transition-all hover:shadow-xl cursor-pointer"
                                style={{ border: "1.5px solid #F0E6D3" }}
                            >
                                {/* Image area */}
                                <div className={`relative bg-gradient-to-br ${colors[idx % 3]} h-64 flex items-center justify-center overflow-hidden`}>
                                    {p.thumbnail ? (
                                        <Image
                                            src={p.thumbnail}
                                            alt={p.name}
                                            fill
                                            className="object-contain p-8 group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <span className="text-8xl opacity-20">🍃</span>
                                    )}
                                    <div className="absolute top-6 right-6">
                                        <div
                                            className="w-12 h-12 rounded-full flex items-center justify-center bg-white/80 backdrop-blur-sm shadow-sm"
                                            style={{ color: accents[idx % 3] }}
                                        >
                                            <Leaf className="w-6 h-6" />
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="font-bengali font-black text-gray-900 text-xl leading-tight mb-1">
                                                {p.name}
                                            </h3>
                                            <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">{p.slug.replace(/-/g, ' ')}</p>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-500 leading-relaxed  line-clamp-3 min-h-[4.5rem]">
                                        {/* {p.description} */}

                                        {p.description.length > 90 ? p.description.slice(0, 90) + "..." : p.description}
                                    </p>

                                    <div className="flex items-center justify-between pt-6 border-t border-orange-50">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Starting from</span>
                                            <span className="text-2xl font-black" style={{ color: "#B5451B" }}>
                                                ৳{price}
                                            </span>
                                        </div>
                                        <Button
                                            onClick={() => handleShop(p._id)}
                                            size="lg"
                                            className="rounded-xl text-white font-bold px-8 shadow-lg hover:shadow-[#B5451B]/20 transition-all active:scale-95"
                                            style={{ background: "#B5451B" }}
                                        >
                                            Shop →
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
