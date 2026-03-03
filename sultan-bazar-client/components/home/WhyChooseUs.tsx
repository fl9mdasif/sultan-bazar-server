const features = [
    {
        icon: "🌿",
        title: "খাঁটি উপাদান",
        sub: "Pure Ingredients",
        desc: "No artificial colors, no preservatives. Sourced directly from trusted farmers across Bangladesh.",
    },
    {
        icon: "🏭",
        title: "নিজস্ব প্রক্রিয়াজাত",
        sub: "Own Processing Unit",
        desc: "Processed in our own facility under strict hygiene and quality control standards.",
    },
    {
        icon: "📦",
        title: "নিরাপদ প্যাকেজিং",
        sub: "Safe Packaging",
        desc: "Sealed, tamper-proof packaging to lock in freshness and protect from contamination.",
    },
    {
        icon: "🚚",
        title: "দ্রুত ডেলিভারি",
        sub: "Fast Delivery",
        desc: "We deliver across Bangladesh within 2–4 business days, right to your doorstep.",
    },
    {
        icon: "💬",
        title: "বিশ্বস্ত সেবা",
        sub: "Trusted Support",
        desc: "Dedicated customer support team available 9am–9pm daily to resolve any issues.",
    },
    {
        icon: "💰",
        title: "সেরা মূল্য",
        sub: "Best Prices",
        desc: "Direct from source means we cut out the middleman and pass the savings to you.",
    },
];

export default function WhyChooseUs() {
    return (
        <section className="py-8 lg:py-12" style={{ background: "#FDF6EC" }}>
            <div className="container mx-auto px-4 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "#D4860A" }}>
                        Our Promise
                    </p>
                    <h2 className="font-bengali text-3xl lg:text-4xl font-bold text-gray-900">
                        কেন <span style={{ color: "#B5451B" }}>সুলতান বাজার</span> বেছে নেবেন?
                    </h2>
                    <p className="text-gray-500 mt-2">
                        We believe you deserve the best — pure, fresh, and at fair prices.
                    </p>
                </div>

                {/* 3-col grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((f) => (
                        <div
                            key={f.title}
                            className="hover-lift bg-white rounded-2xl p-6 border transition-all"
                            style={{ border: "1.5px solid #F0E6D3" }}
                        >
                            <div
                                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-4"
                                style={{ background: "linear-gradient(135deg, #FEF3CD, #FCE8C3)" }}
                            >
                                {f.icon}
                            </div>
                            <h3 className="font-bengali text-lg font-bold text-gray-800">
                                {f.title}
                            </h3>
                            <p className="text-xs font-medium mb-2" style={{ color: "#D4860A" }}>
                                {f.sub}
                            </p>
                            <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
