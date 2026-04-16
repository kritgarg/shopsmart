import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { ClerkProvider } from '@clerk/nextjs';
import { StoreProvider } from '../context/StoreContext';

export const metadata = {
  title: "ShopSmart",
  description: "ShopSmart e-commerce",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col items-center justify-center bg-zinc-50 dark:bg-black font-sans text-black dark:text-zinc-50">
          <StoreProvider>
            <nav className="w-full flex p-4 justify-between max-w-3xl border-b border-zinc-200 dark:border-zinc-800">
               <div className="font-bold text-xl">ShopSmart</div>
            </nav>
            {children}
          </StoreProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
