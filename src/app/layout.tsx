import type { Metadata } from "next";
import { Inter, Caveat } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/AppShell";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SITE_URL } from "@/lib/site";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: 'swap',
});

const caveat = Caveat({ 
  subsets: ["latin"], 
  variable: "--font-caveat",
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ihatetools - Free Online Tools",
    template: "%s | ihatetools",
  },
  description: "Free, fast, client-side tools for developers and creators. No watermark, no sign-up required.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "ihatetools",
    title: "ihatetools - Free Online Tools",
    description: "Free, fast, client-side tools for developers and creators. No watermark, no sign-up required.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${caveat.variable} min-h-screen flex flex-col bg-bg text-ink antialiased font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppShell>
            <main className="flex-1 flex flex-col">
              {children}
            </main>
          </AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
