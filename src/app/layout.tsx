import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Caveat, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: 'swap',
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: 'swap',
});

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "ihatetools - Free Online Tools",
  description: "Free, fast, client-side tools for developers and creators. No watermark, no sign-up required.",
};

import { ThemeProvider } from "@/components/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${caveat.variable} ${bricolageGrotesque.variable} min-h-screen flex flex-col bg-bg text-ink antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NavBar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
