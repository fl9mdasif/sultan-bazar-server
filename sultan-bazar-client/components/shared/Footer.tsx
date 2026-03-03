import Link from "next/link";
import Image from "next/image";

const quickLinks = ["Home", "Products", "Categories", "About", "Contact", "Blog"];
const customerService = ["My Orders", "Track Order", "Return Policy", "FAQ", "Privacy Policy"];

export default function Footer() {
    return (
        <footer className="relative text-gray-300">
            {/* Background image */}
            <Image
                src="/images/footer-image.jpg"
                alt="Footer background"
                fill
                className="object-cover object-center"
            />
            {/* Dark overlay */}
            <div className="absolute inset-0" style={{ background: "rgba(10, 5, 2, 0.54)" }} />
            {/* Main grid */}
            <div className="relative z-10 container mx-auto px-4 lg:px-8 py-14">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Col 1 — Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl">🪔</span>
                            <span className="text-xl font-extrabold text-white">Sultan Bazar</span>
                        </div>
                        <p className="font-bengali text-sm text-gray-400 mb-1">স্বাদে খাঁটি, মানে নিখুঁত</p>
                        <p className="text-sm text-gray-400 leading-relaxed mb-5">
                            Your trusted source for 100% natural spices, oils, and cooking essentials. Bringing the best of Bangladesh to your kitchen.
                        </p>
                        {/* Social icons */}
                        <div className="flex gap-3">
                            {[
                                { icon: "📘", label: "Facebook", href: "#" },
                                { icon: "📷", label: "Instagram", href: "#" },
                                { icon: "▶️", label: "YouTube", href: "#" },
                                { icon: "💬", label: "WhatsApp", href: "#" },
                            ].map((s) => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    aria-label={s.label}
                                    className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-800 hover:bg-gray-700 transition-colors text-lg"
                                >
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Col 2 — Quick Links */}
                    <div>
                        <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
                            Quick Links
                        </h3>
                        <ul className="space-y-2.5">
                            {quickLinks.map((link) => (
                                <li key={link}>
                                    <Link
                                        href={`/${link.toLowerCase().replace(" ", "-")}`}
                                        className="text-sm text-gray-400 hover:text-white transition-colors"
                                    >
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 3 — Customer Service */}
                    <div>
                        <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
                            Customer Service
                        </h3>
                        <ul className="space-y-2.5">
                            {customerService.map((item) => (
                                <li key={item}>
                                    <Link
                                        href={`/${item.toLowerCase().replace(/ /g, "-")}`}
                                        className="text-sm text-gray-400 hover:text-white transition-colors"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 4 — Contact */}
                    <div>
                        <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
                            Contact Us
                        </h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-2 text-gray-400">
                                <span className="text-base mt-0.5">📍</span>
                                <span>Sultan Bazar, Kushtia, Bangladesh</span>
                            </li>
                            <li className="flex items-center gap-2 text-gray-400">
                                <span>📞</span>
                                <a href="tel:+8801700000000" className="hover:text-white transition-colors">
                                    +880 XXXX-XXXXXX
                                </a>
                            </li>
                            <li className="flex items-center gap-2 text-gray-400">
                                <span>📧</span>
                                <a href="mailto:info@sultanbazar.com" className="hover:text-white transition-colors">
                                    info@sultanbazar.com
                                </a>
                            </li>
                            <li className="flex items-center gap-2 text-gray-400">
                                <span>⏰</span>
                                <span>Sat–Thu: 9am – 9pm</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="relative z-10 border-t border-gray-700/50">
                <div className="container mx-auto px-4 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-gray-500">
                        © 2026 Sultan Bazar. All rights reserved.
                    </p>
                    {/* Payment icons */}
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 mr-1">We accept:</span>
                        {["💳 bKash", "💰 Nagad", "🏦 Cash on Delivery"].map((p) => (
                            <span
                                key={p}
                                className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-800 text-gray-300"
                            >
                                {p}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
