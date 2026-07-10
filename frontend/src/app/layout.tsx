import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import "./custom.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import {TooltipProvider} from "@/components/ui/tooltip"

const roboto = Roboto({subsets: ["latin"],
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.variable} antialiased`}>
        <ThemeProvider>
          <TooltipProvider> 
          {children}
            <Toaster richColors position="top-right" />
                      </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}