"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
    {
        image: "/images/slides/slider1.jpg",
        badge: "🌿 100% Natural Products",
        headline: "রান্নাঘরের বিশ্বস্ত সঙ্গী",
        sub: "FLAT 10% OFF ON ALL SPICES",
        coupon: "SULTAN10",
        cta: { label: "Shop Now", href: "/products" },
    },
    {
        image: "/images/slides/slider2.jpg",
        badge: "⭐ Chef's Choice",
        headline: "The Choice of Chefs",
        sub: "15% OFF ON MASALA & SPICES",
        coupon: "SULTAN15",
        cta: { label: "Explore Products", href: "/products" },
    },
    {
        image: "/images/slides/slider3.jpg",
        badge: "🌾 Farm to Table",
        headline: "All Organic Spices...",
        sub: "20% OFF ALL PRODUCTS",
        coupon: "SULTAN20",
        cta: { label: "Shop All", href: "/products" },
    },
];

export default function Hero() {
    const [current, setCurrent] = useState(0);
    const [animating, setAnimating] = useState(false);

    const goTo = useCallback((idx: number) => {
        if (animating) return;
        setAnimating(true);
        setTimeout(() => {
            setCurrent(idx);
            setAnimating(false);
        }, 300);
    }, [animating]);

    const prev = () => goTo((current - 1 + SLIDES.length) % SLIDES.length);
    const next = useCallback(() => goTo((current + 1) % SLIDES.length), [current, goTo]);

    // Auto-play
    useEffect(() => {
        const timer = setInterval(next, 5000);
        return () => clearInterval(timer);
    }, [next]);

    const slide = SLIDES[current];

    return (
        <section className="relative w-full overflow-hidden" style={{ height: "100vh" }}>

            {/* ── Slide Images ── */}
            {SLIDES.map((s, i) => (
                <div
                    key={i}
                    className="absolute inset-0 transition-opacity duration-700"
                    style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
                >
                    <Image
                        src={s.image}
                        alt={s.headline}
                        fill
                        className="object-cover object-center"
                        priority={i === 0}
                    />
                    {/* Dark overlay for text readability */}
                    <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.42)" }} />
                </div>
            ))}

            {/* ── Centered Text Content ── */}
            <div
                className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-6"
                style={{ opacity: animating ? 0 : 1, transition: "opacity 0.3s ease" }}
            >
                {/* Badge */}
                <span
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 rounded-full mb-5"
                    style={{ background: "rgba(255,255,255,0.15)", color: "#F5D078", border: "1px solid rgba(245,208,120,0.4)", backdropFilter: "blur(4px)" }}
                >
                    {slide.badge}
                </span>

                {/* Main headline */}
                <h1
                    className="font-bengali text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight drop-shadow-lg"
                    style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}
                >
                    {slide.headline}
                </h1>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-2">
                    <div className="h-px w-16 bg-[#D4860A]" />
                    <span className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: "#D4860A" }}>
                        {slide.sub}
                    </span>
                    <div className="h-px w-16 bg-[#D4860A]" />
                </div>

                {/* Coupon */}
                <p className="text-sm text-white/80 mb-7 tracking-widest uppercase">
                    Use Coupon :{" "}
                    <span className="font-bold text-white bg-white/20 px-2 py-0.5 rounded">
                        {slide.coupon}
                    </span>
                </p>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                        href={slide.cta.href}
                        className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-sm transition-all hover:scale-105"
                        style={{ background: "linear-gradient(135deg, #B5451B, #D4860A)", color: "white", boxShadow: "0 4px 20px rgba(181,69,27,0.5)" }}
                    >
                        {slide.cta.label} →
                    </Link>
                    <Link
                        href="/categories"
                        className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-sm transition-all hover:scale-105 bg-white/15 backdrop-blur-sm border border-white/30 text-white hover:bg-white/25"
                    >
                        View Categories
                    </Link>
                </div>
            </div>

            {/* ── Prev / Next Arrows ── */}
            <button
                onClick={prev}
                className="absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.3)", color: "white" }}
                aria-label="Previous slide"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
            <button
                onClick={next}
                className="absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.3)", color: "white" }}
                aria-label="Next slide"
            >
                <ChevronRight className="w-5 h-5" />
            </button>

            {/* ── Dot Indicators ── */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                {SLIDES.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i)}
                        className="transition-all rounded-full"
                        style={{
                            width: i === current ? 24 : 8,
                            height: 8,
                            background: i === current ? "#D4860A" : "rgba(255,255,255,0.5)",
                        }}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>

            {/* ── Slide counter ── */}
            <div
                className="absolute top-4 right-4 z-20 text-xs font-bold text-white/70"
                style={{ letterSpacing: "0.1em" }}
            >
                {String(current + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
            </div>
        </section>
    );
}
