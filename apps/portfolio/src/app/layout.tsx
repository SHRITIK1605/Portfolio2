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

export const metadata: Metadata = {
  title: "Shritik — Portfolio",
  description: "AI-powered portfolio by Shritik",
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
    <html lang="en">
      <body className={`${poppins.variable} ${caveat.variable} antialiased`}>
        <ChatProvider>
          <ChatLayoutShell>{children}</ChatLayoutShell>
        </ChatProvider>
      </body>
    </html>
  );
}
