"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { loginUser } from "@/services/actions/loginUser";
import { storeUserInfo } from "@/services/auth.services";
import { toast } from "sonner";

function LoginContent() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [serverError, setServerError] = useState("");

    const validate = () => {
        const e: Record<string, string> = {};
        if (!email.trim()) e.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Invalid email address";
        if (!password) e.password = "Password is required";
        else if (password.length < 6) e.password = "Minimum 6 characters";
        return e;
    };

    const searchParams = useSearchParams();
    const from = searchParams.get("from");

    const handleSubmit = async (ev: React.FormEvent) => {
        ev.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setErrors({});
        setServerError("");
        setLoading(true);

        try {
            const res = await loginUser({ email, password });

            if (res?.data?.accessToken) {
                storeUserInfo({ accessToken: res.data.accessToken });
                toast.success(res?.message || "Welcome back!");
                window.location.href = from || "/dashboard";
            } else {
                setServerError(res?.message || "Invalid email or password.");
            }
        } catch {
            setServerError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex" style={{ background: "#FAFAF8" }}>
            {/* ── Left Panel — Brand Visual ── */}
            <div
                className="hidden lg:flex flex-col justify-between w-[45%] relative overflow-hidden p-12"
                style={{ background: "linear-gradient(160deg, #B5451B 0%, #8f3514 60%, #5c200c 100%)" }}
            >
                {/* Background image */}
                <div className="absolute inset-0">
                    <Image src="/images/mosla_page.png" alt="Sultan Bazar" fill className="object-cover opacity-20" />
                </div>

                {/* Decorative circles */}
                <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-10 border-2 border-white" />
                <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-10 border-2 border-white" />

                <div className="relative z-10">
                    <Link href="/" className="inline-block">
                        <div className="relative w-48 h-12">
                            <Image
                                src="/logo.png"
                                alt="Sultan Bazar"
                                fill
                                className="object-contain object-left"
                            />
                        </div>
                    </Link>
                </div>

                <div className="relative z-10 space-y-6">
                    <div>
                        <h2 className="text-white text-4xl font-bold leading-snug mb-3">
                            Welcome back to<br />
                            <span style={{ color: "#F5D078" }}>Sultan Bazar</span>
                        </h2>
                        <p className="text-orange-200 text-base leading-relaxed max-w-sm">
                            Sign in to track orders, manage your wishlist, and enjoy exclusive deals on authentic Bangladeshi food products.
                        </p>
                    </div>

                    {/* Testimonial */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 max-w-sm">
                        <div className="flex gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((i) => <span key={i} className="text-yellow-400 text-sm">★</span>)}
                        </div>
                        <p className="text-white text-sm leading-relaxed italic">
                            &quot;Sultan Bazar spices have transformed my cooking. The quality is unmatched and delivery is always on time!&quot;
                        </p>
                        <p className="text-orange-200 text-xs mt-3 font-semibold">— Fatima Rahman, Dhaka</p>
                    </div>
                </div>

                <div className="relative z-10">
                    <p className="text-orange-200/60 text-xs">© 2026 Sultan Bazar. All rights reserved.</p>
                </div>
            </div>

            {/* ── Right Panel — Form ── */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-16">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
                        <div className="relative w-32 h-10">
                            <Image
                                src="/logo.png"
                                alt="Sultan Bazar"
                                fill
                                className="object-contain object-left"
                            />
                        </div>
                    </Link>

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-1">Sign in</h1>
                        <p className="text-gray-500 text-sm">
                            Don&apos;t have an account?{" "}
                            <Link href="/signup" className="font-semibold hover:underline" style={{ color: "#B5451B" }}>
                                Create one
                            </Link>
                        </p>
                    </div>

                    {serverError && (
                        <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-medium text-red-600">
                            {serverError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                        {/* Email */}
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                                Email Address
                            </label>
                            <div className={`flex items-center gap-3 border rounded-xl px-4 py-3 bg-white transition-colors ${errors.email ? "border-red-400" : "border-gray-200 focus-within:border-[#B5451B]"}`}>
                                <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-300"
                                />
                            </div>
                            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Password</label>
                                <Link href="/forgot-password" className="text-xs font-semibold hover:underline" style={{ color: "#B5451B" }}>
                                    Forgot password?
                                </Link>
                            </div>
                            <div className={`flex items-center gap-3 border rounded-xl px-4 py-3 bg-white transition-colors ${errors.password ? "border-red-400" : "border-gray-200 focus-within:border-[#B5451B]"}`}>
                                <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <input
                                    type={showPass ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-300"
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="text-gray-400 hover:text-gray-600">
                                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                        </div>

                        {/* Remember me */}
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="rounded border-gray-300 accent-[#B5451B]" />
                            <span className="text-sm text-gray-600">Remember me for 30 days</span>
                        </label>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full text-white font-semibold rounded-xl py-3 h-auto flex items-center justify-center gap-2 text-base"
                            style={{ background: loading ? "#ccc" : "linear-gradient(135deg, #B5451B, #D4860A)" }}
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-xs text-gray-400 font-medium">or continue with</span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    {/* Social */}
                    <button
                        className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors bg-white"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Sign in with Google
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
                <Loader2 className="w-10 h-10 animate-spin text-[#B5451B]" />
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
