"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, MessageSquare, Facebook, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

const CONTACT_INFO = [
    {
        icon: <MapPin className="w-5 h-5" />,
        title: "Our Office",
        lines: ["Sultan Bazar Complex, CDA Avenue", "Anderkilla, Chittagong 4000", "Bangladesh"],
    },
    {
        icon: <Phone className="w-5 h-5" />,
        title: "Call Us",
        lines: ["+880 1712-345678", "+880 31-234567"],
    },
    {
        icon: <Mail className="w-5 h-5" />,
        title: "Email Us",
        lines: ["info@sultanbazar.com.bd", "support@sultanbazar.com.bd"],
    },
    {
        icon: <Clock className="w-5 h-5" />,
        title: "Working Hours",
        lines: ["Sunday – Thursday: 9am – 6pm", "Friday: 9am – 12pm", "Saturday: Closed"],
    },
];

const SUBJECTS = [
    "Order Inquiry",
    "Product Question",
    "Wholesale / B2B",
    "Feedback",
    "Partnership",
    "Other",
];

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const e: Record<string, string> = {};
        if (!form.name.trim()) e.name = "Name is required";
        if (!form.email.trim()) e.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
        if (!form.message.trim()) e.message = "Message is required";
        return e;
    };

    const handleSubmit = (ev: React.FormEvent) => {
        ev.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setErrors({});
        setSubmitted(true);
    };

    const set = (key: string) => (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setForm((f) => ({ ...f, [key]: ev.target.value }));

    return (
        <div className="min-h-screen" style={{ background: "#FAFAF8" }}>

            {/* ── Hero Header ── */}
            <div className="relative border-b border-orange-100 overflow-hidden" style={{ minHeight: 260 }}>
                <Image
                    src="/hero-spices.png"
                    alt="Sultan Bazar spices contact"
                    fill
                    className="object-cover object-center"
                    priority
                />
                <div className="absolute inset-0" style={{ background: "rgba(253,246,236,0.84)" }} />
                <div className="relative z-10 py-14 lg:py-20 text-center container mx-auto px-4">
                    <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#D4860A" }}>
                        Get in Touch
                    </p>
                    <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        Contact <span style={{ color: "#B5451B" }}>Us</span>
                    </h1>
                    <p className="text-gray-600 text-base lg:text-lg max-w-xl mx-auto">
                        Have a question, feedback, or a wholesale inquiry? We\'d love to hear from you.
                        Our team usually responds within 24 hours.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
                <div className="grid lg:grid-cols-5 gap-10">

                    {/* ── Contact Info Sidebar ── */}
                    <div className="lg:col-span-2 space-y-5">
                        {CONTACT_INFO.map((info) => (
                            <div key={info.title}
                                className="hover-lift bg-white rounded-2xl p-5 flex gap-4 shadow-sm"
                                style={{ border: "1.5px solid #F0E6D3" }}>
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white"
                                    style={{ background: "#B5451B" }}>
                                    {info.icon}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 mb-1 text-sm">{info.title}</p>
                                    {info.lines.map((l) => (
                                        <p key={l} className="text-sm text-gray-500 leading-relaxed">{l}</p>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Social */}
                        <div className="bg-white rounded-2xl p-5 shadow-sm" style={{ border: "1.5px solid #F0E6D3" }}>
                            <p className="font-bold text-gray-900 mb-3 text-sm">Follow Us</p>
                            <div className="flex gap-3">
                                {[
                                    { icon: <Facebook className="w-4 h-4" />, label: "Facebook", href: "#" },
                                    { icon: <Instagram className="w-4 h-4" />, label: "Instagram", href: "#" },
                                    { icon: <MessageSquare className="w-4 h-4" />, label: "WhatsApp", href: "#" },
                                ].map((s) => (
                                    <a key={s.label} href={s.href}
                                        className="w-9 h-9 rounded-full border flex items-center justify-center transition-all hover:text-white"
                                        style={{ borderColor: "#B5451B", color: "#B5451B" }}
                                        onMouseEnter={(e) => {
                                            (e.currentTarget as HTMLElement).style.background = "#B5451B";
                                            (e.currentTarget as HTMLElement).style.color = "white";
                                        }}
                                        onMouseLeave={(e) => {
                                            (e.currentTarget as HTMLElement).style.background = "transparent";
                                            (e.currentTarget as HTMLElement).style.color = "#B5451B";
                                        }}>
                                        {s.icon}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Contact Form ── */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm" style={{ border: "1.5px solid #F0E6D3" }}>
                            {submitted ? (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <CheckCircle className="w-16 h-16 mb-4" style={{ color: "#B5451B" }} />
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h2>
                                    <p className="text-gray-500 mb-6 max-w-sm">
                                        Thank you for reaching out. Our team will get back to you within 24 hours.
                                    </p>
                                    <Button
                                        onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); }}
                                        className="rounded-full text-white px-6"
                                        style={{ background: "#B5451B" }}>
                                        Send Another Message
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <Send className="w-5 h-5" style={{ color: "#B5451B" }} />
                                        Send Us a Message
                                    </h2>

                                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            {/* Name */}
                                            <div>
                                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                                                    Full Name <span style={{ color: "#B5451B" }}>*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={form.name}
                                                    onChange={set("name")}
                                                    placeholder="e.g. Rahim Uddin"
                                                    className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-gray-300 ${errors.name ? "border-red-400" : "border-gray-200 focus:border-[#B5451B]"}`}
                                                />
                                                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                                            </div>

                                            {/* Email */}
                                            <div>
                                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                                                    Email <span style={{ color: "#B5451B" }}>*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    value={form.email}
                                                    onChange={set("email")}
                                                    placeholder="you@example.com"
                                                    className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-gray-300 ${errors.email ? "border-red-400" : "border-gray-200 focus:border-[#B5451B]"}`}
                                                />
                                                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                                            </div>
                                        </div>

                                        <div className="grid sm:grid-cols-2 gap-4">
                                            {/* Phone */}
                                            <div>
                                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                                                    Phone (optional)
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={form.phone}
                                                    onChange={set("phone")}
                                                    placeholder="+880 1xxx-xxxxxx"
                                                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#B5451B] transition-colors placeholder:text-gray-300"
                                                />
                                            </div>

                                            {/* Subject */}
                                            <div>
                                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                                                    Subject
                                                </label>
                                                <select
                                                    value={form.subject}
                                                    onChange={set("subject")}
                                                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#B5451B] transition-colors bg-white text-gray-700">
                                                    <option value="">Select a subject…</option>
                                                    {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
                                                </select>
                                            </div>
                                        </div>

                                        {/* Message */}
                                        <div>
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                                                Message <span style={{ color: "#B5451B" }}>*</span>
                                            </label>
                                            <textarea
                                                rows={5}
                                                value={form.message}
                                                onChange={set("message")}
                                                placeholder="Write your message here…"
                                                className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none resize-none transition-colors placeholder:text-gray-300 ${errors.message ? "border-red-400" : "border-gray-200 focus:border-[#B5451B]"}`}
                                            />
                                            {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full text-white font-semibold rounded-full py-3 h-auto flex items-center justify-center gap-2"
                                            style={{ background: "#B5451B" }}>
                                            <Send className="w-4 h-4" /> Send Message
                                        </Button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Map/Location section ── */}
                <div className="mt-12 rounded-3xl overflow-hidden shadow-sm relative" style={{ border: "1.5px solid #F0E6D3", height: 240 }}>
                    <Image src="/images/Dipping-Sauces-cover.png" alt="Sultan Bazar location" fill className="object-cover object-center" />
                    <div className="absolute inset-0" style={{ background: "rgba(253,246,236,0.75)" }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <MapPin className="w-12 h-12 mx-auto mb-3" style={{ color: "#B5451B" }} />
                            <p className="font-bold text-gray-800 text-lg">Sultan Bazar Complex</p>
                            <p className="text-gray-600 text-sm">CDA Avenue, Anderkilla, Chittagong 4000</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
