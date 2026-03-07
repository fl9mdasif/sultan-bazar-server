import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import StoreProvider from "@/redux/StoreProvider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Sultan Bazar — রান্নাঘরের বিশ্বস্ত সঙ্গী",
  description: "100% Natural Spices, Oils & Cooking Essentials from Sultan Bazar. স্বাদে খাঁটি, মানে নিখুঁত।",
  icons: {
    icon: [
      // { url: '/favicon.ico', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.ico', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body className="antialiased">
        <StoreProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <Toaster position="bottom-right" richColors />
        </StoreProvider>
      </body>
    </html>
  );
}
