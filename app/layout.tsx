import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Bumblebee Security Dashboard — Local Package Inventory & Exposure Viewer',
  description:
    'Browser-based viewer for bumblebee CLI scan results. Drag-and-drop NDJSON output to explore your installed package inventory across npm, PyPI, Go, Homebrew, editor extensions, browser extensions, and MCP servers — with exposure findings, confidence ratings, and lifecycle- script risk flags.No data leaves your machine.',
  keywords: [
    'supply chain security',
    'package inventory',
    'SBOM',
    'software bill of materials',
    'dependency scanner',
    'exposure scanning',
    'vulnerability catalog',
    'npm security',
    'PyPI packages',
    'Go modules',
    'Homebrew audit',
    'editor extensions security',
    'browser extensions audit',
    'MCP server inventory',
    'developer endpoint security',
    'offline security tool',
    'local security dashboard',
    'bumblebee scanner',
  ],
  authors: [{ name: 'Bumblebee Security' }],
  robots: { index: true, follow: true },
  referrer: 'no-referrer',
  metadataBase: new URL('https://bumbleboard.vercel.app'),
  alternates: {
    canonical: '/dashboard',
  },
  openGraph: {
    type: 'website',
    siteName: 'Bumblebee Security',
    title: 'Bumblebee Security Dashboard — Local Package Inventory & Exposure Viewer',
    description:
      'Explore bumblebee CLI scan results entirely in your browser. Filter your installed package inventory across npm, PyPI, Go, Homebrew, editor extensions, browser extensions, and MCP servers.Identify vulnerability catalog matches and lifecycle - script risks.Zero data exfiltration.',
    url: '/dashboard',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Bumblebee Security Dashboard showing a package inventory filtered by ecosystem and risk level',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@bumblebee_sec',
    creator: '@bumblebee_sec',
    title: 'Bumblebee Security Dashboard — Local Package Inventory & Exposure Viewer',
    description:
      'Drag-and-drop your bumblebee NDJSON scan output to visualize your full package inventory — npm, PyPI, Go, Homebrew, MCP servers, and more. Offline. Private. Fast.',
    images: {
      url: '/og-image.png',
      alt: 'Bumblebee Security Dashboard UI',
    },
  },
  other: {
    'color-scheme': 'light dark',
  },
  icons: {
    icon: [
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/favicon/apple-icon.png',
  },
  manifest: 'favicon/site.webmanifest',
}

// Note: CSP, X - Frame - Options, X - Content - Type - Options can't go in metadata — add them as HTTP headers in next.config.ts:
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          {
            key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'none'; object- src 'none'; "
          },
        ],
      },
    ]
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
