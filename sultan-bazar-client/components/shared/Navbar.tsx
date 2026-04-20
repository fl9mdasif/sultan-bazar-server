"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Heart, Search, User, Menu, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { getUserInfo, removeUser, isLoggedIn } from "@/services/auth.services";
import { useGetCartQuery } from "@/redux/api/cartApi";
import Image from "next/image";
import { useAppSelector } from "@/redux/hooks";

const navLinks = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    // { label: "Categories", href: "/categories" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
];

export default function Navbar() {
    const router = useRouter();
    const [scrolled, setScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const [userInitial, setUserInitial] = useState("U");
    const [userName, setUserName] = useState("");
    const [userPhoto, setUserPhoto] = useState<string | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const userIsLoggedIn = isLoggedIn();
    const { data: cartData } = useGetCartQuery({}, { skip: !userIsLoggedIn });

    // Show local cart count for guests, remote cart count for logged-in users
    const localCartItems = useAppSelector((state) => state.localCart.items);
    const cartLength = userIsLoggedIn
        ? (cartData?.items?.length || 0)
        : localCartItems.reduce((acc, item) => acc + item.quantity, 0);

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handler);
        return () => window.removeEventListener("scroll", handler);
    }, []);

    useEffect(() => {
        const user = getUserInfo();
        if (isLoggedIn() && user) {
            setLoggedIn(true);
            const name = user.name || user.email || "U";
            setUserName(name);
            setUserInitial(name.charAt(0).toUpperCase());
            setUserPhoto(user.profilePicture || null);
        } else {
            setLoggedIn(false);
        }
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        removeUser();
        setLoggedIn(false);
        setDropdownOpen(false);
        router.push("/");
        router.refresh();
    };

    return (
        <header
            className={`sticky top-0 z-50 w-full bg-white transition-all duration-300 ${scrolled ? "shadow-md" : "shadow-sm border-b border-orange-100"}`}
        >
            {/* Top accent stripe */}
            <div className="h-[3px] w-full" style={{ background: "linear-gradient(90deg, #B5451B, #D4860A, #B5451B)" }} />

            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex items-center justify-between h-16 gap-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                        <div className="relative w-32 sm:w-44 h-10 sm:h-14">
                            <Image
                                src="/logo.png"
                                alt="Sultan Bazar"
                                fill
                                className="object-contain object-left"
                                priority
                            />
                        </div>
                    </Link>

                    {/* Desktop Nav Links */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-[#B5451B] hover:bg-orange-50 transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Side */}
                    <div className="flex items-center gap-2">


                        {/* Cart */}
                        <Link href="/cart" className="p-2 text-gray-600 hover:text-[#B5451B] transition-colors relative">
                            <ShoppingCart className="w-5 h-5" />
                            <Badge
                                className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center text-[10px] p-0 font-bold"
                                style={{ background: "#B5451B", color: "white" }}
                            >
                                {cartLength}
                            </Badge>
                        </Link>

                        {/* Auth — Login / User Avatar */}
                        {loggedIn ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm transition-transform hover:scale-105"
                                    style={userPhoto ? {} : { background: "linear-gradient(135deg, #B5451B, #D4860A)" }}
                                    title={userName}
                                >
                                    {userPhoto ? (
                                        <Image
                                            src={userPhoto}
                                            alt={userName}
                                            width={36}
                                            height={36}
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    ) : (
                                        userInitial
                                    )}
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="text-xs text-gray-400 font-medium">Signed in as</p>
                                            <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
                                        </div>
                                        <Link
                                            href="/dashboard"
                                            onClick={() => setDropdownOpen(false)}
                                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#B5451B] transition-colors"
                                        >
                                            <LayoutDashboard className="w-4 h-4" />
                                            Dashboard
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link href="/login">
                                <Button
                                    size="sm"
                                    className="flex items-center gap-1.5 text-white text-xs sm:text-sm font-medium rounded-full px-3 sm:px-4 cursor-pointer"
                                    style={{ background: "#B5451B" }}
                                >
                                    <User className="w-3.5 h-3.5 sm:w-4 h-4" />
                                    <span className="hidden xs:block">Login</span>
                                </Button>
                            </Link>
                        )}

                        {/* Mobile hamburger */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <button className="lg:hidden p-2 text-gray-700">
                                    <Menu className="w-5 h-5" />
                                </button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-72 p-0">
                                <div className="flex flex-col h-full">
                                    {/* Header */}
                                    <div className="px-6 py-5 border-b" style={{ borderColor: "#B5451B20" }}>
                                        <div className="relative w-32 h-10">
                                            <Image
                                                src="/logo.png"
                                                alt="Sultan Bazar"
                                                fill
                                                className="object-contain object-left"
                                            />
                                        </div>
                                    </div>

                                    {/* Logged-in user info in mobile drawer */}
                                    {loggedIn && (
                                        <div className="flex items-center gap-3 px-6 py-4 border-b bg-orange-50">
                                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 relative overflow-hidden"
                                                style={userPhoto ? {} : { background: "linear-gradient(135deg, #B5451B, #D4860A)" }}>
                                                {userPhoto ? (
                                                    <Image
                                                        src={userPhoto}
                                                        alt={userName}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    userInitial
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
                                                <p className="text-xs text-gray-500">Logged in</p>
                                            </div>
                                        </div>
                                    )}



                                    {/* Nav links */}
                                    <nav className="flex-1 px-2 py-4">
                                        {navLinks.map((link) => (
                                            <SheetClose asChild key={link.href}>
                                                <Link
                                                    href={link.href}
                                                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-[#B5451B] hover:bg-orange-50 rounded-lg transition-colors font-medium"
                                                >
                                                    {link.label}
                                                </Link>
                                            </SheetClose>
                                        ))}
                                    </nav>

                                    {/* Bottom actions */}
                                    <div className="px-4 pb-6 space-y-2 border-t pt-4">
                                        {loggedIn ? (
                                            <>
                                                <SheetClose asChild>
                                                    <Link href="/dashboard">
                                                        <Button className="w-full text-white" style={{ background: "#B5451B" }}>
                                                            <LayoutDashboard className="w-4 h-4 mr-2" />
                                                            Dashboard
                                                        </Button>
                                                    </Link>
                                                </SheetClose>
                                                <Button variant="outline" className="w-full border-red-200 text-red-600" onClick={handleLogout}>
                                                    <LogOut className="w-4 h-4 mr-2" />
                                                    Logout
                                                </Button>
                                            </>
                                        ) : (
                                            <SheetClose asChild>
                                                <Link href="/login">
                                                    <Button className="w-full text-white" style={{ background: "#B5451B" }}>
                                                        <User className="w-4 h-4 mr-2" />
                                                        Login / Sign Up
                                                    </Button>
                                                </Link>
                                            </SheetClose>
                                        )}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>

                {/* Mobile search bar (expanded) */}

            </div>
        </header>
    );
}
