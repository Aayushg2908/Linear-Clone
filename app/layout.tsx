import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

const font = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Linear Clone",
  description:
    "This is a linear clone built using Nextjs, Tailwind CSS, NextAuth, Prisma and many more technologies",
  icons: {
    icon: "/logo.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={`${font.className} dark`}>
          {children}
          <Toaster richColors />
        </body>
      </html>
    </SessionProvider>
  );
}
