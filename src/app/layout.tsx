import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";

import { AppProviders } from "@/app/providers";
import { siteConfig } from "@/shared/config/site";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const brandFont = Plus_Jakarta_Sans({
  variable: "--font-brand",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const brandIconUrl = encodeURI(siteConfig.brandIcon);

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: [{ url: brandIconUrl, type: "image/webp" }],
    shortcut: brandIconUrl,
    apple: brandIconUrl,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${brandFont.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
