import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authKey } from "@/contains/authKey";

// Routes that require authentication
const protectedRoutes = ["/dashboard"];
// Routes only for guests (logged-out users)
const authRoutes = ["/login", "/signup"];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get(authKey)?.value;

    // If trying to access a protected route without a token → redirect to login
    const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
    if (isProtected && !token) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // If already logged in and visiting login/signup → redirect to dashboard
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/login", "/signup"],
};
