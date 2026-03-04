"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserInfo } from "@/services/auth.services";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
    const router = useRouter();

    useEffect(() => {
        const user = getUserInfo();
        if (!user) {
            router.replace("/login");
            return;
        }
        const role = (user.role || "user").toLowerCase();
        if (role === "admin") router.replace("/dashboard/admin");
        else if (role === "superadmin") router.replace("/dashboard/superadmin");
        else router.replace("/dashboard/user");
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#B5451B" }} />
                <p className="text-sm text-gray-500 font-medium">Redirecting to your dashboard...</p>
            </div>
        </div>
    );
}
