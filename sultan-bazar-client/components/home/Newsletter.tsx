"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";

export default function Newsletter() {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) setSubscribed(true);
    };

    return (
        <section className="py-8 lg:py-12">
            <div className="container mx-auto px-4 lg:px-8">
                <div
                    className="rounded-3xl px-8 py-12 lg:px-16 lg:py-14 text-center relative overflow-hidden"
                    style={{ background: "linear-gradient(135deg, #FEF3CD, #FCE8C3, #FDF0D5)" }}
                >
                    {/* Decorative circles */}
                    <div
                        className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-20"
                        style={{ background: "#D4860A" }}
                    />
                    <div
                        className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full opacity-15"
                        style={{ background: "#B5451B" }}
                    />

                    <div className="relative z-10 max-w-xl mx-auto">
                        <div className="text-4xl mb-4">📬</div>

                        <h2 className="font-bengali text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                            অফার ও নতুন পণ্যের আপডেট পান
                        </h2>
                        <p className="text-gray-600 mb-1">
                            Subscribe and get{" "}
                            <span className="font-bold" style={{ color: "#B5451B" }}>
                                10% off
                            </span>{" "}
                            your first order
                        </p>
                        <p className="text-sm text-gray-400 mb-8">
                            No spam. Unsubscribe anytime.
                        </p>

                        {subscribed ? (
                            <div
                                className="flex items-center justify-center gap-3 py-4 px-6 rounded-2xl"
                                style={{ background: "#B5451B15", border: "1px solid #B5451B40" }}
                            >
                                <span className="text-2xl">🎉</span>
                                <p className="font-semibold" style={{ color: "#B5451B" }}>
                                    Subscribed! Check your inbox for your discount code.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                                <div className="flex-1 flex items-center gap-2 bg-white border rounded-full px-4 py-1 shadow-sm focus-within:ring-2" style={{ borderColor: "#D4860A40" }}>
                                    <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="flex-1 bg-transparent text-sm outline-none py-2 placeholder:text-gray-400"
                                        placeholder="your@email.com"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="text-white font-semibold rounded-full px-7 shadow-md hover:opacity-90 transition-all flex-shrink-0"
                                    style={{ background: "linear-gradient(135deg, #B5451B, #D4860A)" }}
                                >
                                    Subscribe →
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
