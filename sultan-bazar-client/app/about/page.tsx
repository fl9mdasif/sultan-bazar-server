"use client";

import Image from "next/image";
import { CheckCircle, Leaf, Award, Users, Heart, Truck, Shield } from "lucide-react";

const STATS = [
    { icon: "🏭", value: "30+", label: "Years of Trust" },
    { icon: "🌍", value: "50+", label: "Cities Served" },
    { icon: "🛒", value: "24", label: "Quality Products" },
    { icon: "⭐", value: "4.8", label: "Average Rating" },
];

const VALUES = [
    {
        icon: <Leaf className="w-6 h-6" />,
        title: "Natural Ingredients",
        desc: "We source only the finest, 100% natural ingredients — free from artificial preservatives and additives.",
    },
    {
        icon: <Award className="w-6 h-6" />,
        title: "Unmatched Quality",
        desc: "Every product goes through rigorous quality checks before reaching your kitchen table.",
    },
    {
        icon: <Heart className="w-6 h-6" />,
        title: "Made with Love",
        desc: "Recipes crafted with generations of culinary passion, bringing authentic Bangladeshi flavors to your home.",
    },
    {
        icon: <Users className="w-6 h-6" />,
        title: "Community First",
        desc: "We partner with local farmers and artisans, empowering rural communities across Bangladesh.",
    },
    {
        icon: <Truck className="w-6 h-6" />,
        title: "Fast Delivery",
        desc: "Reliable, prompt delivery to your doorstep across 50+ cities — fresh and on time.",
    },
    {
        icon: <Shield className="w-6 h-6" />,
        title: "Safe & Certified",
        desc: "All products are BSTI certified, meeting the highest standards for food safety in Bangladesh.",
    },
];

