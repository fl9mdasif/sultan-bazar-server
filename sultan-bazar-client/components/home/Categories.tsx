import Link from "next/link";

const categories = [
    { icon: "🫙", name: "Spice Powders", sub: "Turmeric, Chili, Coriander", slug: "spice-powders" },
    { icon: "🍵", name: "Tea", sub: "Isphahani, Lipton", slug: "tea" },
    { icon: "🫒", name: "Oils", sub: "Sultan Mustard Oil", slug: "oils" },
    { icon: "🌾", name: "Rice & Grains", sub: "Aromatic, Puffed, Flattened", slug: "rice-grains" },
    { icon: "🥘", name: "Masala Mixes", sub: "Haleem, Biriyani, Kala Bhuna", slug: "masala-mixes" },
    { icon: "🌶️", name: "Whole Spices", sub: "Chili Whole, Tejpata", slug: "whole-spices" },
    { icon: "🫘", name: "Pulses & Seeds", sub: "Chia, Basil/Takma, Chola", slug: "pulses-seeds" },
    { icon: "🍜", name: "Dry Foods", sub: "Semai, Chanachur, Gram Flour", slug: "dry-foods" },
];

export default function Categories() {
    return (
        <section className="py-8 lg:py-12" style={{ background: "#FDF6EC" }}>
            <div className="container mx-auto px-4 lg:px-8">
                {/* Section header */}
                <div className="text-center mb-10">
                    <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "#D4860A" }}>
                        Browse
                    </p>
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                        Shop by <span style={{ color: "#B5451B" }}>Category</span>
                    </h2>
                    <p className="text-gray-500 mt-2 max-w-md mx-auto">
                        Everything you need for your kitchen, all in one place
                    </p>
                </div>

                {/* Cards — horizontal scroll on mobile, grid on desktop */}
                <div className="flex gap-4 overflow-x-auto pb-3 md:grid md:grid-cols-4 md:overflow-visible lg:grid-cols-4 md:gap-5 scrollbar-hide">
                    {categories.map((cat) => (
                        <Link
                            key={cat.slug}
                            href={`/categories/${cat.slug}`}
                            className="hover-lift flex-shrink-0 w-40 md:w-auto group"
                        >
                            <div
                                className="rounded-2xl p-5 text-center cursor-pointer border transition-all duration-200 group-hover:border-[#B5451B] group-hover:bg-white"
                                style={{
                                    background: "white",
                                    border: "1.5px solid #F0E6D3",
                                }}
                            >
                                <div
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 text-3xl transition-transform duration-200 group-hover:scale-110"
                                    style={{ background: "linear-gradient(135deg, #FEF3CD, #FCE8C3)" }}
                                >
                                    {cat.icon}
                                </div>
                                <p className="font-bold text-gray-800 text-sm leading-tight">
                                    {cat.name}
                                </p>
                                <p className="text-gray-400 text-xs mt-1 leading-tight">{cat.sub}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* View all */}
                <div className="text-center mt-8">
                    <Link
                        href="/categories"
                        className="text-sm font-semibold hover:underline transition-colors"
                        style={{ color: "#B5451B" }}
                    >
                        View All Categories →
                    </Link>
                </div>
            </div>
        </section>
    );
}
