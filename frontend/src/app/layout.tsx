import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Suspense } from "react";

import "./globals.css";
import "./custom.css";

import { Toaster } from "@/components/ui/sonner";
import ErrorBoundary from "@/components/common/error/ErrorBoundary";
import AuthProvider from "@/providers/auth-provider";
import QueryProvider from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";
import Loading from "./loading";

// Easy Font Config: Bas yahan font badal kar poore app ka font badla ja sakta hai
const appFont = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Inizerp",
  description: "School Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", appFont.variable)} data-scroll-behavior="smooth">
      <body className={`${appFont.variable} antialiased`}>
        <ErrorBoundary>
          <ThemeProvider>
            <QueryProvider>
              <AuthProvider>
                <TooltipProvider>
                  <Suspense fallback={<Loading />}>
                    {children}
                  </Suspense>
                  <Toaster richColors position="top-right"/>
                </TooltipProvider>
              </AuthProvider>
            </QueryProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html >
  );
}





