"use client";

import NavigationManager from "@/components/custom/NavigationManager";
import { ThemeProvider } from "@/providers/ThemeProvider";
import "../globals.css";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <NavigationManager>{children}</NavigationManager>
    </ThemeProvider>
  );
}
