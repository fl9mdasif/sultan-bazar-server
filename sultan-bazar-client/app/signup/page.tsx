"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SignUpPage() {
    const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((f) => ({ ...f, [k]: e.target.value }));

    const validate = () => {
        const e: Record<string, string> = {};
        if (!form.name.trim()) e.name = "Full name is required";
        if (!form.email.trim()) e.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email address";
        if (!form.password) e.password = "Password is required";
        else if (form.password.length < 6) e.password = "Minimum 6 characters";
        if (form.password !== form.confirm) e.confirm = "Passwords do not match";
        return e;
    };

    const handleSubmit = async (ev: React.FormEvent) => {
        ev.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setErrors({});
        setLoading(true);
        await new Promise((r) => setTimeout(r, 1500));
        setLoading(false);
        setDone(true);
    };

    const strength = (() => {
        const p = form.password;
        if (!p) return 0;
        let s = 0;
        if (p.length >= 6) s++;
        if (p.length >= 10) s++;
        if (/[A-Z]/.test(p)) s++;
        if (/[0-9]/.test(p)) s++;
        if (/[^A-Za-z0-9]/.test(p)) s++;
        return s;
    })();

    const strengthLabel = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"][strength];
    const strengthColor = ["", "#ef4444", "#f97316", "#eab308", "#22c55e", "#16a34a"][strength];

    return (
        <div className="min-h-screen flex" style={{ background: "#FAFAF8" }}>
            {/* ── Left Panel — Brand Visual ── */}
            <div
                className="hidden lg:flex flex-col justify-between w-[45%] relative overflow-hidden p-12"
                style={{ background: "linear-gradient(160deg, #B5451B 0%, #8f3514 60%, #5c200c 100%)" }}
            >
                <div className="absolute inset-0">
                    <Image src="/images/jar_opening.png" alt="Sultan Bazar" fill className="object-cover opacity-20" />
                </div>
                <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-10 border-2 border-white" />
                <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-10 border-2 border-white" />

                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-3">
                        <span className="text-3xl">🪔</span>
                        <div>
                            <p className="text-white text-2xl font-extrabold tracking-tight">Sultan Bazar</p>
                            <p className="text-orange-200 text-xs font-medium">স্বাদে খাঁটি, মানে নিখুঁত</p>
                        </div>
                    </Link>
                </div>

                <div className="relative z-10 space-y-6">
                    <div>
                        <h2 className="text-white text-4xl font-bold leading-snug mb-3">
                            Join thousands of<br />
                            <span style={{ color: "#F5D078" }}>happy families</span>
                        </h2>
                        <p className="text-orange-200 text-base leading-relaxed max-w-sm">
                            Create your account to enjoy exclusive member discounts, order tracking, and early access to new products.
                        </p>
                    </div>
                    <div className="space-y-3 max-w-sm">
                        {[
                            "Exclusive member discounts",
                            "Order history & tracking",
                            "Wishlist & saved addresses",
                            "Early access to new arrivals",
                        ].map((benefit) => (
                            <div key={benefit} className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#F5D07830" }}>
                                    <CheckCircle className="w-3.5 h-3.5" style={{ color: "#F5D078" }} />
                                </div>
                                <span className="text-orange-100 text-sm">{benefit}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10">
                    <p className="text-orange-200/60 text-xs">© 2026 Sultan Bazar. All rights reserved.</p>
                </div>
            </div>

            {/* ── Right Panel — Form ── */}
            <div className="flex-1 flex items-center justify-center px-6 py-10 lg:px-16 overflow-y-auto">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <Link href="/" className="flex items-center gap-2 mb-6 lg:hidden">
                        <span className="text-2xl">🪔</span>
                        <span className="text-xl font-extrabold" style={{ color: "#B5451B" }}>Sultan Bazar</span>
                    </Link>

                    {done ? (
                        <div className="text-center py-10">
                            <CheckCircle className="w-16 h-16 mx-auto mb-4" style={{ color: "#B5451B" }} />
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Created!</h2>
                            <p className="text-gray-500 mb-6">Welcome to Sultan Bazar. You can now sign in.</p>
                            <Link href="/login">
                                <Button className="rounded-xl text-white px-8" style={{ background: "#B5451B" }}>
                                    Go to Sign In
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="mb-7">
                                <h1 className="text-3xl font-bold text-gray-900 mb-1">Create account</h1>
                                <p className="text-gray-500 text-sm">
                                    Already have an account?{" "}
                                    <Link href="/login" className="font-semibold hover:underline" style={{ color: "#B5451B" }}>Sign in</Link>
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                                {/* Name */}
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Full Name</label>
                                    <div className={`flex items-center gap-3 border rounded-xl px-4 py-3 bg-white transition-colors ${errors.name ? "border-red-400" : "border-gray-200 focus-within:border-[#B5451B]"}`}>
                                        <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                        <input type="text" value={form.name} onChange={set("name")} placeholder="e.g. Rahim Uddin"
                                            className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-300" />
                                    </div>
                                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Email Address</label>
                                    <div className={`flex items-center gap-3 border rounded-xl px-4 py-3 bg-white transition-colors ${errors.email ? "border-red-400" : "border-gray-200 focus-within:border-[#B5451B]"}`}>
                                        <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                        <input type="email" value={form.email} onChange={set("email")} placeholder="you@example.com"
                                            className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-300" />
                                    </div>
                                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Phone (optional)</label>
                                    <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 bg-white focus-within:border-[#B5451B] transition-colors">
                                        <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                        <input type="tel" value={form.phone} onChange={set("phone")} placeholder="+880 1xxx-xxxxxx"
                                            className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-300" />
                                    </div>
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Password</label>
                                    <div className={`flex items-center gap-3 border rounded-xl px-4 py-3 bg-white transition-colors ${errors.password ? "border-red-400" : "border-gray-200 focus-within:border-[#B5451B]"}`}>
                                        <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                        <input type={showPass ? "text" : "password"} value={form.password} onChange={set("password")} placeholder="••••••••"
                                            className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-300" />
                                        <button type="button" onClick={() => setShowPass(!showPass)} className="text-gray-400 hover:text-gray-600">
                                            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {form.password && (
                                        <div className="mt-2">
                                            <div className="flex gap-1 mb-1">
                                                {[1, 2, 3, 4, 5].map((i) => (
                                                    <div key={i} className="h-1 flex-1 rounded-full transition-all"
                                                        style={{ background: i <= strength ? strengthColor : "#e5e7eb" }} />
                                                ))}
                                            </div>
                                            <p className="text-xs font-medium" style={{ color: strengthColor }}>{strengthLabel}</p>
                                        </div>
                                    )}
                                    {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                                </div>

                                {/* Confirm password */}
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Confirm Password</label>
                                    <div className={`flex items-center gap-3 border rounded-xl px-4 py-3 bg-white transition-colors ${errors.confirm ? "border-red-400" : "border-gray-200 focus-within:border-[#B5451B]"}`}>
                                        <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                        <input type="password" value={form.confirm} onChange={set("confirm")} placeholder="••••••••"
                                            className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-300" />
                                    </div>
                                    {errors.confirm && <p className="text-xs text-red-500 mt-1">{errors.confirm}</p>}
                                </div>

                                <p className="text-xs text-gray-400">
                                    By creating an account you agree to our{" "}
                                    <span className="underline cursor-pointer" style={{ color: "#B5451B" }}>Terms</span> and{" "}
                                    <span className="underline cursor-pointer" style={{ color: "#B5451B" }}>Privacy Policy</span>.
                                </p>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full text-white font-semibold rounded-xl py-3 h-auto flex items-center justify-center gap-2 text-base"
                                    style={{ background: loading ? "#ccc" : "linear-gradient(135deg, #B5451B, #D4860A)" }}
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>}
                                </Button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
