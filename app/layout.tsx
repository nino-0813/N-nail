import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "N nail | Nail Salon",
  description: "広島県福山市駅家町のネイルサロン",
  applicationName: "Nnailネイルサロン",
  appleWebApp: {
    capable: true,
    title: "Nnailネイルサロン",
  },
  manifest: "/manifest.json",
  icons: {
    icon: [{ url: "/icon.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-white text-stone-800 font-sans selection:bg-pink-100 selection:text-pink-900">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
