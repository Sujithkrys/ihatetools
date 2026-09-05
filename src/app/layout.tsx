import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Caveat } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { AppShell } from "@/components/AppShell";
import { ThemeProvider } from "@/components/ThemeProvider";

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

export const metadata: Metadata = {
  title: "ihatetools - Free Online Tools",
  description: "Free, fast, client-side tools for developers and creators. No watermark, no sign-up required.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${caveat.variable} min-h-screen flex flex-col bg-bg text-ink antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppShell>
            <NavBar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
