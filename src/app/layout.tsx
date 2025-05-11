import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import { Toaster } from "@/components/ui/sonner";
import QueryProvider from "@/providers/QueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OWASP Top 10 Visualizer",
  description: "Visualize OWASP Top 10 vulnerabilities in your code.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`patternBg ${inter.className}`}>
        <QueryProvider>
          <Header />
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
