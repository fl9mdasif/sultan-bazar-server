import Link from "next/link";
import { Button } from "@/components/ui/button";

const healthProducts = [
    {
        icon: "🌿",
        name: "Isobgoli",
        nameEn: "Psyllium Husk",
        benefit: "হজমশক্তি বাড়ায়",
        benefitEn: "Aids digestion naturally",
        desc: "Rich in dietary fiber, helps maintain a healthy gut and reduces constipation.",
        price: 120,
        slug: "isobgoli",
        color: "from-green-50 to-emerald-50",
        accent: "#16a34a",
    },
    {
        icon: "🫘",
        name: "চিয়া সিড",
        nameEn: "Chia Seeds",
        benefit: "ওমেগা-৩ সমৃদ্ধ",
        benefitEn: "Rich in Omega-3 & Fiber",
        desc: "Superfood packed with omega-3 fatty acids, antioxidants, and complete protein.",
        price: 95,
        slug: "chia-seeds",
        color: "from-purple-50 to-violet-50",
        accent: "#7c3aed",
    },
    {
        icon: "💧",
        name: "বেসিল সিড / তোকমা",
        nameEn: "Basil Seeds (Takma)",
        benefit: "শীতলতা প্রদানকারী",
        benefitEn: "Cooling & refreshing",
        desc: "Traditional cooling seeds, perfect for summer drinks and digestive health.",
        price: 80,
        slug: "basil-seeds",
        color: "from-blue-50 to-cyan-50",
        accent: "#0891b2",
    },
];

export default function HealthProducts() {
    return (
        <section className="py-8 lg:py-12 bg-white">
            <div className="container mx-auto px-4 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "#D4860A" }}>
                        Nature&apos;s Best
                    </p>
                    <h2 className="font-bengali text-3xl lg:text-4xl font-bold text-gray-900">
                        প্রকৃতির <span style={{ color: "#B5451B" }}>সেরা উপহার</span>
                    </h2>
                    <p className="text-gray-500 mt-2">
                        Health-focused natural products for your wellbeing
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {healthProducts.map((p) => (
                        <div
                            key={p.slug}
                            className={`hover-lift rounded-3xl overflow-hidden border`}
                            style={{ border: "1.5px solid #F0E6D3" }}
                        >
                            {/* Image area */}
                            <div className={`bg-gradient-to-br ${p.color} h-48 flex items-center justify-center`}>
                                <span className="text-8xl">{p.icon}</span>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h3 className="font-bengali font-bold text-gray-800 text-lg leading-tight">
                                            {p.name}
                                        </h3>
                                        <p className="text-gray-500 text-sm">{p.nameEn}</p>
                                    </div>
                                    <span
                                        className="text-xs font-bold px-2 py-1 rounded-full"
                                        style={{ background: `${p.accent}15`, color: p.accent }}
                                    >
                                        {p.benefit}
                                    </span>
                                </div>

                                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                                    {p.benefitEn} — {p.desc}
                                </p>

                                <div className="flex items-center justify-between">
                                    <span className="text-xl font-bold" style={{ color: "#B5451B" }}>
                                        ৳{p.price}
                                    </span>
                                    <Link href={`/products/${p.slug}`}>
                                        <Button
                                            size="sm"
                                            className="rounded-full text-white font-semibold px-5"
                                            style={{ background: "#B5451B" }}
                                        >
                                            Shop Now →
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
