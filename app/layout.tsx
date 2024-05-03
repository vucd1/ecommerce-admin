import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import { ModalProvider } from "@/providers/modal-providers";

import "./globals.css";
import prismadb from "@/lib/prismadb";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {/* The store modal will appear on each page automatically. */}
          <ModalProvider />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
