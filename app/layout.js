import { Inter, Outfit } from "next/font/google";
import { Providers } from "@/components/Providers";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata = {
  title: "Complex - Hyperlocal Commerce",
  description: "Your city's digital market.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body>
        <Providers>
          <Header />
          <main style={{ paddingBottom: "70px" }}>
            {children}
          </main>
          <MobileNav />
        </Providers>
      </body>
    </html>
  );
}
