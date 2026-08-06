import type { Metadata, Viewport } from "next";
import { Caveat, Poppins } from "next/font/google";
import { ChatProvider } from "@/context/ChatContext";
import ChatLayoutShell from "@/components/layout/ChatLayoutShell";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const SITE_URL = "https://shritikportfolio.vercel.app";
const OG_TITLE = "Shritik Jaiswal | Portfolio";
const OG_DESCRIPTION =
  "AI & digital product enthusiast. Product work across fashion, fintech, and marketplaces.";
const OG_IMAGE = `${SITE_URL}/og-image.png?v=2`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: OG_TITLE,
    template: "%s | Shritik Jaiswal",
  },
  description: OG_DESCRIPTION,
  applicationName: "Shritik Jaiswal",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.png", type: "image/png", sizes: "257x257" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Shritik Jaiswal",
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Shritik Jaiswal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Before paint: keep home black so the page never flashes under the intro */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=location.pathname;if(p!=="/"&&p!=="")return;var k="shritik-landing-intro-seen";var n=performance.getEntriesByType("navigation")[0];var play=(n&&n.type==="reload")||sessionStorage.getItem(k)!=="1";if(play){document.documentElement.classList.add("intro-boot");document.documentElement.style.background="#000";}}catch(e){document.documentElement.classList.add("intro-boot");document.documentElement.style.background="#000";}})();`,
          }}
        />
      </head>
      <body className={`${poppins.variable} ${caveat.variable} antialiased`}>
        <ChatProvider>
          <ChatLayoutShell>{children}</ChatLayoutShell>
        </ChatProvider>
      </body>
    </html>
  );
}
