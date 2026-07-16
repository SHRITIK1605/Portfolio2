import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ChatProvider } from "@/context/ChatContext";
import ChatLayoutShell from "@/components/layout/ChatLayoutShell";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Shritik — Portfolio",
  description: "AI-powered portfolio by Shritik",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <ChatProvider>
          <ChatLayoutShell>{children}</ChatLayoutShell>
        </ChatProvider>
      </body>
    </html>
  );
}
