"use client";

import NavigationManager from "@/components/custom/NavigationManager";
import { ThemeProvider } from "@/providers/ThemeProvider";
import "../../globals.css";
import { useUser, useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StandardErrorToast from "@/components/custom/StandardErrorToast";

export const dynamic = "force-dynamic";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <NavigationManager>{children}</NavigationManager>
    </ThemeProvider>
  );
}
