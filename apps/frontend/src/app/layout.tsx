import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { SocketProvider } from "@/context/SocketContext";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "react-hot-toast";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NexCommerce | Premium E-commerce PWA",
  description: "Next-generation glassmorphism shopping experience.",
  manifest: "/manifest.json",
  icons: {
    icon: [{ url: "/icons/icon-192x192.png" }],
    apple: [{ url: "/icons/icon-192x192.png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "NexCommerce",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#f59f00",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${geistSans.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="font-sans min-h-full flex flex-col bg-white dark:bg-zinc-950 transition-colors duration-300 text-[13px] sm:text-sm md:text-base" suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            <SocketProvider>
              <Toaster 
                position="top-center"
                toastOptions={{
                  className: 'nav-glass border border-white/20 text-sm font-medium rounded-xl shadow-xl',
                  style: {
                    backdropFilter: 'blur(14px)',
                  }
                }}
              />
              {children}
            </SocketProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