const TEAM = [
    { emoji: "👨‍💼", name: "Mohammad Sultan", role: "Founder & CEO", desc: "30+ years of experience in the food industry, pioneering authentic Bangladeshi flavors." },
    { emoji: "👩‍🍳", name: "Fatema Khatun", role: "Head of Quality", desc: "Ensuring every product meets our highest standards before reaching your family." },
    { emoji: "👨‍🌾", name: "Rahim Uddin", role: "Sourcing Manager", desc: "Building direct relationships with the finest farmers across Bangladesh." },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen" style={{ background: "#FAFAF8" }}>

            {/* ── Hero Header ── */}
            <div className="relative border-b border-orange-100 overflow-hidden" style={{ minHeight: 280 }}>
                {/* Background photo */}
                <Image
                    src="/images/mosla_page.png"
                    alt="Sultan Bazar spices"
                    fill
                    className="object-cover object-center"
                    priority
                />
                {/* Overlay */}
                <div className="absolute inset-0" style={{ background: "rgba(253,246,236,0.82)" }} />

                <div className="relative z-10 py-14 lg:py-20 text-center container mx-auto px-4">
                    <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#D4860A" }}>
                        Our Story
                    </p>
                    <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        About <span style={{ color: "#B5451B" }}>Sultan Bazar</span>
                    </h1>
                    <p className="text-gray-600 text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
                        Bringing the authentic taste of Bangladesh to your home since 1994.
                        Trusted by millions of families across the nation.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16 space-y-16">

                {/* ── Our Story ── */}
                <section className="grid lg:grid-cols-2 gap-10 items-center">
                    {/* Text */}
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#D4860A" }}>Who We Are</p>
                        <h2 className="text-3xl font-bold text-gray-900 mb-5">
                            Rooted in Tradition,<br />
                            <span style={{ color: "#B5451B" }}>Built for Today</span>
                        </h2>
                        <div className="space-y-4 text-gray-600 leading-relaxed">
                            <p>
                                Sultan Bazar was founded in 1994 in the heart of Chittagong with a single mission —
                                to provide Bangladeshi families with the purest, most authentic food products at fair prices.
                                What started as a small mustard‑oil producer has grown into one of the country's most
                                trusted brands.
                            </p>
                            <p>
                                Today, our product range spans premium mustard oils, hand-crafted masala mixes, aromatic rice,
                                premium teas, whole spices, and much more — all made with the same care and commitment to
                                quality that defined our very first batch.
                            </p>
                            <p>
                                Every ingredient we use is sourced directly from trusted local farmers, ensuring freshness
                                while supporting the communities that make our products possible.
                            </p>
                        </div>
                        <div className="mt-6 flex flex-wrap gap-3">
                            {["BSTI Certified", "100% Natural", "No Preservatives", "Locally Sourced"].map((t) => (
                                <span key={t}
                                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                                    style={{ background: "#B5451B15", color: "#B5451B" }}>
                                    <CheckCircle className="w-3.5 h-3.5" /> {t}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Visual card */}
                    <div className="relative">
                        <div className="rounded-3xl overflow-hidden shadow-xl aspect-[4/3] relative">
                            <Image
                                src="/images/jar_opening.png"
                                alt="Sultan Bazar products"
                                fill
                                className="object-cover object-center"
                            />
                        </div>
                        {/* Floating badge */}
                        <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg px-5 py-3 flex items-center gap-3"
                            style={{ border: "1.5px solid #F0E6D3" }}>
                            <span className="text-3xl">⭐</span>
                            <div>
                                <p className="font-bold text-gray-900 text-lg leading-none">4.8/5</p>
                                <p className="text-xs text-gray-500">Avg. Customer Rating</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Stats ── */}
                <section>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {STATS.map((s) => (
                            <div key={s.label}
                                className="hover-lift bg-white rounded-2xl p-6 text-center shadow-sm"
                                style={{ border: "1.5px solid #F0E6D3" }}>
                                <span className="text-4xl mb-3 block">{s.icon}</span>
                                <p className="text-3xl font-bold mb-1" style={{ color: "#B5451B" }}>{s.value}</p>
                                <p className="text-sm text-gray-500">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Our Values ── */}
                <section>
                    <div className="text-center mb-10">
                        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#D4860A" }}>What Drives Us</p>
                        <h2 className="text-3xl font-bold text-gray-900">
                            Our Core <span style={{ color: "#B5451B" }}>Values</span>
                        </h2>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {VALUES.map((v) => (
                            <div key={v.title}
                                className="hover-lift bg-white rounded-2xl p-6 shadow-sm"
                                style={{ border: "1.5px solid #F0E6D3" }}>
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white"
                                    style={{ background: "#B5451B" }}>
                                    {v.icon}
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Meet the Team ── */}
                <section>
                    <div className="text-center mb-10">
                        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#D4860A" }}>The People Behind</p>
                        <h2 className="text-3xl font-bold text-gray-900">
                            Meet Our <span style={{ color: "#B5451B" }}>Team</span>
                        </h2>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {TEAM.map((m) => (
                            <div key={m.name}
                                className="hover-lift bg-white rounded-2xl p-6 text-center shadow-sm"
                                style={{ border: "1.5px solid #F0E6D3" }}>
                                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl"
                                    style={{ background: "linear-gradient(135deg, #FDF6EC, #FEF3CD)" }}>
                                    {m.emoji}
                                </div>
                                <h3 className="font-bold text-gray-900 text-lg">{m.name}</h3>
                                <p className="text-sm font-semibold mb-2" style={{ color: "#B5451B" }}>{m.role}</p>
                                <p className="text-sm text-gray-500 leading-relaxed">{m.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── CTA ── */}
                <section className="rounded-3xl overflow-hidden relative text-center text-white">
                    <Image src="/images/all-products.png" alt="All products" fill className="object-cover object-center" />
                    <div className="absolute inset-0" style={{ background: "rgba(181,69,27,0.88)" }} />
                    <div className="relative z-10 p-10 lg:p-16">
                        <h2 className="text-3xl font-bold mb-3">Ready to taste the difference?</h2>
                        <p className="text-orange-100 mb-6 max-w-xl mx-auto">
                            Explore our full range of authentic Bangladeshi food products — crafted with love and tradition.
                        </p>
                        <a href="/products"
                            className="inline-flex items-center gap-2 bg-white font-bold px-8 py-3 rounded-full text-sm hover:bg-orange-50 transition-colors"
                            style={{ color: "#B5451B" }}>
                            Shop All Products →
                        </a>
                    </div>
                </section>

            </div>
        </div>
    );
}