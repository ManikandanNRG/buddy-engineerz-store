import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Suspense } from "react";
import "./globals.css";
import Header from "@/components/Header";
import NavigationProgress from "@/components/NavigationProgress";
import PageTransition from "@/components/PageTransition";
import { AuthProvider } from "@/hooks/useAuth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Buddy Engineerz - Engineering Fashion",
  description: "Premium clothing brand for engineers and tech enthusiasts. Shop T-shirts, hoodies, and accessories that celebrate engineering culture.",
  keywords: ["engineering clothing", "tech fashion", "programmer apparel", "developer merchandise", "buddy engineerz"],
  authors: [{ name: "Buddy Engineerz" }],
  creator: "Buddy Engineerz",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: "Buddy Engineerz - Engineering Fashion",
    description: "Premium clothing brand for engineers and tech enthusiasts",
    type: "website",
    locale: "en_IN",
    siteName: "Buddy Engineerz",
  },
  twitter: {
    card: "summary_large_image",
    title: "Buddy Engineerz - Engineering Fashion",
    description: "Premium clothing brand for engineers and tech enthusiasts",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <AuthProvider>
          <Suspense fallback={null}>
            <NavigationProgress />
          </Suspense>
          <Suspense fallback={null}>
            <PageTransition />
          </Suspense>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
        </AuthProvider>
        <footer className="border-t py-8 mt-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-semibold mb-4">Buddy Engineerz</h3>
                <p className="text-sm text-muted-foreground">
                  Engineering fashion for the modern tech enthusiast.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Shop</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link href="/products?gender=men">Men&apos;s Collection</Link></li>
                  <li><Link href="/products?gender=women">Women&apos;s Collection</Link></li>
                  <li><Link href="/products?category=accessories">Accessories</Link></li>
                  <li><Link href="/sale">Sale</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Support</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link href="/contact">Contact Us</Link></li>
                  <li><Link href="/shipping">Shipping Info</Link></li>
                  <li><Link href="/returns">Returns</Link></li>
                  <li><Link href="/size-guide">Size Guide</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Connect</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#">Instagram</a></li>
                  <li><a href="#">Twitter</a></li>
                  <li><a href="#">LinkedIn</a></li>
                  <li><a href="#">GitHub</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
              <p>&copy; 2024 Buddy Engineerz. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
