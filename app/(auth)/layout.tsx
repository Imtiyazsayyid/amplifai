import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import React from "react";

import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/providers/ThemeProvider";
import "../globals.css";
const fontSans = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["300", "400", "700"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "ImtCommunity",
  description: "A Community Created By ImtCode",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={cn("h-screen relative font-sans antialiased", fontSans.variable)}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </div>
  );
}
